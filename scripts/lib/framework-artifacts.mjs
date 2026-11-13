import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { createReadStream, createWriteStream, existsSync, readdirSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { spawnSync } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'

export function selectFrameworkArtifacts(artifacts, { runId, attempt, cases }) {
  assert(/^\d+$/.test(String(runId)), 'Invalid run ID')
  assert(Number.isSafeInteger(attempt) && attempt > 0, 'Invalid run attempt')
  assert(cases.length > 0 && new Set(cases).size === cases.length, 'Expected distinct matrix case names')
  return cases.map(name => {
    assert(/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(name), 'Invalid matrix case name')
    const prefix = `benchmark-frameworks-result-${name}-${runId}-`
    const matches = artifacts.filter(a => a.name.startsWith(prefix) && /^\d+$/.test(a.name.slice(prefix.length)))
      .map(a => ({ artifact: a, attempt: Number(a.name.slice(prefix.length)) }))
      .filter(a => Number.isSafeInteger(a.attempt) && a.attempt > 0 && a.attempt <= attempt)
      .sort((a, b) => b.attempt - a.attempt)
    assert(matches.length, `Missing merge input for ${name} in run ${runId}`)
    const latest = matches[0]
    assert(!latest.artifact.expired, `Latest merge input for ${name} has expired`)
    assert(matches.filter(a => a.attempt === latest.attempt).length === 1, `Ambiguous merge input for ${name}`)
    return { ...latest.artifact, caseName: name, sourceAttempt: latest.attempt }
  })
}

const cleanError = error => String(error?.message ?? error).replace(/https?:\/\/\S+/g, '[download URL]')

export async function retry(operation, { attempts = 3, wait = sleep, log = console.log } = {}) {
  for (let attempt = 1; ; attempt++) {
    try { return await operation(attempt) } catch (error) {
      if (attempt >= attempts) throw new Error(cleanError(error), { cause: undefined })
      log(`Attempt ${attempt}/${attempts} failed: ${cleanError(error)}; retrying`)
      await wait(2000 * attempt)
    }
  }
}

function command(bin, args) {
  const r = spawnSync(bin, args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
  if (r.status !== 0) throw new Error(`${bin} failed: ${r.stderr || r.error?.message}`)
  return r.stdout
}

export function extractFrameworkArchive(zip, scratch) {
  const entries = command('unzip', ['-Z1', zip]).trim().split('\n')
  assert.deepEqual(entries, ['case.tar.gz'], 'Merge artifact must contain only case.tar.gz')
  command('unzip', ['-q', zip, '-d', scratch])
  const tar = join(scratch, 'case.tar.gz')
  const paths = command('tar', ['-tzf', tar]).trim().split('\n')
  assert(paths.includes('result.json'), 'Merge artifact is missing result.json')
  for (const path of paths) {
    assert(!path.split('/').includes('..') && (path === 'result.json' || /^workspaces\/[\w-]+\/[\w-]+\/src(?:\/|$)/.test(path)), `Unexpected merge artifact entry: ${path}`)
  }
  // A fresh output directory plus regular files/directories only prevents links
  // in an archive from redirecting extraction outside the staging directory.
  for (const line of command('tar', ['-tvzf', tar]).trim().split('\n'))
    assert(/^[d-]/.test(line), 'Merge archive must not contain links or special files')
  const output = join(scratch, 'result')
  mkdirSync(output)
  command('tar', ['-xzf', tar, '-C', output, '--no-same-owner', '--no-same-permissions'])
  return output
}

export async function downloadFrameworkArtifacts({ repository, runId, attempt, cases, token, output, apiUrl = 'https://api.github.com', fetchImpl = fetch, wait = sleep, log = console.log }) {
  assert(/^[\w.-]+\/[\w.-]+$/.test(repository), 'Invalid repository')
  assert(/^\d+$/.test(String(runId)), 'Invalid run ID')
  assert(token, 'GITHUB_TOKEN is required to download run artifacts')
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
  const artifacts = []
  for (let page = 1; ; page++) {
    const data = await retry(async () => {
      const response = await fetchImpl(`${apiUrl}/repos/${repository}/actions/runs/${runId}/artifacts?per_page=100&page=${page}`, { headers, signal: AbortSignal.timeout(60000) })
      if (!response.ok) throw new Error(`List run artifacts: HTTP ${response.status}`)
      return response.json()
    }, { wait, log })
    artifacts.push(...data.artifacts)
    if (data.artifacts.length < 100) break
  }
  const selected = selectFrameworkArtifacts(artifacts, { runId, attempt, cases })
  // A fresh directory prevents a previous invocation's older attempt from being
  // included by merge-results.mjs's case-results/* glob.
  assert((!existsSync(output) || readdirSync(output).length === 0), 'Artifact output directory must be empty')
  mkdirSync(output, { recursive: true })
  // Download and extract sequentially, instead of fanning out all case archives.
  for (const artifact of selected) {
    assert(/^sha256:[a-f\d]{64}$/.test(artifact.digest ?? ''), `Missing SHA-256 digest for ${artifact.name}`)
    log(`Downloading ${artifact.name} (${artifact.size_in_bytes} bytes, source attempt ${artifact.sourceAttempt})`)
    await retry(async () => {
      const scratch = mkdtempSync(join(output, '.download-'))
      try {
        const response = await fetchImpl(`${apiUrl}/repos/${repository}/actions/artifacts/${artifact.id}/zip`, { headers, redirect: 'manual', signal: AbortSignal.timeout(60000) })
        let download = response
        if ([301, 302, 303, 307, 308].includes(response.status)) {
          const url = response.headers.get('location')
          assert(url?.startsWith('https://'), 'Artifact redirect must use HTTPS')
          // Never forward the GitHub token to the blob storage host.
          download = await fetchImpl(url, { signal: AbortSignal.timeout(60000) })
        }
        if (!download.ok || !download.body) throw new Error(`Download ${artifact.name}: HTTP ${download.status}`)
        const zip = join(scratch, 'artifact.zip')
        await pipeline(Readable.fromWeb(download.body), createWriteStream(zip))
        const hash = createHash('sha256')
        for await (const chunk of createReadStream(zip)) hash.update(chunk)
        assert.equal(`sha256:${hash.digest('hex')}`, artifact.digest, `Digest mismatch for ${artifact.name}`)
        const extracted = extractFrameworkArchive(zip, scratch)
        const record = JSON.parse(readFileSync(join(extracted, 'result.json'), 'utf8'))
        assert.equal(record.status, 'completed', `${artifact.name}: benchmark did not complete`)
        assert(record.ci?.url?.endsWith(`/${repository}/actions/runs/${runId}`), 'Artifact belongs to another workflow run')
        assert.equal(record.ci.attempt, artifact.sourceAttempt, 'Artifact attempt does not match its name')
        const target = join(output, artifact.name)
        rmSync(target, { recursive: true, force: true })
        renameSync(extracted, target)
      } finally {
        rmSync(scratch, { recursive: true, force: true })
      }
    }, { wait, log })
  }
  return selected
}

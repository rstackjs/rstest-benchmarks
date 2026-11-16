import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createHash } from 'node:crypto'
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { downloadFrameworkArtifacts, selectFrameworkArtifacts, retry } from '../lib/framework-artifacts.mjs'
import { packResult } from '../../frameworks/pack-result.mjs'
import { verify } from '../../frameworks/verify.mjs'

const artifact = (name, attempt = 1, run = 123) => ({ id: attempt, name: `benchmark-frameworks-result-${name}-${run}-${attempt}`, expired: false })
const selection = { runId: '123', attempt: 2, cases: ['minimal-node', 'react-browser'] }

test('artifact selection supports merge-only and partial case reruns without crossing runs', () => {
  const artifacts = [artifact('minimal-node'), artifact('react-browser'), artifact('minimal-node', 2), artifact('minimal-node', 3), artifact('react-browser', 2, 999)]
  assert.deepEqual(selectFrameworkArtifacts(artifacts, selection).map(a => a.sourceAttempt), [2, 1])
  assert.deepEqual(selectFrameworkArtifacts(artifacts.slice(0, 2), selection).map(a => a.sourceAttempt), [1, 1])
  assert.throws(() => selectFrameworkArtifacts(artifacts.slice(0, 1), selection), /Missing merge input for react-browser/)
  assert.throws(() => selectFrameworkArtifacts([...artifacts, { ...artifact('minimal-node', 2), expired: true }], selection), /Ambiguous/)
  assert.throws(() => selectFrameworkArtifacts(artifacts.map(a => ({ ...a, expired: true })), selection), /expired/)
})

test('download retries are bounded and never print signed URLs', async () => {
  const logs = [], delays = []
  let calls = 0
  await assert.rejects(retry(() => { calls++; throw Error('failed https://blob.example/file?secret=token') }, {
    log: s => logs.push(s), wait: async ms => delays.push(ms),
  }), /\[download URL\]/)
  assert.equal(calls, 3)
  assert.deepEqual(delays, [2000, 4000])
  assert(!logs.join('').includes('secret'))
})

function packedFixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'framework-artifact-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  const input = join(root, 'input')
  const record = JSON.parse(readFileSync(new URL('../../frameworks/reports/result.json', import.meta.url)))
  record.plan = record.plan.filter(g => g.item.id === 'minimal-node')
  record.plan[0].frameworks = ['jest']
  record.options.frameworks = ['jest']
  for (const key of ['samples', 'memorySamples']) record[key] = record[key].filter(s => s.group === 'main/minimal-node/none' && s.framework === 'jest')
  record.ci = { url: 'https://github.com/example/benchmarks/actions/runs/123', attempt: 1 }
  const src = join(input, 'workspaces/jest/minimal-node/src')
  mkdirSync(src, { recursive: true })
  cpSync(new URL('../../frameworks/fixtures/minimal-node/src/', import.meta.url), src, { recursive: true })
  writeFileSync(join(input, 'result.json'), JSON.stringify(record))
  const entries = packResult(input, join(root, 'case.tar.gz'))
  assert.deepEqual(entries, ['result.json', 'workspaces/jest/minimal-node/src'])
  const zipped = spawnSync('zip', ['-q', 'artifact.zip', 'case.tar.gz'], { cwd: root })
  assert.equal(zipped.status, 0)
  const zip = readFileSync(join(root, 'artifact.zip'))
  const info = { ...artifact('minimal-node'), size_in_bytes: zip.length, digest: `sha256:${createHash('sha256').update(zip).digest('hex')}` }
  return { root, input, info, zip }
}

test('compact archive downloads, retries a storage error and verifies source fingerprints', async t => {
  const { root, input, info, zip } = packedFixture(t)
  let storageRequests = 0
  const messages = []
  const output = join(root, 'downloaded')
  await downloadFrameworkArtifacts({ repository: 'example/benchmarks', runId: '123', attempt: 2, cases: ['minimal-node'], token: 'test-token', output,
    wait: async () => {}, log: s => messages.push(s),
    fetchImpl: async (url, options) => {
      if (url.startsWith('https://api.github.com/')) {
        assert.equal(options.headers.Authorization, 'Bearer test-token')
        if (url.includes('/runs/')) return Response.json({ artifacts: [info] })
        assert.equal(options.redirect, 'manual')
        return new Response(null, { status: 302, headers: { location: 'https://storage.example/archive?signature=private' } })
      }
      assert.equal(options.headers, undefined)
      return ++storageRequests === 1 ? new Response('busy', { status: 503 }) : new Response(zip)
    },
  })
  assert.equal(storageRequests, 2)
  assert(messages.some(s => s.includes('HTTP 503')))
  assert(!messages.join('').includes('signature'))
  assert.deepEqual(readdirSync(output), [info.name])
  const extracted = join(output, info.name)
  assert.deepEqual(verify(JSON.parse(readFileSync(join(extracted, 'result.json'))), extracted), { groups: 1, measured: 10, warmups: 1 })
  writeFileSync(join(input, 'workspaces/jest/minimal-node/src/tampered.ts'), 'changed')
  assert.throws(() => packResult(input, join(root, 'bad.tar.gz')))
})

test('digest mismatch exhausts retries without leaving mergeable partial output', async t => {
  const { root, info } = packedFixture(t)
  const output = join(root, 'bad-download')
  let downloads = 0
  await assert.rejects(downloadFrameworkArtifacts({ repository: 'example/benchmarks', runId: '123', attempt: 1, cases: ['minimal-node'], token: 'test', output,
    wait: async () => {}, log: () => {},
    fetchImpl: async url => {
      if (url.includes('/runs/')) return Response.json({ artifacts: [info] })
      downloads++
      return new Response('truncated archive')
    },
  }), /Digest mismatch/)
  assert.equal(downloads, 3)
  assert.deepEqual(readdirSync(output), [])
})

// Publishes the results of one finished CI run into the README and reports.
// Used by scripts/publish-run.mjs (and so by the publish-results workflow).
import assert from 'node:assert/strict'
import { appendFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { downloadArtifactZip, downloadFrameworkArtifacts, githubJson, listRunArtifacts, selectFrameworkArtifacts } from './framework-artifacts.mjs'
import { publishComparison } from './publication.mjs'
import { mergeResults, writeMerged } from '../../frameworks/merge.mjs'
import { verify } from '../../frameworks/verify.mjs'
import { refreshReport } from '../../frameworks/publication.mjs'

const workflows = {
  'benchmark-frameworks.yml': { kind: 'frameworks', title: 'framework', artifact: 'benchmark-frameworks-result-' },
  'benchmark-version-coverage.yml': { kind: 'coverage', title: 'version coverage', artifact: 'benchmark-version-coverage-merged-' },
  'benchmark-versions.yml': { kind: 'versions', title: 'version', artifact: 'benchmark-versions-' },
}
// Everything a publication may change. The tree must be clean here before it starts.
export const publishedPaths = ['README.md', 'frameworks/reports', 'versions', 'reports', 'reports.config.json']

export function classifyRun(run) {
  const file = basename(String(run.path ?? '').replace(/@.*$/, ''))
  const workflow = workflows[file]
  assert(workflow, `Run ${run.id} belongs to "${run.name ?? file}", which is not a benchmark workflow that can be published (expected Frameworks benchmark, Rstest coverage benchmark or Rstest version benchmark)`)
  assert.equal(run.status, 'completed', `Run ${run.id} is ${run.status}, not completed`)
  assert.equal(run.conclusion, 'success', `Run ${run.id} concluded with "${run.conclusion}", not success; only successful runs can be published`)
  return workflow
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Framework runs publish from the per-case result artifacts, which the CI merge job
// itself uses; coverage and version runs publish from their single comparison artifact.
export function selectPublishArtifacts(workflow, artifacts, run) {
  const runId = String(run.id)
  const attempt = run.run_attempt
  if (workflow.kind === 'frameworks') {
    const pattern = new RegExp(`^${escapeRegExp(workflow.artifact)}(.+)-${runId}-\\d+$`)
    const cases = [...new Set(artifacts.map((a) => a.name.match(pattern)?.[1]).filter(Boolean))]
    assert(cases.length > 0, `Run ${runId} has no per-case result artifacts (they expire after 30 days)`)
    return selectFrameworkArtifacts(artifacts, { runId, attempt, cases })
  }
  const pattern = new RegExp(`^${escapeRegExp(workflow.artifact)}(.+)-${runId}-(\\d+)$`)
  const matches = artifacts
    .map((artifact) => ({ artifact, attempt: Number(artifact.name.match(pattern)?.[2]) }))
    .filter((match) => match.attempt > 0 && match.attempt <= attempt)
    .sort((a, b) => b.attempt - a.attempt)
  assert(matches.length, `Run ${runId} has no ${workflow.artifact}* artifact`)
  assert(!matches[0].artifact.expired, `The ${matches[0].artifact.name} artifact has expired`)
  assert(matches.filter((match) => match.attempt === matches[0].attempt).length === 1, `Ambiguous ${workflow.artifact}* artifacts in run ${runId}`)
  return [matches[0].artifact]
}

function command(bin, args, options = {}) {
  const result = spawnSync(bin, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...options })
  if (result.status !== 0) throw new Error(`${bin} ${args.join(' ')} failed: ${result.stderr || result.error?.message}`)
  return result.stdout
}

// Extracts a comparison artifact (one directory holding comparison.json) under
// results/, refusing paths outside that directory and links.
export function extractComparisonArchive(zip, resultsDir) {
  const entries = command('unzip', ['-Z1', zip]).trim().split('\n')
  const tops = new Set(entries.map((entry) => entry.split('/')[0]))
  assert.equal(tops.size, 1, 'Comparison artifact must contain exactly one result directory')
  const [top] = tops
  assert(/^ci-[\w.-]+$/.test(top), `Unexpected result directory name: ${top}`)
  for (const entry of entries) assert(!entry.startsWith('/') && !entry.split('/').includes('..'), `Unexpected artifact entry: ${entry}`)
  assert(entries.includes(`${top}/comparison.json`), 'Comparison artifact is missing comparison.json')
  for (const line of command('unzip', ['-Z', zip]).trim().split('\n').filter((line) => /^[-dl]/.test(line)))
    assert(/^[-d]/.test(line), 'Comparison artifact must not contain links or special files')
  mkdirSync(resultsDir, { recursive: true })
  rmSync(join(resultsDir, top), { recursive: true, force: true })
  command('unzip', ['-q', zip, '-d', resultsDir])
  return join(resultsDir, top, 'comparison.json')
}

const git = (root, ...args) => command('git', args, { cwd: root })
const changed = (root) => git(root, 'status', '--porcelain', '--', ...publishedPaths).trim()

export async function publishRun({ root, repository, runId, token, apiUrl = 'https://api.github.com', fetchImpl = fetch, dryRun = false, push = false, log = console.log, summaryFile }) {
  assert(/^\d+$/.test(String(runId)), 'Invalid run ID')
  assert(!(dryRun && push), '--dry-run and --push cannot be combined')
  assert(!changed(root), 'Publication paths have uncommitted changes; commit or discard them first')
  if (push) assert.equal(git(root, 'rev-parse', '--abbrev-ref', 'HEAD').trim(), 'main', 'Publishing with --push is only allowed on main')

  const run = await githubJson(`${apiUrl}/repos/${repository}/actions/runs/${runId}`, { token, fetchImpl, what: 'Get workflow run', log })
  const workflow = classifyRun(run)
  log(`Run ${runId}: ${run.name}, commit ${run.head_sha?.slice(0, 7)}, attempt ${run.run_attempt}`)
  const artifacts = await listRunArtifacts({ repository, runId, token, apiUrl, fetchImpl, log })
  const selected = selectPublishArtifacts(workflow, artifacts, run)
  mkdirSync(join(root, 'results'), { recursive: true })
  const work = mkdtempSync(join(root, 'results', '.publish-'))
  try {
    if (workflow.kind === 'frameworks') {
      const inputs = join(work, 'case-results')
      await downloadFrameworkArtifacts({ repository, runId, attempt: run.run_attempt, cases: selected.map((a) => a.caseName), token, output: inputs, apiUrl, fetchImpl, log })
      const merged = join(work, 'merged')
      // The CI merge job reads its inputs in sorted glob order; do the same.
      const result = mergeResults(selected.map((a) => a.name).sort().map((name) => ({ name, file: join(inputs, name, 'result.json') })))
      const file = writeMerged(merged, result)
      result.merged.verification = verify(result.merged, merged, file)
      writeFileSync(file, JSON.stringify(result.merged, null, 2))
      refreshReport({ root, input: file })
      refreshReport({ root, check: true })
    } else {
      const [artifact] = selected
      const zip = join(work, 'artifact.zip')
      await downloadArtifactZip({ artifact, repository, token, zip, apiUrl, fetchImpl })
      const input = extractComparisonArchive(zip, join(root, 'results'))
      publishComparison(root, dirname(input), JSON.parse(readFileSync(input, 'utf8')))
      command('node', ['scripts/report.mjs', '--check'], { cwd: root })
    }
    const status = changed(root)
    const message = `docs: publish ${workflow.title} results from run ${runId}`
    const report = status
      ? `${message}\n\n${git(root, 'diff', '--stat', '--', ...publishedPaths).trim()}\n\nNew files:\n${status.split('\n').filter((line) => line.startsWith('??')).join('\n') || '(none)'}`
      : `Nothing to publish: run ${runId} already matches the published ${workflow.title} results.`
    log(report)
    if (summaryFile) appendFileSync(summaryFile, `### ${dryRun ? 'Dry run: ' : ''}Publish run ${runId}\n\n\`\`\`\n${report}\n\`\`\`\n`)
    if (dryRun && status) {
      git(root, 'restore', '--staged', '--worktree', '--', ...publishedPaths)
      git(root, 'clean', '-fdq', '--', ...publishedPaths)
      log('Dry run: working tree restored.')
    }
    if (push && status) {
      git(root, 'add', '--', ...publishedPaths)
      git(root, '-c', 'user.name=github-actions[bot]', '-c', 'user.email=41898282+github-actions[bot]@users.noreply.github.com', 'commit', '-q', '-m', message)
      try { git(root, 'push', 'origin', 'HEAD:main') } catch {
        log('Push rejected; rebasing onto main once')
        git(root, 'pull', '--rebase', 'origin', 'main')
        git(root, 'push', 'origin', 'HEAD:main')
      }
      log(`Pushed: ${message}`)
    }
    return { kind: workflow.kind, changed: Boolean(status), message }
  } finally {
    rmSync(work, { recursive: true, force: true })
  }
}

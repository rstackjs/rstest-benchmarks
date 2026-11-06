import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { refreshReport, publishedInput } from '../../frameworks/publication.mjs'
import { ciContext, ciResultDirectory } from '../lib/ci.mjs'

const samples = readFileSync(new URL('../../frameworks/reports/result.json', import.meta.url), 'utf8')
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'framework-publication-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  mkdirSync(join(root, 'versions'))
  writeFileSync(join(root, 'versions/README.md'), 'Keep version results')
  writeFileSync(join(root, 'README.md'), '# Rstest benchmarks\n\nBefore\n<!-- framework-results:start -->\nOld results\n<!-- framework-results:end -->\nAfter\n')
  const input = join(root, 'raw.json')
  const record = JSON.parse(samples)
  delete record.publication
  record.ci = {
    url: 'https://github.com/example/benchmarks/actions/runs/123',
    sha: 'abc123', attempt: 2, runner: 'test runner', image: 'test image',
  }
  writeFileSync(input, JSON.stringify(record))
  return { root, input, record }
}

test('framework publication updates tables and provenance together, with repeatable checks', (t) => {
  const { root, input, record: original } = fixture(t)
  refreshReport({ root, input })
  const readme = readFileSync(join(root, 'README.md'), 'utf8')
  assert.match(readme, /actions\/runs\/123/)
  assert.match(readme, /commit `abc123`, attempt 2/)
  const measured = original.samples.filter((s) => s.phase === 'timed').length
  const warmups = original.samples.filter((s) => s.phase === 'warmup').length
  assert(readme.includes(`${measured} timed samples and ${warmups} warmups`))
  assert.match(readme, /Before\n<!-- framework-results:start -->/)
  assert.match(readme, /<!-- framework-results:end -->\nAfter/)
  assert.match(readme, /\| Node · single-file \|/)
  assert.doesNotMatch(readme, /\| Δ \|/)
  assert.equal(readFileSync(join(root, 'versions/README.md'), 'utf8'), 'Keep version results')
  const exported = readFileSync(join(root, 'frameworks/reports/result.json'), 'utf8')
  const record = JSON.parse(exported)
  assert.equal(record.publication.sourceSha256, createHash('sha256').update(readFileSync(input)).digest('hex'))
  refreshReport({ root, check: true })
  refreshReport({ root })
  assert.equal(readFileSync(join(root, 'frameworks/reports/result.json'), 'utf8'), exported)
  writeFileSync(join(root, 'README.md'), readme.replace(`${measured} timed samples`, 'invalid timed samples'))
  assert.throws(() => refreshReport({ root, check: true }), /Stale framework report/)
  assert.match(readFileSync(join(root, 'README.md'), 'utf8'), /invalid timed samples/)
})

test('framework publication rejects incomplete, failed, partial or invalid samples before writing', (t) => {
  const { root, input, record } = fixture(t)
  const before = readFileSync(join(root, 'README.md'), 'utf8')
  for (const mutate of [
    (r) => { r.status = 'failed' },
    (r) => { r.samples.pop() },
    (r) => { r.samples[0].status = 'failed' },
    (r) => { r.samples[0].rssBytes = null },
    (r) => { r.samples[0].counts.passed = 0 },
    (r) => { r.samples[0].round = 99 },
    (r) => { r.independentBatches = true },
    (r) => {
      r.plan = r.plan.filter((g) => g.item.id === 'minimal-node')
      r.samples = r.samples.filter((s) => s.group === 'main/minimal-node/none')
    },
  ]) {
    const bad = structuredClone(record)
    mutate(bad)
    writeFileSync(input, JSON.stringify(bad))
    assert.throws(() => refreshReport({ root, input }))
    assert.equal(readFileSync(join(root, 'README.md'), 'utf8'), before)
  }
})

test('publication strips machine paths without losing samples or cache evidence', (t) => {
  const { record } = fixture(t)
  const cwd = '/private/work/workspaces/vitest/minimal-node'
  Object.assign(record.samples[0], {
    cwd, command: ['/private/node/bin/node', 'test'],
    stdoutPath: '/private/stdout', stderrPath: '/private/stderr',
  })
  record.samples[0].counts.settings = { fsModuleCachePath: cwd + '/node_modules/.cache/vitest' }
  record.cacheActions = [{ cwd, paths: ['.cache'], at: record.startedAt }]
  record.browser.executable = '/private/chrome'
  const exported = publishedInput(JSON.stringify(record))
  assert.equal(exported.samples.length, record.samples.length)
  assert.equal(exported.samples[0].wallMs, record.samples[0].wallMs)
  assert.doesNotMatch(JSON.stringify(exported), /\/private\//)
  assert.equal(exported.cacheActions[0].workspace, 'vitest/minimal-node')
  assert.equal(exported.samples[0].counts.settings.fsModuleCachePath, './node_modules/.cache/vitest')
})

test('CI records run identity and exposes the exact result directory', (t) => {
  const { root } = fixture(t)
  const env = {
    GITHUB_ACTIONS: 'true', GITHUB_SERVER_URL: 'https://github.com',
    GITHUB_REPOSITORY: 'example/benchmarks', GITHUB_RUN_ID: '123',
    GITHUB_RUN_ATTEMPT: '2', GITHUB_SHA: 'abc123', GITHUB_JOB: 'benchmark',
    RUNNER_NAME: 'test runner', ImageVersion: 'test image',
    GITHUB_OUTPUT: join(root, 'outputs'),
  }
  assert.equal(ciContext(env).url, 'https://github.com/example/benchmarks/actions/runs/123')
  assert.equal(ciContext(env).attempt, 2)
  assert.equal(ciContext({}), undefined)
  ciResultDirectory(root, join(root, 'results/exact-run'), env)
  assert.equal(readFileSync(env.GITHUB_OUTPUT, 'utf8'), 'result-directory=results/exact-run\n')
})

test('framework publication restores the homepage if a later file write fails', async (t) => {
  const { root, input } = fixture(t)
  const before = readFileSync(join(root, 'README.md'), 'utf8')
  const fs = (await import('node:fs')).default
  const { syncBuiltinESMExports } = await import('node:module')
  const write = fs.writeFileSync
  let failed = false
  const patched = t.mock.method(fs, 'writeFileSync', (path, ...args) => {
    if (!failed && path === join(root, 'frameworks/reports/report.md')) {
      failed = true
      throw new Error('simulated write failure')
    }
    return write(path, ...args)
  })
  syncBuiltinESMExports()
  try {
    assert.throws(() => refreshReport({ root, input }), /simulated write failure/)
    assert.equal(readFileSync(join(root, 'README.md'), 'utf8'), before)
    assert.equal(fs.existsSync(join(root, 'frameworks/reports/result.json')), false)
  } finally {
    patched.mock.restore()
    syncBuiltinESMExports()
  }
})

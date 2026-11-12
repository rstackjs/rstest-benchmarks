import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { refreshReport, publishedInput } from '../../frameworks/publication.mjs'
import { cases } from '../../frameworks/fixtures.mjs'
import { renderReport } from '../../frameworks/report.mjs'
import { verifySamples } from '../../frameworks/verify.mjs'
import { ciContext, ciResultDirectory } from '../lib/ci.mjs'
import { memoryKinds } from '../lib/memory.mjs'

// The committed published samples predate the footprint metric and carry the old
// maxrss field. Relabel them so these fixtures match the current schema; the
// values are only placeholders for report structure, not footprint data.
const record0 = JSON.parse(readFileSync(new URL('../../frameworks/reports/result.json', import.meta.url), 'utf8'))
record0.memorySamples = []
record0.measurement = { memory: memoryKinds.darwin }
for (const sample of record0.samples) {
  // Build the separate memory pass from the old single-pass samples.
  if (sample.phase === 'timed')
    record0.memorySamples.push({ ...sample, startedAt: sample.endedAt, wallMs: undefined, memoryBytes: sample.rssBytes })
  delete sample.rssBytes
}
const samples = JSON.stringify(record0)
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'framework-publication-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  mkdirSync(join(root, 'versions'))
  writeFileSync(join(root, 'versions/README.md'), 'Keep version results')
  writeFileSync(join(root, 'README.md'), '# Rstest benchmarks\n\nBefore\n<!-- framework-results:start -->\nOld results\n<!-- framework-results:end -->\nAfter\n')
  const input = join(root, 'raw.json')
  const record = JSON.parse(samples)
  record.host.logicalCpuCount = 8
  record.host.parallelism = 2
  delete record.publication
  for (const item of cases.filter((item) => item.fixture)) {
    Object.assign(record.fixtures[item.id], { files: item.files, tests: item.tests })
    for (const group of record.plan.filter((group) => group.item.id === item.id))
      Object.assign(group.item, { files: item.files, tests: item.tests })
    for (const sample of [...record.samples, ...record.memorySamples].filter((sample) => sample.group === `main/${item.id}/none`))
      Object.assign(sample.counts, { files: item.files, tests: item.tests, passed: item.tests })
  }
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
  assert.match(readme, /logical CPUs: 8; available parallelism: 2/)
  const measured = original.samples.filter((s) => s.phase === 'timed').length
  const warmups = original.samples.filter((s) => s.phase === 'warmup').length
  assert(readme.includes(`${measured} timed samples and ${warmups} warmups`))
  assert.match(readme, /Before\n<!-- framework-results:start -->/)
  assert.match(readme, /<!-- framework-results:end -->\nAfter/)
  assert.match(readme, /\| Node · 2 files \|/)
  assert.match(readme, /\| React · 2 files \|/)
  assert.doesNotMatch(readme, /\| Δ \|/)
  assert.equal(readFileSync(join(root, 'versions/README.md'), 'utf8'), 'Keep version results')
  const exported = readFileSync(join(root, 'frameworks/reports/result.json'), 'utf8')
  const record = JSON.parse(exported)
  assert.equal(record.host.logicalCpuCount, 8)
  assert.equal(record.host.parallelism, 2)
  assert.equal(record.publication.sourceSha256, createHash('sha256').update(readFileSync(input)).digest('hex'))
  refreshReport({ root, check: true })
  refreshReport({ root })
  assert.equal(readFileSync(join(root, 'frameworks/reports/result.json'), 'utf8'), exported)
  writeFileSync(join(root, 'README.md'), readme.replace(`${measured} timed samples`, 'invalid timed samples'))
  assert.throws(() => refreshReport({ root, check: true }), /Stale framework report/)
  assert.match(readFileSync(join(root, 'README.md'), 'utf8'), /invalid timed samples/)
})

test('published single-file history retains its original workload labels and counts', () => {
  const record = publishedInput(samples)
  assert.equal(record.fixtures['minimal-node'].files, 1)
  assert.equal(record.fixtures['minimal-react'].tests, 1)
  assert.match(renderReport(record).tables, /\| Node · single-file \|/)
  assert.match(renderReport(record).tables, /\| React · single-file \|/)
})

test('main and browser CI results publish without coverage; missing browser still fails', (t) => {
  const { root, input, record } = fixture(t)
  record.options.suites = ['main', 'browser']
  record.plan = record.plan.filter((group) => group.suite !== 'coverage')
  record.samples = record.samples.filter((sample) => !sample.group.startsWith('coverage/'))
  record.memorySamples = record.memorySamples.filter((sample) => !sample.group.startsWith('coverage/'))
  writeFileSync(input, JSON.stringify(record))
  refreshReport({ root, input })
  refreshReport({ root, check: true })
  const readme = readFileSync(join(root, 'README.md'), 'utf8')
  assert.match(readme, /--suites main,browser/)
  record.plan = record.plan.filter((group) => group.suite !== 'browser')
  record.samples = record.samples.filter((sample) => !sample.group.startsWith('browser/'))
  record.memorySamples = record.memorySamples.filter((sample) => !sample.group.startsWith('browser/'))
  writeFileSync(input, JSON.stringify(record))
  assert.throws(() => refreshReport({ root, input }), /complete main and browser/)
  assert.equal(readFileSync(join(root, 'README.md'), 'utf8'), readme)
})

test('framework publication rejects incomplete, failed, partial or invalid samples before writing', (t) => {
  const { root, input, record } = fixture(t)
  const before = readFileSync(join(root, 'README.md'), 'utf8')
  for (const mutate of [
    (r) => { r.status = 'failed' },
    (r) => { r.samples.pop() },
    (r) => { r.samples[0].status = 'failed' },
    (r) => { r.memorySamples[0].memoryBytes = null },
    (r) => { r.memorySamples.pop() },
    (r) => { r.memorySamples[0].counts.passed = 0 },
    (r) => { r.samples[0].memoryBytes = 1 },
    (r) => { r.samples[0].counts.passed = 0 },
    (r) => { r.samples[0].round = 99 },
    (r) => { r.independentBatches = true },
    (r) => {
      r.plan = r.plan.filter((g) => g.item.id === 'minimal-node')
      r.samples = r.samples.filter((s) => s.group === 'main/minimal-node/none')
      r.memorySamples = r.memorySamples.filter((s) => s.group === 'main/minimal-node/none')
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

test('legacy maxrss framework results are rejected with a clear error', () => {
  const legacy = {
    status: 'completed',
    plan: [{ suite: 'main', item: { id: 'x' }, provider: 'none' }],
    options: { runs: 1, conditions: ['cold'] },
    samples: [{ group: 'main/x/none', rssBytes: 1024 }],
  }
  assert.throws(
    () => publishedInput(JSON.stringify({ schemaVersion: 1, ...legacy }), 'result.json'),
    /result\.json: legacy maxrss data \(rssBytes\); republish with the footprint sampler/,
  )
  const noMemory = { ...legacy, samples: [{ group: 'main/x/none' }] }
  assert.throws(
    () => publishedInput(JSON.stringify({ schemaVersion: 1, ...noMemory }), 'result.json'),
    /result\.json: legacy maxrss data \(missing memorySamples\)/,
  )
  assert.throws(
    () => renderReport(legacy, 'result.json'),
    /legacy maxrss data \(rssBytes\)/,
  )
})

test('Linux cgroup results verify and render with their memory kind but cannot be published', () => {
  const record = JSON.parse(samples)
  record.measurement = { memory: memoryKinds.linux }
  record.host = { ...record.host, platform: 'linux x64' }
  for (const sample of record.memorySamples) sample.cgroupPeakBytes = sample.memoryBytes * 1.5
  for (const item of cases.filter((item) => item.fixture)) {
    Object.assign(record.fixtures[item.id], { files: item.files, tests: item.tests })
    for (const group of record.plan.filter((group) => group.item.id === item.id)) Object.assign(group.item, { files: item.files, tests: item.tests })
    for (const sample of [...record.samples, ...record.memorySamples].filter((sample) => sample.group === `main/${item.id}/none`))
      Object.assign(sample.counts, { files: item.files, tests: item.tests, passed: item.tests })
  }
  delete record.publication
  // The kind is recorded, printed in every memory heading, and checked against the platform.
  const rendered = renderReport(record)
  assert.match(rendered.markdown, /### Memory \(MiB, Linux cgroup v2 anon\+shmem peak\)/)
  assert.match(rendered.summary, /### Memory \(MiB, Linux cgroup v2 anon\+shmem peak\)/)
  assert.match(rendered.markdown, /cgroup v2 `anon` \+ `shmem`.*cgroupPeakBytes/)
  assert.doesNotThrow(() => verifySamples(record))
  const missingPeak = structuredClone(record)
  delete missingPeak.memorySamples[0].cgroupPeakBytes
  assert.throws(() => verifySamples(missingPeak), /cgroupPeakBytes/)
  const wrongPlatform = structuredClone(record)
  wrongPlatform.host.platform = 'darwin arm64'
  assert.throws(() => verifySamples(wrongPlatform), /does not match platform darwin/)
  assert.throws(() => publishedInput(JSON.stringify({ ...record, schemaVersion: 1 }), 'result.json'), /result\.json: cannot publish memory data of kind "Linux cgroup v2 anon\+shmem peak".*job summaries and artifacts only/)
})

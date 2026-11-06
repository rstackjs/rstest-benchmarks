import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import nodeModule from 'node:module'
import { statistics, median, seconds } from '../lib/stats.mjs'
import {
  normalize,
  mergeRows,
  compare,
  comparisonReport,
} from '../lib/report.mjs'
import { rotate, casesFor } from '../lib/cases.mjs'
import { execute, reportCounts } from '../lib/process.mjs'
import { environment, parseOptions } from '../runner.mjs'

const legacy = (overrides = {}) => ({
  meta: {
    runs: 3,
    node: 'v24',
    cpu: 'CPU',
    platform: 'darwin arm64',
    rstest: '0.12.4',
  },
  results: [
    {
      app: 'node-library',
      case: 'medium module graph',
      samples: [10, 20, 30],
      ...overrides,
    },
  ],
})

test('median, MAD, sample SD, CV and empty/singleton behavior', () => {
  assert.equal(median([4, 1, 2, 3]), 2.5)
  assert.equal(seconds(295.5), '0.30s')
  const stats = statistics([10, 20, 30])
  assert.deepEqual(stats, {
    n: 3,
    median: 20,
    min: 10,
    max: 30,
    mean: 20,
    sd: 10,
    cv: 50,
    mad: 10,
  })
  assert.equal(statistics([]).median, null)
  assert.equal(statistics([1]).cv, null)
  assert.equal(statistics([0, 0]).cv, null)
  assert.throws(() => statistics([NaN]))
  assert.throws(() => statistics([-1]))
})

test('CLI rejects invalid filters/options and preserves defaults', () => {
  assert.equal(parseOptions('main', []).runs, 5)
  for (const args of [
    ['--runs', '0'],
    ['--runs', '1.5'],
    ['--warmup', '0'],
    ['--apps', 'typo'],
    ['--scales', 'small'],
    ['--label', '../escape'],
    ['--wat'],
  ])
    assert.throws(() => parseOptions('main', args))
  assert.throws(() => parseOptions('pools', ['--scales', 'small,small']))
  assert.equal(casesFor('coverage').length, 15)
  assert.equal(casesFor('pools').length, 12)
})

test('timed rounds rotate variant order, including reverse starts', () => {
  assert.deepEqual(rotate(['a', 'b', 'c'], 1), ['b', 'c', 'a'])
  assert.deepEqual(rotate(['a', 'b', 'c'], 1, true), ['b', 'a', 'c'])
})

test('benchmark subprocess cannot enable Node compile cache, even with inherited overrides', async (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'rstest-cache-policy-'))
  try {
    const env = environment({
      ...process.env,
      NODE_COMPILE_CACHE: join(dir, 'cache'),
      NODE_DISABLE_COMPILE_CACHE: '0',
    })
    assert.equal(env.NODE_COMPILE_CACHE, undefined)
    assert.equal(env.NODE_DISABLE_COMPILE_CACHE, '1')
    if (!nodeModule.enableCompileCache) {
      t.skip('This Node version has no compile-cache API')
      return
    }
    const result = await execute({
      command: [
        process.execPath,
        '--input-type=module',
        '-e',
        'import { enableCompileCache, constants } from "node:module"; const result = enableCompileCache(); console.log(JSON.stringify(result)); if (result.status !== constants.compileCacheStatus.DISABLED) process.exit(1)',
      ],
      cwd: dir,
      env,
      prefix: join(dir, 'probe'),
      timeoutMs: 5000,
    })
    assert.equal(result.exitCode, 0)
    assert.match(
      readFileSync(result.stdoutPath, 'utf8'),
      /Disabled by NODE_DISABLE_COMPILE_CACHE/,
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('legacy import recalculates statistics without mutating source', () => {
  const input = legacy({ median: 999 })
  const before = JSON.stringify(input)
  const [row] = normalize(input)
  assert.equal(row.stats.median, 20)
  assert.equal(row.fixture, null)
  assert.equal(row.scale, 'medium')
  assert.equal(JSON.stringify(input), before)
  assert.equal(normalize(legacy({ samples: [1] }))[0].status, 'incomplete')
})

test('v2 excludes warmups and failed samples, incomplete batches cannot win', () => {
  const document = {
    schemaVersion: 2,
    suite: 'main',
    meta: { options: { runs: 2 } },
    results: [
      {
        app: 'a',
        status: 'passed',
        samples: [
          { phase: 'warmup', status: 'passed', wallMs: 999 },
          { phase: 'timed', status: 'passed', wallMs: 20 },
          { phase: 'timed', status: 'failed', wallMs: 1 },
        ],
      },
    ],
  }
  const [row] = normalize(document)
  assert.equal(row.status, 'incomplete')
  assert.deepEqual(row.samples, [20])
  assert.equal(compare(normalize(legacy())[0], row).delta, null)
  assert.throws(() => normalize({ ...document, schemaVersion: 99 }))
})

test('pooling uses all samples and conventional even median', () => {
  const rows = [
    ...normalize(legacy()),
    ...normalize(legacy({ samples: [40, 50, 60] })),
  ]
  const merged = [...mergeRows(rows).values()][0]
  assert.equal(merged.stats.n, 6)
  assert.equal(merged.stats.median, 35)
  assert.equal(
    mergeRows([...rows, ...normalize(legacy({ env: 'happy-dom' }))]).size,
    2,
  )
})

test('known hardware/fixture differences block deltas; legacy differences stay unknown', () => {
  const [base] = normalize(legacy())
  assert.equal(
    compare(base, { ...base, stats: statistics([5, 10, 15]) }).delta,
    -50,
  )
  assert.match(
    compare(base, { ...base, meta: { ...base.meta, node: 'v25' } }).note,
    /incompatible/,
  )
  assert.equal(
    compare({ ...base, fixture: 'a' }, { ...base, fixture: 'b' }).delta,
    null,
  )
  assert.equal(compare(base, undefined).delta, null)
  assert.match(compare(base, base).note, /legacy provenance/)
  assert.equal(
    [
      ...mergeRows([
        base,
        { ...base, meta: { ...base.meta, rstest: '0.11.0' } },
      ]).values(),
    ][0].status,
    'incompatible',
  )
  assert.equal(
    [
      ...mergeRows([
        base,
        { ...base, fixture: 'a' },
        { ...base, fixture: 'b' },
      ]).values(),
    ][0].status,
    'incompatible',
  )
  assert.equal(
    compare(
      { ...base, environment: { NODE_OPTIONS: null } },
      { ...base, environment: { NODE_OPTIONS: '--jitless' } },
    ).delta,
    null,
  )
})

test('comparison reports reject duplicates/implicit axes and show missing cases', () => {
  const spec = {
    columns: [
      { label: 'base', files: ['a'] },
      { label: 'candidate', files: ['b'] },
    ],
  }
  const report = comparisonReport(spec, (path) =>
    path === 'a' ? legacy() : legacy({ app: 'other' }),
  )
  assert.match(report.summary, /missing case/)
  assert.match(report.markdown, /MAD/)
  assert.throws(() =>
    comparisonReport({ ...spec, axis: 'pool' }, () => legacy()),
  )
  assert.throws(() =>
    comparisonReport(
      { columns: [{ label: 'a', files: ['a', 'a'] }, spec.columns[1]] },
      () => legacy(),
    ),
  )
  assert.throws(
    () =>
      comparisonReport(
        { columns: [{ label: 'a', files: ['a', './a'] }, spec.columns[1]] },
        () => legacy(),
      ),
    /Duplicate result content/,
  )
})

test('structured summary requires all files, no failures and stable passing counts', () => {
  const output = (counts) => '```json\n' + JSON.stringify(counts) + '\n```'
  const valid = {
    testFiles: 5,
    passedTests: 10,
    failedFiles: 0,
    failedTests: 0,
  }
  assert.equal(reportCounts(output(valid), 5).passedTests, 10)
  assert.throws(() => reportCounts(output(valid), 4))
  assert.throws(() => reportCounts(output(valid), 5, 11))
  assert.throws(() => reportCounts(output({ ...valid, failedTests: 1 }), 5))
  assert.throws(() => reportCounts(output({ ...valid, skippedTests: 1 }), 5))
  assert.throws(() => reportCounts('passed 5 files', 5))
})

test('real subprocess retains stdout/stderr and non-zero exits', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'rstest-harness-'))
  try {
    const result = await execute({
      command: [
        process.execPath,
        '-e',
        'console.log("out"); console.error("err"); process.exit(7)',
      ],
      cwd: dir,
      env: process.env,
      prefix: join(dir, 'run'),
      timeoutMs: 5000,
    })
    assert.equal(result.exitCode, 7)
    assert.equal(readFileSync(result.stdoutPath, 'utf8'), 'out\n')
    assert.equal(readFileSync(result.stderrPath, 'utf8'), 'err\n')
    assert.ok(result.wallMs > 0)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('timeout and abort terminate actual processes and preserve logs', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'rstest-harness-'))
  try {
    const args = {
      command: [process.execPath, '-e', 'setInterval(() => {}, 1000)'],
      cwd: dir,
      env: process.env,
      timeoutMs: 100,
    }
    const timeout = await execute({ ...args, prefix: join(dir, 'timeout') })
    assert.equal(timeout.timedOut, true)
    assert.notEqual(timeout.exitCode, 0)
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 100)
    const aborted = await execute({
      ...args,
      timeoutMs: 5000,
      prefix: join(dir, 'abort'),
      signal: controller.signal,
    })
    clearTimeout(timer)
    assert.equal(aborted.interrupted, true)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

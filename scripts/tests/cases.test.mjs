import test from 'node:test'
import assert from 'node:assert/strict'
import { copyFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { casesFor, SCALES, unsupportedReason } from '../lib/cases.mjs'
import { filesUnder, inventory } from '../lib/provenance.mjs'
import { normalize, mergeRows, comparisonReport } from '../lib/report.mjs'
import { parseOptions } from '../runner.mjs'

const root = fileURLToPath(new URL('../..', import.meta.url))

test('workload suites have unique cases and complete paired controls', () => {
  assert.equal(casesFor('main').length, 10)
  for (const suite of ['main', 'coverage', 'pools', 'barrel', 'scaling']) {
    const rows = casesFor(suite)
    assert.equal(new Set(rows.map((r) => r.id)).size, rows.length)
  }
  for (const app of ['react-spa', 'vue-spa'])
    assert.deepEqual(
      casesFor('main', { apps: [app] }).map((r) => r.env),
      ['jsdom', 'happy-dom', 'chromium'],
    )
  assert.equal(
    casesFor('main').filter((r) => r.app === 'barrel-clean').length,
    1,
  )
  for (const scale of SCALES) {
    assert.deepEqual(
      casesFor('barrel', { scales: [scale] }).map((r) => r.config),
      ['default', 'rstest.no-lazy-barrel.config.ts'],
    )
    assert.equal(casesFor('pools', { scales: [scale] }).length, 4)
    assert.deepEqual(
      casesFor('scaling', { scales: [scale] }).map((r) => r.dimension),
      ['files', 'graph'],
    )
  }
  const coverage = casesFor('coverage')
  for (let i = 0; i < coverage.length; i += 3)
    assert.deepEqual(
      coverage.slice(i, i + 3).map((r) => r.provider),
      ['none', 'v8', 'istanbul'],
    )
  assert.equal(parseOptions('barrel', ['--scales', 'small']).scales[0], 'small')
  assert.throws(() => parseOptions('main', ['--scales', 'small']))
})

test('capability skip is limited to the known Vue browser release', () => {
  const rows = casesFor('main', { apps: ['vue-spa'] })
  assert.equal(rows.filter((r) => unsupportedReason(r, '0.11.0')).length, 1)
  assert.equal(rows.filter((r) => unsupportedReason(r, '0.12.4')).length, 0)
})

test('0.11.0 VM pools are skipped without replacing them with forks', () => {
  const rows = casesFor('pools')
  assert.equal(rows.filter(r => unsupportedReason(r, '0.11.0')).length, 6)
  assert.equal(rows.filter(r => unsupportedReason(r, '0.12.5')).length, 0)
  assert.ok(rows.filter(r => ['forks', 'threads'].includes(r.pool)).every(r => !unsupportedReason(r, '0.11.0')))
})

test('version reports distinguish pool and barrel config rows', () => {
  for (const suite of ['pools', 'barrel']) {
    const document = { schemaVersion: 2, suite, meta: { options: { runs: 1 } }, results: casesFor(suite, { scales: ['small'] }).map(r => ({
      ...r, status: 'passed', samples: [{ phase: 'timed', status: 'passed', wallMs: 20 }],
    })) }
    const report = comparisonReport({ columns: [
      { label: 'old', files: ['old'] }, { label: 'new', files: ['new'] },
    ] }, () => document)
    for (const label of suite === 'pools' ? ['forks', 'threads', 'vmForks', 'vmThreads'] : ['default', 'lazy-barrel disabled'])
      assert.ok(report.summary.includes(` / ${label} |`))
  }
})

test('list CLI enumerates selected cases without generating results', () => {
  const result = spawnSync(
    process.execPath,
    ['scripts/bench-barrel.mjs', '--list', '--scales', 'small'],
    { cwd: root, encoding: 'utf8' },
  )
  assert.equal(result.status, 0, result.stderr)
  const listed = JSON.parse(result.stdout)
  assert.equal(listed.suite, 'barrel')
  assert.equal(listed.cases.length, 2)
})

test('generated scaling fixtures hold the unselected dimension constant', () => {
  const dir = mkdtempSync(join(tmpdir(), 'rstest-scaling-'))
  try {
    for (const path of [
      'tools/generator/helpers.mjs',
      'tools/generator/library-shape.mjs',
      'apps/node-library/generate.mjs',
    ]) {
      mkdirSync(join(dir, path, '..'), { recursive: true })
      copyFileSync(join(root, path), join(dir, path))
    }
    const app = join(dir, 'apps/node-library')
    const results = {}
    for (const dimension of ['files', 'graph']) {
      results[dimension] = []
      for (const scale of SCALES) {
        const generate = () => {
          const run = spawnSync(process.execPath, ['generate.mjs'], {
            cwd: app,
            env: {
              ...process.env,
              LIBRARY_DIMENSION: dimension,
              LIBRARY_SCALE: scale,
            },
            encoding: 'utf8',
          })
          assert.equal(run.status, 0, run.stderr)
          return {
            src: inventory(app, filesUnder(join(app, 'src'))),
            tests: inventory(app, filesUnder(join(app, 'tests'))),
          }
        }
        const first = generate()
        assert.deepEqual(generate(), first)
        results[dimension].push(first)
      }
    }
    assert.deepEqual(
      results.files.map((r) => r.src.files.length),
      [127, 127, 127],
    )
    assert.equal(new Set(results.files.map((r) => r.src.sha256)).size, 1)
    assert.deepEqual(
      results.files.map((r) => r.tests.files.length),
      [10, 40, 120],
    )
    assert.deepEqual(
      results.graph.map((r) => r.src.files.length),
      [43, 127, 493],
    )
    assert.equal(new Set(results.graph.map((r) => r.tests.sha256)).size, 1)
    assert.deepEqual(
      results.graph.map((r) => r.tests.files.length),
      [40, 40, 40],
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('scaling dimensions never merge; barrel config comparison is explicit', () => {
  const document = {
    schemaVersion: 2,
    suite: 'scaling',
    meta: { options: { runs: 1 } },
    results: ['files', 'graph'].map((dimension) => ({
      app: 'node-library',
      dimension,
      scale: 'small',
      status: 'passed',
      samples: [{ phase: 'timed', status: 'passed', wallMs: 20 }],
    })),
  }
  assert.equal(mergeRows(normalize(document)).size, 2)
  const barrel = {
    ...document,
    suite: 'barrel',
    results: ['default', 'rstest.no-lazy-barrel.config.ts'].map(
      (config, i) => ({
        app: 'barrel-clean',
        scale: 'small',
        config,
        status: 'passed',
        samples: [{ phase: 'timed', status: 'passed', wallMs: 20 + i * 10 }],
      }),
    ),
  }
  const report = comparisonReport(
    {
      axis: 'config',
      columns: barrel.results.map((r) => ({
        label: r.config,
        where: { config: r.config },
        files: ['run'],
      })),
    },
    () => barrel,
  )
  assert.match(report.summary, /\+50\.00%/)
})

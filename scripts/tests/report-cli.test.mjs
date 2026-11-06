import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = fileURLToPath(new URL('../..', import.meta.url))
const cli = (args) =>
  spawnSync(process.execPath, ['scripts/report.mjs', ...args], {
    cwd: root,
    encoding: 'utf8',
  })

test('CI summary shares README tables and retains CPU metadata without variability tables', async () => {
  const { comparisonReport, readmeBlock } = await import('../lib/report.mjs')
  const spec = {
    title: 'Rstest version benchmark',
    output: 'reports/main.md',
    columns: [{ label: 'Baseline', files: ['base'] }, { label: 'Candidate', files: ['next'] }],
  }
  const load = (file) => ({
    meta: {
      runs: 3, cpu: 'test CPU', node: 'v24', platform: 'linux',
      logicalCpuCount: 4, availableParallelism: 2,
      measurement: { warmup: 1, runs: 3 },
    },
    results: [{
      app: 'a', case: 'fixture',
      samples: file === 'base' ? [10, 20, 30] : [5, 10, 15],
      rssSamples: [90, 100, 110].map((n) => n * 1024 ** 2),
    }],
  })
  const report = comparisonReport(spec, load)
  const readme = readmeBlock(spec, report, load)
  for (const table of [report.summary, report.rssSummary]) {
    assert(table.length > 0)
    assert(report.jobSummary.includes(table))
    assert(readme.includes(table))
  }
  assert.match(report.jobSummary, /logical CPUs: 4; available parallelism: 2/)
  assert.match(report.jobSummary, /1 warmup\(s\), 3 timed runs/)
  assert.match(report.jobSummary, /### RSS comparison/)
  assert.doesNotMatch(report.jobSummary, /## Variability|## Memory|Min–max|\| CV \|/)
  assert.match(report.markdown, /## Variability/)
  assert.match(report.markdown, /## Memory/)
  const noRss = comparisonReport(spec, (file) => {
    const data = load(file)
    delete data.results[0].rssSamples
    return data
  })
  assert.doesNotMatch(noRss.jobSummary, /### RSS comparison/)
})

test('real report CLI updates a nested README and detects stale output without rewriting it', () => {
  const dir = mkdtempSync(join(tmpdir(), 'rstest-report-cli-'))
  try {
    const baseline = join(dir, 'base.json'),
      candidate = join(dir, 'candidate.json'),
      output = join(dir, 'report.md'),
      config = join(dir, 'config.json'),
      readmePath = join(dir, 'versions/README.md')
    const homepage = readFileSync(join(root, 'README.md'), 'utf8')
    mkdirSync(join(dir, 'versions'))
    writeFileSync(readmePath, '<!-- benchmark:versions:start -->\nstale\n<!-- benchmark:versions:end -->\n')
    const document = (samples) => ({
      meta: { runs: 3, cpu: 'test', node: 'v24', platform: 'test' },
      results: [{ app: 'a', case: 'fixture', samples }],
    })
    writeFileSync(baseline, JSON.stringify(document([10, 20, 30])))
    writeFileSync(candidate, JSON.stringify(document([5, 10, 15])))
    assert.equal(
      cli([
        '--baseline',
        baseline,
        '--candidate',
        candidate,
        '--output',
        output,
      ]).status,
      0,
    )
    assert.match(readFileSync(output, 'utf8'), /-50\.00%/)
    writeFileSync(
      config,
      JSON.stringify({
        readmePath,
        reports: [
          {
            output,
            marker: 'versions',
            columns: [
              { label: 'Baseline', files: [baseline] },
              { label: 'Candidate', files: [candidate] },
            ],
          },
        ],
      }),
    )
    assert.equal(cli(['--config', config, '--readme']).status, 0)
    assert.equal(readFileSync(join(root, 'README.md'), 'utf8'), homepage)
    const rendered = readFileSync(readmePath, 'utf8')
    assert.match(rendered, /\]\(\.\.\/report\.md\)/)
    assert.match(rendered, /-50\.00%/)
    assert.equal(cli(['--config', config, '--check']).status, 0)
    writeFileSync(readmePath, rendered.replace('-50.00%', 'stale'))
    const staleReadme = cli(['--config', config, '--check'])
    assert.notEqual(staleReadme.status, 0)
    assert.match(staleReadme.stderr, /Stale README/)
    assert.match(readFileSync(readmePath, 'utf8'), /stale/)
    writeFileSync(readmePath, rendered)
    writeFileSync(output, 'stale')
    const check = cli(['--config', config, '--check'])
    assert.notEqual(check.status, 0)
    assert.match(check.stderr, /Stale report/)
    assert.equal(readFileSync(output, 'utf8'), 'stale')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('real benchmark CLI rejects invalid arguments before starting work', () => {
  const result = spawnSync(
    process.execPath,
    ['scripts/bench.mjs', '--runs', '0'],
    { cwd: root, encoding: 'utf8' },
  )
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /positive integer/)
})

test('README selects two columns and recalculates notes without changing the full comparison', async () => {
  const { comparisonReport, readmeBlock } = await import('../lib/report.mjs')
  const spec = {
    output: 'reports/versions.md',
    context: 'Full three-version context',
    columns: [
      { label: 'baseline: 0.11.0', files: ['base'] },
      { label: 'candidate: 0.12.5', files: ['middle'] },
      { label: 'candidate-2: 0.12.6', files: ['last'] },
    ],
    readme: { columns: [0, 2], context: 'Selected two-version view' },
  }
  const load = file => ({
    meta: { runs: 3 },
    results: [{ app: 'example', name: 'Example', samples: file === 'base' ? [100, 100, 100] : file === 'last' ? [50, 50, 50] : [1, 10, 1000] }],
  })
  const full = comparisonReport(spec, load)
  const block = readmeBlock(spec, full, load)
  assert.match(full.summary, /0\.12\.5/)
  assert.doesNotMatch(full.summary, /high variation/)
  assert.match(full.markdown, /\| SD \|/)
  assert.doesNotMatch(block, /0\.12\.5|high variation|Full three-version context/)
  assert.match(block, /\| Case \| 0\.11\.0 \| 0\.12\.6 \| Δ \| Notes \|/)
  assert.match(block, /\| -50\.00% \|/)
  assert.match(block, /Selected two-version view/)
  assert.equal(spec.columns.length, 3)
  for (const columns of [[1, 2], [0, 0], [0, 3], [0]])
    assert.throws(() => readmeBlock({ ...spec, readme: { columns } }, full, load), /README columns/)
})

test('README projects compact RSS medians and changes onto selected versions', async () => {
  const { comparisonReport, readmeBlock } = await import('../lib/report.mjs')
  const spec = {
    output: 'reports/coverage.md',
    columns: [
      { label: 'baseline: 0.11.0', files: ['base'] },
      { label: 'candidate: 0.12.5', files: ['middle'] },
      { label: 'candidate-2: 0.12.6', files: ['last'] },
    ],
    readme: { columns: [0, 2] },
  }
  const load = (file) => ({
    meta: { runs: 3, platform: 'test' },
    results: [{
      app: 'example', name: 'Example', provider: 'v8',
      samples: [100, 100, 100],
      rssSamples: (file === 'base' ? [90, 100, 110] : file === 'last' ? [70, 75, 80] : [200, 200, 200]).map(value => value * 1024 ** 2),
    }],
  })
  const full = comparisonReport(spec, load)
  const block = readmeBlock(spec, full, load)
  assert.match(block, /### RSS comparison/)
  assert.match(block, /\| Case \| 0\.11\.0 \| 0\.12\.6 \| Δ \|\n/)
  assert.match(block, /\| Example \/ v8 \| 100\.00 \| 75\.00 \| -25\.00% \|/)
  assert.doesNotMatch(block, /0\.12\.5|## Variability|## Memory|Median MiB|Min–max|\| Column \|/)
  assert.match(full.markdown, /## Memory/)
  assert.match(full.rssSummary, /0\.12\.5/)
  // Publication also passes the complete report directly without a README projection.
  assert.match(readmeBlock({ ...spec, readme: undefined }, full), /### RSS comparison/)
  const withoutMemory = (file) => {
    const doc = load(file)
    delete doc.results[0].rssSamples
    return doc
  }
  assert.doesNotMatch(readmeBlock(spec, full, withoutMemory), /### RSS comparison/)
})

test('RSS comparisons suppress percentages for incomplete or incompatible inputs', async () => {
  const { comparisonReport } = await import('../lib/report.mjs')
  const spec = {
    columns: [
      { label: 'Baseline', files: ['base'] },
      { label: 'Candidate', files: ['candidate'] },
    ],
  }
  for (const scenario of ['missing', 'incomplete', 'incompatible', 'failed', 'zero']) {
    const report = comparisonReport(spec, file => ({
      meta: { runs: 3, platform: scenario === 'incompatible' ? file : 'test' },
      results: [{
        app: 'example', name: 'Example', provider: 'v8', samples: [100, 100, 100],
        ...(scenario === 'failed' && file === 'candidate' ? { error: 'failed run' } : {}),
        rssSamples: file === 'base'
          ? Array(3).fill(scenario === 'zero' ? 0 : 100 * 1024 ** 2)
          : Array(scenario === 'missing' ? 0 : scenario === 'incomplete' ? 2 : 3).fill(50 * 1024 ** 2),
      }],
    }))
    assert.doesNotMatch(report.rssSummary, /%/, scenario)
    if (scenario === 'incomplete') assert.match(report.rssSummary, /INCOMPLETE/)
    if (scenario === 'failed') assert.match(report.rssSummary, /FAILED/)
  }
})

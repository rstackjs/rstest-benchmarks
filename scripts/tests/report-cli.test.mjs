import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
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

test('real report CLI creates comparison and detects stale output without rewriting it', () => {
  const dir = mkdtempSync(join(tmpdir(), 'rstest-report-cli-'))
  try {
    const baseline = join(dir, 'base.json'),
      candidate = join(dir, 'candidate.json'),
      output = join(dir, 'report.md'),
      config = join(dir, 'config.json')
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
        reports: [
          {
            output,
            columns: [
              { label: 'Baseline', files: [baseline] },
              { label: 'Candidate', files: [candidate] },
            ],
          },
        ],
      }),
    )
    assert.equal(cli(['--config', config, '--check']).status, 0)
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

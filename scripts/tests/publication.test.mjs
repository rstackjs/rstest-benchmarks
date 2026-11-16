import test from 'node:test'
import assert from 'node:assert/strict'
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
  existsSync,
  cpSync,
} from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { publishComparison } from '../lib/publication.mjs'
import { comparisonReport, readmeBlock } from '../lib/report.mjs'

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'rstest-publication-'))
  const write = (path, content) => {
    mkdirSync(join(root, path, '..'), { recursive: true })
    writeFileSync(
      join(root, path),
      typeof content === 'string' ? content : JSON.stringify(content),
    )
  }
  write('reports/data/old.json', '{}')
  write('reports/data/coverage.json', '{}')
  write('reports/versions.md', 'old report')
  write('reports/coverage.md', 'keep coverage')
  write('reports/README.md', 'old index')
  write('README.md', '# Framework comparisons\n')
  write('reports.config.json', {
    readmePath: 'versions/README.md',
    reports: [
      {
        title: 'old',
        output: 'reports/versions.md',
        marker: 'versions',
        columns: [{ label: 'old', files: ['reports/data/old.json'] }],
      },
      {
        title: 'coverage',
        output: 'reports/coverage.md',
        columns: [{ label: 'coverage', files: ['reports/data/coverage.json'] }],
      },
    ],
  })
  write(
    'versions/README.md',
    '# Benchmarks\n\n## Published release results\n\nStale versions and five runs.\n\n<!-- benchmark:versions:start -->\nold table\n<!-- benchmark:versions:end -->\n\n## Coverage results\n\nKeep this text and data.\n<!-- benchmark:coverage:start -->\nkeep coverage\n<!-- benchmark:coverage:end -->\n',
  )
  const sources = {
    baseline: { kind: 'npm', label: '0.12.4' },
    candidate: { kind: 'npm', label: '0.12.5' },
    'candidate-2': { kind: 'local', label: 'local abcdef12' },
  }
  const runs = []
  for (const [index, side] of Object.keys(sources).entries()) {
    const file = `results/run/${side}.json`
    runs.push({ side, suite: 'main', status: 'completed', file })
    write(file, {
      schemaVersion: 2,
      status: 'completed',
      suite: 'main',
      runId: side,
      meta: {
        startedAt: '2026-11-04T00:00:00Z',
        node: 'v24',
        cpu: 'test CPU',
        platform: 'test OS',
        options: { runs: 3, warmup: 1 },
        measurement: {
          order: 'rotating 3 versions per case/round; rotating variants',
        },
      },
      results: [
        {
          app: 'example',
          name: 'Example',
          status: 'passed',
          samples: [
            { phase: 'warmup', status: 'passed', wallMs: 100 },
            ...[0, 1, 2].map((round) => ({
              phase: 'timed',
              round,
              status: 'passed',
              wallMs: 100 - index * 10,
            })),
          ],
          memorySamples: [0, 1, 2].map((round) => ({
            phase: 'timed',
            round,
            status: 'passed',
            memoryBytes: (200 - index * 50) * 1024 ** 2,
          })),
        },
      ],
    })
  }
  return {
    root,
    write,
    record: {
      status: 'completed',
      sources,
      runs,
      reports: [{ output: 'results/run/reports/main.md' }],
      options: { runs: '3', warmup: '1' },
    },
  }
}

test('publication updates selected tables, context and inputs, preserving other suites and backing up retired data', () => {
  const { root, record } = fixture()
  try {
    const result = publishComparison(root, join(root, 'results/run'), record)
    const readme = readFileSync(join(root, 'versions/README.md'), 'utf8')
    assert.equal(readFileSync(join(root, 'README.md'), 'utf8'), '# Framework comparisons\n')
    assert.equal(result.readmePath, 'versions/README.md')
    assert.match(readme, /\]\(\.\.\/reports\/versions\.md\)/)
    assert(!readme.includes('Stale versions'))
    assert.match(readme, /3 timed runs/)
    assert.match(readme, /local abcdef12/)
    assert.match(readme, /-10\.00%/)
    assert.match(readme, /-20\.00%/)
    assert.match(readme, /### Memory comparison/)
    assert.match(readme, /\| Example \| 200\.00 \| 150\.00 \| -25\.00% \| 100\.00 \| -50\.00% \|/)
    assert.match(readme, /Keep this text and data/)
    assert.equal(
      readFileSync(join(root, 'reports/coverage.md'), 'utf8'),
      'keep coverage',
    )
    assert.equal(existsSync(join(root, 'reports/data/coverage.json')), true)
    assert.equal(existsSync(join(root, 'reports/data/old.json')), false)
    assert.equal(
      readFileSync(join(root, result.backup, 'reports/data/old.json'), 'utf8'),
      '{}',
    )
    const config = JSON.parse(readFileSync(join(root, 'reports.config.json')))
    const spec = config.reports[0]
    assert.equal(spec.columns.length, 3)
    const generated = comparisonReport(spec, (file) =>
      JSON.parse(readFileSync(join(root, file))),
    )
    assert.equal(
      generated.markdown,
      readFileSync(join(root, spec.output), 'utf8'),
    )
    assert(readme.includes(readmeBlock(spec, generated, undefined, config.readmePath)))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('publication CLI imports a completed CI artifact without changing the framework homepage', () => {
  const { root, record, write } = fixture()
  try {
    cpSync(new URL('../', import.meta.url), join(root, 'scripts'), { recursive: true })
    record.ci = { url: 'https://github.com/example/benchmarks/actions/runs/123', sha: 'abc123', attempt: 2 }
    write('results/run/comparison.json', record)
    const result = spawnSync(process.execPath, ['scripts/publish-comparison.mjs', '--input', 'results/run/comparison.json'], { cwd: root, encoding: 'utf8' })
    assert.equal(result.status, 0, result.stderr)
    assert.match(result.stdout, /Updated versions\/README.md/)
    assert.equal(readFileSync(join(root, 'README.md'), 'utf8'), '# Framework comparisons\n')
    assert.match(readFileSync(join(root, 'versions/README.md'), 'utf8'), /actions\/runs\/123/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('failed or incompatible comparisons leave all published files untouched', () => {
  for (const failure of ['status', 'samples', 'compatibility', 'markers']) {
    const { root, record, write } = fixture()
    try {
      if (failure === 'status') record.status = 'failed'
      else if (failure === 'markers') write('versions/README.md', '# Missing markers')
      else {
        const file = record.runs[2].file
        const doc = JSON.parse(readFileSync(join(root, file)))
        if (failure === 'samples') doc.results[0].samples.pop()
        else doc.meta.node = 'different runtime'
        write(file, doc)
      }
      const paths = [
        'versions/README.md',
        'reports.config.json',
        'reports/README.md',
        'reports/versions.md',
        'reports/data/old.json',
      ]
      const originals = paths.map((path) =>
        readFileSync(join(root, path), 'utf8'),
      )
      assert.throws(() =>
        publishComparison(root, join(root, 'results/run'), record),
      )
      paths.forEach((path, index) =>
        assert.equal(readFileSync(join(root, path), 'utf8'), originals[index]),
      )
      assert.equal(
        existsSync(join(root, 'reports/data/baseline-baseline-main.json')),
        false,
      )
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  }
})

test('publication rolls back already-written reports and inputs when a later write fails', async (t) => {
  const fs = (await import('node:fs')).default
  const { syncBuiltinESMExports } = await import('node:module')
  const { root, record } = fixture()
  const paths = [
    'versions/README.md',
    'reports.config.json',
    'reports/README.md',
    'reports/versions.md',
    'reports/data/old.json',
  ]
  const original = paths.map((path) => readFileSync(join(root, path), 'utf8'))
  const rename = fs.renameSync
  const patched = t.mock.method(fs, 'renameSync', (from, to) => {
    if (to === join(root, 'versions/README.md'))
      throw new Error('simulated write failure')
    return rename(from, to)
  })
  syncBuiltinESMExports()
  try {
    assert.throws(
      () => publishComparison(root, join(root, 'results/run'), record),
      /simulated write failure/,
    )
    paths.forEach((path, index) =>
      assert.equal(readFileSync(join(root, path), 'utf8'), original[index]),
    )
    assert.equal(
      existsSync(join(root, 'reports/data/baseline-baseline-main.json')),
      false,
    )
    assert.equal(
      fs.readdirSync(root).some((file) => file.endsWith('.tmp')),
      false,
    )
  } finally {
    patched.mock.restore()
    syncBuiltinESMExports()
    rmSync(root, { recursive: true, force: true })
  }
})

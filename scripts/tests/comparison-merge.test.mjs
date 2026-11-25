import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { mergeComparisons } from '../lib/merge-comparison.mjs'

const MiB = 1024 ** 2
const sample = (phase, wallMs) => ({ phase, status: 'passed', wallMs, exitCode: 0, order: 0, counts: { tests: 2 } })
const row = (app, provider, base) => ({
  app, name: app, provider, scale: null, env: 'node', pool: 'forks', isolate: true, dimension: null, config: 'default',
  id: `coverage:${app}:default:default:node:forks:${provider}:default`, status: 'passed', expectedFiles: 1, tests: 2,
  fixture: { sha256: `fixture-${app}` }, configs: { sha256: `config-${app}` }, dependencies: { '@rstest/core': { version: '0.12.6' } },
  samples: [sample('warmup', base * 3), sample('timed', base), sample('timed', base + 1)],
  memorySamples: [100, 110].map((n) => ({ phase: 'timed', status: 'passed', memoryBytes: n * MiB })),
})
const meta = (app, side) => ({
  label: 'run', startedAt: `2026-11-12T00:0${app === 'a' ? 0 : 5}:00.000Z`, endedAt: `2026-11-12T00:0${app === 'a' ? 4 : 9}:00.000Z`,
  node: 'v24.11.1', cpu: 'test CPU', logicalCpuCount: 3, platform: 'darwin arm64', osRelease: '24', availableParallelism: 3,
  packageManager: '11.6.0', git: { commit: 'abc', status: '' }, lockfileSha256: 'lock', runner: { sha256: 'runner' },
  source: { kind: 'npm', version: side === 'baseline' ? '0.11.0' : '0.12.6', label: side, workloadDependencies: { [app]: `deps-${app}` } },
  options: { runs: 2, warmup: 1, cases: [`coverage:${app}:default:default:node:forks:none:default`] },
  measurement: { clock: 'wall', warmup: 1, runs: 2 },
})

// Writes one per-app comparison directory the way an uploaded artifact lays it out.
function writeInput(root, app) {
  const name = `benchmark-version-coverage-case-${app}`
  const dirName = `ci-version-coverage-${app}`
  const dir = join(root, 'inputs', name, dirName)
  const runs = ['baseline', 'candidate'].map((side) => {
    const relative = `workspaces/${side}/results/${app}-${side}/result.json`
    const doc = {
      schemaVersion: 2, runId: `${app}-${side}`, suite: 'coverage', status: 'completed', meta: meta(app, side), generations: [{ app }],
      results: ['none', 'v8'].map((provider) => row(app, provider, side === 'baseline' ? 20 : 10)),
    }
    mkdirSync(join(dir, relative, '..'), { recursive: true })
    writeFileSync(join(dir, relative), JSON.stringify(doc))
    // The recorded path is repository-relative on the job that produced it.
    return { side, suite: 'coverage', status: 'completed', file: `results/${dirName}/${relative}` }
  })
  writeFileSync(join(dir, 'comparison.json'), JSON.stringify({
    host: { node: 'v24.11.1', cpu: 'test CPU', logicalCpuCount: 3, platform: 'darwin arm64', availableParallelism: 3 },
    status: 'completed',
    options: { baseline: '0.11.0', candidate: ['0.12.6'], suites: 'coverage', runs: '2', warmup: '1', label: 'ci', cases: `coverage:${app}:default:default:node:forks:none:default` },
    sources: { baseline: { kind: 'npm', version: '0.11.0', label: '0.11.0', installed: {} }, candidate: { kind: 'npm', version: '0.12.6', label: '0.12.6', installed: {} } },
    runs, reports: [], schedule: [{ kind: 'prepare', group: app }],
    ci: { url: 'https://github.com/example/b/actions/runs/1', sha: 'abc', attempt: 1, job: app, runner: `runner-${app}`, image: 'img' },
    startedAt: '2026-11-12T00:00:00.000Z', endedAt: '2026-11-12T00:09:00.000Z',
  }))
  return { name, file: join(dir, 'comparison.json'), dir, runs }
}
const scratch = (t) => {
  const root = mkdtempSync(join(tmpdir(), 'comparison-merge-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  return root
}

test('per-app comparisons merge into one comparison the publisher accepts', (t) => {
  const root = scratch(t)
  const inputs = [writeInput(root, 'a'), writeInput(root, 'b')]
  const out = join(root, 'results', 'merged')
  const comparison = mergeComparisons(root, inputs, out)
  assert.deepEqual(comparison.runs.map((run) => run.file), ['results/merged/baseline/result.json', 'results/merged/candidate/result.json'])
  assert.deepEqual(comparison.mergedFrom.map((entry) => entry.name), inputs.map((input) => input.name))
  assert.equal(comparison.ci.runner, 'runner-a, runner-b')
  assert.equal(comparison.startedAt, '2026-11-12T00:00:00.000Z')
  const baseline = JSON.parse(readFileSync(join(out, 'baseline', 'result.json'), 'utf8'))
  assert.equal(baseline.results.length, 4)
  assert.deepEqual(baseline.meta.source.workloadDependencies, { a: 'deps-a', b: 'deps-b' })
  assert.equal(baseline.meta.options.cases.length, 2)
  assert.equal(baseline.status, 'completed')
  const saved = JSON.parse(readFileSync(join(out, 'comparison.json'), 'utf8'))
  assert.deepEqual(saved.reports[0].columns.map((column) => column.files), [['results/merged/baseline/result.json'], ['results/merged/candidate/result.json']])
  assert.match(readFileSync(join(out, 'reports', 'coverage.md'), 'utf8'), /Memory/)
  assert.match(readFileSync(join(out, 'summary.md'), 'utf8'), /Memory/)
})

test('comparison merging refuses mismatched identity, duplicates and failed inputs without writing', (t) => {
  const root = scratch(t)
  const edit = (change) => {
    const inputs = [writeInput(root, 'a'), writeInput(root, 'b')]
    change(inputs[1])
    return () => mergeComparisons(root, inputs, join(root, 'results', 'out'))
  }
  const rewrite = (path, change) => {
    const value = JSON.parse(readFileSync(path, 'utf8'))
    change(value)
    writeFileSync(path, JSON.stringify(value))
  }
  const candidateDoc = (input) => join(input.dir, input.runs[1].file.replace(/^results\/[^/]+\//, ''))
  assert.throws(edit((input) => rewrite(input.file, (c) => { c.sources.candidate.version = '0.13.0' })), /candidate source differs/)
  assert.throws(edit((input) => rewrite(input.file, (c) => { c.options.runs = '6' })), /options differ/)
  assert.throws(edit((input) => rewrite(input.file, (c) => { c.status = 'failed' })), /failed, not completed/)
  assert.throws(edit((input) => rewrite(input.file, (c) => { c.host.cpu = 'other' })), /host\.cpu differs/)
  assert.throws(edit((input) => rewrite(candidateDoc(input), (d) => { d.meta.lockfileSha256 = 'other' })), /lockfileSha256 differs/)
  assert.throws(edit((input) => rewrite(candidateDoc(input), (d) => { d.meta.runner.sha256 = 'other' })), /runner harness differs/)
  assert.throws(edit((input) => rewrite(candidateDoc(input), (d) => { d.results[0].id = 'coverage:a:default:default:node:forks:none:default' })), /Duplicate case/)
  assert.throws(edit((input) => rewrite(candidateDoc(input), (d) => { d.status = 'failed' })), /not completed/)
  assert.throws(() => mergeComparisons(root, [], join(root, 'results', 'out')), /No comparisons/)
  assert.throws(() => readFileSync(join(root, 'results', 'out', 'comparison.json')), /ENOENT/)
})

test('multi-suite version matrix comparisons merge separate suites into one comparison', (t) => {
  const root = scratch(t)
  const makeUnit = (unitName, suite, rows) => {
    const name = `benchmark-version-case-${unitName}`
    const dirName = `ci-versions-${unitName}`
    const dir = join(root, 'inputs', name, dirName)
    const runs = ['baseline', 'candidate'].map((side) => {
      const rel = `workspaces/${side}/results/${unitName}-${side}/result.json`
      const doc = {
        schemaVersion: 2,
        runId: `${unitName}-${side}`,
        suite,
        status: 'completed',
        meta: {
          ...meta(rows[0].app, side),
          source: {
            kind: side === 'baseline' ? 'npm' : 'preview',
            ...(side === 'baseline'
              ? { version: '1.0.0-beta.0' }
              : { commit: '380624b', requested: 'https://pkg.pr.new/@rstest/core@380624b' }),
            label: side === 'baseline' ? '1.0.0-beta.0' : 'preview 380624b',
            workloadDependencies: Object.fromEntries(rows.map((r) => [r.app, `deps-${r.app}`])),
          },
          options: { runs: 2, warmup: 1, memory: true, cases: rows.map((r) => r.id) },
        },
        generations: [{ app: rows[0].app }],
        results: rows.map((r) => ({ ...r, samples: [sample('warmup', 30), sample('timed', side === 'baseline' ? 20 : 10), sample('timed', side === 'baseline' ? 21 : 11)] })),
      }
      mkdirSync(join(dir, rel, '..'), { recursive: true })
      writeFileSync(join(dir, rel), JSON.stringify(doc))
      return { side, suite, status: 'completed', file: `results/${dirName}/${rel}` }
    })
    writeFileSync(join(dir, 'comparison.json'), JSON.stringify({
      host: { node: 'v24.11.1', cpu: 'test CPU', logicalCpuCount: 3, platform: 'darwin arm64', availableParallelism: 3 },
      status: 'completed',
      options: { baseline: '1.0.0-beta.0', candidate: ['https://pkg.pr.new/@rstest/core@380624b'], suites: suite, runs: '2', warmup: '1', memory: true, label: 'ci-versions', cases: rows.map((r) => r.id).join(',') },
      sources: {
        baseline: { kind: 'npm', version: '1.0.0-beta.0', label: '1.0.0-beta.0', installed: {} },
        candidate: { kind: 'preview', commit: '380624b', requested: 'https://pkg.pr.new/@rstest/core@380624b', label: 'preview 380624b', installed: {} },
      },
      runs, reports: [], schedule: [{ kind: 'prepare', group: unitName }],
      ci: { url: 'https://github.com/example/b/actions/runs/2', sha: 'abc', attempt: 1, job: unitName, runner: `runner-${unitName}`, image: 'img' },
      startedAt: '2026-11-25T00:00:00.000Z', endedAt: '2026-11-25T00:09:00.000Z',
    }))
    return { name, file: join(dir, 'comparison.json') }
  }
  const inputs = [
    makeUnit('scaling-files', 'scaling', [{
      ...row('node-library', 'none', 20),
      id: 'scaling:node-library:files:small:node:forks:none:default',
      dimension: 'files', scale: 'small', name: 'files scaling · small',
    }]),
    makeUnit('main-many-files', 'main', [{
      ...row('many-files', 'none', 20),
      id: 'main:many-files:default:default:node:forks:none:default',
      name: 'Many files',
    }]),
    makeUnit('main-node', 'main', [{
      ...row('minimal-node', 'none', 20),
      id: 'main:minimal-node:default:default:node:forks:none:default',
      name: 'Node · 2 files',
    }]),
  ]
  const out = join(root, 'results', 'merged-multi')
  const comparison = mergeComparisons(root, inputs, out)
  assert.equal(comparison.options.suites, 'main,scaling')
  assert.deepEqual(comparison.runs.map((r) => r.file), [
    'results/merged-multi/baseline/main.json',
    'results/merged-multi/candidate/main.json',
    'results/merged-multi/baseline/scaling.json',
    'results/merged-multi/candidate/scaling.json',
  ])
  // Main results are restored to canonical casesFor('main') order even when globbed out of order.
  const mainBaseline = JSON.parse(readFileSync(join(out, 'baseline', 'main.json'), 'utf8'))
  assert.deepEqual(mainBaseline.results.map((r) => r.app), ['minimal-node', 'many-files'])
  assert.match(readFileSync(join(out, 'reports', 'main.md'), 'utf8'), /Node · 2 files/)
  assert.match(readFileSync(join(out, 'reports', 'scaling.md'), 'utf8'), /files scaling · small/)
  assert.match(readFileSync(join(out, 'summary.md'), 'utf8'), /Rstest version benchmark/)
  assert.match(readFileSync(join(out, 'summary.md'), 'utf8'), /Rstest scaling benchmark/)
})

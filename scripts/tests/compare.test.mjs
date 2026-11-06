import test from 'node:test'
import assert from 'node:assert/strict'
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import {
  parseSource,
  rstestPackages,
  builtFiles,
  verifyInstalled,
  sourceIdentity,
} from '../lib/sources.mjs'
import { execute } from '../lib/process.mjs'
import { normalize, mergeRows } from '../lib/report.mjs'

const root = fileURLToPath(new URL('../..', import.meta.url))
const cli = (...args) =>
  spawnSync(process.execPath, ['scripts/compare.mjs', ...args], {
    cwd: root,
    encoding: 'utf8',
  })

test('compare dry-run validates both sources and filters before installing or measuring', () => {
  const result = cli(
    '--baseline',
    '0.12.5',
    '--candidate',
    '0.12.6',
    '--apps',
    'node-backend',
    '--suites',
    'main,coverage',
    '--dry-run',
  )
  assert.equal(result.status, 0, result.stderr)
  const plan = JSON.parse(result.stdout)
  assert.equal(plan.matrix.main.length, 1)
  assert.equal(plan.matrix.coverage.length, 3)
  assert.equal(plan.sources.candidate.version, '0.12.6')
  assert.notEqual(
    cli('--baseline', 'latest', '--candidate', '0.12.6', '--dry-run').status,
    0,
  )
  assert.notEqual(
    cli(
      '--baseline',
      '0.12.5',
      '--candidate',
      '0.12.6',
      '--suites',
      'main,main',
      '--dry-run',
    ).status,
    0,
  )
  assert.notEqual(
    cli(
      '--baseline',
      '0.12.5',
      '--candidate',
      '0.12.6',
      '--runs',
      '0',
      '--dry-run',
    ).status,
    0,
  )
})

test('local package verification detects stale installed output even when versions match', () => {
  const dir = mkdtempSync(join(tmpdir(), 'rstest-local-source-'))
  try {
    for (const name of rstestPackages) {
      const p = join(dir, 'packages', name)
      mkdirSync(p, { recursive: true })
      writeFileSync(
        join(p, 'package.json'),
        JSON.stringify({ name: `@rstest/${name}`, version: '0.12.6' }),
      )
    }
    const source = parseSource(`local:${dir}`, root)
    assert.equal(source.kind, 'local')
    const core = join(dir, 'packages/core')
    mkdirSync(join(core, 'dist'))
    writeFileSync(join(core, 'dist/index.js'), 'export const version = 1')
    source.packages = { core: { version: '0.12.6', built: builtFiles(core) } }
    const app = join(dir, 'apps/example')
    const installed = join(app, 'node_modules/@rstest/core')
    mkdirSync(join(installed, 'dist'), { recursive: true })
    mkdirSync(join(installed, 'bin'))
    writeFileSync(
      join(app, 'package.json'),
      JSON.stringify({ devDependencies: { '@rstest/core': '0.12.6' } }),
    )
    writeFileSync(
      join(installed, 'package.json'),
      readFileSync(join(core, 'package.json')),
    )
    writeFileSync(join(installed, 'bin/rstest.js'), '')
    writeFileSync(join(installed, 'dist/index.js'), 'stale output')
    assert.throws(() => verifyInstalled(dir, source), /artifact differs/)
    writeFileSync(
      join(installed, 'dist/index.js'),
      readFileSync(join(core, 'dist/index.js')),
    )
    assert.equal(
      verifyInstalled(dir, source)['example/@rstest/core'].version,
      '0.12.6',
    )
    assert.throws(
      () => verifyInstalled(dir, { kind: 'npm', version: '0.12.5' }),
      /expected/,
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('pooling rejects different local builds with the same package version', () => {
  const source = {
    kind: 'local',
    label: 'local',
    git: { commit: 'abc' },
    packages: {
      core: {
        version: '0.12.6',
        archiveSha256: 'first',
        built: { sha256: 'first' },
      },
    },
  }
  const first = sourceIdentity(source)
  source.packages.core.archiveSha256 = 'second'
  const second = sourceIdentity(source)
  const doc = (identity) => ({
    meta: { runs: 3, source: identity, rstest: '0.12.6' },
    results: [{ app: 'example', samples: [1, 2, 3] }],
  })
  const rows = [...normalize(doc(first)), ...normalize(doc(second))]
  const merged = [...mergeRows(rows).values()][0]
  assert.equal(merged.status, 'incompatible')
  assert.deepEqual(merged.differences, ['source identity'])
})

test('graceful subprocess timeout lets the benchmark runner finish cleanup', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'rstest-graceful-'))
  try {
    const marker = join(dir, 'cleanup')
    const result = await execute({
      command: [
        process.execPath,
        '-e',
        `process.on('SIGTERM', () => { require('fs').writeFileSync(process.argv[1], 'cleaned'); process.exit(1) }); setInterval(() => {}, 1000)`,
        marker,
      ],
      cwd: dir,
      env: process.env,
      prefix: join(dir, 'process'),
      timeoutMs: 500,
      graceful: true,
    })
    assert.equal(result.timedOut, true)
    assert.equal(readFileSync(marker, 'utf8'), 'cleaned')
    assert.equal(result.exitCode, 1)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('paired scheduling alternates each round without overlapping preparation or samples', async () => {
  const { runPaired } = await import('../lib/paired.mjs')
  for (const reverse of [false, true]) {
    let active = false
    const completed = []
    const worker = async function* (side) {
      for (const step of [
        { kind: 'prepare', group: 'first' },
        { kind: 'sample', id: 'first', phase: 'warmup', round: 0 },
        ...[0, 1, 2].map((round) => ({
          kind: 'sample',
          id: 'first',
          phase: 'timed',
          round,
        })),
        { kind: 'prepare', group: 'second' },
        { kind: 'sample', id: 'second', phase: 'timed', round: 0 },
      ]) {
        yield step
        assert.equal(active, false, 'another side is preparing or running')
        active = true
        await new Promise((resolve) => setTimeout(resolve, 2))
        completed.push({ side, ...step })
        active = false
      }
      return side
    }
    const results = await runPaired(
      { baseline: worker('A'), candidate: worker('B') },
      { reverse },
    )
    assert.deepEqual(results, { baseline: 'A', candidate: 'B' })
    const timed = completed
      .filter((step) => step.phase === 'timed')
      .map((step) => step.side)
      .join('')
    assert.equal(timed, reverse ? 'BAABBAAB' : 'ABBAABBA')
  }
})

test('paired scheduling preserves skipped slots and closes both suites on interruption or divergence', async () => {
  const { runPaired } = await import('../lib/paired.mjs')
  for (const mode of ['skipped', 'interrupt', 'diverge']) {
    const controller = new AbortController()
    const closed = []
    const measured = []
    const worker = async function* (side) {
      try {
        yield { kind: 'prepare', group: 'first' }
        yield {
          kind: 'sample',
          id: mode === 'diverge' ? side : 'same',
          round: 0,
        }
        if (mode === 'interrupt') controller.abort()
        if (mode !== 'skipped' || side !== 'A') measured.push(side)
      } finally {
        closed.push(side)
      }
    }
    const promise = runPaired(
      { baseline: worker('A'), candidate: worker('B') },
      { signal: controller.signal },
    )
    if (mode === 'skipped') {
      await promise
      assert.deepEqual(measured, ['B'])
    } else {
      await assert.rejects(
        promise,
        mode === 'interrupt' ? /interrupted/ : /diverged/,
      )
    }
    assert.deepEqual(closed.sort(), ['A', 'B'])
  }
})

test('workload audit rejects transitive drift, permits framework-owned changes and ignores installation paths', async () => {
  const { workloadDependencies, verifyWorkloadDependencies } =
    await import('../lib/sources.mjs')
  const dir = mkdtempSync(join(tmpdir(), 'rstest-dependency-audit-'))
  try {
    const write = (side, name, manifest) => {
      const path = join(
        dir,
        side,
        'apps/example',
        name ? `node_modules/${name}` : '',
      )
      mkdirSync(path, { recursive: true })
      writeFileSync(join(path, 'package.json'), JSON.stringify(manifest))
    }
    for (const side of ['A', 'B']) {
      write(side, '', {
        dependencies: { express: '1.0.0', '@rstest/core': '0.12.6' },
      })
      write(side, 'express', {
        name: 'express',
        version: '1.0.0',
        dependencies: { router: '^1' },
      })
      write(side, 'router', { name: 'router', version: '1.0.0' })
      write(side, '@rstest/core', {
        name: '@rstest/core',
        version: side,
        dependencies: { rspack: side },
      })
    }
    const audit = (side) => workloadDependencies(join(dir, side), ['example'])
    const baseline = audit('A')
    assert.doesNotThrow(() => verifyWorkloadDependencies(baseline, audit('B')))
    write('B', 'router', { name: 'router', version: '1.1.0' })
    assert.throws(
      () => verifyWorkloadDependencies(baseline, audit('B')),
      /dependencies differ/,
    )
    rmSync(join(dir, 'B/apps/example/node_modules/router'), { recursive: true })
    assert.throws(() => audit('B'), /Missing workload dependency/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('fixture cleanup removes stale sequencing and build caches but preserves installed packages', async () => {
  const { clearFixtureCaches, CACHE } = await import('../runner.mjs')
  const { existsSync } = await import('node:fs')
  const dir = mkdtempSync(join(tmpdir(), 'rstest-fixture-cache-'))
  try {
    for (const path of [...CACHE, 'node_modules/@rstest/core']) {
      mkdirSync(join(dir, path), { recursive: true })
      writeFileSync(join(dir, path, 'sentinel'), 'old fixture')
    }
    clearFixtureCaches(dir)
    for (const path of CACHE) assert.equal(existsSync(join(dir, path)), false)
    assert.equal(
      existsSync(join(dir, 'node_modules/@rstest/core/sentinel')),
      true,
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('report rejects changed workload dependencies even when fixtures and core versions match', async () => {
  const { compare } = await import('../lib/report.mjs')
  const doc = (hash) => ({
    meta: { runs: 3, source: { workloadDependencies: { example: hash } } },
    results: [{ app: 'example', samples: [1, 2, 3] }],
  })
  const [a] = normalize(doc('first'))
  const [b] = normalize(doc('second'))
  assert.equal(compare(a, b).delta, null)
  assert.match(compare(a, b).note, /workload dependencies/)
})

test('candidate CLI accepts lists and repeated flags; README publication is opt-in', () => {
  const args = [
    '--baseline',
    '0.12.4',
    '--candidate',
    '0.12.5,0.12.6',
    '--dry-run',
  ]
  const listed = cli(...args)
  assert.equal(listed.status, 0, listed.stderr)
  const plan = JSON.parse(listed.stdout)
  assert.deepEqual(
    Object.values(plan.sources).map((source) => source.version),
    ['0.12.4', '0.12.5', '0.12.6'],
  )
  assert.equal(plan.updateReadme, false)
  const repeated = cli(
    '--baseline',
    '0.12.4',
    '--candidate',
    '0.12.5',
    '--candidate',
    '0.12.6',
    '--update-readme',
    '--dry-run',
  )
  assert.equal(repeated.status, 0, repeated.stderr)
  assert.equal(JSON.parse(repeated.stdout).updateReadme, true)
  assert.deepEqual(JSON.parse(repeated.stdout).sources, plan.sources)
  assert.equal(
    JSON.parse(cli(...args, '--update-readme', '--no-update-readme').stdout)
      .updateReadme,
    false,
  )
  assert.notEqual(
    cli('--baseline', '0.12.4', '--candidate', '0.12.5,0.12.5', '--dry-run')
      .status,
    0,
  )
  assert.notEqual(cli('--baseline', '0.12.4', '--dry-run').status, 0)
})

test('three versions rotate through every position with one shared baseline and no overlap', async () => {
  const { runPaired } = await import('../lib/paired.mjs')
  for (const reverse of [false, true]) {
    let active = false
    const execution = []
    const worker = async function* (side) {
      yield { kind: 'prepare', group: 'same' }
      for (let round = 0; round < 6; round++) {
        yield { kind: 'sample', id: 'same', phase: 'timed', round }
        assert.equal(active, false)
        active = true
        await new Promise((resolve) => setTimeout(resolve, 1))
        execution.push({ side, round })
        active = false
      }
    }
    const sides = ['baseline', 'candidate', 'candidate-2']
    await runPaired(
      Object.fromEntries(sides.map((side) => [side, worker(side)])),
      { reverse, offset: 1 },
    )
    for (const side of sides) {
      const positions = [0, 0, 0]
      execution.forEach((item, index) => {
        if (item.side === side) positions[index % 3]++
      })
      assert.deepEqual(positions, [2, 2, 2])
    }
    for (let round = 0; round < 6; round++)
      assert.equal(execution.filter((x) => x.round === round).length, 3)
  }
})

test('package verification resolves declared browser entries across release layouts', () => {
  const dir = mkdtempSync(join(tmpdir(), 'rstest-browser-entry-'))
  try {
    for (const [version, entry] of [
      ['0.11.0', './dist/browser.js'],
      ['0.12.6', './dist/client/index.js'],
    ]) {
      const workspace = join(dir, version)
      const app = join(workspace, 'apps/example')
      const pkg = join(app, 'node_modules/@rstest/browser')
      mkdirSync(join(pkg, 'dist/client'), { recursive: true })
      writeFileSync(
        join(app, 'package.json'),
        JSON.stringify({ devDependencies: { '@rstest/browser': version } }),
      )
      writeFileSync(
        join(pkg, 'package.json'),
        JSON.stringify({
          name: '@rstest/browser',
          version,
          type: 'module',
          exports: { '.': { default: entry } },
        }),
      )
      writeFileSync(join(pkg, entry), 'export {}')
      assert.equal(
        verifyInstalled(workspace, { kind: 'npm', version })[
          'example/@rstest/browser'
        ].version,
        version,
      )
      rmSync(join(pkg, entry))
      assert.throws(() => verifyInstalled(workspace, { kind: 'npm', version }), {
        code: 'MODULE_NOT_FOUND',
      })
    }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

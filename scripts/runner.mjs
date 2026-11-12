import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  renameSync,
  rmSync,
  existsSync,
  copyFileSync,
  openSync,
  closeSync,
} from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
import { parseArgs } from 'node:util'
import {
  casesFor,
  SCALES,
  SCALED_SUITES,
  rotate,
  unsupportedReason,
} from './lib/cases.mjs'
import { statistics, seconds } from './lib/stats.mjs'
import { execute, reportCounts, sameRunOutcome } from './lib/process.mjs'
import { getMemorySampler, memoryKind } from './lib/memory.mjs'
import {
  machine,
  dependencies,
  inventory,
  filesUnder,
  browserIdentity,
} from './lib/provenance.mjs'
import { singleReport } from './lib/report.mjs'
import { formatCpu } from './lib/host.mjs'
import { createProgress, versionRunCounts } from './lib/progress.mjs'

// Counters a memory run must reproduce from its timing run.
const countKeys = ['testFiles', 'passedTests', 'failedTests', 'failedFiles', 'skippedTests', 'todoTests']

const ROOT = fileURLToPath(new URL('..', import.meta.url))
export const CACHE = [
  'dist/.rstest-temp',
  'node_modules/.cache/rstest',
  'node_modules/.cache/.rstest-results',
]

export function clearFixtureCaches(appDir) {
  for (const path of CACHE)
    rmSync(join(appDir, path), { recursive: true, force: true })
}

export function parseOptions(suite, args) {
  const { values } = parseArgs({
    args,
    options: {
      runs: { type: 'string', default: '5' },
      warmup: { type: 'string', default: '1' },
      label: { type: 'string', default: `rstest-${suite}` },
      apps: { type: 'string' },
      scales: { type: 'string' },
      reverse: { type: 'boolean', default: false },
      'timeout-ms': { type: 'string', default: '120000' },
      help: { type: 'boolean', default: false },
      list: { type: 'boolean', default: false },
    },
  })
  if (values.help) return { help: true }
  for (const key of ['runs', 'warmup', 'timeout-ms']) {
    values[key] = Number(values[key])
    if (!Number.isSafeInteger(values[key]) || values[key] < 1)
      throw new Error(`--${key} must be a positive integer`)
  }
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(values.label))
    throw new Error(
      'Invalid --label; use letters, digits, dots, underscores and hyphens',
    )
  if (values.scales && !SCALED_SUITES.includes(suite))
    throw new Error(`--scales is only supported by ${SCALED_SUITES.join(', ')}`)
  values.scales = values.scales?.split(',') ?? SCALES
  if (
    values.scales.some((scale) => !SCALES.includes(scale)) ||
    new Set(values.scales).size !== values.scales.length
  )
    throw new Error('--scales must be a unique subset of small,medium,large')
  values.apps = values.apps?.split(',')
  const known = new Set(casesFor(suite).map((item) => item.app))
  if (values.apps?.some((app) => !known.has(app)))
    throw new Error(
      `Unknown app for ${suite}; expected ${[...known].join(',')}`,
    )
  return values
}

export function environment(inherited = process.env) {
  const env = { ...inherited, CI: 'true', NO_COLOR: '1', LC_ALL: 'C' }
  for (const key of Object.keys(env)) {
    if (
      key.startsWith('BENCH_') ||
      [
        'LIBRARY_SCALE',
        'LIBRARY_DIMENSION',
        'BARREL_SCALE',
        'NODE_COMPILE_CACHE',
        'NODE_DISABLE_COMPILE_CACHE',
        'FORCE_COLOR',
      ].includes(key)
    )
      delete env[key]
  }
  env.NODE_DISABLE_COMPILE_CACHE = '1'
  return env
}

function savedEnvironment(env) {
  const keys = [
    'CI',
    'NO_COLOR',
    'LC_ALL',
    'LANG',
    'TZ',
    'NODE_OPTIONS',
    'NODE_COMPILE_CACHE',
    'NODE_DISABLE_COMPILE_CACHE',
    'UV_THREADPOOL_SIZE',
    'RAYON_NUM_THREADS',
    'PLAYWRIGHT_BROWSERS_PATH',
    'LIBRARY_SCALE',
    'LIBRARY_DIMENSION',
    'BARREL_SCALE',
  ]
  return Object.fromEntries(
    [
      ...new Set([
        ...keys,
        ...Object.keys(env).filter((key) => key.startsWith('BENCH_')),
      ]),
    ]
      .sort()
      .map((key) => [key, env[key] ?? null]),
  )
}

export async function runSuite(suite, args = process.argv.slice(2)) {
  for await (const step of suiteSteps(suite, args)) {
    // Advancing executes one preparation or sample at a time.
  }
}

export async function* suiteSteps(
  suite,
  args,
  { root = ROOT, order, progress, progressLabel = suite, caseIds } = {},
) {
  const options = parseOptions(suite, args)
  if (options.help) {
    console.log(
      `Suite: ${suite}\n--list --apps <names> --runs <n> --warmup <n> --label <name> --timeout-ms <ms> --reverse\nPools/barrel/scaling: --scales small,medium,large\nOutputs: results/<label>-<timestamp>-<id>/result.json and report.md`,
    )
    return
  }
  if (suite === 'coverage') {
    memoryKind()
    await getMemorySampler()
  }
  const items = casesFor(suite, options).filter((item) => !caseIds || caseIds.includes(item.id))
  if (!items.length) throw new Error('No benchmark cases selected')
  if (caseIds) options.cases = caseIds
  if (options.list) {
    console.log(JSON.stringify({ suite, cases: items }, null, 2))
    return
  }
  mkdirSync(join(root, 'results'), { recursive: true })
  // All suites share generated fixtures and caches.
  const lockPath = join(root, 'results/.runner.lock')
  const lock = openSync(lockPath, 'wx')
  const controller = new AbortController()
  const abort = () => controller.abort()
  process.on('SIGINT', abort)
  process.on('SIGTERM', abort)
  let document
  let runDir
  const persist = () => {
    const path = join(runDir, 'result.json')
    writeFileSync(`${path}.tmp`, JSON.stringify(document, null, 2) + '\n')
    renameSync(`${path}.tmp`, path)
  }
  try {
    const runId = `${options.label}-${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}`
    runDir = join(root, 'results', runId)
    mkdirSync(join(runDir, 'logs'), { recursive: true })
    writeFileSync(lock, JSON.stringify({ pid: process.pid, runDir }))
    const sourcePaths = [
      ...filesUnder(join(root, 'scripts')),
      ...filesUnder(join(root, 'tools')),
      join(root, 'package.json'),
      join(root, 'pnpm-workspace.yaml'),
      join(root, 'pnpm-lock.yaml'),
      join(root, 'benchmark-source.json'),
    ]
    const runner = inventory(
      root,
      sourcePaths.filter(
        (path) =>
          /\/(scripts|tools)\//.test(path) && !path.endsWith('.test.mjs'),
      ),
    )
    for (const path of sourcePaths) {
      if (!existsSync(path)) continue
      const dest = join(runDir, 'snapshot', relative(root, path))
      mkdirSync(dirname(dest), { recursive: true })
      copyFileSync(path, dest)
    }
    document = {
      schemaVersion: 2,
      runId,
      suite,
      status: 'running',
      meta: {
        label: options.label,
        startedAt: new Date().toISOString(),
        endedAt: null,
        ...machine(root),
        ...(existsSync(join(root, 'benchmark-source.json'))
          ? {
              source: JSON.parse(
                readFileSync(join(root, 'benchmark-source.json'), 'utf8'),
              ),
            }
          : {}),
        options,
        invocation: [process.execPath, ...process.argv.slice(1)],
        cwd: root,
        runner,
        measurement: {
          clock:
            'whole-process wall time; includes CLI/build/workers/tests/reporter',
          state: 'warm',
          warmup: options.warmup,
          runs: options.runs,
          reporter: 'md',
          order:
            order ??
            'rotating rounds within each fixture; versions measured separately',
          reverse: options.reverse,
          cache:
            'Node compile cache disabled via NODE_DISABLE_COMPILE_CACHE=1; clear Rstest build and sequencing caches once per fixture before warmups; retain across variants and timed rounds',
          maxWorkers: 'Rstest default (unset)',
          memory: suite === 'coverage' ? memoryKind() : null,
          environment:
            'Inherited environment; BENCH_*, scale and Node compile-cache overrides cleared, then NODE_DISABLE_COMPILE_CACHE=1 enforced. Only documented non-secret controls saved.',
        },
      },
      generations: [],
      results: items.map((item) => ({
        ...item,
        status: 'pending',
        samples: [],
        stats: statistics([]),
        memoryStats: statistics([]),
      })),
    }
    console.log(
      `[host] ${formatCpu(document.meta)}; ${document.meta.platform}; Node ${document.meta.node}`,
    )
    progress ??= createProgress(
      versionRunCounts(items, options, (item) =>
        JSON.parse(
          readFileSync(join(root, 'apps', item.app, 'node_modules/@rstest/core/package.json')),
        ).version,
      ),
    )
    persist()
    const groups = new Map()
    for (const item of document.results) {
      const key = `${item.app}:${item.dimension}:${item.scale}`
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(item)
    }
    let sequence = 0
    let groupIndex = 0
    for (const group of groups.values()) {
      if (controller.signal.aborted) break
      const first = group[0]
      yield {
        kind: 'prepare',
        group: `${first.app}:${first.dimension}:${first.scale}`,
      }
      const appDir = join(root, 'apps', first.app)
      const env = environment()
      if (first.app === 'node-library') {
        env.LIBRARY_SCALE = first.scale ?? 'medium'
        env.LIBRARY_DIMENSION = first.dimension ?? 'combined'
      }
      if (first.app === 'barrel-clean')
        env.BARREL_SCALE = first.scale ?? 'medium'
      const generation = await execute({
        command: [process.execPath, 'generate.mjs'],
        cwd: appDir,
        env,
        prefix: join(runDir, 'logs', `generate-${groupIndex++}`),
        timeoutMs: options['timeout-ms'],
        signal: controller.signal,
      })
      document.generations.push({
        app: first.app,
        scale: first.scale,
        dimension: first.dimension,
        cwd: appDir,
        command: [process.execPath, 'generate.mjs'],
        environment: savedEnvironment(env),
        ...generation,
        stdoutPath: relative(runDir, generation.stdoutPath),
        stderrPath: relative(runDir, generation.stderrPath),
      })
      if (
        generation.exitCode !== 0 ||
        generation.error ||
        generation.interrupted ||
        generation.timedOut
      ) {
        for (const item of group) {
          item.status = 'failed'
          item.error = 'Fixture generation failed; see generation logs'
        }
        persist()
        continue
      }
      const fixture = inventory(appDir, [
        ...filesUnder(join(appDir, 'src')),
        ...filesUnder(join(appDir, 'tests')),
      ])
      const configs = inventory(
        appDir,
        filesUnder(appDir).filter(
          (path) =>
            !path.includes('/node_modules/') &&
            !path.includes('/src/') &&
            !path.includes('/tests/') &&
            /(?:config\.(?:ts|js|json)|generate\.mjs|setup\.[^.]+)$/.test(path),
        ),
      )
      const installed = dependencies(appDir)
      const browser = group.some((item) => item.pool === 'browser')
        ? browserIdentity(appDir)
        : null
      const expectedFiles = fixture.files.filter((file) =>
        /\.(test|spec)\.[cm]?[jt]sx?$/.test(file.path),
      ).length
      const snapshotDir = join(
        runDir,
        'snapshot',
        first.app,
        first.dimension ?? 'combined',
        first.scale ?? 'default',
      )
      for (const file of [
        ...fixture.files,
        ...configs.files,
        { path: 'package.json' },
      ]) {
        const dest = join(snapshotDir, file.path)
        mkdirSync(dirname(dest), { recursive: true })
        copyFileSync(join(appDir, file.path), dest)
      }
      for (const item of group) {
        Object.assign(item, {
          fixture,
          configs,
          dependencies: installed,
          expectedFiles,
          cwd: appDir,
          status: 'running',
          browser: item.pool === 'browser' ? browser : null,
          environment: savedEnvironment(env),
        })
        const reason = unsupportedReason(
          item,
          installed['@rstest/core'].version,
        )
        if (reason) {
          item.status = 'skipped'
          item.reason = reason
          console.log(`${progressLabel}: skipped ${item.id}: ${reason}`)
        }
      }
      // measurement 'timing' runs without the sampler; 'memory' reruns the same
      // command under it. Elapsed time comes only from timing samples and memory
      // only from memory samples.
      const run = async (item, phase, round, measurement = 'timing', reference) => {
        if (item.status !== 'running' || controller.signal.aborted) return
        const childEnv = { ...env }
        if (item.pool === 'browser') childEnv.BENCH_BROWSER = 'true'
        else
          Object.assign(childEnv, {
            BENCH_POOL: item.pool,
            BENCH_ENV: item.env,
            BENCH_ISOLATE: String(item.isolate),
          })
        const command = [
          process.execPath,
          join(appDir, 'node_modules/@rstest/core/bin/rstest.js'),
          'run',
          '--reporter',
          'md',
        ]
        if (item.config !== 'default') command.push('--config', item.config)
        if (item.provider !== 'none')
          command.push(
            '--coverage',
            '--coverage.provider',
            item.provider,
            '--coverage.reporters',
            'text',
          )
        if (suite === 'coverage') {
          for (const dir of ['coverage', '.rstest-reports'])
            rmSync(join(appDir, dir), { recursive: true, force: true })
        }
        const order = sequence++
        const sample = {
          measurement,
          phase,
          round,
          order,
          command,
          environment: savedEnvironment(childEnv),
          status: 'running',
          stdoutPath: join(runDir, 'logs', `${order}.stdout.log`),
          stderrPath: join(runDir, 'logs', `${order}.stderr.log`),
        }
        if (measurement === 'memory') (item.memorySamples ??= []).push(sample)
        else item.samples.push(sample)
        persist()
        const finish = progress.start(
          `${progressLabel}: ${measurement} ${phase} ${round + 1} ${item.id}`,
        )
        Object.assign(
          sample,
          await execute({
            command,
            cwd: appDir,
            env: childEnv,
            prefix: join(runDir, 'logs', String(order)),
            timeoutMs: options['timeout-ms'],
            signal: controller.signal,
            memory: measurement === 'memory',
          }),
        )
        try {
          if (
            sample.exitCode !== 0 ||
            sample.error ||
            sample.timedOut ||
            sample.interrupted
          )
            throw new Error(
              sample.error ??
                `Exit ${sample.exitCode}; signal=${sample.signal}; timeout=${sample.timedOut}; interrupted=${sample.interrupted}`,
            )
          sample.counts = reportCounts(
            readFileSync(sample.stdoutPath, 'utf8'),
            expectedFiles,
            item.tests,
          )
          item.tests = sample.counts.passedTests
          if (measurement === 'memory') {
            if (!Number.isFinite(sample.memoryBytes))
              throw new Error('No memory samples were collected')
            if (!sameRunOutcome(sample, reference, countKeys))
              throw new Error(
                `Memory run differs from its timing run: exit ${sample.exitCode} vs ${reference.exitCode}; counts ${JSON.stringify(sample.counts)} vs ${JSON.stringify(reference.counts)}`,
              )
          }
          sample.status = 'passed'
        } catch (error) {
          sample.status = 'failed'
          sample.error = error.message
          item.status = 'failed'
          item.error = error.message
        }
        sample.stdoutPath = relative(runDir, sample.stdoutPath)
        sample.stderrPath = relative(runDir, sample.stderrPath)
        const timed = item.samples.filter(
          (sample) => sample.phase === 'timed' && sample.status === 'passed',
        )
        item.stats = statistics(timed.map((sample) => sample.wallMs))
        item.memoryStats = statistics(
          (item.memorySamples ?? [])
            .filter(
              (sample) => sample.phase === 'timed' && sample.status === 'passed',
            )
            .map((sample) => sample.memoryBytes),
        )
        persist()
        finish(
          sample.status !== 'passed'
            ? `failed: ${sample.error}`
            : measurement === 'memory'
              ? `passed ${(sample.memoryBytes / 1048576).toFixed(1)} MiB`
              : `passed ${seconds(sample.wallMs)}`,
        )
        return sample
      }
      clearFixtureCaches(appDir)
      for (const item of rotate(group, 0, options.reverse)) {
        for (let round = 0; round < options.warmup; round++) {
          yield { kind: 'sample', id: item.id, phase: 'warmup', round }
          await run(item, 'warmup', round)
        }
      }
      for (let round = 0; round < options.runs; round++)
        for (const item of rotate(group, round, options.reverse)) {
          yield { kind: 'sample', id: item.id, phase: 'timed', round }
          const timing = await run(item, 'timed', round)
          // Memory pass: same preparation, rerun under the sampler.
          if (suite === 'coverage' && timing?.status === 'passed')
            await run(item, 'timed', round, 'memory', timing)
        }
      for (const item of group)
        if (item.status === 'running')
          item.status = item.stats.n === options.runs ? 'passed' : 'incomplete'
      persist()
    }
    for (const item of document.results)
      if (['pending', 'running'].includes(item.status))
        item.status = 'incomplete'
    document.status = controller.signal.aborted
      ? 'interrupted'
      : document.results.some((item) =>
            ['failed', 'incomplete'].includes(item.status),
          )
        ? 'failed'
        : 'completed'
  } catch (error) {
    if (!document) throw error
    document.status = 'failed'
    document.error = error.stack
    console.error(error)
  } finally {
    try {
      if (document) {
        if (document.status === 'running') document.status = 'incomplete'
        for (const item of document.results)
          if (['pending', 'running'].includes(item.status))
            item.status = 'incomplete'
        document.meta.endedAt = new Date().toISOString()
        persist()
        writeFileSync(join(runDir, 'report.md'), singleReport(document))
        console.log(
          `Results: ${join(runDir, 'result.json')}\nReport: ${join(runDir, 'report.md')}`,
        )
        if (document.status !== 'completed') process.exitCode = 1
      }
    } finally {
      closeSync(lock)
      rmSync(lockPath)
      process.off('SIGINT', abort)
      process.off('SIGTERM', abort)
    }
  }
  return { file: join(runDir, 'result.json'), document }
}

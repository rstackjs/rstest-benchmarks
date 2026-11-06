import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  cpSync,
  realpathSync,
} from 'node:fs'
import { resolve, join, relative } from 'node:path'
import { parseArgs } from 'node:util'
import {
  cpus,
  platform,
  arch,
  release,
  availableParallelism,
  loadavg,
} from 'node:os'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { execute, readRss } from '../scripts/lib/process.mjs'
import { environment } from '../scripts/runner.mjs'
import {
  generate,
  cases,
  frameworks,
  supportedFrameworks,
  frameworkFamily,
  root,
  files,
  fingerprint,
} from './fixtures.mjs'
import { configure } from './configs.mjs'
import { report } from './report.mjs'
import { verify } from './verify.mjs'
import { ciContext, ciResultDirectory } from '../scripts/lib/ci.mjs'
import { selectedFor, orderFor } from './order.mjs'
import { formatCpu } from '../scripts/lib/host.mjs'
import { createProgress, frameworkRunCounts } from '../scripts/lib/progress.mjs'
import { readWorkers, slotVariables } from './workers.mjs'
import { selectCases } from '../scripts/lib/selection.mjs'
const { values } = parseArgs({
  options: {
    runs: { type: 'string', default: '6' },
    conditions: { type: 'string', default: 'cold,warm' },
    suites: { type: 'string', default: 'main,browser' },
    cases: { type: 'string' },
    'exclude-cases': { type: 'string' },
    'dry-run': { type: 'boolean' },
    label: { type: 'string', default: 'frameworks' },
    install: { type: 'boolean', default: false },
    frameworks: { type: 'string', default: frameworks.join(',') },
  },
})
if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(values.label))
  throw Error('Invalid label')
const runs = Number(values.runs),
  conditions = values.conditions.split(','),
  suites = values.suites.split(',')
const requested = values.frameworks.split(',')
if (
  requested.some((f) => !supportedFrameworks.includes(f)) ||
  new Set(requested).size !== requested.length
)
  throw Error('Unknown or duplicate framework')
if (!Number.isInteger(runs) || runs < 1)
  throw Error('runs must be a positive integer')
if (
  conditions.some((x) => !['cold', 'warm'].includes(x)) ||
  new Set(conditions).size !== conditions.length
)
  throw Error('conditions must be cold,warm')
if (suites.some((x) => !['main', 'coverage', 'browser'].includes(x)))
  throw Error('unknown suite')
if (!['darwin', 'linux'].includes(platform()))
  throw Error('RSS requires macOS or Linux')
const planned = selectCases(
  [
    ...(suites.includes('main')
      ? cases.map((item) => ({ item, provider: 'none', suite: 'main' }))
      : []),
    ...(suites.includes('coverage')
      ? cases
          .filter((c) => ['backend', 'react'].includes(c.id))
          .flatMap((item) =>
            ['none', 'v8', 'istanbul'].map((provider) => ({
              item,
              provider,
              suite: 'coverage',
            })),
          )
      : []),
    ...(suites.includes('browser')
      ? [{ item: cases.find((c) => c.id === 'react'), provider: 'none', suite: 'browser' }]
      : []),
  ],
  {
    include: values.cases,
    exclude: values['exclude-cases'],
    keys: (g) => [g.item.id, `${g.suite}/${g.item.id}/${g.provider}`],
    defaults: (g) => !g.item.optional,
  },
).map((g) => ({ ...g, frameworks: selectedFor(g, requested) }))
const groups = planned.filter((g) => g.frameworks.length)
if (!groups.length) throw Error('No matching cases')
if (values['dry-run']) {
  console.log(JSON.stringify({ groups }, null, 2))
  process.exit(0)
}
const host = {
  node: process.version,
  cpu: cpus()[0]?.model ?? 'unknown',
  logicalCpuCount: cpus().length,
  platform: platform() + ' ' + arch(),
  os: release(),
  parallelism: availableParallelism(),
}
console.log(`[host] ${formatCpu(host)}; ${host.platform}; Node ${host.node}`)
const deps = JSON.parse(
  readFileSync(join(root, 'frameworks/package.json')),
).dependencies
if (
  values.install ||
  Object.keys(deps).some(
    (name) =>
      !existsSync(join(root, 'frameworks/node_modules', name, 'package.json')),
  )
) {
  const install = spawnSync('pnpm', ['install', '--frozen-lockfile'], {
    cwd: join(root, 'frameworks'),
    stdio: 'inherit',
  })
  if (install.status !== 0)
    throw Error('Framework dependency installation failed')
}
const resolved = Object.fromEntries(
  Object.keys(deps).map((name) => [
    name,
    JSON.parse(
      readFileSync(join(root, 'frameworks/node_modules', name, 'package.json')),
    ).version,
  ]),
)
for (const [name, version] of Object.entries(deps))
  if (resolved[name] !== version)
    throw Error(`Installed ${name} differs from pinned version`)
// Jest resolves its default transformer from jest-config's own dependency graph.
const jestRequire = createRequire(realpathSync(join(root, 'frameworks/node_modules/jest/package.json')))
const jestCliRequire = createRequire(jestRequire.resolve('jest-cli/package.json'))
const jestConfigRequire = createRequire(jestCliRequire.resolve('jest-config/package.json'))
resolved['babel-jest'] = JSON.parse(readFileSync(jestConfigRequire.resolve('babel-jest/package.json'))).version
const directory = join(
  root,
  'results',
  `${values.label}-${new Date().toISOString().replace(/[:.]/g, '-')}`,
)
mkdirSync(join(directory, 'logs'), { recursive: true })
ciResultDirectory(root, directory)
const lock = join(root, 'results/.runner.lock')
writeFileSync(lock, String(process.pid), { flag: 'wx' })
const controller = new AbortController()
process.on('SIGINT', () => controller.abort())
process.on('SIGTERM', () => controller.abort())
const record = {
  schemaVersion: 1,
  ci: ciContext(),
  status: 'preparing',
  startedAt: new Date().toISOString(),
  options: {
    runs,
    conditions,
    suites,
    cases: values.cases,
    excludeCases: values['exclude-cases'],
    frameworks: requested,
  },
  host,
  versions: {
    ...Object.fromEntries(
      requested.map((f) => [
        f,
        resolved[
          frameworkFamily(f) === 'rstest' ? '@rstest/core' : frameworkFamily(f)
        ],
      ]),
    ),
  },
  dependencies: resolved,
  lockHash: createHash('sha256')
    .update(readFileSync(join(root, 'frameworks/pnpm-lock.yaml')))
    .digest('hex'),
  harnessHash: fingerprint(join(root, 'frameworks/reporters')),
  samples: [],
  cacheActions: [],
}
const save = () => {
  writeFileSync(join(directory, 'result.json'), JSON.stringify(record, null, 2))
  report(record, directory)
}
const cachePaths = [
  '.cache',
  'node_modules/.cache',
  'node_modules/.vite',
  'node_modules/.vite-temp',
  'dist',
  '.rstest-results',
]
function clear(cwd) {
  for (const path of cachePaths)
    rmSync(join(cwd, path), { recursive: true, force: true })
  record.cacheActions.push({
    cwd,
    paths: cachePaths,
    at: new Date().toISOString(),
  })
}
try {
  cpSync(join(root, 'frameworks'), join(directory, 'harness/frameworks'), {
    recursive: true,
    filter: (p) => !p.split('/').includes('node_modules'),
  })
  cpSync(join(root, 'scripts'), join(directory, 'harness/scripts'), {
    recursive: true,
  })
  cpSync(
    join(root, 'tools/generator'),
    join(directory, 'harness/tools/generator'),
    { recursive: true },
  )
  record.harnessHash = fingerprint(join(directory, 'harness'))
  record.fixtures = generate(directory, requested)
  for (const framework of requested)
    for (const item of cases)
      configure(
        join(directory, 'workspaces', framework, item.id),
        framework,
        item,
      )
  record.configHashes = {}
  for (const framework of requested)
    for (const item of cases) {
      const file = join(
        directory,
        'workspaces',
        framework,
        item.id,
        frameworkFamily(framework) + '.config.' + (frameworkFamily(framework) === 'jest' ? 'cjs' : 'mjs'),
      )
      record.configHashes[framework + '/' + item.id] = createHash('sha256')
        .update(readFileSync(file))
        .digest('hex')
      if (framework === 'jest-babel')
        record.configHashes[framework + '/' + item.id + '/babel'] = createHash('sha256')
          .update(readFileSync(join(directory, 'workspaces', framework, item.id, 'babel.config.cjs')))
          .digest('hex')
    }
  record.unsupported = planned.flatMap((g) =>
    requested
      .filter((f) => !g.frameworks.includes(f))
      .map((framework) => ({
        framework,
        group: `${g.suite}/${g.item.id}/${g.provider}`,
        reason:
          g.suite === 'browser'
            ? framework === 'rstest-vmThreads'
              ? 'vmThreads is a Node worker pool and does not apply to browser mode'
              : 'No corresponding Chromium browser mode in this adapter'
            : 'This framework variant does not support this workload',
      })),
  )
  if (!groups.length) throw Error('No matching cases')
  record.plan = groups
  const progress = createProgress(frameworkRunCounts(groups, conditions, runs))
  if (groups.some((group) => group.suite === 'browser')) {
    const { chromium } = await import('playwright')
    const executable = chromium.executablePath()
    record.browser = {
      executable,
      version: spawnSync(executable, ['--version'], {
        encoding: 'utf8',
      }).stdout?.trim(),
    }
  }
  record.status = 'running'
  save()
  async function sample(group, condition, framework, round, phase) {
    if (controller.signal.aborted) throw Error('Interrupted')
    const cwd = join(directory, 'workspaces', framework, group.item.id)
    if (condition === 'cold') clear(cwd)
    rmSync(join(cwd, 'coverage'), { recursive: true, force: true })
    const id = record.samples.length,
      prefix = join(directory, 'logs', String(id)),
      countPath = prefix + '.json',
      rssPath = prefix + '.rss'
    const env = {
      ...environment(),
      FRAMEWORK_REPORT: countPath,
      RTL_SKIP_AUTO_CLEANUP: 'true',
    }
    if (group.provider !== 'none') env.BENCH_COVERAGE = group.provider
    if (group.suite === 'browser') env.BENCH_BROWSER = '1'
    const workerDirectory = prefix + '.workers'
    if (group.suite !== 'browser') {
      mkdirSync(workerDirectory)
      env.BENCH_WORKER_REPORT_DIR = workerDirectory
      env.BENCH_WORKER_SLOT_VARIABLE = slotVariables[frameworkFamily(framework)]
    }
    const pkg = framework.startsWith('rstest')
        ? '@rstest/core'
        : frameworkFamily(framework)
    const pkgPath = join(root, 'frameworks/node_modules', pkg, 'package.json'),
      pkgJson = JSON.parse(readFileSync(pkgPath))
    const bin =
      typeof pkgJson.bin === 'string'
        ? pkgJson.bin
        : pkgJson.bin[frameworkFamily(framework)]
    const command = [
      '/usr/bin/time',
      ...(platform() === 'darwin' ? ['-l'] : ['-v']),
      '-o',
      rssPath,
      process.execPath,
      resolve(pkgPath, '..', bin),
      ...(frameworkFamily(framework) === 'jest'
        ? ['--config', 'jest.config.cjs']
        : ['run', '--config', frameworkFamily(framework) + '.config.mjs']),
    ]
    const startLoad = loadavg()
    const finish = progress.start(
      `${phase} ${phase === 'warmup' ? 1 : round + 1} ${condition} ${group.suite}/${group.item.id}/${group.provider} ${framework}`,
    )
    const r = await execute({
      command,
      cwd,
      env,
      prefix,
      timeoutMs: 180000,
      signal: controller.signal,
      graceful: true,
    })
    const counts = existsSync(countPath)
      ? JSON.parse(readFileSync(countPath))
      : null
    const passed =
      r.exitCode === 0 &&
      !r.timedOut &&
      counts &&
      counts.files === group.item.files &&
      counts.tests === group.item.tests &&
      counts.passed === group.item.tests &&
      counts.failed === 0 &&
      counts.skipped === 0 &&
      counts.errors === 0
    const coverage = join(cwd, 'coverage/coverage-final.json')
    let coveredFiles
    if (group.provider !== 'none' && existsSync(coverage)) {
      const data = JSON.parse(readFileSync(coverage))
      coveredFiles = Object.keys(data)
        .map((f) => relative(cwd, f))
        .sort()
      writeFileSync(prefix + '.coverage.json', JSON.stringify(data))
    }
    let coverageError
    if (group.provider !== 'none') {
      const expected = files(join(cwd, 'src'))
        .filter((f) => /\.tsx?$/.test(f) && !f.endsWith('.d.ts'))
        .map((f) => relative(cwd, f))
        .filter((f) => !/^src\/features\/[^/]+\/index\.ts$/.test(f))
        .sort()
      if (JSON.stringify(expected) !== JSON.stringify(coveredFiles))
        coverageError = `Coverage file set mismatch: ${prefix}.coverage.json; expected ${expected.length}, got ${coveredFiles?.length}`
    }
    let workers = { status: 'not-applicable', reason: 'Browser mode' }
    let workerError
    if (group.suite !== 'browser') {
      try {
        workers = readWorkers(workerDirectory, env.BENCH_WORKER_SLOT_VARIABLE, counts?.settings?.runnerPid)
      } catch (error) {
        workerError = error.message
        workers = { status: 'unavailable', reason: workerError }
      }
    }
    const s = {
      group: group.suite + '/' + group.item.id + '/' + group.provider,
      condition,
      framework,
      round,
      phase,
      status: passed && !coverageError && !workerError ? 'passed' : 'failed',
      coverageError,
      workerError,
      workers,
      command,
      cwd,
      environment: {
        NODE_DISABLE_COMPILE_CACHE: env.NODE_DISABLE_COMPILE_CACHE,
        NODE_COMPILE_CACHE: env.NODE_COMPILE_CACHE ?? null,
        CI: env.CI,
        NODE_OPTIONS: env.NODE_OPTIONS ?? null,
        RTL_SKIP_AUTO_CLEANUP: env.RTL_SKIP_AUTO_CLEANUP,
        BENCH_COVERAGE: env.BENCH_COVERAGE ?? null,
        BENCH_BROWSER: env.BENCH_BROWSER ?? null,
      },
      loadAverage: startLoad,
      ...r,
      counts,
      coveredFiles,
      rssBytes: existsSync(rssPath) ? readRss(rssPath, platform()) : null,
    }
    record.samples.push(s)
    save()
    finish(`${(r.wallMs / 1000).toFixed(3)}s ${s.status}`)
    if (coverageError) throw Error(coverageError)
    if (workerError) throw Error(workerError)
    if (!passed)
      throw Error(`Failed sample: ${prefix}; counts ${JSON.stringify(counts)}`)
  }
  for (const group of groups)
    for (const condition of conditions) {
      const selected = group.frameworks
      for (const framework of selected)
        clear(join(directory, 'workspaces', framework, group.item.id))
      if (condition === 'warm')
        for (const framework of selected)
          await sample(group, condition, framework, -1, 'warmup')
      for (let round = 0; round < runs; round++) {
        const order = orderFor(selected, round)
        for (const framework of order)
          await sample(group, condition, framework, round, 'timed')
      }
    }
  record.status = 'completed'
  record.verification = verify(record, directory)
} catch (error) {
  record.status = 'failed'
  record.error = error.stack
  process.exitCode = 1
  console.error(error.stack)
} finally {
  record.endedAt = new Date().toISOString()
  save()
  rmSync(lock)
  console.log(`Report: ${join(directory, 'report.md')}`)
}

import { ciContext, ciResultDirectory } from './lib/ci.mjs'
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  copyFileSync,
  cpSync,
  existsSync,
  rmSync,
  openSync,
  closeSync,
  renameSync,
} from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { randomUUID } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { execute } from './lib/process.mjs'
import { parseOptions, environment, suiteSteps } from './runner.mjs'
import { runPaired } from './lib/paired.mjs'
import { casesFor } from './lib/cases.mjs'
import { selectCases } from './lib/selection.mjs'
import { fileHash, machine } from './lib/provenance.mjs'
import { formatCpu } from './lib/host.mjs'
import { createProgress, versionRunCounts } from './lib/progress.mjs'
import { comparisonReport } from './lib/report.mjs'
import { publishComparison } from './lib/publication.mjs'
import {
  parseSources,
  rstestPackages,
  localGit,
  builtFiles,
  verifyInstalled,
  sourceIdentity,
  workloadDependencies,
  verifyWorkloadDependencies,
} from './lib/sources.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const suites = ['main', 'scaling', 'barrel', 'pools', 'coverage']
const { values } = parseArgs({
  allowNegative: true,
  options: {
    baseline: { type: 'string' },
    candidate: { type: 'string', multiple: true },
    'update-readme': { type: 'boolean', default: false },
    suites: { type: 'string', default: 'main' },
    apps: { type: 'string' },
    cases: { type: 'string' },
    'exclude-cases': { type: 'string' },
    scales: { type: 'string' },
    runs: { type: 'string', default: '5' },
    warmup: { type: 'string', default: '1' },
    label: { type: 'string', default: 'compare' },
    'timeout-ms': { type: 'string', default: '120000' },
    reverse: { type: 'boolean', default: false },
    'dry-run': { type: 'boolean' },
    help: { type: 'boolean' },
  },
})
if (values.help) {
  console.log(`Usage: pnpm compare --baseline <version|local:path> --candidate <version|local:path>
  --suites main|scaling|barrel|pools|coverage (comma-separated, or all; default main)
  --apps <names> --scales <sizes> --runs 5 --warmup 1 --label compare
  --cases <app names or full case IDs> --exclude-cases <app names or full case IDs>
  --timeout-ms 120000 --reverse --dry-run --update-readme
Repeat --candidate or use comma-separated npm versions. README updates are off by default.
Local sources are installed, freshly built and packed before timing. Outputs stay under results/.`)
} else {
  await compareSources()
}

async function compareSources() {
  let selected = values.suites === 'all' ? suites : values.suites.split(',')
  if (
    new Set(selected).size !== selected.length ||
    selected.some((suite) => !suites.includes(suite))
  )
    throw new Error(
      `--suites must select unique values from ${suites.join(',')}, or all`,
    )
  const sources = parseSources(values.baseline, values.candidate, process.cwd())
  const sides = Object.keys(sources)
  const comparisonTitle = () =>
    Object.values(sources)
      .map((source) => source.label)
      .join(' vs ')
  const args = [
    '--runs',
    values.runs,
    '--warmup',
    values.warmup,
    '--label',
    values.label,
    '--timeout-ms',
    values['timeout-ms'],
  ]
  for (const name of ['apps', 'scales'])
    if (values[name]) args.push(`--${name}`, values[name])
  if (values.reverse) args.push('--reverse')
  const matrix = Object.fromEntries(
    selected.map((suite) => [
      suite,
      casesFor(suite, parseOptions(suite, args)),
    ]),
  )
  const selectedIds = new Set(selectCases(Object.values(matrix).flat(), {
    include: values.cases,
    exclude: values['exclude-cases'],
    keys: (item) => [item.app, item.id],
  }).map((item) => item.id))
  for (const suite of selected) {
    matrix[suite] = matrix[suite].filter((item) => selectedIds.has(item.id))
    if (!matrix[suite].length) delete matrix[suite]
  }
  selected = Object.keys(matrix)
  if (
    selected.includes('coverage') &&
    !['darwin', 'linux'].includes(process.platform)
  )
    throw new Error('Coverage RSS requires macOS or Linux')
  if (values['dry-run']) {
    console.log(
      JSON.stringify(
        { sources, matrix, updateReadme: values['update-readme'] },
        null,
        2,
      ),
    )
    return
  }

  mkdirSync(join(root, 'results'), { recursive: true })
  const lockPath = join(root, 'results/.runner.lock')
  const lock = openSync(lockPath, 'wx')
  const dir = join(
    root,
    'results',
    `${values.label}-${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}`,
  )
  ciResultDirectory(root, dir)
  const record = {
    host: machine(root),
    ci: ciContext(),
    status: 'preparing',
    options: values,
    sources,
    runs: [],
    reports: [],
    schedule: [],
    startedAt: new Date().toISOString(),
  }
  const controller = new AbortController()
  console.log(
    `[host] ${formatCpu(record.host)}; ${record.host.platform}; Node ${record.host.node}`,
  )
  const abort = () => controller.abort()
  process.on('SIGINT', abort)
  process.on('SIGTERM', abort)
  let sequence = 0
  const summaries = []
  const save = () => {
    writeFileSync(
      join(dir, 'comparison.json.tmp'),
      JSON.stringify(record, null, 2) + '\n',
    )
    renameSync(join(dir, 'comparison.json.tmp'), join(dir, 'comparison.json'))
  }
  const command = async (command, cwd, label, timeoutMs = 900000) => {
    if (controller.signal.aborted) throw new Error('Comparison interrupted')
    console.log(label)
    const result = await execute({
      command,
      cwd,
      env: environment(),
      prefix: join(
        dir,
        'logs',
        `${sequence++}-${label.replace(/[^a-z0-9-]/gi, '-')}`,
      ),
      timeoutMs,
      signal: controller.signal,
      graceful: true,
    })
    if (
      result.exitCode !== 0 ||
      result.error ||
      result.timedOut ||
      result.interrupted
    )
      throw new Error(
        `${label} failed (exit ${result.exitCode}). See ${result.stderrPath} and ${result.stdoutPath}`,
      )
  }
  try {
    mkdirSync(join(dir, 'logs'), { recursive: true })
    writeFileSync(lock, JSON.stringify({ pid: process.pid, runDir: dir }))
    save()
    const policy = spawnSync(
      'pnpm',
      ['config', 'get', 'minimumReleaseAgeExclude', '--json'],
      { cwd: root, encoding: 'utf8' },
    )
    if (policy.status !== 0)
      throw new Error('Cannot read package-age exceptions')
    const inheritedAgeExceptions =
      JSON.parse(policy.stdout.trim() || 'null') ?? []
    // Prepare both installations before any timings; keep all package resolution local to each side.
    for (const [side, source] of Object.entries(sources)) {
      if (source.kind === 'local') {
        await command(
          ['pnpm', 'install', '--frozen-lockfile'],
          source.path,
          `${side}-local-install`,
        )
        await command(['pnpm', 'build'], source.path, `${side}-local-build`)
        source.git = localGit(source.path)
        source.label = `local ${source.git.commit.slice(0, 8)}${source.git.status ? ' (dirty)' : ''}`
        source.packages = {}
        for (const name of rstestPackages) {
          const packageDir = join(source.path, 'packages', name)
          const destination = join(dir, 'packages', side, name)
          mkdirSync(destination, { recursive: true })
          const built = builtFiles(packageDir)
          await command(
            ['pnpm', 'pack', '--pack-destination', destination],
            packageDir,
            `${side}-pack-${name}`,
          )
          const archives = readdirSync(destination).filter((file) =>
            file.endsWith('.tgz'),
          )
          if (archives.length !== 1)
            throw new Error(`Expected one packed archive in ${destination}`)
          const archive = join(destination, archives[0])
          source.packages[name] = {
            archive,
            archiveSha256: fileHash(archive),
            built,
            version: JSON.parse(readFileSync(join(packageDir, 'package.json')))
              .version,
          }
        }
      }
      const workspace = join(dir, 'workspaces', side)
      source.workspace = relative(dir, workspace)
      mkdirSync(workspace, { recursive: true })
      for (const name of ['scripts', 'tools'])
        cpSync(join(root, name), join(workspace, name), { recursive: true })
      for (const name of ['package.json', 'pnpm-lock.yaml'])
        copyFileSync(join(root, name), join(workspace, name))
      for (const app of readdirSync(join(root, 'apps'))) {
        const target = join(workspace, 'apps', app)
        mkdirSync(target, { recursive: true })
        for (const file of readdirSync(join(root, 'apps', app), {
          withFileTypes: true,
        }))
          if (file.isFile())
            copyFileSync(
              join(root, 'apps', app, file.name),
              join(target, file.name),
            )
        const file = join(target, 'package.json')
        const manifest = JSON.parse(readFileSync(file))
        for (const type of [
          'dependencies',
          'devDependencies',
          'peerDependencies',
        ])
          for (const name of rstestPackages)
            if (manifest[type]?.[`@rstest/${name}`])
              manifest[type][`@rstest/${name}`] =
                source.kind === 'npm'
                  ? source.version
                  : `file:${source.packages[name].archive}`
        writeFileSync(file, JSON.stringify(manifest, null, 2) + '\n')
      }
      const overrides = Object.fromEntries(
        rstestPackages.map((name) => [
          `@rstest/${name}`,
          source.kind === 'npm'
            ? source.version
            : `file:${source.packages[name].archive}`,
        ]),
      )
      // JSON is valid YAML; fresh workspaces use explicit overrides for transitive imports too.
      writeFileSync(
        join(workspace, 'pnpm-workspace.yaml'),
        JSON.stringify(
          {
            packages: ['apps/*'],
            overrides,
            minimumReleaseAgeExclude: [
              ...new Set([
                ...inheritedAgeExceptions,
                ...(source.kind === 'npm'
                  ? rstestPackages.map(
                      (name) => `@rstest/${name}@${source.version}`,
                    )
                  : []),
              ]),
            ],
          },
          null,
          2,
        ) + '\n',
      )
      await command(
        ['pnpm', 'install', '--no-frozen-lockfile'],
        workspace,
        `${side}-install`,
      )
      source.installed = verifyInstalled(workspace, source)
      source.workloadDependencies = workloadDependencies(workspace, [
        ...new Set(
          Object.values(matrix)
            .flat()
            .map((row) => row.app),
        ),
      ])
      writeFileSync(
        join(workspace, 'benchmark-source.json'),
        JSON.stringify(sourceIdentity(source), null, 2) + '\n',
      )
      if (
        Object.values(matrix)
          .flat()
          .some((row) => row.pool === 'browser')
      )
        await command(
          [
            'pnpm',
            '--dir',
            'apps/react-spa',
            'exec',
            'playwright',
            'install',
            'chromium',
          ],
          workspace,
          `${side}-chromium`,
        )
      save()
    }
    for (const side of sides.slice(1))
      verifyWorkloadDependencies(
        sources.baseline.workloadDependencies,
        sources[side].workloadDependencies,
      )
    record.status = 'running'
    save()
    const counts = sides.map((side) =>
      versionRunCounts(
        Object.values(matrix).flat(),
        { runs: Number(values.runs), warmup: Number(values.warmup) },
        () => sources[side].kind === 'npm'
          ? sources[side].version
          : sources[side].packages.core.version,
      ),
    )
    const progress = createProgress({
      timed: counts.reduce((sum, count) => sum + count.timed, 0),
      warmup: counts.reduce((sum, count) => sum + count.warmup, 0),
    })
    for (const [index, suite] of selected.entries()) {
      const iterators = {}
      for (const side of sides) {
        const workspace = join(dir, sources[side].workspace)
        verifyInstalled(workspace, sources[side])
        record.runs.push({ side, suite, status: 'running' })
        iterators[side] = suiteSteps(suite, args, {
          root: workspace,
          caseIds: matrix[suite].map((item) => item.id),
          progress,
          progressLabel: `${side}/${suite}`,
          order:
            sides.length === 2
              ? 'paired versions per case/round; alternating first side each round and fixture; rotating variants'
              : `rotating ${sides.length} versions per case/round; rotating variants`,
        })
      }
      save()
      const results = await runPaired(iterators, {
        reverse: values.reverse,
        offset: index,
        signal: controller.signal,
        onStep(step) {
          record.schedule.push({
            suite,
            ...step,
            startedAt: new Date().toISOString(),
          })
          save()
          if (step.kind === 'prepare')
            console.log(`${step.side}/${suite}: preparing ${step.group}`)
        },
      })
      for (const [side, result] of Object.entries(results)) {
        const run = record.runs.find(
          (run) => run.side === side && run.suite === suite,
        )
        run.file = relative(root, result.file)
        run.status = result.document.status
      }
      save()
      const incomplete = record.runs.find(
        (run) => run.suite === suite && run.status !== 'completed',
      )
      if (incomplete)
        throw new Error(`Incomplete benchmark: ${incomplete.file}`)
      const spec = {
        title: `Rstest ${suite === 'main' ? 'version' : suite} benchmark`,
        output: relative(root, join(dir, 'reports', `${suite}.md`)),
        columns: sides.map((side) => ({
          label: `${side}: ${sources[side].label}`,
          files: [
            record.runs.find((run) => run.side === side && run.suite === suite)
              .file,
          ],
        })),
      }
      mkdirSync(join(dir, 'reports'), { recursive: true })
      const rendered = comparisonReport(spec)
      writeFileSync(resolve(root, spec.output), rendered.markdown)
      summaries.push(rendered.jobSummary)
      writeFileSync(join(dir, 'summary.md'), summaries.join('\n'))
      record.reports.push(spec)
      writeFileSync(
        join(dir, 'reports.config.json'),
        JSON.stringify({ reports: record.reports }, null, 2) + '\n',
      )
      save()
    }
    record.status = 'completed'
    writeFileSync(
      join(dir, 'README.md'),
      `# Rstest ${selected.length === 1 && selected[0] === 'coverage' ? 'coverage' : 'version'} benchmark\n\n${comparisonTitle()}. ${values.warmup} warmup(s), ${values.runs} timed runs per case.\n\n` +
        selected
          .map((suite) => `- [${suite}](reports/${suite}.md)`)
          .join('\n') +
        '\n\nInstallation logs, local package archives, source identities, and execution records are retained in this directory. See [comparison.json](comparison.json).\n',
    )
    if (values['update-readme']) {
      record.publication = publishComparison(root, dir, record)
      console.log(
        `Updated README and selected reports: ${join(root, record.publication.readmePath)}`,
      )
    }
    console.log(`Comparison: ${join(dir, 'README.md')}`)
  } catch (error) {
    record.status = controller.signal.aborted ? 'interrupted' : 'failed'
    for (const run of record.runs) {
      if (run.status !== 'running') continue
      run.status = record.status
      const resultsDir = join(dir, sources[run.side].workspace, 'results')
      const candidates = existsSync(resultsDir)
        ? readdirSync(resultsDir).filter((name) =>
            existsSync(join(resultsDir, name, 'result.json')),
          )
        : []
      const candidate = candidates.find(
        (name) =>
          JSON.parse(readFileSync(join(resultsDir, name, 'result.json')))
            .suite === run.suite,
      )
      if (candidate)
        run.file = relative(root, join(resultsDir, candidate, 'result.json'))
    }
    record.error = error.message
    process.exitCode = 1
    console.error(error.message)
    console.error(`Artifacts: ${dir}`)
  } finally {
    record.endedAt = new Date().toISOString()
    if (existsSync(dir)) save()
    closeSync(lock)
    rmSync(lockPath)
    process.off('SIGINT', abort)
    process.off('SIGTERM', abort)
  }
}

import { statistics } from '../scripts/lib/stats.mjs'
import { formatCpu } from '../scripts/lib/host.mjs'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { workerLabel } from './workers.mjs'

function caseName(group) {
  const [suite, name, provider] = group.split('/')
  if (suite === 'main') return name
  if (suite === 'browser') return `${name} (browser)`
  if (suite === 'coverage')
    return `${name} (${provider === 'none' ? 'coverage off' : provider})`
  return group
}

export function renderReport(record) {
  const runners = record.options.frameworks ?? Object.keys(record.versions)
  const names = runners.map(
    (f) =>
      ({
        jest: 'Jest + SWC',
        'jest-babel': 'Jest + Babel',
        vitest: 'Vitest',
        'vitest-vmForks': 'Vitest vmForks',
        rstest: 'Rstest',
        'rstest-vmForks': 'Rstest vmForks',
        'rstest-vmThreads': 'Rstest vmThreads',
      })[f] ?? f,
  )

  const lines = [
    '# Frameworks benchmark',
    '',
    `Status: **${record.status}**. ${record.startedAt}. Node ${record.host.node}; ${formatCpu(record.host)}; ${record.host.platform}.`,
    '',
    'Published packages: ' +
      Object.entries(record.versions)
        .map(([k, v]) => `${k} ${v}`)
        .join(', ') +
      '.',
    '',
    `${record.options.runs} measured runs per framework/case/cache condition; medians. Each sample is a fresh process. Warm cache: one warmup after clearing caches; cold cache: cleared before every measured run. Node compile cache disabled; OS page cache and background load uncontrolled. Framework defaults, except explicitly named variants.`,
    '',
    'RSS is OS /usr/bin/time maxrss (MiB), not simultaneous aggregate process-tree memory. Installations and generation are outside timing. All samples retained.',
    '',
    '🥇 and 🥈 mark the lowest and second-lowest distinct unrounded medians among complete results in each row; exact ties share the marker. They do not indicate statistical significance.',
    '',
  ]
  if (runners.includes('jest-babel') && record.dependencies) lines.push(
    `Babel versions: babel-jest ${record.dependencies['babel-jest']}; core ${record.dependencies['@babel/core']}; preset-env ${record.dependencies['@babel/preset-env']}; preset-typescript ${record.dependencies['@babel/preset-typescript']}; preset-react ${record.dependencies['@babel/preset-react']}.`,
    '',
  )
  if (runners.includes('jest-babel')) lines.push(
    'Jest + Babel retains the default babel-jest transformer and adds Babel presets for TypeScript, CommonJS targeting the current Node, and automatic React JSX in the React case. The SWC and Babel variants use the same Jest package and default scheduling/isolation.',
    '',
  )
  if (record.ci) lines.splice(4, 0, `Source: [GitHub Actions](${record.ci.url}), commit \`${record.ci.sha}\`, attempt ${record.ci.attempt}; runner ${record.ci.runner}, image ${record.ci.image ?? 'unknown'}.`, '')
  if (record.comparisonNote) lines.splice(4, 0, record.comparisonNote, '')
  if (runners.includes('rstest-vmThreads')) lines.push(
    'Rstest vmThreads uses the same published core package as Rstest, with only pool set to vmThreads. Default concurrency is retained; each file receives a fresh VM context. Browser mode is excluded for this variant. Thread heaps share one process RSS, while fork workers occupy separate processes; maxrss ratios cannot be interpreted as total-memory ratios between these pools.',
    '',
  )
  if (
    !record.independentBatches &&
    record.plan?.some((g) => record.options.runs % (g.frameworks?.length || 1))
  ) {
    lines.push(
      'The repetition count does not evenly divide all framework counts; order rotates, but positions are not exactly balanced in those groups.',
      '',
    )
  }
  if (record.dependencies) {
    lines.push(
      `Jest transformer: @swc/jest ${record.dependencies['@swc/jest']}; @swc/core ${record.dependencies['@swc/core']}. Shared React ${record.dependencies.react}; jsdom ${record.dependencies.jsdom}.`,
      '',
    )
  }
  if (record.plan) {
    lines.push('| Workload | Test files | Tests |', '| --- | --- | --- |')
    const workloads = new Map(record.plan.map(({ item }) => [item.id, item]))
    for (const item of workloads.values())
      lines.push(`| ${item.id} | ${item.files} | ${item.tests} |`)
    lines.push('')
  }
  if (record.unsupported?.length) {
    lines.push('## Unsupported combinations', '')
    for (const reason of new Set(record.unsupported.map((s) => s.reason))) {
      const entries = record.unsupported.filter((s) => s.reason === reason)
      lines.push(
        `- ${[...new Set(entries.map((s) => s.framework))].join(', ')}: ${reason}. Affected: ${[...new Set(entries.map((s) => caseName(s.group)))].join(', ')}.`,
      )
    }
    lines.push('')
  }
  const detail = [
    '# Variability',
    '',
    'CV is shown with absolute standard deviation and range; CV alone does not establish a meaningful fluctuation or regression.',
    '',
    '| Cache / case | Framework | n | Time median | Time min–max | Time SD | Time CV | RSS median | RSS CV |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ]
  const mainTables = []
  const mainCaseNames = {
    'minimal-node': 'Node',
    'minimal-react': 'React',
    startup: 'Node startup',
    'many-files': 'Many files',
    'module-graph': 'Module graph',
    backend: 'Backend',
    barrel: 'Barrel',
    react: 'React + jsdom',
  }
  for (const id of ['minimal-node', 'minimal-react']) {
    const count = record.fixtures?.[id]?.files ?? 1
    mainCaseNames[id] += count === 1 ? ' · single-file' : ` · ${count} files`
  }
  const groups = [...new Set(record.samples.map((s) => s.group))]
  lines.push(
    '## Observed test workers',
    '',
    'Distinct worker slots that executed test setup in each invocation, read from framework-assigned runtime IDs. Ranges span timed runs and cache conditions. These are observed slots, not configured limits or peak simultaneous workers; recycled processes do not add slots. In-process means tests ran in the Jest runner itself. Browser mode does not use Node test workers. Historical runs without observations show Not recorded.',
    '',
    `| Case | ${names.join(' | ')} |`,
    `| --- | ${names.map(() => '---:').join(' | ')} |`,
  )
  for (const group of groups) {
    const cells = runners.map((framework) => workerLabel(record.samples.filter((sample) =>
      sample.group === group && sample.framework === framework && sample.phase === 'timed',
    )))
    lines.push(`| ${caseName(group)} | ${cells.join(' | ')} |`)
  }
  lines.push('')
  for (const condition of record.options.conditions) {
    const rows = groups.map((group) => {
      const sets = runners.map((f) =>
        record.samples.filter(
          (s) =>
            s.group === group &&
            s.condition === condition &&
            s.framework === f &&
            s.phase === 'timed',
        ),
      )
      const stats = sets.map((ss) => ({
        time: statistics(
          ss.filter((s) => s.status === 'passed').map((s) => s.wallMs),
        ),
        rss: statistics(
          ss.filter((s) => s.status === 'passed').map((s) => s.rssBytes),
        ),
        complete:
          ss.length === record.options.runs &&
          ss.every((s) => s.status === 'passed'),
      }))
      stats.forEach((s, i) => {
        if (s.time.n)
          detail.push(
            `| ${condition} / ${caseName(group)} | ${names[i]} | ${s.time.n} | ${(s.time.median / 1000).toFixed(2)}s | ${(s.time.min / 1000).toFixed(2)}–${(s.time.max / 1000).toFixed(2)}s | ${s.time.sd == null ? '—' : (s.time.sd / 1000).toFixed(2) + 's'} | ${s.time.cv?.toFixed(2) ?? '—'}% | ${(s.rss.median / 1024 ** 2).toFixed(2)} MiB | ${s.rss.cv?.toFixed(2) ?? '—'}% |`,
          )
      })
      return { group, sets, stats }
    })
    lines.push(`## ${condition === 'warm' ? 'Warm' : 'Cold'} framework cache`, '')
    for (const metric of ['time', 'rss']) {
      const title = metric === 'time' ? 'Elapsed time' : 'RSS (MiB)'
      const header = `| Case | ${names.join(' | ')} |`
      const separator = `| --- | ${names.map(() => '---:').join(' | ')} |`
      const main = [`**Main suite · ${condition} cache · ${metric === 'time' ? 'elapsed time' : title}**`, '', header, separator]
      lines.push(`### ${title}`, '', header, separator)
      for (const { group, sets, stats } of rows) {
        const ranked = [...new Set(
          stats.filter((s) => s.complete).map((s) => s[metric].median),
        )].sort((a, b) => a - b)
        const cells = stats.map((s, i) => {
          if (!sets[i].length) return '—'
          if (!s.complete) return 'INCOMPLETE'
          return (['🥇 ', '🥈 '][ranked.indexOf(s[metric].median)] ?? '') +
            (metric === 'time'
              ? `${(s.time.median / 1000).toFixed(2)}s`
              : (s.rss.median / 1024 ** 2).toFixed(2))
        })
        lines.push(`| ${caseName(group)} | ${cells.join(' | ')} |`)
        if (group.startsWith('main/')) {
          const id = group.split('/')[1]
          main.push(`| ${mainCaseNames[id] ?? id} | ${cells.join(' | ')} |`)
        }
      }
      if (main.length > 4) mainTables.push(main.join('\n'))
      lines.push('')
    }
  }
  const summary = [
    ...lines,
    'Full reports, phase timings and raw samples are available in the workflow artifact.',
    '',
  ].join('\n')
  const phased = record.samples.filter((s) => s.phase === 'timed' && s.counts?.duration)
  if (phased.length) {
    lines.push(
      '## Rstest phase timings',
      '',
      'Medians in seconds from the reporter. Build includes run preparation and compilation; runtime includes worker scheduling, module loading, test execution and worker fixture cleanup. Process wall time also includes CLI startup and final teardown. Each column is an independent median and need not add up exactly.',
      '',
      '| Cache / case | Pool | n | Build | Runtime | Process wall time |',
      '| --- | --- | --- | --- | --- | --- |',
    )
    for (const condition of record.options.conditions) for (const group of groups) for (const [i, framework] of runners.entries()) {
      const selected = phased.filter((s) => s.condition === condition && s.group === group && s.framework === framework)
      if (!selected.length) continue
      if (selected.length !== record.options.runs || selected.some((s) => s.status !== 'passed')) {
        lines.push(`| ${condition} / ${caseName(group)} | ${names[i]} | ${selected.length} | INCOMPLETE | INCOMPLETE | INCOMPLETE |`)
        continue
      }
      const med = (values) => (statistics(values).median / 1000).toFixed(2)
      lines.push(`| ${condition} / ${caseName(group)} | ${names[i]} | ${selected.length} | ${med(selected.map((s) => s.counts.duration.buildTime))} | ${med(selected.map((s) => s.counts.duration.testTime))} | ${med(selected.map((s) => s.wallMs))} |`)
    }
    lines.push('')
  }
  lines.push(
    '## Samples and provenance',
    '',
    '[Full variability](variability.md). See [result.json](result.json) for all samples, warmups, counts, cache actions, fixture/config hashes, resolved dependencies and coverage file inventories. ' +
      (record.publication
        ? 'Local commands, executable paths and log paths are omitted; cache paths are workspace-relative. publication.sourceSha256 identifies the original result. Full logs and source snapshots remain in the original run directory or CI artifact.'
        : record.sourceRuns
        ? 'Logs, workspaces and harness snapshots remain in the source batch directories listed in the run history.'
        : 'Logs and final reporter output are under logs/. Workspaces and generated source are retained alongside this report.'),
    '',
  )
  return { markdown: lines.join('\n'), summary, variability: detail.join('\n') + '\n', tables: mainTables.join('\n\n') }
}

export function report(record, directory) {
  const rendered = renderReport(record)
  writeFileSync(join(directory, 'report.md'), rendered.markdown)
  writeFileSync(join(directory, 'summary.md'), rendered.summary)
  writeFileSync(join(directory, 'variability.md'), rendered.variability)
  return rendered.tables
}

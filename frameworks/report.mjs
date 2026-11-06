import { statistics } from '../scripts/lib/stats.mjs'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
export function report(record, directory) {
  const runners = record.options.frameworks ?? Object.keys(record.versions)
  const names = runners.map(
    (f) =>
      ({
        jest: 'Jest + SWC',
        'jest-babel': 'Jest + Babel',
        vitest: 'Vitest',
        rstest: 'Rstest',
        'rstest-vmForks': 'Rstest vmForks',
        'rstest-vmThreads': 'Rstest vmThreads',
      })[f] ?? f,
  )

  const lines = [
    '# ' + names.join(' / ') + ' comparison',
    '',
    `Status: **${record.status}**. ${record.startedAt}. Node ${record.host.node}; ${record.host.cpu}; ${record.host.platform}.`,
    '',
    'Published packages: ' +
      Object.entries(record.versions)
        .map(([k, v]) => `${k} ${v}`)
        .join(', ') +
      '.',
    '',
    `${record.options.runs} measured runs per framework/case/cache condition; medians. Each sample is a fresh process. Warm cache: one warmup after clearing caches; cold cache: cleared before every measured run. Node compile cache disabled; OS page cache and background load uncontrolled. Framework defaults, except explicitly named variants.`,
    '',
    'RSS is OS /usr/bin/time maxrss (MiB), not simultaneous aggregate process-tree memory. Percentages use Jest when present, Vitest for browser mode, otherwise the first listed framework as baseline. Negative means less time or memory. Installations and generation are outside timing. All samples retained.',
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
        `- ${[...new Set(entries.map((s) => s.framework))].join(', ')}: ${reason}. Affected: ${[...new Set(entries.map((s) => s.group))].join(', ')}.`,
      )
    }
    lines.push('')
  }
  const detail = [
    '# Variability',
    '',
    '| Cache / case | Framework | n | Time median | Time min–max | Time CV | RSS median | RSS CV |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
  ]
  const groups = [...new Set(record.samples.map((s) => s.group))]
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
            `| ${condition} / ${group} | ${names[i]} | ${s.time.n} | ${(s.time.median / 1000).toFixed(3)}s | ${(s.time.min / 1000).toFixed(3)}–${(s.time.max / 1000).toFixed(3)}s | ${s.time.cv?.toFixed(1) ?? '—'}% | ${(s.rss.median / 1024 ** 2).toFixed(1)} MiB | ${s.rss.cv?.toFixed(1) ?? '—'}% |`,
          )
      })
      return { group, sets, stats }
    })
    lines.push(`## ${condition} framework cache`, '')
    for (const metric of ['time', 'rss']) {
      lines.push(
        `### ${metric === 'time' ? 'Elapsed time' : 'RSS (MiB)'}`,
        '',
        `| Case | ${names.join(' | ')} | Notes |`,
        `| --- | ${names.map(() => '---').join(' | ')} | --- |`,
      )
      for (const { group, sets, stats } of rows) {
        const baseIndex = Math.max(
            0,
            runners.indexOf(group.startsWith('browser/') ? 'vitest' : 'jest'),
          ),
          base = stats[baseIndex],
          notes = []
        const ranked = [...new Set(
          stats.filter((s) => s.complete).map((s) => s[metric].median),
        )].sort((a, b) => a - b)
        const cells = stats.map((s, i) => {
          if (!sets[i].length) return '—'
          if (!s.complete) return 'INCOMPLETE'
          if (s[metric].cv > 10) notes.push(names[i] + ' CV > 10%')
          const value =
            (['🥇 ', '🥈 '][ranked.indexOf(s[metric].median)] ?? '') +
            (metric === 'time'
              ? `${(s.time.median / 1000).toFixed(3)}s`
              : (s.rss.median / 1024 ** 2).toFixed(1))
          if (i === baseIndex || !base.complete || !base[metric].median)
            return value
          const delta = (s[metric].median / base[metric].median - 1) * 100
          return `${value} (${delta >= 0 ? '+' : ''}${delta.toFixed(1)}%)`
        })
        lines.push(
          `| ${group} | ${cells.join(' | ')} | ${notes.join('; ') || '—'} |`,
        )
      }
      lines.push('')
    }
  }
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
        lines.push(`| ${condition} / ${group} | ${names[i]} | ${selected.length} | INCOMPLETE | INCOMPLETE | INCOMPLETE |`)
        continue
      }
      const med = (values) => (statistics(values).median / 1000).toFixed(3)
      lines.push(`| ${condition} / ${group} | ${names[i]} | ${selected.length} | ${med(selected.map((s) => s.counts.duration.buildTime))} | ${med(selected.map((s) => s.counts.duration.testTime))} | ${med(selected.map((s) => s.wallMs))} |`)
    }
    lines.push('')
  }
  lines.push(
    '## Samples and provenance',
    '',
    '[Full variability](variability.md). See [result.json](result.json) for all samples, warmups, counts, cache actions, commands, fixture/config hashes, resolved dependencies and coverage file inventories. ' +
      (record.sourceRuns
        ? 'Logs, workspaces and harness snapshots remain in the source batch directories listed in the run history.'
        : 'Logs and final reporter output are under logs/. Workspaces and generated source are retained alongside this report.'),
    '',
  )
  writeFileSync(join(directory, 'report.md'), lines.join('\n'))
  writeFileSync(join(directory, 'variability.md'), detail.join('\n') + '\n')
}

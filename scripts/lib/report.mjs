import { readFileSync } from 'node:fs'
import { assertNoLegacyMemory } from './legacy.mjs'
import { createHash } from 'node:crypto'
import { dirname, relative } from 'node:path'
import { statistics, seconds, percent } from './stats.mjs'
import { formatCpu } from './host.mjs'

const escape = (value) =>
  String(value ?? 'unknown')
    .replaceAll('|', '\\|')
    .replaceAll('\n', ' ')
const table = (headers, rows) =>
  [
    `| ${headers.map(escape).join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map(escape).join(' | ')} |`),
  ].join('\n')

export function normalize(document, source = 'memory') {
  if (document.schemaVersion != null && document.schemaVersion !== 2)
    throw new Error(`Unsupported schemaVersion in ${source}`)
  if (!document.meta || !Array.isArray(document.results))
    throw new Error(`Invalid result document: ${source}`)
  const legacy = document.schemaVersion !== 2
  return document.results.map((row) => {
    const suite =
      document.suite ?? (row.provider ? 'coverage' : row.app ? 'main' : 'pools')
    assertNoLegacyMemory(source, row, suite === 'coverage' && row.status === 'passed')
    const timed = legacy
      ? row.samples
      : row.samples
          .filter(
            (sample) => sample.phase === 'timed' && sample.status === 'passed',
          )
          .map((sample) => sample.wallMs)
    const memory = legacy
      ? (row.memorySamples ?? []).filter((value) => value != null)
      : (row.memorySamples ?? [])
          .filter(
            (sample) =>
              sample.phase === 'timed' &&
              sample.status === 'passed' &&
              sample.memoryBytes != null,
          )
          .map((sample) => sample.memoryBytes)
    const expected = document.meta.options?.runs ?? document.meta.runs
    const status = legacy
      ? row.error
        ? 'failed'
        : timed.length === expected
          ? 'passed'
          : 'incomplete'
      : row.status === 'passed' && timed.length !== expected
        ? 'incomplete'
        : row.status
    return {
      source,
      meta: document.meta,
      legacy,
      suite,
      status,
      error: row.error ?? row.reason,
      name: (row.name ?? row.case ?? `${row.scale} module graph`).replace(
        / \+ Chromium$/, ' + browser mode',
      ),
      app: row.app ?? 'node-library',
      scale:
        row.scale ??
        (row.app === 'node-library'
          ? 'medium'
          : row.app === 'barrel-clean'
            ? row.case.match(/small|medium|large/)?.[0]
            : null),
      pool: row.pool ?? 'forks',
      dimension: row.dimension ?? null,
      env: row.env ?? 'node',
      isolate: row.pool === 'browser' ? null : (row.isolate ?? true),
      provider: row.provider ?? 'none',
      config: row.config ?? 'default',
      tests: row.tests ?? null,
      files: row.expectedFiles ?? row.testFiles ?? row.files ?? null,
      fixture: row.fixture?.sha256 ?? null,
      configs: row.configs?.sha256 ?? null,
      browser: row.browser?.version ?? null,
      environment: row.environment ?? null,
      dependencies: row.dependencies ?? null,
      samples: timed,
      memorySamples: memory,
      stats: statistics(timed),
      memoryStats: statistics(memory),
    }
  })
}

export function identity(row, axis = null) {
  return JSON.stringify(
    [
      'suite',
      'app',
      'dimension',
      'scale',
      'env',
      'pool',
      'provider',
      'config',
      'isolate',
    ]
      .filter((key) => key !== axis)
      .map((key) => row[key] ?? null),
  )
}

function compatibility(a, b, withinColumn = false) {
  const mismatches = []
  const check = (name, left, right) => {
    if (
      left != null &&
      right != null &&
      JSON.stringify(left) !== JSON.stringify(right)
    )
      mismatches.push(name)
  }
  for (const key of [
    'node',
    'cpu',
    'logicalCpuCount',
    'platform',
    'osRelease',
    'availableParallelism',
  ])
    check(key, a.meta[key], b.meta[key])
  for (const key of [
    'fixture',
    'configs',
    'files',
    'tests',
    'browser',
    'environment',
  ])
    check(key, a[key], b[key])
  const policy = (meta) =>
    meta.measurement && {
      state: meta.measurement.state,
      warmup: meta.measurement.warmup,
      reporter: meta.measurement.reporter,
      cache: meta.measurement.cache,
      memory: meta.measurement.memory,
      order: meta.measurement.order,
      maxWorkers: meta.measurement.maxWorkers,
    }
  check('measurement policy', policy(a.meta), policy(b.meta))
  check('workload dependencies', a.meta.source?.workloadDependencies?.[a.app], b.meta.source?.workloadDependencies?.[b.app])
  check('runner source', a.meta.runner?.sha256, b.meta.runner?.sha256)
  // Release comparisons intentionally change lockfiles; pooled batches must not.
  if (withinColumn) {
    check('lockfile', a.meta.lockfileSha256, b.meta.lockfileSha256)
    check('source identity', a.meta.source?.fingerprint, b.meta.source?.fingerprint)
    const version = (row) =>
      row.dependencies?.['@rstest/core']?.version ?? row.meta.rstest
    check('Rstest version', version(a), version(b))
  }
  return mismatches
}

export function mergeRows(rows, axis = null) {
  const grouped = new Map()
  for (const row of rows) {
    const id = identity(row, axis)
    if (!grouped.has(id)) grouped.set(id, [])
    grouped.get(id).push(row)
  }
  return new Map(
    [...grouped].map(([id, group]) => {
      const first = group[0]
      const differences = group.flatMap((row, index) =>
        group
          .slice(index + 1)
          .flatMap((other) => compatibility(row, other, true)),
      )
      const samples = group.flatMap((row) => row.samples)
      const memorySamples = group.flatMap((row) => row.memorySamples)
      return [
        id,
        {
          ...first,
          legacy: group.some((row) => row.legacy),
          members: group,
          sources: group.map((row) => row.source),
          samples,
          memorySamples,
          stats: statistics(samples),
          memoryStats: statistics(memorySamples),
          status: differences.length
            ? 'incompatible'
            : group.every((row) => row.status === 'passed')
              ? 'passed'
              : group.find((row) => row.status !== 'passed').status,
          differences: [...new Set(differences)],
        },
      ]
    }),
  )
}

export function compare(base, candidate) {
  if (!base || !candidate) return { delta: null, note: 'missing case' }
  if (base.status !== 'passed' || candidate.status !== 'passed')
    return { delta: null, note: `${base.status} / ${candidate.status}` }
  const differences = [
    ...new Set(
      (base.members ?? [base]).flatMap((left) =>
        (candidate.members ?? [candidate]).flatMap((right) =>
          compatibility(left, right),
        ),
      ),
    ),
  ]
  if (differences.length)
    return { delta: null, note: `incompatible: ${differences.join(', ')}` }
  if (!base.stats.median) return { delta: null, note: 'zero baseline' }
  return {
    delta: (candidate.stats.median / base.stats.median - 1) * 100,
    note: [
      base.legacy || candidate.legacy ? 'legacy provenance incomplete' : '',
      base.stats.n < 3 || candidate.stats.n < 3 ? 'fewer than 3 samples' : '',
    ]
      .filter(Boolean)
      .join('; '),
  }
}

function spread(row) {
  const stats = row.stats
  return [
    stats.n,
    seconds(stats.median),
    `${seconds(stats.min)}–${seconds(stats.max)}`,
    seconds(stats.mad),
    seconds(stats.sd),
    stats.cv == null ? '—' : `${stats.cv.toFixed(2)}%`,
  ]
}
function cell(row) {
  if (!row) return '— (missing)'
  return row.status === 'passed'
    ? seconds(row.stats.median)
    : row.status.toUpperCase()
}

export function singleReport(document) {
  const rows = normalize(document)
  const axis =
    document.suite === 'pools'
      ? 'pool'
      : document.suite === 'coverage'
        ? 'provider'
        : document.suite === 'barrel'
          ? 'config'
          : null
  const variants = axis ? [...new Set(rows.map((row) => row[axis]))] : []
  const relative =
    variants.length > 1
      ? comparisonReport(
          {
            axis,
            columns: variants.map((value) => ({
              label: value,
              files: ['result.json'],
              where: { [axis]: value },
            })),
          },
          () => document,
        ).summary
      : null
  return [
    `# ${document.meta.label}`,
    '',
    `Status: ${document.status}. ${formatCpu(document.meta)}; ${document.meta.platform}; Node ${document.meta.node}.`,
    '',
    `Started: ${document.meta.startedAt}. Ended: ${document.meta.endedAt ?? 'running'}.`,
    '',
    'Wall-clock samples exclude warmups. MAD is the unscaled median absolute deviation; CV uses sample standard deviation. No outliers are removed.',
    '',
    table(
      [
        'Case',
        'Rstest',
        'Pool',
        'Config',
        'Provider',
        'Status',
        'n',
        'Median',
        'Min–max',
        'MAD',
        'SD',
        'CV',
        'Memory median (MiB, process-tree footprint peak)',
      ],
      rows.map((row) => [
        row.name,
        row.dependencies?.['@rstest/core']?.version ?? 'unknown',
        row.pool,
        row.config,
        row.provider,
        row.status,
        ...spread(row),
        row.memoryStats.median == null
          ? '—'
          : (row.memoryStats.median / 1024 ** 2).toFixed(2),
      ]),
    ),
    '',
    ...(relative
      ? [
          '## Relative comparison',
          '',
          'Elapsed-time change relative to the first column; negative means faster.',
          '',
          relative,
          '',
        ]
      : []),
    'Memory is the peak of the summed macOS physical footprint over the command process tree (sampled every ~50 ms, benchmark driver excluded); the table shows the median across runs. Raw samples, warmups, commands, counts and provenance are in [result.json](result.json); stdout/stderr and source snapshots accompany it.',
    '',
    ...rows
      .filter((row) => row.status !== 'passed')
      .map(
        (row) =>
          `- ${row.name} / ${row.pool} / ${row.provider}: ${row.error ?? row.status}`,
      ),
    '',
  ].join('\n')
}

export function comparisonReport(
  spec,
  load = (path) => JSON.parse(readFileSync(path, 'utf8')),
) {
  if (spec.axis && !['pool', 'provider', 'config'].includes(spec.axis))
    throw new Error('Comparison axis must be pool, provider or config')
  if (!Array.isArray(spec.columns) || spec.columns.length < 2)
    throw new Error('At least two comparison columns are required')
  const columns = spec.columns.map((column) => {
    if (new Set(column.files).size !== column.files.length)
      throw new Error('Duplicate input file in report column')
    if (spec.axis && !column.where?.[spec.axis])
      throw new Error(`Each column must filter ${spec.axis}`)
    const seen = new Set()
    const rows = column.files
      .flatMap((file) => {
        const document = load(file)
        const fingerprint =
          document.runId ??
          createHash('sha256').update(JSON.stringify(document)).digest('hex')
        if (seen.has(fingerprint))
          throw new Error(
            `Duplicate result content in column ${column.label}: ${file}`,
          )
        seen.add(fingerprint)
        return normalize(document, file)
      })
      .filter((row) =>
        Object.entries(column.where ?? {}).every(
          ([key, value]) => row[key] === value,
        ),
      )
    if (!rows.length) throw new Error(`Empty report column: ${column.label}`)
    return { ...column, rows: mergeRows(rows, spec.axis) }
  })
  const ids = [...new Set(columns.flatMap((column) => [...column.rows.keys()]))]
  const summaryRows = [],
    detailRows = [],
    memorySummaryRows = [],
    memoryRows = []
  for (const id of ids) {
    const values = columns.map((column) => column.rows.get(id))
    const first = values.find(Boolean)
    const qualifier =
      first.suite === 'coverage' && spec.axis !== 'provider'
        ? first.provider
        : first.suite === 'pools' && spec.axis !== 'pool'
          ? first.pool
          : first.suite === 'barrel' && spec.axis !== 'config'
            ? first.config === 'default' ? 'default' : 'lazy-barrel disabled'
            : null
    const name = `${first.name}${qualifier ? ` / ${qualifier}` : ''}`
    const cells = [name, cell(values[0])]
    const notes = new Set()
    for (const value of values.slice(1)) {
      const comparison = compare(values[0], value)
      cells.push(cell(value), percent(comparison.delta))
      if (comparison.note) notes.add(comparison.note)
    }
    summaryRows.push([...cells, [...notes].join('; ') || '—'])
    if (values.some((row) => row?.memoryStats.n)) {
      const memoryValues = values.map((row) => row && ({
        ...row,
        stats: row.memoryStats,
        status: row.status === 'passed' && row.memoryStats.n !== row.stats.n
          ? 'incomplete'
          : row.status,
      }))
      memorySummaryRows.push([name, ...memoryValues.flatMap((row, index) => {
        if (!row || !row.stats.n) return index === 0 ? ['—'] : ['—', '—']
        if (row.status !== 'passed') return index === 0 ? [row.status.toUpperCase()] : [row.status.toUpperCase(), '—']
        const value = (row.stats.median / 1024 ** 2).toFixed(2)
        const delta = index === 0 ? null : compare(memoryValues[0], row).delta
        return index === 0 ? [value] : [value, percent(delta)]
      })])
    }
    values.forEach((row, index) => {
      if (!row) return
      detailRows.push([
        name,
        columns[index].label,
        row.status,
        ...spread(row),
        row.files ?? 'unknown',
        row.tests ?? 'unknown',
      ])
      if (row.memoryStats.n)
        memoryRows.push([
          name,
          columns[index].label,
          row.status,
          row.memoryStats.n,
          (row.memoryStats.median / 1024 ** 2).toFixed(2),
          `${(row.memoryStats.min / 1024 ** 2).toFixed(2)}–${(row.memoryStats.max / 1024 ** 2).toFixed(2)}`,
          row.memoryStats.cv == null ? '—' : `${row.memoryStats.cv.toFixed(2)}%`,
        ])
    })
  }
  const headers = ['Case', ...columns.flatMap((column, index) => index === 0 ? [column.label] : [column.label, 'Δ'])]
  const hasNotes = summaryRows.some((row) => row.at(-1) !== '—')
  const summary = table(
    hasNotes ? [...headers, 'Notes'] : headers,
    hasNotes ? summaryRows : summaryRows.map((row) => row.slice(0, -1)),
  )
  const inputs = [
    ...new Map(
      columns.flatMap((column) =>
        [...column.rows.values()].flatMap((row) =>
          row.members.map((member) => [member.source, member.meta]),
        ),
      ),
    ).entries(),
  ]
  const published = inputs.some(([, meta]) => meta.publication)
  const memorySummary = memorySummaryRows.length ? table(headers, memorySummaryRows) : ''
  return {
    summary,
    memorySummary,
    jobSummary: [
      `# ${spec.title ?? 'Benchmark comparison'}`,
      '',
      ...new Set(inputs.map(([, meta]) =>
        `Node ${meta.node}; ${formatCpu(meta)}; ${meta.platform}.`,
      )),
      '',
      ...new Set(inputs.map(([, meta]) =>
        `${meta.measurement?.warmup ?? meta.options?.warmup ?? 'Not recorded'} warmup(s), ${meta.measurement?.runs ?? meta.options?.runs ?? meta.runs ?? 'not recorded'} timed runs per supported case; medians.`,
      )),
      '',
      ...(spec.context ? [spec.context, ''] : []),
      'Each Δ is relative to the baseline; negative means less elapsed time or memory. Values display two decimal places; changes use unrounded medians.',
      '',
      compactTables({ summary, memorySummary }),
      '',
      'Full reports, variability, samples and execution details are available in the workflow artifact.',
      '',
    ].join('\n'),
    provenanceNote: columns.some((column) =>
      [...column.rows.values()].some((row) => row.legacy),
    )
      ? 'Generated from raw samples; legacy provenance is incomplete.'
      : published
        ? 'Generated from published samples and compatibility fingerprints; full logs and snapshots are stored separately.'
        : 'Generated from schema v2 samples; commands, logs, snapshots and fingerprints are retained with each run.',
    markdown: [
      `# ${spec.title ?? 'Benchmark comparison'}`,
      '',
      ...(spec.context ? [spec.context, ''] : []),
      'Generated from raw samples. Change = (candidate / baseline − 1) × 100%; negative means faster. The first value column is the baseline; each Δ column shows the change relative to it. Values display two decimal places; changes use unrounded medians. All repetitions are retained; combined batches use the median of pooled samples, not the median of batch medians.',
      '',
      summary,
      '',
      '## Variability',
      '',
      'MAD is unscaled. CV uses sample standard deviation (n − 1). Evaluate CV together with absolute SD and range before deciding whether a fluctuation warrants a rerun. Small sample counts do not establish a regression. Failed or incomplete batches never receive a speedup percentage.',
      '',
      table(
        [
          'Case',
          'Column',
          'Status',
          'n',
          'Median',
          'Min–max',
          'MAD',
          'SD',
          'CV',
          'Files',
          'Tests',
        ],
        detailRows,
      ),
      '',
      ...(memoryRows.length
        ? [
            '## Memory',
            '',
            'Peak process-tree physical footprint in MiB (macOS `phys_footprint`, summed every ~50 ms).',
            '',
            table(
              [
                'Case',
                'Column',
                'Status',
                'n',
                'Median MiB',
                'Min–max MiB',
                'CV',
              ],
              memoryRows,
            ),
            '',
          ]
        : []),
      '## Inputs and provenance',
      '',
      ...inputs.map(
        ([file, meta]) =>
          `- \`${file}\`: ${meta.startedAt ?? meta.date ?? 'unknown date'}; Node ${meta.node}; ${formatCpu(meta)}; ${meta.platform}; lockfile SHA-256: ${meta.lockfileSha256 ?? 'unknown (legacy)'}.${meta.source ? ` Source: ${meta.source.kind} / ${meta.source.label}; fingerprint: ${meta.source.fingerprint}.` : ''}`,
      ),
      '',
      ...(columns.some((column) =>
        [...column.rows.values()].some((row) => row.legacy),
      )
        ? [
            'Legacy files are read without modification. Missing hashes, per-sample timestamps, warmups, counts and logs remain unknown. Historical comparisons are descriptive, not verified like-for-like reproductions.',
          ]
        : [
            published
              ? 'Published inputs retain every sample, warmup, test count, timestamp and compatibility fingerprint. Full logs, commands and source snapshots are stored separately; meta.publication.sourceSha256 identifies the original result JSON.'
              : 'Schema v2 inputs retain per-sample timestamps, warmups, test counts, commands, logs and source snapshots. Fixture, configuration, harness and host compatibility are checked before calculating changes.',
          ]),
      inputs.every(([, meta]) => meta.measurement?.order?.startsWith('paired versions'))
        ? 'Versions are measured in paired case/round order, alternating the first side each round and fixture. No benchmark processes overlap. Workload dependencies, fixtures, configurations, harness and host compatibility are checked before calculating changes.'
        : inputs.every(([, meta]) => meta.measurement?.order?.startsWith('rotating '))
          ? 'Versions run sequentially in rotating case/round order; no setup or test processes overlap. Every candidate is compared with the baseline.'
          : 'Version runs are separate batches, not interleaved A/B runs. Fixture, configuration, harness and host compatibility are checked before calculating changes.',
      '',
    ].join('\n'),
  }
}

function compactTables(report) {
  const memory = report.memorySummary
    ? `\n\n### Memory comparison\n\nMedian of the per-run peak process-tree physical footprint in MiB; negative percentages mean less memory.\n\n${report.memorySummary}`
    : ''
  return `${report.summary}${memory}`
}

export function readmeBlock(spec, report, load, readmePath = 'README.md') {
  if (spec.readme) {
    const indices = spec.readme.columns
    if (!Array.isArray(indices) || indices.length < 2 || indices[0] !== 0 ||
        new Set(indices).size !== indices.length ||
        indices.some(index => !Number.isInteger(index) || index < 0 || index >= spec.columns.length))
      throw new Error('README columns must select the baseline first and at least one unique candidate')
    spec = {
      ...spec,
      context: spec.readme.context ?? spec.context,
      columns: indices.map(index => ({
        ...spec.columns[index],
        label: spec.columns[index].label.replace(/^(?:baseline|candidate(?:-\d+)?): /, ''),
      })),
    }
    report = comparisonReport(spec, load)
  }
  const reportLink = relative(dirname(readmePath), spec.output).replaceAll('\\', '/')
  return `\n\n${spec.context ? spec.context + '\n\n' : ''}${compactTables(report)}\n\n[Full report, variability and inputs](${reportLink}). ${report.provenanceNote}\n\n`
}

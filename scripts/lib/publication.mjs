import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  copyFileSync,
  renameSync,
  rmSync,
} from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { reportInput } from './publish.mjs'
import { comparisonReport, readmeBlock } from './report.mjs'
import { formatCpu } from './host.mjs'
import { assertPublishableMemory } from './memory.mjs'

const outputs = {
  main: 'versions',
  scaling: 'scaling',
  barrel: 'barrel',
  pools: 'pools',
  coverage: 'coverage',
}

export function publishComparison(root, directory, record) {
  if (record.status !== 'completed' || !record.reports.length)
    throw new Error('Only completed comparisons can update README')
  const manifestPath = join(root, 'reports.config.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const oldInputs = new Set(
    manifest.reports.flatMap((spec) =>
      spec.columns.flatMap((column) => column.files),
    ),
  )
  const pending = new Map()
  const selected = record.reports.map((spec) => basename(spec.output, '.md'))
  const sides = Object.keys(record.sources)
  const updated = []
  for (const suite of selected) {
    const name = outputs[suite]
    if (!name) throw new Error(`Unknown publication suite: ${suite}`)
    const documents = []
    const columns = sides.map((side) => {
      const run = record.runs.find(
        (run) => run.side === side && run.suite === suite,
      )
      if (!run || run.status !== 'completed')
        throw new Error(`Incomplete run: ${side}/${suite}`)
      const raw = readFileSync(resolve(root, run.file), 'utf8')
      const doc = JSON.parse(raw)
      if (doc.suite === 'coverage') assertPublishableMemory(doc.meta.measurement?.memory, run.file)
      if (
        doc.status !== 'completed' ||
        doc.suite !== suite ||
        doc.meta.options.runs !== Number(record.options.runs) ||
        doc.meta.options.warmup !== Number(record.options.warmup) ||
        !doc.results.length ||
        doc.results.some(
          (row) =>
            !['passed', 'skipped'].includes(row.status) ||
            (row.status === 'passed' &&
              (row.samples.filter(
                (sample) =>
                  sample.phase === 'timed' && sample.status === 'passed',
              ).length !== Number(record.options.runs) ||
                row.samples.filter(
                  (sample) =>
                    sample.phase === 'warmup' && sample.status === 'passed',
                ).length !== Number(record.options.warmup) ||
                row.samples.some((sample) => sample.status !== 'passed'))),
        )
      )
        throw new Error(`Cannot publish incomplete samples: ${side}/${suite}`)
      const file = `reports/data/${doc.runId}-${side}-${suite}.json`
      if (existsSync(join(root, file)))
        throw new Error(`Publication input already exists: ${file}`)
      pending.set(file, JSON.stringify(reportInput(raw), null, 2) + '\n')
      documents.push(doc)
      return { label: `${side}: ${record.sources[side].label}`, files: [file] }
    })
    const meta = documents[0].meta
    const context = [
      ...(record.ci ? [`Source: [GitHub Actions](${record.ci.url}), commit \`${record.ci.sha}\`, attempt ${record.ci.attempt}.`] : []),
      `Sources: ${sides.map((side) => `${side}: **${record.sources[side].label}** (${record.sources[side].kind})`).join('; ')}. Measured ${meta.startedAt.slice(0, 10)} (UTC); ${formatCpu(meta)}; ${meta.platform}, Node ${meta.node}.`,
      `${record.options.warmup} warmup(s) and **${record.options.runs} timed runs per supported case**; medians are reported. ${documents[0].results.length} selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.`,
      `Sources run sequentially in rotating case/round order. ${Number(record.options.runs) % sides.length === 0 ? 'For cases supported by all sources, each source occupies every order position equally often.' : 'Round count is not a multiple of source count, so order positions differ by at most one per case.'} Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.`,
    ].join('\n\n')
    const spec = {
      title: `${suite}: ${sides.map((side) => record.sources[side].label).join(' vs ')}`,
      output: `reports/${name}.md`,
      ...(suite === 'main' || suite === 'coverage' ? { marker: name } : {}),
      context,
      columns,
    }
    const generated = comparisonReport(spec, (file) =>
      JSON.parse(
        pending.get(file) ?? readFileSync(resolve(root, file), 'utf8'),
      ),
    )
    if (/incompatible|missing case/.test(generated.summary))
      throw new Error(`Cannot publish incompatible comparison: ${suite}`)
    pending.set(spec.output, generated.markdown)
    const index = manifest.reports.findIndex(
      (existing) => existing.output === spec.output,
    )
    if (index < 0) manifest.reports.push(spec)
    else manifest.reports[index] = spec
    updated.push({ spec, ...generated })
  }
  const readmePath = manifest.readmePath ?? 'README.md'
  let readme = readFileSync(join(root, readmePath), 'utf8')
  for (const report of updated) {
    const { spec } = report
    if (!spec.marker) continue
    // Migrate the existing handwritten measurement introduction into the generated block.
    const heading =
      spec.marker === 'versions'
        ? '(?:Published release results|Selected results)'
        : 'Coverage results'
    readme = readme.replace(
      new RegExp(
        `## ${heading}\\n[\\s\\S]*?(?=<!-- benchmark:${spec.marker}:start -->)`,
      ),
      `## ${spec.marker === 'versions' ? 'Selected results' : 'Coverage results'}\n\n`,
    )
    const start = `<!-- benchmark:${spec.marker}:start -->`
    const end = `<!-- benchmark:${spec.marker}:end -->`
    const from = readme.indexOf(start),
      to = readme.indexOf(end, from)
    if (from < 0 || to < 0)
      throw new Error(`Missing README markers: ${spec.marker}`)
    readme =
      readme.slice(0, from + start.length) +
      readmeBlock(spec, report, undefined, readmePath) +
      readme.slice(to)
  }
  pending.set(readmePath, readme)
  pending.set('reports.config.json', JSON.stringify(manifest, null, 2) + '\n')
  pending.set(
    'reports/README.md',
    '# Benchmark reports\n\nSelected comparisons are listed below. Each report records its sources, measurement conditions, samples and variability. Updating a subset of suites preserves the others.\n\n' +
      manifest.reports
        .map(
          (spec) =>
            `- [${spec.title}](${spec.output.replace(/^reports\//, '')}): ${spec.columns.map((column) => column.files.map((file) => `[${column.label} samples](${relative('reports', file)})`).join(', ')).join('; ')}.`,
        )
        .join('\n') +
      '\n\nPercentages compare each candidate with the first column. Skipped cases remain visible; detailed reports include absolute spread and CV. Coverage memory is the peak process-tree physical footprint on macOS, median across runs.\n\nRegenerate with `pnpm report --readme`; verify with `pnpm report:check`. Published inputs are included under [data/](data/README.md); full logs and snapshots remain with the original comparison. See [measurement policy](../docs/results.md#measurement-policy).\n',
  )
  const newInputs = new Set(
    manifest.reports.flatMap((spec) =>
      spec.columns.flatMap((column) => column.files),
    ),
  )
  const retired = [...oldInputs].filter(
    (file) => !newInputs.has(file) && /^reports\/data\/[^/]+\.json$/.test(file),
  )
  const backup = join(directory, 'publication-backup')
  const originals = new Map()
  const targets = [...pending.keys(), ...retired]
  // Validate and render everything before touching published files; retain a recoverable backup.
  for (const file of targets) {
    const path = join(root, file)
    const content = existsSync(path) ? readFileSync(path) : null
    originals.set(file, content)
    if (content !== null) {
      const destination = join(backup, file)
      mkdirSync(dirname(destination), { recursive: true })
      copyFileSync(path, destination)
    }
  }
  const temporary = new Set()
  try {
    for (const [file, content] of pending) {
      const path = join(root, file)
      mkdirSync(dirname(path), { recursive: true })
      const temp = `${path}.${randomUUID()}.tmp`
      temporary.add(temp)
      writeFileSync(temp, content, { flag: 'wx' })
      renameSync(temp, path)
      temporary.delete(temp)
    }
    for (const file of retired) rmSync(join(root, file))
  } catch (error) {
    for (const [file, content] of originals) {
      const path = join(root, file)
      if (content === null) rmSync(path, { force: true })
      else writeFileSync(path, content)
    }
    throw error
  } finally {
    for (const temp of temporary) rmSync(temp, { force: true })
  }
  return {
    updatedAt: new Date().toISOString(),
    readmePath,
    suites: selected,
    files: [...pending.keys()],
    retiredInputs: retired,
    backup: relative(root, backup),
  }
}

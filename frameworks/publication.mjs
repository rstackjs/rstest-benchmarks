import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { cases } from './fixtures.mjs'
import { selectedFor } from './order.mjs'
import { renderReport } from './report.mjs'
import { summaryJson } from './summary.mjs'
import { verifySamples } from './verify.mjs'

function validate(record, source) {
  assert.equal(record.schemaVersion, 1, 'Unsupported framework result schema')
  const summary = verifySamples(record, source)
  assert(!record.independentBatches && !record.sourceRuns, 'Publish one complete run, not merged batches')
  const runners = record.options.frameworks
  for (const name of ['jest', 'vitest', 'rstest'])
    assert(runners.includes(name), `Missing framework: ${name}`)
  assert.deepEqual([...record.options.conditions].sort(), ['cold', 'warm'])
  const expected = [
    ...cases.map((item) => `main/${item.id}/none`),
    ...(record.options.suites.includes('coverage')
      ? ['backend', 'react'].flatMap((id) => ['none', 'v8', 'istanbul'].map((provider) => `coverage/${id}/${provider}`))
      : []),
    'browser/react/none',
  ].sort()
  assert.deepEqual(record.plan.map((g) => `${g.suite}/${g.item.id}/${g.provider}`).sort(), expected, 'README publication requires the complete main and browser matrix, plus coverage when selected')
  for (const group of record.plan) {
    assert.deepEqual(group.frameworks, selectedFor(group, runners), 'Missing framework in benchmark plan')
    const item = cases.find((item) => item.id === group.item.id)
    // Published single-file inputs remain reproducible after the minimal fixtures grow.
    const historicalMinimal = record.publication && item.fixture &&
      group.item.files === 1 && group.item.tests === 1
    if (historicalMinimal) continue
    assert.equal(group.item.files, item.files, 'Workload file count differs from this checkout')
    assert.equal(group.item.tests, item.tests, 'Workload test count differs from this checkout')
  }
  return summary
}

export function publishedInput(source, name = 'framework result') {
  const record = JSON.parse(source)
  validate(record, name)
  if (record.publication) return record
  record.publication = {
    format: 1,
    sourceSha256: createHash('sha256').update(source).digest('hex'),
  }
  if (record.browser) delete record.browser.executable
  for (const sample of [...record.samples, ...(record.memorySamples ?? [])]) {
    const cwd = sample.cwd
    // Reporter data may contain a framework cache path nested inside counts.
    if (cwd && sample.counts)
      sample.counts = JSON.parse(JSON.stringify(sample.counts).replaceAll(cwd, '.'))
    for (const key of ['command', 'cwd', 'stdoutPath', 'stderrPath']) delete sample[key]
  }
  for (const action of record.cacheActions ?? []) {
    action.workspace = action.cwd?.split('/workspaces/')[1] ?? action.workspace
    delete action.cwd
  }
  return record
}

const metricNames = { time: 'Elapsed time', memory: 'Memory (MiB, peak process-tree footprint)' }
const chartFile = { time: 'elapsed', memory: 'memory' }
const chartPath = (condition, metric) => `frameworks/reports/charts/${condition}-${chartFile[metric]}.svg`

// One short line: where the numbers come from. Full runner details stay in report.md.
function provenance(record) {
  const parts = []
  if (record.ci) parts.push(`Run [${record.ci.url.split('/').pop()}](${record.ci.url}) (attempt ${record.ci.attempt}), commit \`${record.ci.sha.slice(0, 7)}\``)
  parts.push(record.startedAt.slice(0, 10))
  parts.push(`${record.host.cpu}, ${record.host.logicalCpuCount ?? 'unknown'} CPUs${record.ci?.image ? `, GitHub-hosted macOS runner image ${record.ci.image}` : ''}`)
  parts.push(`Node ${record.host.node}`)
  parts.push(Object.entries(record.versions).map(([name, version]) => `${name} **${version}**`).join(', ') + `, @swc/jest **${record.dependencies['@swc/jest']}**`)
  return parts.join(' · ')
}

function details(summary, body) {
  return `<details>\n<summary>${summary}</summary>\n\n${body}\n\n</details>`
}

function context(record, rendered, command) {
  const summary = {
    measured: record.samples.filter((sample) => sample.phase === 'timed').length,
    warmups: record.samples.filter((sample) => sample.phase === 'warmup').length,
  }
  const { sections } = rendered
  const view = (condition, metric) => {
    const section = sections[condition]?.[metric]
    return `![${metricNames[metric]}, ${condition} cache](${chartPath(condition, metric)})\n\nBars are scaled per case; compare lengths only within a case.\n\n${section.table}`
  }
  const warm = ['time', 'memory'].map((metric) => `**Warm cache · ${metricNames[metric]}**\n\n${view('warm', metric)}`).join('\n\n')
  const browser = ['cold', 'warm'].flatMap((condition) => ['time', 'memory'].map((metric) => {
    const table = sections[condition]?.[metric]?.browser
    return table && `**Browser mode · ${condition} cache · ${metricNames[metric]}**\n\n${table}`
  })).filter(Boolean).join('\n\n')
  const run = `${record.options.runs} timed runs per supported case and cache condition; all **${summary.measured} timed samples and ${summary.warmups} warmups passed**. Node compile cache is disabled. Default concurrency; named Rstest pool variants change only the pool. Cold and warm framework caches are reported separately; OS page cache and background load are uncontrolled. Browser mode compares Vitest against default Rstest only.`
  const rstest = record.rstestSource ? `Rstest source: \`${record.rstestSource.requested}\`. The run records its resolved versions and dependency lockfile.\n\n` : ''
  return [
    provenance(record),
    rstest.trim(),
    `### Elapsed time, cold cache\n\n${view('cold', 'time')}`,
    `### Memory, cold cache (MiB, peak process-tree footprint)\n\n${view('cold', 'memory')}`,
    details('Warm cache', warm),
    ...(browser ? [details('Browser mode', browser)] : []),
    details('Run details and reproduction', `${run}\n\nReproduce this matrix using the matching source checkout and pinned dependencies:\n\n\`\`\`sh\n${command}\n\`\`\`\n\nThe full runner list is in the [complete report](frameworks/reports/report.md).`),
  ].filter(Boolean).join('\n\n')
}

export function refreshReport({ root, input = join(root, 'frameworks/reports/result.json'), check = false }) {
  const source = readFileSync(input, 'utf8')
  const record = publishedInput(source, input)
  const rendered = renderReport(record, input)
  const readme = readFileSync(join(root, 'README.md'), 'utf8')
  const startMarker = '<!-- framework-results:start -->'
  const endMarker = '<!-- framework-results:end -->'
  const start = readme.indexOf(startMarker), end = readme.indexOf(endMarker)
  assert(start >= 0 && end > start && readme.lastIndexOf(startMarker) === start && readme.lastIndexOf(endMarker) === end, 'Missing, duplicate or invalid framework result markers')
  const command = `pnpm compare:frameworks --suites ${record.options.suites.join(',')} --cases ${cases.map((item) => item.id).join(',')} --frameworks ${record.options.frameworks.join(',')} --runs ${record.options.runs}${record.rstestSource ? ` --rstest-version ${record.rstestSource.requested}` : ''}`
  const body = `\n\n${context(record, rendered, command)}\n\n`
  const updates = new Map([
    ['README.md', readme.slice(0, start + startMarker.length) + body + readme.slice(end)],
    ['frameworks/reports/report.md', rendered.markdown],
    ['frameworks/reports/variability.md', rendered.variability],
    ['frameworks/reports/summary.json', summaryJson(record)],
  ])
  for (const [condition, metrics] of Object.entries(rendered.sections))
    for (const [metric, section] of Object.entries(metrics)) updates.set(chartPath(condition, metric), section.chart)
  // Keep a published input byte-for-byte when only regenerating its presentation.
  if (input !== join(root, 'frameworks/reports/result.json'))
    updates.set('frameworks/reports/result.json', JSON.stringify(record, null, 2) + '\n')
  if (check) {
    for (const [file, content] of updates)
      assert.equal(readFileSync(join(root, file), 'utf8'), content, `Stale framework report: ${file}`)
    return
  }
  const originals = new Map([...updates.keys()].map((file) => [file, existsSync(join(root, file)) ? readFileSync(join(root, file)) : null]))
  try {
    for (const [file, content] of updates) {
      mkdirSync(dirname(join(root, file)), { recursive: true })
      writeFileSync(join(root, file), content)
    }
  } catch (error) {
    for (const [file, content] of originals) {
      if (content === null) rmSync(join(root, file), { force: true })
      else writeFileSync(join(root, file), content)
    }
    throw error
  }
}

import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { cases } from './fixtures.mjs'
import { selectedFor } from './order.mjs'
import { renderReport } from './report.mjs'
import { verifySamples } from './verify.mjs'

function validate(record) {
  assert.equal(record.schemaVersion, 1, 'Unsupported framework result schema')
  const summary = verifySamples(record)
  assert(!record.independentBatches && !record.sourceRuns, 'Publish one complete run, not merged batches')
  const runners = record.options.frameworks
  for (const name of ['jest', 'vitest', 'rstest'])
    assert(runners.includes(name), `Missing framework: ${name}`)
  assert.deepEqual([...record.options.conditions].sort(), ['cold', 'warm'])
  const expected = [
    ...cases.map((item) => `main/${item.id}/none`),
    ...['backend', 'react'].flatMap((id) => ['none', 'v8', 'istanbul'].map((provider) => `coverage/${id}/${provider}`)),
    'browser/react/none',
  ].sort()
  assert.deepEqual(record.plan.map((g) => `${g.suite}/${g.item.id}/${g.provider}`).sort(), expected, 'README publication requires the complete main, coverage and browser matrix')
  for (const group of record.plan) {
    assert.deepEqual(group.frameworks, selectedFor(group, runners), 'Missing framework in benchmark plan')
    const item = cases.find((item) => item.id === group.item.id)
    assert.equal(group.item.files, item.files, 'Workload file count differs from this checkout')
    assert.equal(group.item.tests, item.tests, 'Workload test count differs from this checkout')
  }
  return summary
}

export function publishedInput(source) {
  const record = JSON.parse(source)
  validate(record)
  if (record.publication) return record
  record.publication = {
    format: 1,
    sourceSha256: createHash('sha256').update(source).digest('hex'),
  }
  if (record.browser) delete record.browser.executable
  for (const sample of record.samples) {
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

function context(record) {
  const summary = {
    measured: record.samples.filter((sample) => sample.phase === 'timed').length,
    warmups: record.samples.filter((sample) => sample.phase === 'warmup').length,
  }
  const source = record.ci
    ? `Source: [GitHub Actions](${record.ci.url}), commit \`${record.ci.sha}\`, attempt ${record.ci.attempt}. Runner ${record.ci.runner}; image ${record.ci.image ?? 'unknown'}.\n\n`
    : ''
  const versions = Object.entries(record.versions).map(([name, version]) => `${name} **${version}**`).join(', ')
  return `${source}Measured ${record.startedAt.slice(0, 10)} (UTC) on ${record.host.cpu}, ${record.host.platform}, Node ${record.host.node}; ${record.host.parallelism} available CPUs. ${versions}; @swc/jest **${record.dependencies['@swc/jest']}**.\n\n${record.options.runs} timed runs per supported case and cache condition; all **${summary.measured} timed samples and ${summary.warmups} warmups passed**. Node compile cache is disabled. Default concurrency; named Rstest pool variants change only the pool. Cold and warm framework caches are reported separately; OS page cache and background load are uncontrolled. Browser mode compares Vitest against default Rstest only.`
}

export function refreshReport({ root, input = join(root, 'frameworks/reports/result.json'), check = false }) {
  const source = readFileSync(input, 'utf8')
  const record = publishedInput(source)
  const rendered = renderReport(record)
  const readme = readFileSync(join(root, 'README.md'), 'utf8')
  const startMarker = '<!-- framework-results:start -->'
  const endMarker = '<!-- framework-results:end -->'
  const start = readme.indexOf(startMarker), end = readme.indexOf(endMarker)
  assert(start >= 0 && end > start && readme.lastIndexOf(startMarker) === start && readme.lastIndexOf(endMarker) === end, 'Missing, duplicate or invalid framework result markers')
  const command = `pnpm compare:frameworks --suites ${record.options.suites.join(',')} --cases ${cases.map((item) => item.id).join(',')} --frameworks ${record.options.frameworks.join(',')} --runs ${record.options.runs}`
  const body = `\n\n${context(record)}\n\nReproduce this matrix using the matching source checkout and pinned dependencies:\n\n\`\`\`sh\n${command}\n\`\`\`\n\n${rendered.tables}\n\n`
  const updates = new Map([
    ['README.md', readme.slice(0, start + startMarker.length) + body + readme.slice(end)],
    ['frameworks/reports/report.md', rendered.markdown],
    ['frameworks/reports/variability.md', rendered.variability],
  ])
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

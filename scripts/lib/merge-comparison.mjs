// Merges the per-app comparison directories of the version coverage CI matrix
// into one comparison that `pnpm report:versions` publishes like a single run.
import assert from 'node:assert/strict'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { comparisonReport } from './report.mjs'

const metaKeys = ['node', 'cpu', 'logicalCpuCount', 'platform', 'osRelease', 'availableParallelism', 'packageManager', 'lockfileSha256', 'measurement']
const hostKeys = ['node', 'cpu', 'logicalCpuCount', 'platform', 'availableParallelism']
const without = (object, ...keys) => Object.fromEntries(Object.entries(object).filter(([key]) => !keys.includes(key)))
const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'))
// Run files are repository-relative paths inside the comparison directory of the
// job that produced them; a downloaded artifact keeps the directory but not the root.
const runFile = (comparisonFile, file) => {
  const marker = `${basename(dirname(comparisonFile))}/`
  return join(dirname(comparisonFile), file.slice(file.indexOf(marker) + marker.length))
}

// Merges the result documents of one side/suite across inputs.
function mergeDocuments(documents, names, runId) {
  const [first] = documents
  const ids = new Map()
  const workloadDependencies = {}
  documents.forEach((doc, index) => {
    const name = names[index]
    assert.equal(doc.status, 'completed', `${name}: ${doc.suite} document is ${doc.status}, not completed`)
    assert.equal(doc.suite, first.suite, `${name}: suite differs`)
    assert.equal(doc.schemaVersion, first.schemaVersion, `${name}: schemaVersion differs`)
    for (const key of metaKeys)
      assert.deepEqual(doc.meta[key], first.meta[key], `${name}: meta.${key} differs from ${names[0]}`)
    assert.equal(doc.meta.git?.commit, first.meta.git?.commit, `${name}: git commit differs from ${names[0]}`)
    assert.equal(doc.meta.runner?.sha256, first.meta.runner?.sha256, `${name}: runner harness differs from ${names[0]}`)
    assert.deepEqual(without(doc.meta.options, 'cases'), without(first.meta.options, 'cases'), `${name}: options differ from ${names[0]}`)
    assert.deepEqual(without(doc.meta.source, 'workloadDependencies'), without(first.meta.source, 'workloadDependencies'), `${name}: source differs from ${names[0]}`)
    for (const [app, hash] of Object.entries(doc.meta.source.workloadDependencies ?? {})) {
      if (app in workloadDependencies) assert.equal(workloadDependencies[app], hash, `${name}: workload dependencies of ${app} differ`)
      workloadDependencies[app] = hash
    }
    for (const row of doc.results) {
      assert(!ids.has(row.id), `Duplicate case ${row.id} in ${name} and ${ids.get(row.id)}`)
      ids.set(row.id, name)
    }
  })
  return {
    ...first,
    runId,
    generations: documents.flatMap((doc) => doc.generations ?? []),
    results: documents.flatMap((doc) => doc.results),
    meta: {
      ...first.meta,
      startedAt: documents.map((doc) => doc.meta.startedAt).sort()[0],
      endedAt: documents.map((doc) => doc.meta.endedAt).sort().at(-1),
      options: { ...first.meta.options, cases: documents.flatMap((doc) => doc.meta.options.cases ?? []) },
      source: { ...first.meta.source, workloadDependencies },
    },
  }
}

// `inputs` are { name, file } pairs naming each comparison.json.
export function mergeComparisons(root, inputs, outDir, now = new Date()) {
  assert(inputs.length > 0, 'No comparisons to merge')
  const records = inputs.map(({ name, file }) => ({ name, file, record: readJson(file) }))
  const [first] = records
  const names = records.map(({ name }) => name)
  assert.equal(new Set(names).size, names.length, 'Duplicate input name')
  for (const { name, record } of records) {
    assert.equal(record.status, 'completed', `${name}: comparison is ${record.status}, not completed`)
    assert.deepEqual(without(record.options, 'cases', 'exclude-cases'), without(first.record.options, 'cases', 'exclude-cases'), `${name}: options differ from ${names[0]}`)
    assert.deepEqual(Object.keys(record.sources), Object.keys(first.record.sources), `${name}: sources differ from ${names[0]}`)
    for (const [side, source] of Object.entries(record.sources))
      assert.deepEqual(
        { kind: source.kind, version: source.version, label: source.label },
        { kind: first.record.sources[side].kind, version: first.record.sources[side].version, label: first.record.sources[side].label },
        `${name}: ${side} source differs from ${names[0]}`,
      )
    for (const key of hostKeys) assert.deepEqual(record.host[key], first.record.host[key], `${name}: host.${key} differs from ${names[0]}`)
    assert.equal(!record.ci, !first.record.ci, `${name}: CI context present in only some inputs`)
    if (record.ci)
      for (const key of ['url', 'sha', 'attempt'])
        assert.equal(record.ci[key], first.record.ci[key], `${name}: ci.${key} differs from ${names[0]}`)
  }
  const label = first.record.options.label
  const stamp = now.toISOString().replace(/[:.]/g, '-')
  const runs = []
  const reports = []
  const documents = []
  for (const suite of [...new Set(first.record.runs.map((run) => run.suite))]) {
    const columns = []
    for (const side of Object.keys(first.record.sources)) {
      const files = records.map(({ name, file, record }) => {
        const run = record.runs.find((run) => run.side === side && run.suite === suite)
        assert(run && run.status === 'completed', `${name}: no completed ${side}/${suite} run`)
        return runFile(file, run.file)
      })
      const document = mergeDocuments(files.map(readJson), names, `${label}-merged-${stamp}`)
      const file = join(outDir, side, 'result.json')
      documents.push({ file, document })
      runs.push({ side, suite, status: 'completed', file: relative(root, file) })
      columns.push({ label: `${side}: ${first.record.sources[side].label}`, files: [relative(root, file)] })
    }
    reports.push({
      title: `Rstest ${suite === 'main' ? 'version' : suite} benchmark`,
      output: relative(root, join(outDir, 'reports', `${suite}.md`)),
      columns,
    })
  }
  const comparison = {
    ...first.record,
    options: { ...first.record.options, cases: records.map(({ record }) => record.options.cases).filter(Boolean).join(',') },
    runs,
    reports,
    schedule: records.flatMap(({ name, record }) => (record.schedule ?? []).map((step) => ({ ...step, mergeSource: name }))),
    startedAt: records.map(({ record }) => record.startedAt).sort()[0],
    endedAt: records.map(({ record }) => record.endedAt).sort().at(-1),
    mergedFrom: records.map(({ name, record }) => ({
      name,
      cases: record.options.cases ?? null,
      ci: record.ci && { job: record.ci.job, runner: record.ci.runner, image: record.ci.image },
      startedAt: record.startedAt,
      endedAt: record.endedAt,
    })),
  }
  const ci = first.record.ci
  if (ci) comparison.ci = { ...ci, job: 'merged', runner: [...new Set(records.map(({ record }) => record.ci.runner))].join(', '), image: [...new Set(records.map(({ record }) => record.ci.image))].join(', ') }
  delete comparison.publication
  delete comparison.error
  // Nothing is written until every input has been validated and merged.
  for (const { file, document } of documents) {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, JSON.stringify(document, null, 2))
  }
  mkdirSync(join(outDir, 'reports'), { recursive: true })
  const summaries = reports.map((spec) => {
    const rendered = comparisonReport(spec, (path) => readJson(resolve(root, path)))
    writeFileSync(resolve(root, spec.output), rendered.markdown)
    return rendered.jobSummary
  })
  writeFileSync(join(outDir, 'summary.md'), summaries.join('\n'))
  writeFileSync(join(outDir, 'reports.config.json'), JSON.stringify({ reports }, null, 2) + '\n')
  writeFileSync(join(outDir, 'comparison.json'), JSON.stringify(comparison, null, 2))
  return comparison
}

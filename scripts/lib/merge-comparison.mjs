// Merges per-unit comparison directories from version or coverage CI matrix jobs
// into one comparison that `pnpm report:versions` publishes like a single run.
import assert from 'node:assert/strict'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { casesFor } from './cases.mjs'
import { comparisonReport } from './report.mjs'

const SUITE_ORDER = ['main', 'scaling', 'barrel', 'pools', 'coverage']
const metaKeys = ['node', 'cpu', 'logicalCpuCount', 'platform', 'osRelease', 'availableParallelism', 'packageManager', 'measurement']
const hostKeys = ['node', 'cpu', 'logicalCpuCount', 'platform', 'availableParallelism', 'lockfileSha256']
const without = (object, ...keys) => Object.fromEntries(Object.entries(object).filter(([key]) => !keys.includes(key)))
const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'))
// Run files are repository-relative paths inside the comparison directory of the
// job that produced them; a downloaded artifact keeps the directory but not the root.
const runFile = (comparisonFile, file) => {
  const marker = `${basename(dirname(comparisonFile))}/`
  return join(dirname(comparisonFile), file.slice(file.indexOf(marker) + marker.length))
}

function canonicalOrder(suite, rows) {
  let order
  try {
    order = new Map(casesFor(suite).map((item, index) => [item.id, index]))
  } catch {
    return rows
  }
  return rows
    .map((row, index) => ({ row, index, rank: order.get(row.id) ?? Number.MAX_SAFE_INTEGER }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map(({ row }) => row)
}

// Merges the result documents of one side/suite across inputs.
function mergeDocuments(documents, names, runId) {
  const [first] = documents
  const ids = new Map()
  const workloadDependencies = {}
  const rstestVersions = {}
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
      for (const [pkg, info] of Object.entries(row.dependencies ?? {})) {
        if (!pkg.startsWith('@rstest/') || !info?.version) continue
        if (pkg in rstestVersions) assert.equal(rstestVersions[pkg], info.version, `${name}: installed ${pkg} version differs`)
        rstestVersions[pkg] = info.version
      }
    }
  })
  const results = canonicalOrder(first.suite, documents.flatMap((doc) => doc.results))
  const lockfiles = [...new Set(documents.map((doc) => doc.meta.lockfileSha256).filter(Boolean))].sort()
  return {
    ...first,
    runId,
    generations: documents.flatMap((doc) => doc.generations ?? []),
    results,
    meta: {
      ...first.meta,
      ...(lockfiles.length ? { lockfileSha256: lockfiles.length === 1 ? lockfiles[0] : lockfiles.join(', ') } : {}),
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
  const sourceKey = (source) => ({
    kind: source.kind,
    version: source.version,
    commit: source.commit,
    requested: source.requested,
    label: source.label,
  })
  for (const { name, record } of records) {
    assert.equal(record.status, 'completed', `${name}: comparison is ${record.status}, not completed`)
    assert.deepEqual(without(record.options, 'suites', 'cases', 'exclude-cases'), without(first.record.options, 'suites', 'cases', 'exclude-cases'), `${name}: options differ from ${names[0]}`)
    assert.deepEqual(Object.keys(record.sources), Object.keys(first.record.sources), `${name}: sources differ from ${names[0]}`)
    for (const [side, source] of Object.entries(record.sources))
      assert.deepEqual(
        sourceKey(source),
        sourceKey(first.record.sources[side]),
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
  const discoveredSuites = [...new Set(records.flatMap(({ record }) => record.runs.map((run) => run.suite)))]
  const suites = [
    ...SUITE_ORDER.filter((suite) => discoveredSuites.includes(suite)),
    ...discoveredSuites.filter((suite) => !SUITE_ORDER.includes(suite)),
  ]
  const runs = []
  const reports = []
  const documents = []
  for (const suite of suites) {
    const suiteRecords = records.filter(({ record }) => record.runs.some((run) => run.suite === suite))
    const suiteNames = suiteRecords.map(({ name }) => name)
    const columns = []
    for (const side of Object.keys(first.record.sources)) {
      const files = suiteRecords.map(({ name, file, record }) => {
        const run = record.runs.find((run) => run.side === side && run.suite === suite)
        assert(run && run.status === 'completed', `${name}: no completed ${side}/${suite} run`)
        return runFile(file, run.file)
      })
      const document = mergeDocuments(files.map(readJson), suiteNames, `${label}-merged-${stamp}`)
      const file = suites.length === 1
        ? join(outDir, side, 'result.json')
        : join(outDir, side, `${suite}.json`)
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
    options: {
      ...first.record.options,
      suites: suites.join(','),
      cases: records.map(({ record }) => record.options.cases).filter(Boolean).join(','),
    },
    runs,
    reports,
    schedule: records.flatMap(({ name, record }) => (record.schedule ?? []).map((step) => ({ ...step, mergeSource: name }))),
    startedAt: records.map(({ record }) => record.startedAt).sort()[0],
    endedAt: records.map(({ record }) => record.endedAt).sort().at(-1),
    mergedFrom: records.map(({ name, record }) => ({
      name,
      suites: [...new Set(record.runs.map((run) => run.suite))],
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

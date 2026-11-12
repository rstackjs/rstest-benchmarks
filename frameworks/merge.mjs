// Merges the per-case framework results of the CI matrix into one result record
// that verify.mjs and the publication path accept like a single run.
import assert from 'node:assert/strict'
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { mergeHosts } from '../scripts/lib/host.mjs'

// `measurement` carries the memory kind: records of different kinds are never mixed.
const identityKeys = ['schemaVersion', 'lockHash', 'harnessHash', 'dependencies', 'versions', 'measurement']
// Runtime and platform must match; machine details (CPU model, core counts, OS build)
// may differ because matrix jobs land on different hosts.
const sameHostKeys = ['node', 'platform']
const varyingHostKeys = ['cpu', 'logicalCpuCount', 'os', 'parallelism']
const optionKeys = ['runs', 'conditions', 'frameworks']

const union = (target, source, what, from) => {
  for (const [key, value] of Object.entries(source ?? {})) {
    if (key in target) assert.deepEqual(target[key], value, `${what} conflict for ${key} (${from})`)
    else target[key] = value
  }
}

export function mergeResults(inputs) {
  assert(inputs.length > 0, 'No results to merge')
  const records = inputs.map(({ name, file }) => ({ name, file, directory: dirname(file), record: JSON.parse(readFileSync(file, 'utf8')) }))
  const [first] = records
  const names = new Set()
  for (const { name, record } of records) {
    assert(!names.has(name), `Duplicate input name: ${name}`)
    names.add(name)
    assert.equal(record.status, 'completed', `${name}: result is ${record.status}, not completed`)
    for (const key of identityKeys)
      assert.deepEqual(record[key], first.record[key], `${name}: ${key} differs from ${first.name}`)
    for (const key of sameHostKeys)
      assert.deepEqual(record.host?.[key], first.record.host?.[key], `${name}: host.${key} differs from ${first.name}`)
    for (const key of optionKeys)
      assert.deepEqual(record.options[key], first.record.options[key], `${name}: options.${key} differs from ${first.name}`)
    assert.equal(!record.ci, !first.record.ci, `${name}: CI context present in only some inputs`)
    if (record.ci)
      for (const key of ['url', 'sha', 'attempt'])
        assert.equal(record.ci[key], first.record.ci[key], `${name}: ci.${key} differs from ${first.name}`)
  }

  const seen = new Map()
  const merged = {
    ...first.record,
    status: 'completed',
    samples: [],
    memorySamples: [],
    cacheActions: [],
    plan: [],
    unsupported: [],
    fixtures: {},
    configHashes: {},
    browser: {},
  }
  merged.host = { ...first.record.host, ...mergeHosts(records.map(({ record }) => record.host), varyingHostKeys) }
  delete merged.error
  delete merged.verification
  delete merged.publication
  const distinct = (key) => [...new Set(records.map(({ record }) => record.ci?.[key]).filter(Boolean))].join(', ')
  if (first.record.ci) merged.ci = { ...first.record.ci, job: 'merged', runner: distinct('runner'), image: distinct('image') }
  const suites = new Set()
  for (const { name, record } of records) {
    for (const group of record.plan) {
      const id = `${group.suite}/${group.item.id}/${group.provider}`
      assert(!seen.has(id), `Duplicate case ${id} in ${name} and ${seen.get(id)}`)
      seen.set(id, name)
      suites.add(group.suite)
    }
    merged.plan.push(...record.plan)
    // Each input ran on its own host; the tag lets verify.mjs check overlap per input.
    for (const key of ['samples', 'memorySamples'])
      merged[key].push(...record[key].map((sample) => ({ ...sample, mergeSource: name })))
    merged.cacheActions.push(...record.cacheActions)
    merged.unsupported.push(...record.unsupported)
    union(merged.fixtures, record.fixtures, 'fixtures', name)
    union(merged.configHashes, record.configHashes, 'configHashes', name)
    union(merged.browser, record.browser, 'browser', name)
  }
  merged.startedAt = records.map(({ record }) => record.startedAt).sort()[0]
  merged.endedAt = records.map(({ record }) => record.endedAt).sort().at(-1)
  merged.options = {
    ...first.record.options,
    suites: ['main', 'coverage', 'browser'].filter((suite) => suites.has(suite)),
    cases: records.map(({ record }) => record.options.cases).filter(Boolean).join(','),
  }
  merged.mergedFrom = records.map(({ name, record }) => ({
    name,
    cases: record.plan.map((group) => `${group.suite}/${group.item.id}/${group.provider}`),
    host: Object.fromEntries(varyingHostKeys.map((key) => [key, record.host?.[key]])),
    ci: record.ci && { job: record.ci.job, runner: record.ci.runner, image: record.ci.image },
    startedAt: record.startedAt,
    endedAt: record.endedAt,
  }))
  return { merged, records }
}

// Writes result.json and the generated source trees that verification fingerprints.
export function writeMerged(outDir, { merged, records }) {
  mkdirSync(outDir, { recursive: true })
  for (const { directory, record } of records)
    for (const group of record.plan)
      for (const framework of group.frameworks) {
        const from = join(directory, 'workspaces', framework, group.item.id, 'src')
        if (existsSync(from)) cpSync(from, join(outDir, 'workspaces', framework, group.item.id, 'src'), { recursive: true })
      }
  writeFileSync(join(outDir, 'result.json'), JSON.stringify(merged, null, 2))
  return join(outDir, 'result.json')
}

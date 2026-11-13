import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { findArtifactFile } from '../lib/ci.mjs'
import { mergeResults, writeMerged } from '../../frameworks/merge.mjs'
import { publishedInput } from '../../frameworks/publication.mjs'
import { verifySamples } from '../../frameworks/verify.mjs'

// Split the committed two-pass samples like the CI matrix.
const full = JSON.parse(readFileSync(new URL('../../frameworks/reports/result.json', import.meta.url), 'utf8'))
delete full.publication
full.ci = { url: 'https://github.com/example/benchmarks/actions/runs/1', sha: 'abc', attempt: 1, job: 'x', runner: 'r', image: 'i' }

const groupId = (group) => `${group.suite}/${group.item.id}/${group.provider}`
function split() {
  const ids = [...new Set(full.plan.map(groupId))]
  return ids.map((id, index) => {
    const part = structuredClone(full)
    part.plan = part.plan.filter((group) => groupId(group) === id)
    part.samples = part.samples.filter((sample) => sample.group === id)
    part.memorySamples = part.memorySamples.filter((sample) => sample.group === id)
    part.unsupported = part.unsupported.filter((entry) => entry.group === id)
    part.cacheActions = index === 0 ? part.cacheActions : []
    part.options.cases = id
    part.options.suites = [part.plan[0].suite]
    // Parallel jobs run at the same time: rewind this part onto the first part's clock.
    return { name: `benchmark-frameworks-case-${id.replaceAll('/', '-')}`, record: part }
  })
}
function overlapParts(parts) {
  const start = (record) => record.samples.map((sample) => sample.startedAt).sort()[0]
  const base = Date.parse(start(parts[0].record))
  for (const { record } of parts) {
    const shift = Date.parse(start(record)) - base
    for (const sample of [...record.samples, ...record.memorySamples])
      for (const key of ['startedAt', 'endedAt']) sample[key] = new Date(Date.parse(sample[key]) - shift).toISOString()
  }
  return parts
}
function write(root, parts) {
  return parts.map(({ name, record }) => {
    const dir = join(root, name, 'ci-frameworks-x')
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'result.json'), JSON.stringify(record))
    return { name, file: findArtifactFile(join(root, name), 'result.json') }
  })
}
const scratch = (t) => {
  const root = mkdtempSync(join(tmpdir(), 'framework-merge-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  return root
}

test('per-case results merge into one record that verifies and publishes', (t) => {
  const parts = overlapParts(split())
  const { merged } = mergeResults(write(scratch(t), parts))
  assert.equal(merged.samples.length, full.samples.length)
  assert.equal(merged.memorySamples.length, full.memorySamples.length)
  assert.deepEqual(merged.plan.map(groupId).sort(), full.plan.map(groupId).sort())
  assert.deepEqual(merged.options.suites, full.options.suites)
  assert.equal(merged.mergedFrom.length, parts.length)
  assert.deepEqual(merged.mergedFrom[0].cases, [groupId(parts[0].record.plan[0])])
  assert.equal(merged.ci.job, 'merged')
  assert.equal(merged.status, 'completed')
  // Verification passes unchanged even though the inputs overlap in time.
  assert.deepEqual(verifySamples(merged), verifySamples(full))
  // Publication accepts the merged record like a single run.
  const published = publishedInput(JSON.stringify(merged), 'merged.json')
  assert.equal(published.mergedFrom.length, parts.length)
  // Without the per-source tags the overlap between parallel jobs is still caught.
  const untagged = structuredClone(merged)
  for (const sample of [...untagged.samples, ...untagged.memorySamples]) delete sample.mergeSource
  assert.throws(() => verifySamples(untagged), /Overlapping benchmark processes/)
})

test('merged results are written with the source trees that verification fingerprints', (t) => {
  const root = scratch(t)
  const parts = split().slice(0, 2)
  for (const { record } of parts) record.fixtures = Object.fromEntries(Object.entries(record.fixtures))
  const inputs = write(root, parts)
  for (const [index, { record }] of parts.entries()) {
    const group = record.plan[0]
    for (const framework of group.frameworks) {
      const src = join(root, parts[index].name, 'ci-frameworks-x', 'workspaces', framework, group.item.id, 'src')
      mkdirSync(src, { recursive: true })
      writeFileSync(join(src, 'a.ts'), 'export {}')
    }
  }
  const out = join(root, 'merged')
  const file = writeMerged(out, mergeResults(inputs))
  assert.equal(JSON.parse(readFileSync(file, 'utf8')).mergedFrom.length, 2)
  assert.equal(readFileSync(join(out, 'workspaces', 'jest', parts[0].record.plan[0].item.id, 'src', 'a.ts'), 'utf8'), 'export {}')
})

test('merging refuses inputs with different identity, duplicates or failed runs', (t) => {
  const root = scratch(t)
  const attempt = (edit) => {
    const parts = split().slice(0, 3)
    edit(parts)
    return () => mergeResults(write(mkdtempSync(join(root, 'case-')), parts))
  }
  assert.throws(attempt((parts) => { parts[1].record.lockHash = 'dead' }), /lockHash differs/)
  assert.throws(attempt((parts) => { parts[1].record.harnessHash = 'dead' }), /harnessHash differs/)
  assert.throws(attempt((parts) => { parts[2].record.dependencies = { ...parts[2].record.dependencies, vitest: '0.0.1' } }), /dependencies differs/)
  assert.throws(attempt((parts) => { parts[1].record.versions = { ...parts[1].record.versions, jest: '0.0.1' } }), /versions differs/)
  assert.throws(attempt((parts) => { parts[1].record.host = { ...parts[1].record.host, cpu: 'other' } }), /host\.cpu differs/)
  assert.throws(attempt((parts) => { parts[1].record.options.runs = 7 }), /options\.runs differs/)
  assert.throws(attempt((parts) => { parts[1].record.status = 'failed' }), /failed, not completed/)
  assert.throws(attempt((parts) => { parts[1].record.ci.sha = 'other' }), /ci\.sha differs/)
  assert.throws(attempt((parts) => { parts[1] = { name: 'duplicate', record: structuredClone(parts[0].record) } }), /Duplicate case/)
  assert.throws(() => mergeResults([]), /No results/)
})

test('rerun cases merge with earlier successful attempts of the same run', (t) => {
  const parts = split()
  parts[1].record.ci.attempt = 2
  const { merged } = mergeResults(write(scratch(t), parts))
  assert.equal(merged.ci.attempt, 2)
  assert.deepEqual(merged.mergedFrom.map(p => p.ci.attempt), parts.map(p => p.record.ci.attempt))
  verifySamples(merged)
})

test('merging refuses different preview sources even with identical package versions', (t) => {
  const parts = split().slice(0, 2)
  parts[0].record.rstestSource = { requested: 'https://pkg.pr.new/@rstest/core@abcdef0' }
  parts[1].record.rstestSource = { requested: 'https://pkg.pr.new/@rstest/core@abcdef1' }
  assert.throws(() => mergeResults(write(scratch(t), parts)), /rstestSource differs/)
})

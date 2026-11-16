import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { fingerprint } from './fixtures.mjs'
import { sameRunOutcome } from '../scripts/lib/process.mjs'
import { assertNoLegacyMemory } from '../scripts/lib/legacy.mjs'

// Counters a memory run must reproduce from its timing run.
export const countKeys = ['files', 'tests', 'passed', 'failed', 'skipped', 'errors']
export function verifySamples(record, source = 'result.json') {
  assertNoLegacyMemory(source, record, true)
  assert.equal(record.status, 'completed')
  assert(record.plan?.length > 0, 'Missing benchmark plan')
  assert(Number.isSafeInteger(record.options.runs) && record.options.runs > 0)
  let expectedSamples = 0
  for (const group of record.plan)
    for (const condition of record.options.conditions) {
      const selected =
        group.frameworks ??
        (group.suite === 'browser'
          ? ['vitest', 'rstest']
          : ['jest', 'vitest', 'rstest'])
      const id = `${group.suite}/${group.item.id}/${group.provider}`
      expectedSamples += selected.length * (record.options.runs + (condition === 'warm' ? 1 : 0))
      for (const framework of selected) {
        const samples = record.samples.filter(
          (s) =>
            s.group === id &&
            s.condition === condition &&
            s.framework === framework,
        )
        const timed = samples.filter((s) => s.phase === 'timed'),
          warmups = samples.filter((s) => s.phase === 'warmup')
        assert.equal(
          timed.length,
          record.options.runs,
          `${id}/${framework}/${condition}`,
        )
        assert.equal(warmups.length, condition === 'warm' ? 1 : 0)
        assert.deepEqual(
          timed.map((s) => s.round),
          Array.from({ length: record.options.runs }, (_, i) => i),
        )
        const memory = record.memorySamples.filter(
          (s) =>
            s.group === id &&
            s.condition === condition &&
            s.framework === framework,
        )
        assert.equal(memory.length, record.options.runs, `memory ${id}/${framework}/${condition}`)
        assert.deepEqual(
          memory.map((s) => s.round),
          Array.from({ length: record.options.runs }, (_, i) => i),
        )
        for (const m of memory) {
          const timing = timed.find((s) => s.round === m.round)
          assert.equal(m.status, 'passed')
          assert.equal(m.exitCode, 0)
          assert(!m.timedOut && !m.interrupted && !m.error)
          assert(Number.isFinite(m.memoryBytes) && m.memoryBytes > 0)
          assert(sameRunOutcome(m, timing, countKeys), 'Memory run differs from its timing run')
        }
        for (const s of samples) {
          assert.equal(s.status, 'passed')
          assert.equal(s.exitCode, 0)
          assert(!s.timedOut && !s.interrupted && !s.error)
          assert(s.memoryBytes === undefined, 'Timing samples must not carry memory')
          assert(Number.isFinite(s.wallMs))
          assert.equal(s.counts.files, group.item.files)
          assert.equal(s.counts.tests, group.item.tests)
          assert.equal(s.counts.passed, group.item.tests)
          assert.equal(s.counts.failed + s.counts.skipped + s.counts.errors, 0)
          assert(s.wallMs > 0)
          assert.equal(s.environment.NODE_DISABLE_COMPILE_CACHE, '1')
          assert.equal(s.environment.NODE_COMPILE_CACHE, null)
          if (group.provider !== 'none') assert(s.coveredFiles.length > 0)
        }
      }
      if (record.options.runs % selected.length === 0) {
        for (let position = 0; position < selected.length; position++)
          for (const framework of selected) {
            const occurrences = Array.from(
              { length: record.options.runs },
              (_, round) =>
                record.samples.filter(
                  (s) =>
                    s.group === id &&
                    s.condition === condition &&
                    s.phase === 'timed' &&
                    s.round === round,
                )[position]?.framework,
            ).filter((f) => f === framework).length
            assert.equal(occurrences, record.options.runs / selected.length)
          }
      }
    }
  assert.equal(record.samples.length, expectedSamples, 'Unexpected or missing samples')
  assert.equal(record.memorySamples.length, expectedSamples - record.samples.filter((s) => s.phase === 'warmup').length, 'Unexpected or missing memory samples')
  // Merged CI results come from parallel jobs on different hosts: processes only
  // have to be sequential within one source run.
  const bySource = Map.groupBy([...record.samples, ...record.memorySamples], (s) => s.mergeSource ?? '')
  for (const group of bySource.values()) {
    const samples = group.sort((a, b) => a.startedAt.localeCompare(b.startedAt))
    for (let i = 1; i < samples.length; i++)
      assert(
        samples[i].startedAt >= samples[i - 1].endedAt,
        'Overlapping benchmark processes',
      )
  }
  return {
    groups: record.plan.length,
    measured: record.samples.filter((s) => s.phase === 'timed').length,
    warmups: record.samples.filter((s) => s.phase === 'warmup').length,
  }
}
export function verify(record, directory, source = join(directory, 'result.json')) {
  const summary = verifySamples(record, source)
  for (const group of record.plan)
    for (const framework of group.frameworks ?? (group.suite === 'browser' ? ['vitest', 'rstest'] : ['jest', 'vitest', 'rstest']))
      assert.equal(
        fingerprint(join(directory, 'workspaces', framework, group.item.id, 'src')),
        record.fixtures[group.item.id].sourceHash,
      )
  return summary
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const directory = resolve(process.argv[2])
  console.log(
    verify(JSON.parse(readFileSync(join(directory, 'result.json'))), directory),
  )
}

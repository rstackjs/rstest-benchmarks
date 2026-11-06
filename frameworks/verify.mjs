import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { fingerprint } from './fixtures.mjs'
export function verify(record, directory) {
  assert.equal(record.status, 'completed')
  for (const group of record.plan)
    for (const condition of record.options.conditions) {
      const selected =
        group.frameworks ??
        (group.suite === 'browser'
          ? ['vitest', 'rstest']
          : ['jest', 'vitest', 'rstest'])
      const id = `${group.suite}/${group.item.id}/${group.provider}`
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
        for (const s of samples) {
          assert.equal(s.status, 'passed')
          assert.equal(s.exitCode, 0)
          assert.equal(s.counts.files, group.item.files)
          assert.equal(s.counts.tests, group.item.tests)
          assert.equal(s.counts.passed, group.item.tests)
          assert.equal(s.counts.failed + s.counts.skipped + s.counts.errors, 0)
          assert(s.rssBytes > 0 && s.wallMs > 0)
          assert.equal(s.environment.NODE_DISABLE_COMPILE_CACHE, '1')
          assert.equal(s.environment.NODE_COMPILE_CACHE, null)
          if (group.provider !== 'none') assert(s.coveredFiles.length > 0)
        }
        assert.equal(
          fingerprint(
            join(directory, 'workspaces', framework, group.item.id, 'src'),
          ),
          record.fixtures[group.item.id].sourceHash,
        )
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
  const samples = record.samples
    .slice()
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt))
  for (let i = 1; i < samples.length; i++)
    assert(
      samples[i].startedAt >= samples[i - 1].endedAt,
      'Overlapping benchmark processes',
    )
  return {
    groups: record.plan.length,
    measured: record.samples.filter((s) => s.phase === 'timed').length,
    warmups: record.samples.filter((s) => s.phase === 'warmup').length,
  }
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

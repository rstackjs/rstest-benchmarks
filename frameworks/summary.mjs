// Compact machine-readable summary of a verified framework result. Readers and
// tools can use it; publication verifies the full result.json, not this file.
import { statistics } from '../scripts/lib/stats.mjs'

const darwinMetric = 'macOS phys_footprint process-tree sum, 50 ms samples'

export function buildSummary(record) {
  const timed = (list) => list.filter((sample) => sample.phase === 'timed')
  const results = []
  for (const condition of record.options.conditions)
    for (const group of [...new Set(record.samples.map((sample) => sample.group))].sort())
      for (const framework of record.options.frameworks) {
        const pick = (list) => timed(list).filter((s) => s.group === group && s.condition === condition && s.framework === framework)
        const samples = pick(record.samples)
        if (!samples.length) continue
        const memory = pick(record.memorySamples ?? [])
        const passed = (list) => list.filter((s) => s.status === 'passed')
        results.push({
          case: group,
          condition,
          framework,
          elapsedMsMedian: statistics(passed(samples).map((s) => s.wallMs)).median,
          memoryBytesMedian: statistics(passed(memory).map((s) => s.memoryBytes)).median,
          timedSamples: samples.length,
          passedTimedSamples: passed(samples).length,
          memorySamples: memory.length,
          passedMemorySamples: passed(memory).length,
        })
      }
  return {
    schemaVersion: 1,
    run: record.ci ? { url: record.ci.url, sha: record.ci.sha, attempt: record.ci.attempt } : null,
    date: record.startedAt.slice(0, 10),
    host: { cpu: record.host.cpu, logicalCpuCount: record.host.logicalCpuCount ?? null, platform: record.host.platform, node: record.host.node },
    memoryMetric: record.measurement?.memory ?? (record.host.platform?.startsWith('darwin') ? darwinMetric : null),
    runsPerCondition: record.options.runs,
    versions: record.versions,
    results,
  }
}

export const summaryJson = (record) => JSON.stringify(buildSummary(record), null, 2) + '\n'

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export const slotVariables = {
  jest: 'JEST_WORKER_ID',
  vitest: 'VITEST_POOL_ID',
  rstest: 'RSTEST_WORKER_ID',
}

export function workerLabel(samples) {
  if (!samples.length) return '—'
  if (samples.every((sample) => sample.workers?.status === 'not-applicable')) return 'Browser mode'
  if (samples.some((sample) => sample.workers?.status !== 'measured')) return 'Not recorded'
  const counts = samples.map((sample) => sample.workers.observedSlots)
  const min = Math.min(...counts), max = Math.max(...counts)
  return `${min === max ? min : `${min}–${max}`}${samples.every((sample) => sample.workers.inProcess) ? ' (in-process)' : ''}`
}

export function readWorkers(directory, slotVariable, runnerPid) {
  const identities = readdirSync(directory).map((file) =>
    JSON.parse(readFileSync(join(directory, file), 'utf8')),
  )
  if (!identities.length || identities.some((worker) =>
    worker.slotVariable !== slotVariable || !/^\d+$/.test(worker.slotId ?? ''),
  )) throw new Error(`Missing runtime worker identity (${slotVariable})`)
  const slotIds = [...new Set(identities.map((worker) => worker.slotId))]
    .sort((a, b) => Number(a) - Number(b))
  return {
    status: 'measured',
    source: slotVariable,
    observedSlots: slotIds.length,
    slotIds,
    processCount: new Set(identities.map((worker) => worker.pid)).size,
    identities,
    ...(runnerPid == null ? {} : {
      inProcess: identities.every((worker) => worker.pid === runnerPid && worker.threadId === 0),
    }),
  }
}

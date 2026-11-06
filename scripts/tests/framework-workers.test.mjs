import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { readWorkers, workerLabel } from '../../frameworks/workers.mjs'

function observations(t, identities) {
  const directory = mkdtempSync(join(tmpdir(), 'benchmark-workers-'))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  identities.forEach((identity, index) => writeFileSync(
    join(directory, `${index}.json`),
    JSON.stringify({ slotVariable: 'RSTEST_WORKER_ID', threadId: 0, ...identity }),
  ))
  return directory
}

test('recycled processes do not inflate observed worker slots', (t) => {
  const directory = observations(t, [
    { slotId: '1', pid: 100 },
    { slotId: '2', pid: 101 },
    { slotId: '1', pid: 102 },
  ])
  const result = readWorkers(directory, 'RSTEST_WORKER_ID')
  assert.equal(result.observedSlots, 2)
  assert.equal(result.processCount, 3)
  assert.deepEqual(result.slotIds, ['1', '2'])
  assert.equal(result.identities.length, 3)
})

test('threads sharing a process count as separate slots and are not in-process execution', (t) => {
  const directory = observations(t, [
    { slotId: '1', pid: 100, threadId: 1 },
    { slotId: '2', pid: 100, threadId: 2 },
  ])
  const result = readWorkers(directory, 'RSTEST_WORKER_ID', 100)
  assert.equal(result.observedSlots, 2)
  assert.equal(result.processCount, 1)
  assert.equal(result.inProcess, false)
})

test('missing or mismatched runtime IDs fail instead of estimating from defaults', (t) => {
  for (const identities of [[], [{ slotId: null, pid: 100 }], [{ slotId: 'unknown', pid: 100 }], [{ slotVariable: 'VITEST_POOL_ID', slotId: '1', pid: 100 }]]) {
    assert.throws(() => readWorkers(observations(t, identities), 'RSTEST_WORKER_ID'), /Missing runtime worker identity/)
  }
})

test('worker labels distinguish ranges, in-process execution, browser mode and historical data', () => {
  const sample = (observedSlots, inProcess = false) => ({ workers: { status: 'measured', observedSlots, inProcess } })
  assert.equal(workerLabel([sample(1), sample(4)]), '1–4')
  assert.equal(workerLabel([sample(1, true)]), '1 (in-process)')
  assert.equal(workerLabel([sample(1, true), sample(1)]), '1')
  assert.equal(workerLabel([{ workers: { status: 'not-applicable' } }]), 'Browser mode')
  assert.equal(workerLabel([{ counts: { settings: { maxWorkers: 8 } } }]), 'Not recorded')
  assert.equal(workerLabel([sample(4), {}]), 'Not recorded')
  assert.equal(workerLabel([]), '—')
})

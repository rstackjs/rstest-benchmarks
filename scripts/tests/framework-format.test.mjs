import assert from 'node:assert/strict'
import { test } from 'node:test'
import { formatDifference, formatElapsed, formatMemory, relativeCells } from '../../frameworks/format.mjs'

const ok = (value) => ({ value, state: 'ok' })
const MiB = 1024 ** 2

test('elapsed time keeps two decimals below 10 s and one decimal from 10 s', () => {
  assert.equal(formatElapsed(1170), '1.17s')
  assert.equal(formatElapsed(9994), '9.99s')
  assert.equal(formatElapsed(9996), '10.0s')
  assert.equal(formatElapsed(12141), '12.1s')
  assert.equal(formatElapsed(30160), '30.2s')
})

test('memory is shown as integer MiB', () => {
  assert.equal(formatMemory(260.76 * MiB), '261')
  assert.equal(formatMemory(1094.01 * MiB), '1094')
  assert.equal(formatMemory(0.4 * MiB), '0')
})

test('differences use unrounded values, integer percent and +<1% for non-ties', () => {
  assert.equal(formatDifference(115, 100), '+15%')
  assert.equal(formatDifference(114.5, 100), '+15%')
  assert.equal(formatDifference(114.4, 100), '+14%')
  assert.equal(formatDifference(100.4, 100), '+<1%')
  assert.equal(formatDifference(1000, 100), '+900%')
})

test('best cells are bold, ties are all best, others show the gap to the best', () => {
  const cells = relativeCells([ok(261 * MiB), ok(300.15 * MiB), ok(261 * MiB), ok(261.1 * MiB)], formatMemory)
  assert.deepEqual(cells, ['**261**', '300 (+15%)', '**261**', '261 (+<1%)'])
  const times = relativeCells([ok(1000), ok(2500), ok(12141)], formatElapsed)
  assert.deepEqual(times, ['**1.00s**', '2.50s (+150%)', '12.1s (+1114%)'])
})

test('missing and incomplete entries are shown as such and never become the best', () => {
  const cells = relativeCells([{ value: 1, state: 'incomplete' }, { value: null, state: 'missing' }, ok(5000), ok(6000)], formatElapsed)
  assert.deepEqual(cells, ['INCOMPLETE', '—', '**5.00s**', '6.00s (+20%)'])
  assert.deepEqual(relativeCells([{ value: null, state: 'missing' }], formatElapsed), ['—'])
})

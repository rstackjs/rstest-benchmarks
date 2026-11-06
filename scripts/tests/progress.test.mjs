import test from 'node:test'
import assert from 'node:assert/strict'
import { casesFor } from '../lib/cases.mjs'
import { selectedFor } from '../../frameworks/order.mjs'
import { createProgress, frameworkRunCounts, versionRunCounts } from '../lib/progress.mjs'

test('framework total accounts for cold/warm, repeats and browser support', () => {
  const requested = ['jest', 'vitest', 'vitest-vmForks', 'rstest', 'rstest-vmForks']
  const groups = [{ suite: 'main' }, { suite: 'coverage' }, { suite: 'browser' }]
    .map((group) => ({ ...group, frameworks: selectedFor(group, requested) }))
  assert.deepEqual(frameworkRunCounts(groups, ['cold', 'warm'], 6), { timed: 144, warmup: 12 })
  assert.deepEqual(frameworkRunCounts(groups, ['cold'], 1), { timed: 12, warmup: 0 })
  assert.deepEqual(frameworkRunCounts(groups, ['warm'], 1), { timed: 12, warmup: 12 })
})

test('version total excludes unsupported VM pools and Vue browser', () => {
  const items = [...casesFor('main'), ...casesFor('pools', { scales: ['small'] })]
  assert.deepEqual(versionRunCounts(items, { runs: 6, warmup: 1 }, () => '0.11.0'), { timed: 66, warmup: 11 })
  assert.deepEqual(versionRunCounts(items, { runs: 6, warmup: 0 }, () => '0.12.6'), { timed: 84, warmup: 0 })
})

test('shared progress retains one counter across sides and suites, with matching start/end numbers', () => {
  const logs = []
  const progress = createProgress({ timed: 2, warmup: 1 }, (line) => logs.push(line))
  progress.start('baseline/main warmup')('passed')
  progress.start('candidate/main timed')('passed')
  progress.start('baseline/coverage timed')('failed')
  assert.match(logs[0], /3 executions: 2 timed \+ 1 warmup/)
  assert.deepEqual(logs.slice(1), [
    '[1/3] baseline/main warmup: starting',
    '[1/3] baseline/main warmup: passed',
    '[2/3] candidate/main timed: starting',
    '[2/3] candidate/main timed: passed',
    '[3/3] baseline/coverage timed: starting',
    '[3/3] baseline/coverage timed: failed',
  ])
})

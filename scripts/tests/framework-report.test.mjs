import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { report } from '../../frameworks/report.mjs'

function render(t, samples) {
  const directory = mkdtempSync(join(tmpdir(), 'framework-report-'))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  report(
    {
      status: 'completed',
      startedAt: '2026-11-04T00:00:00Z',
      host: { node: 'v24', cpu: 'fixture', platform: 'test' },
      versions: { jest: 'test', vitest: 'test', rstest: 'test' },
      options: { runs: 2, conditions: ['warm'] },
      samples,
    },
    directory,
  )
  return readFileSync(join(directory, 'report.md'), 'utf8')
}

function samples(framework, times, overrides = {}) {
  return times.map((wallMs) => ({
    group: 'main/startup/none',
    condition: 'warm',
    framework,
    phase: 'timed',
    status: 'passed',
    wallMs,
    rssBytes: 100 * 1024 ** 2,
    ...overrides,
  }))
}

test('report excludes warmups and keeps RSS separate from elapsed time', (t) => {
  const text = render(t, [
    ...samples('jest', [1000, 3000]),
    ...samples('vitest', [500, 1500]),
    ...samples('vitest', [90000], { phase: 'warmup' }),
  ])
  assert.match(text, /\| main\/startup\/none \| 2\.000s \| 🥇 1\.000s \(-50\.0%\)/)
  assert.match(text, /\| main\/startup\/none \| 🥇 100\.0 \| 🥇 100\.0 \(\+0\.0%\)/)
})

test('failed baseline is not silently replaced by another framework', (t) => {
  const text = render(t, [
    ...samples('jest', [1000]),
    ...samples('jest', [1000], { status: 'failed' }),
    ...samples('vitest', [1000, 1000]),
    ...samples('rstest', [500, 500]),
  ])
  assert.match(
    text,
    /\| main\/startup\/none \| INCOMPLETE \| 1\.000s \| 🥇 0\.500s \|/,
  )
  assert.doesNotMatch(text, /-50\.0%/)
})

test('browser comparison uses Vitest as baseline and leaves Jest unavailable', (t) => {
  const text = render(t, [
    ...samples('vitest', [1000, 1000], { group: 'browser/react/none' }),
    ...samples('rstest', [1500, 1500], { group: 'browser/react/none' }),
  ])
  assert.match(
    text,
    /\| browser\/react\/none \| — \| 🥇 1\.000s \| 1\.500s \(\+50\.0%\)/,
  )
})

test('phase timings retain reporter durations and exclude warmup measurements', (t) => {
  const text = render(t, [
    ...samples('rstest', [1000, 1200], {
      counts: { duration: { buildTime: 100, testTime: 800, totalTime: 900 } },
    }),
    ...samples('rstest', [90000], {
      phase: 'warmup',
      counts: { duration: { buildTime: 9000, testTime: 80000, totalTime: 89000 } },
    }),
  ])
  assert.match(text, /\| warm \/ main\/startup\/none \| Rstest \| 2 \| 0\.100 \| 0\.800 \| 1\.100 \|/)
})

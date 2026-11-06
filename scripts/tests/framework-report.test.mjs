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
  const detail = readFileSync(join(directory, 'variability.md'), 'utf8')
  assert.match(detail, /Time SD/)
  const text = readFileSync(join(directory, 'report.md'), 'utf8')
  assert.doesNotMatch(text, /CV > 10%|high variation|\| Notes \||Δ|%/)
  return text
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
  assert.match(text, /\| main\/startup\/none \| 🥈 2\.00s \| 🥇 1\.00s \|/)
  assert.match(text, /\| main\/startup\/none \| 🥇 100\.00 \| 🥇 100\.00 \|/)
})

test('incomplete results are excluded from rankings', (t) => {
  const text = render(t, [
    ...samples('jest', [1000]),
    ...samples('jest', [1000], { status: 'failed' }),
    ...samples('vitest', [1000, 1000]),
    ...samples('rstest', [500, 500]),
  ])
  assert.match(
    text,
    /\| main\/startup\/none \| INCOMPLETE \| 🥈 1\.00s \| 🥇 0\.50s \|/,
  )
})

test('browser comparison ranks available frameworks and leaves Jest unavailable', (t) => {
  const text = render(t, [
    ...samples('vitest', [1000, 1000], { group: 'browser/react/none' }),
    ...samples('rstest', [1500, 1500], { group: 'browser/react/none' }),
  ])
  assert.match(text, /\| Case \| Jest \+ SWC \| Vitest \| Rstest \|/)
  assert.match(
    text,
    /\| browser\/react\/none \| — \| 🥇 1\.00s \| 🥈 1\.50s \|/,
  )
})

test('medals use unrounded medians and share second place for exact ties', (t) => {
  const text = render(t, [
    ...samples('jest', [1000.1, 1000.1], { rssBytes: 300 * 1024 ** 2 }),
    ...samples('vitest', [1000.2, 1000.2], { rssBytes: 200 * 1024 ** 2 }),
    ...samples('rstest', [1000.2, 1000.2]),
  ])
  assert.match(text, /\| main\/startup\/none \| 🥇 1\.00s \| 🥈 1\.00s \| 🥈 1\.00s \|/)
  assert.match(text, /\| main\/startup\/none \| 300\.00 \| 🥈 200\.00 \| 🥇 100\.00 \|/)
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
  assert.match(text, /\| warm \/ main\/startup\/none \| Rstest \| 2 \| 0\.10 \| 0\.80 \| 1\.10 \|/)
})

import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { report } from '../../frameworks/report.mjs'

function render(t, samples, host = { node: 'v24', cpu: 'fixture', platform: 'test' }) {
  const directory = mkdtempSync(join(tmpdir(), 'framework-report-'))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  report(
    {
      status: 'completed',
      startedAt: '2026-11-04T00:00:00Z',
      host,
      versions: { jest: 'test', vitest: 'test', rstest: 'test' },
      options: { runs: 2, conditions: ['warm'] },
      // Memory comes from the separate memory pass, elapsed time from timing.
      samples: samples.map(({ memoryBytes, ...sample }) => sample),
      memorySamples: samples
        .filter((sample) => sample.phase === 'timed' && sample.memoryBytes != null)
        .map(({ wallMs, ...sample }) => sample),
    },
    directory,
  )
  const detail = readFileSync(join(directory, 'variability.md'), 'utf8')
  assert.match(detail, /Time SD/)
  const text = readFileSync(join(directory, 'report.md'), 'utf8')
  const summary = readFileSync(join(directory, 'summary.md'), 'utf8')
  assert.doesNotMatch(summary, /## Rstest phase timings|\| Build \| Runtime \|/)
  assert.match(summary, /### Elapsed time/)
  assert.match(summary, /### Memory \(MiB, process-tree footprint peak\)/)
  assert.match(summary, /logical CPUs:/)
  assert.match(summary, /## Observed test workers/)
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
    memoryBytes: 100 * 1024 ** 2,
    ...overrides,
  }))
}

test('report distinguishes processor model, logical CPUs and available parallelism', (t) => {
  const text = render(t, [], {
    node: 'v24', cpu: 'EPYC 80-Core Processor', platform: 'linux x64',
    logicalCpuCount: 8, parallelism: 2,
  })
  assert.match(text, /EPYC 80-Core Processor; logical CPUs: 8; available parallelism: 2/)
  const historical = render(t, [], {
    node: 'v24', cpu: 'EPYC 80-Core Processor', platform: 'linux x64', parallelism: 2,
  })
  assert.match(historical, /logical CPUs: not recorded; available parallelism: 2/)
})

test('report excludes warmups and keeps memory separate from elapsed time', (t) => {
  const text = render(t, [
    ...samples('jest', [1000, 3000]),
    ...samples('vitest', [500, 1500]),
    ...samples('vitest', [90000], { phase: 'warmup' }),
  ])
  assert.match(text, /\| startup \| 🥈 2\.00s \| 🥇 1\.00s \|/)
  assert.match(text, /\| startup \| 🥇 100\.00 \| 🥇 100\.00 \|/)
})

test('worker summary uses measured slots from timed runs, not CPU or configured limits', (t) => {
  const text = render(t, [
    ...samples('jest', [1000, 1000], { counts: { settings: { maxWorkers: 99 } } }),
    ...samples('rstest', [1000], { workers: { status: 'measured', observedSlots: 2 } }),
    ...samples('rstest', [1000], { condition: 'cold', workers: { status: 'measured', observedSlots: 3 } }),
    ...samples('rstest', [1000], { phase: 'warmup', workers: { status: 'measured', observedSlots: 99 } }),
  ])
  assert.match(text, /\| startup \| Not recorded \| — \| 2–3 \|/)
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
    /\| startup \| INCOMPLETE \| 🥈 1\.00s \| 🥇 0\.50s \|/,
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
    /\| react \(browser\) \| — \| 🥇 1\.00s \| 🥈 1\.50s \|/,
  )
})

test('medals use unrounded medians and share second place for exact ties', (t) => {
  const text = render(t, [
    ...samples('jest', [1000.1, 1000.1], { memoryBytes: 300 * 1024 ** 2 }),
    ...samples('vitest', [1000.2, 1000.2], { memoryBytes: 200 * 1024 ** 2 }),
    ...samples('rstest', [1000.2, 1000.2]),
  ])
  assert.match(text, /\| startup \| 🥇 1\.00s \| 🥈 1\.00s \| 🥈 1\.00s \|/)
  assert.match(text, /\| startup \| 300\.00 \| 🥈 200\.00 \| 🥇 100\.00 \|/)
})

test('case labels omit internal suite IDs while distinguishing browser and coverage', (t) => {
  const groups = [
    ['main/minimal-node/none', 'minimal-node'],
    ['main/react/none', 'react'],
    ['browser/react/none', 'react (browser)'],
    ['coverage/react/none', 'react (coverage off)'],
    ['coverage/react/v8', 'react (v8)'],
    ['coverage/react/istanbul', 'react (istanbul)'],
  ]
  const input = groups.flatMap(([group]) => samples('rstest', [1000, 1000], { group }))
  const text = render(t, input)
  for (const [group, label] of groups) {
    assert(text.includes(`| ${label} |`))
    assert(!text.includes(group))
  }
  assert.equal(input[0].group, 'main/minimal-node/none')
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
  assert.match(text, /\| warm \/ startup \| Rstest \| 2 \| 0\.10 \| 0\.80 \| 1\.10 \|/)
})

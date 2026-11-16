import assert from 'node:assert/strict'
import { test } from 'node:test'
import { heatFill, longestBars, renderChart, renderTable } from '../../frameworks/charts.mjs'
import { buildSummary } from '../../frameworks/summary.mjs'
import { readFileSync } from 'node:fs'

const groups = () => [
  { name: 'Barrel <1>', bars: [
    { framework: 'jest', label: 'Jest + SWC', value: 12000, text: '12.00s' },
    { framework: 'rstest', label: 'Rstest', value: 1500, text: '1.50s' },
    { framework: 'vitest', label: 'Vitest', value: null, text: '—' },
  ] },
  { name: 'Tiny', bars: [
    { framework: 'jest', label: 'Jest + SWC', value: 0.5, text: '0.50s' },
    { framework: 'rstest', label: 'Rstest', value: 0.25, text: '0.25s' },
    { framework: 'vitest', label: 'Vitest', value: 0.4, text: '0.40s' },
  ] },
]

test('chart rendering is deterministic; group length follows the largest value on a log scale', () => {
  const first = renderChart({ title: 'Cold elapsed', groups: groups() })
  assert.equal(renderChart({ title: 'Cold elapsed', groups: groups() }), first)
  assert.match(first, /^<svg xmlns=/)
  assert.match(first, /Barrel &lt;1&gt;/)
  assert.match(first, /fill="#848d97"/)
  // Group maxima are 12000 and 0.5: the smaller case gets 35% of the full width,
  // the larger one the full 670px; bars are linear inside a group.
  assert.deepEqual(longestBars(groups()).map((n) => n.toFixed(2)), ['670.00', '234.50'])
  assert.match(first, /width="670.00"/)
  assert.match(first, /width="234.50"/)
  assert.match(first, /width="83.75"/) // 1500 / 12000 * 670
  assert.match(first, /width="187.60"/) // 0.4 / 0.5 * 234.5
  // A missing value draws a dash instead of a bar.
  assert.match(first, />—<\/text>/)
  // Bars and the legend start at the left edge; case names sit above their bars.
  assert.match(first, /<rect x="0" y="0" width="10"/)
  assert.match(first, /<text x="0" y="\d+(\.\d+)?" dominant-baseline="central" fill="#848d97" font-weight="600"[^>]*>Barrel &lt;1&gt;/)
  assert.doesNotMatch(first, /NaN|undefined/)
})

test('longest-bar lengths use a log scale between 35% and 100% of the width', () => {
  const group = (value) => ({ name: 'g', bars: [{ framework: 'jest', label: 'Jest', value, text: '' }] })
  const [small, middle, large] = longestBars([group(1), group(10), group(100)])
  assert.equal(small, 670 * 0.35)
  assert.equal(large, 670)
  assert(Math.abs(middle - 670 * (0.35 + 0.65 / 2)) < 1e-9)
  assert.deepEqual(longestBars([group(5), group(5)]), [670, 670])
})

test('summary lists medians per case, condition and framework', () => {
  const record = JSON.parse(readFileSync(new URL('../../frameworks/reports/result.json', import.meta.url), 'utf8'))
  const summary = buildSummary(record)
  assert.equal(summary.schemaVersion, 1)
  assert.equal(summary.run.url, record.ci.url)
  // 8 main cases x 5 frameworks + browser x 2 frameworks, for two cache conditions.
  assert.equal(summary.results.length, 2 * (8 * 5 + 2))
  const row = summary.results.find((r) => r.case === 'main/barrel/none' && r.condition === 'cold' && r.framework === 'rstest')
  assert.equal(row.timedSamples, 5)
  assert(row.elapsedMsMedian > 0 && row.memoryBytesMedian > 0)
})

test('table rendering is deterministic and tints cells by their gap to the best', () => {
  const cell = (text, diff, gap, best = false) => ({ state: 'ok', text, diff, gap, best })
  const input = () => ({
    title: 'Elapsed time, cold cache',
    columns: [{ framework: 'jest', label: 'Jest + SWC' }, { framework: 'rstest', label: 'Rstest' }, { framework: 'vitest', label: 'Vitest' }],
    rows: [
      { name: 'Backend <1>', cells: [cell('1.03s', null, 0, true), cell('2.06s', '+100%', 1), cell('9.00s', '+773%', 7.73)] },
      { name: 'Tie', cells: [cell('1.00s', null, 0, true), cell('1.00s', null, 0, true), { state: 'missing', text: '—', best: false, diff: null, gap: 0 }] },
    ],
  })
  const svg = renderTable(input())
  assert.equal(renderTable(input()), svg)
  assert.match(svg, /^<svg xmlns=.* width="760"/)
  assert.match(svg, /Backend &lt;1&gt;/)
  // Best cells: strongest green with a champion marker; ties are all best (3 best cells).
  assert.equal(svg.match(/fill="#2da44e" fill-opacity="0.450"/g).length, 3)
  assert.equal(svg.match(/🏆/g).length, 3)
  assert.equal(svg.match(/font-weight="700"/g).length, 3)
  // Values and gaps sit in two sub-columns: every value ends at one x, every gap at another.
  const cellRight = (index) => 130 + (index + 1) * ((760 - 130) / 3)
  assert(svg.includes(`<text x="${(cellRight(1) - 60).toFixed(2)}"`)) // value of the 2nd column
  assert(svg.includes(`<text x="${(cellRight(1) - 10).toFixed(2)}"`)) // gap of the 2nd column
  // Differences appear in the muted column; missing cells have no tint and no difference.
  assert.match(svg, /font-size="10"[^>]*>\+773%</)
  assert.match(svg, /tabular-nums/)
  assert.doesNotMatch(svg, /NaN|undefined/)
  // The first column and the header start at x = 0.
  assert.match(svg, /<text x="0" y="45" /)
})

test('heat scale moves from green through amber to red as the gap grows, and stops at +300%', () => {
  const gaps = [0, 0.05, 0.15, 0.5, 1, 2, 3, 10]
  const fills = gaps.map(heatFill)
  for (let i = 1; i < fills.length; i++) {
    assert(fills[i].color[0] >= fills[i - 1].color[0], 'red channel never decreases')
    assert(fills[i].color[1] <= fills[i - 1].color[1] + 1e-9, 'green channel never increases')
  }
  assert.deepEqual(fills[6], fills[7]) // capped at +300%
  assert.deepEqual(heatFill(0).color, [45, 164, 78])
  assert.deepEqual(heatFill(3).color, [229, 83, 75])
})

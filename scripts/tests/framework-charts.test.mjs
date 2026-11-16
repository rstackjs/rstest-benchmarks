import assert from 'node:assert/strict'
import { test } from 'node:test'
import { heatColor, heatEndpoints, heatFullGap, longestBars, renderChart, renderTable } from '../../frameworks/charts.mjs'
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

const cell = (text, diff, gap, best = false) => ({ state: 'ok', text, diff, gap, best })
const tableInput = (rows) => ({
  title: 'Elapsed time, cold cache',
  columns: [{ framework: 'jest', label: 'Jest + SWC' }, { framework: 'rstest', label: 'Rstest' }, { framework: 'vitest', label: 'Vitest' }],
  rows,
})
const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
const fills = (svg) => [...svg.matchAll(/<rect x="([\d.]+)" y="(\d+)" width="([\d.]+)" height="(\d+)"(?: rx="3")? fill="(#[0-9a-f]{6})" fill-opacity="([\d.]+)"/g)]
  .map((m) => ({ x: Number(m[1]), y: Number(m[2]), width: Number(m[3]), height: Number(m[4]), color: m[5], opacity: Number(m[6]) }))

test('table rendering is deterministic, with light and dark text variants and the same fills', () => {
  const rows = () => [
    { name: 'Backend <1>', cells: [cell('1.03s', null, 0, true), cell('2.06s', '+100%', 1), cell('9.00s', '+773%', 7.73)] },
    { name: 'Tie', cells: [cell('1.00s', null, 0, true), cell('1.00s', null, 0, true), { state: 'missing', text: '—', best: false, diff: null, gap: 0 }] },
  ]
  const light = renderTable(tableInput(rows()))
  assert.equal(renderTable(tableInput(rows())), light)
  const dark = renderTable({ ...tableInput(rows()), theme: 'dark' })
  assert.notEqual(dark, light)
  assert.deepEqual(fills(dark), fills(light))
  assert.match(light, /fill="#1f2328"/)
  assert.match(dark, /fill="#f0f6fc"/)
  assert.match(light, /^<svg xmlns=.* width="760"/)
  assert.match(light, /Backend &lt;1&gt;/)
  assert.equal(light.match(/🏆/g).length, 3) // ties are all best
  assert.equal(light.match(/font-weight="700"/g).length, 3)
  assert.match(light, /tabular-nums/)
  assert.doesNotMatch(light, /NaN|undefined/)
})

test('values and gaps are right-aligned in two sub-columns of every cell', () => {
  const rows = [
    { name: 'A', cells: [cell('1.03s', null, 0, true), cell('2.06s', '+100%', 1), cell('9.00s', '+773%', 7.73)] },
    { name: 'B', cells: [cell('12.1s', '+15%', 0.15), cell('1.05s', null, 0, true), cell('3.00s', '+186%', 1.86)] },
  ]
  const svg = renderTable(tableInput(rows))
  const right = (index) => 130 + (index + 1) * ((760 - 130) / 3)
  for (let index = 0; index < 3; index++) {
    // Every value in a column ends at one x; every gap at another.
    const valueX = (right(index) - 10 - 54).toFixed(2), gapX = (right(index) - 10).toFixed(2)
    const values = [...svg.matchAll(new RegExp(`<text x="${valueX}" y="(\\d+)"`, 'g'))]
    assert.equal(values.length, 2)
    assert.equal(svg.match(new RegExp(`<text x="${gapX}" y="\\d+"[^>]*font-size="10"`, 'g'))?.length, index === 0 ? 1 : index === 1 ? 1 : 2)
  }
  // The first column and the header labels start at fixed offsets from their column edge.
  assert.match(svg, /<text x="0" y="45" /)
  assert.equal(svg.match(/<circle cx="(\d+)\.00"/g).length, 3)
  const labels = [...svg.matchAll(/<circle cx="([\d.]+)" cy="15" r="4.5" fill="#[0-9a-f]+"\/>\n<text x="([\d.]+)"/g)].map((m) => Number(m[2]) - Number(m[1]))
  assert.deepEqual(labels, [10, 10, 10])
})

test('cells are separated by a gap and have rounded corners; there are no separator lines', () => {
  const rows = [{ name: 'A', cells: [cell('1s', null, 0, true), cell('2s', '+100%', 1), cell('3s', '+200%', 2)] }, { name: 'B', cells: [cell('1s', null, 0, true), cell('1s', null, 0, true), cell('1s', null, 0, true)] }]
  const svg = renderTable(tableInput(rows))
  const all = fills(svg)
  assert.equal(all.length, 6)
  const columnWidth = (760 - 130) / 3
  all.slice(0, 3).forEach((fill, index) => {
    assert.equal(fill.x, 130 + index * columnWidth + 3)
    assert.equal(fill.width, columnWidth - 6)
    assert.equal(fill.height, 24)
  })
  assert.equal(all[1].x - (all[0].x + all[0].width), 6) // 6 px between neighbouring cells
  assert.equal(all[3].y - (all[0].y + all[0].height), 6) // and between rows
  assert.equal(svg.match(/<rect [^>]*rx="3"/g).length, 6)
  assert.doesNotMatch(svg, /<line /)
  assert.doesNotMatch(svg, /stroke/)
})

test('fixed scale: 0% is green, +100% or more is full red, monotonic in between; ties are green', () => {
  assert.equal(heatFullGap, 1)
  assert.equal(heatColor(0), heatEndpoints.best)
  assert.equal(heatColor(1), heatEndpoints.worst)
  const gaps = [0, 0.05, 0.15, 0.5, 1, 2, 10]
  const rows = [
    { name: 'A', cells: gaps.map((gap) => cell(`${gap}`, gap ? `+${gap}` : null, gap, gap === 0)) },
    // The scale is the same in every row: a row whose worst gap is only +20% never turns fully red.
    { name: 'B', cells: [cell('1', null, 0, true), cell('1.2', '+20%', 0.2), cell('1', null, 0, true), cell('1.1', '+10%', 0.1), cell('1', null, 0, true), cell('1', null, 0, true), cell('1', null, 0, true)] },
  ]
  const svg = renderTable({ ...tableInput(rows), columns: gaps.map((_, i) => ({ framework: 'jest', label: `c${i}` })) })
  const colors = fills(svg).map((fill) => fill.color)
  const first = colors.slice(0, 7)
  assert.equal(first[0], heatEndpoints.best)
  assert.equal(first[4], heatEndpoints.worst) // +100%
  assert.equal(first[5], heatEndpoints.worst) // +200%, capped
  assert.equal(first[6], heatEndpoints.worst)
  assert.equal(new Set(first.slice(0, 5)).size, 5) // continuous below the cap
  const red = first.map((color) => hexToRgb(color)[0])
  for (let i = 1; i < 5; i++) assert(red[i] >= red[i - 1] - 1)
  const second = colors.slice(7)
  assert.equal(second[0], heatEndpoints.best)
  assert.equal(second[2], heatEndpoints.best) // ties stay green
  assert.notEqual(second[1], heatEndpoints.worst) // +20% in another row is not full red
  assert.equal(second[1], heatColor(0.2))
  const [r, g] = hexToRgb(heatColor(0.5))
  assert(r > 150 && g > 100, `midpoint ${heatColor(0.5)} should be amber/yellow`)
})

test('summary lists medians per case, condition and framework', () => {
  const record = JSON.parse(readFileSync(new URL('../../frameworks/reports/result.json', import.meta.url), 'utf8'))
  const summary = buildSummary(record)
  assert.equal(summary.schemaVersion, 1)
  assert.equal(summary.run.url, record.ci.url)
  assert.equal(summary.results.length, 2 * (8 * 5 + 2))
  const row = summary.results.find((r) => r.case === 'main/barrel/none' && r.condition === 'cold' && r.framework === 'rstest')
  assert.equal(row.timedSamples, 5)
  assert(row.elapsedMsMedian > 0 && row.memoryBytesMedian > 0)
})

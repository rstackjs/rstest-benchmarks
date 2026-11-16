import assert from 'node:assert/strict'
import { test } from 'node:test'
import { renderChart } from '../../frameworks/charts.mjs'
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

test('chart rendering is deterministic and scales each group to its own maximum', () => {
  const first = renderChart({ title: 'Cold elapsed', groups: groups() })
  assert.equal(renderChart({ title: 'Cold elapsed', groups: groups() }), first)
  assert.match(first, /^<svg xmlns=/)
  assert.match(first, /Barrel &lt;1&gt;/)
  assert.match(first, /fill="#848d97"/)
  // The largest bar in every group is the full bar width (670px).
  assert.equal(first.match(/width="670.00"/g).length, 2)
  // A missing value draws a dash instead of a bar.
  assert.match(first, />—<\/text>/)
  // Bars and the legend start at the left edge; case names sit above their bars.
  assert.match(first, /<rect x="0" y="0" width="10"/)
  assert.match(first, /<text x="0" y="\d+(\.\d+)?" dominant-baseline="central" fill="#848d97" font-weight="600"[^>]*>Barrel &lt;1&gt;/)
  assert.doesNotMatch(first, /NaN|undefined/)
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

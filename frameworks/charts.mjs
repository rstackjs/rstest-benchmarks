// Deterministic SVG bar charts for the framework README. Text uses #848d97 so it
// is readable on GitHub's light and dark themes; bars use mid-tone colors.
const palette = {
  jest: '#d9644f',
  'jest-babel': '#e8a094',
  vitest: '#6aa84f',
  'vitest-vmForks': '#b3cc57',
  rstest: '#3d7bf0',
  'rstest-vmForks': '#8fb5f7',
  'rstest-vmThreads': '#6a5acd',
}
const fallbackColor = '#999999'
const textColor = '#848d97'
const font = "font-family=\"-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif\" font-size=\"11\""

const width = 760
const labelHeight = 16
const minFrac = 0.35 // longest bar of the smallest case, as a fraction of barMax
const barMax = 670 // leaves room for the longest value label after the longest bar
const rowHeight = 10
const rowGap = 3
const groupGap = 28
const top = 28

const escape = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const fixed = (number) => number.toFixed(2)

// Longest-bar length of each group. It grows with the group's largest value on a
// log scale, from minFrac * barMax (smallest group) to barMax (largest group).
export function longestBars(groups) {
  const maxima = groups.map((group) => Math.max(...group.bars.filter((bar) => bar.value != null).map((bar) => bar.value), 0))
  const positive = maxima.filter((value) => value > 0)
  const lo = Math.min(...positive), hi = Math.max(...positive)
  return maxima.map((value) => {
    if (!(value > 0)) return barMax
    const t = hi > lo ? Math.log(value / lo) / Math.log(hi / lo) : 1
    return barMax * (minFrac + (1 - minFrac) * t)
  })
}

// `groups`: [{ name, bars: [{ framework, label, value, text }] }]. Bars are linear
// within a group, scaled to the group's longest-bar length.
export function renderChart({ title, groups }) {
  const frameworks = []
  for (const group of groups) for (const bar of group.bars) if (!frameworks.some((f) => f.framework === bar.framework)) frameworks.push(bar)
  const parts = []
  let legendX = 0
  for (const { framework, label } of frameworks) {
    parts.push(`<rect x="${legendX}" y="0" width="10" height="10" rx="2" fill="${palette[framework] ?? fallbackColor}"/>`)
    parts.push(`<text x="${legendX + 15}" y="5" dominant-baseline="central" fill="${textColor}" ${font}>${escape(label)}</text>`)
    legendX += 15 + label.length * 7 + 18
  }
  const longest = longestBars(groups)
  let y = top
  for (const [index, group] of groups.entries()) {
    const max = Math.max(...group.bars.filter((bar) => bar.value != null).map((bar) => bar.value), 0)
    parts.push(`<text x="0" y="${y + labelHeight / 2}" dominant-baseline="central" fill="${textColor}" font-weight="600" ${font}>${escape(group.name)}</text>`)
    y += labelHeight
    for (const bar of group.bars) {
      const barY = y
      if (bar.value == null) {
        parts.push(`<text x="0" y="${barY + rowHeight / 2}" dominant-baseline="central" fill="${textColor}" ${font}>—</text>`)
      } else {
        const length = Math.max(2, max > 0 ? (bar.value / max) * longest[index] : 2)
        parts.push(`<rect x="0" y="${barY}" width="${fixed(length)}" height="${rowHeight}" rx="2" fill="${palette[bar.framework] ?? fallbackColor}"/>`)
        parts.push(`<text x="${fixed(length + 6)}" y="${barY + rowHeight / 2}" dominant-baseline="central" fill="${textColor}" ${font}>${escape(bar.text)}</text>`)
      }
      y += rowHeight + rowGap
    }
    y += groupGap - rowGap
  }
  const total = y - groupGap + rowGap
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${total}" viewBox="0 0 ${width} ${total}" role="img" aria-label="${escape(title)}">\n<title>${escape(title)}</title>\n${parts.join('\n')}\n</svg>\n`
}

// ---- SVG result tables ----
const tableWidth = 760
const nameColumn = 130
const rowTableHeight = 30
const gapColumn = 50 // room for "+1114%" in the muted difference column
// Values need one color that reads on both light and dark GitHub themes.
const valueColor = '#6e7781'
// Heat scale for the gap to the row's best: strongest green for the best cell, then
// green -> amber -> red over a log-scaled gap, capped at +300%. Fills are translucent so
// the same SVG works on light and dark backgrounds.
const bestFill = { color: [45, 164, 78], opacity: 0.45 }
const heatStops = [
  { color: [45, 164, 78], opacity: 0.28 }, // #2da44e
  { color: [210, 153, 34], opacity: 0.3 }, // #d29922
  { color: [229, 83, 75], opacity: 0.42 }, // #e5534b
]
const gapCap = 3 // +300%
const hex = (rgb) => `#${rgb.map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`

export function heatFill(gap) {
  const t = Math.min(Math.log1p(Math.max(gap, 0)) / Math.log1p(gapCap), 1) * (heatStops.length - 1)
  const index = Math.min(Math.floor(t), heatStops.length - 2)
  const f = t - index
  const [from, to] = [heatStops[index], heatStops[index + 1]]
  return { color: from.color.map((channel, i) => channel + (to.color[i] - channel) * f), opacity: from.opacity + (to.opacity - from.opacity) * f }
}

const tintOf = (cell) => {
  if (cell.state !== 'ok') return null
  return cell.best ? bestFill : heatFill(cell.gap)
}

// `columns`: [{ framework, label }]; `rows`: [{ name, cells: [{ state, text, best, diff, gap }] }].
export function renderTable({ title, columns, rows }) {
  const columnWidth = (tableWidth - nameColumn) / columns.length
  const parts = []
  const headerY = rowTableHeight / 2
  columns.forEach(({ framework, label }, index) => {
    const right = nameColumn + (index + 1) * columnWidth
    parts.push(`<text x="${fixed(right - 8)}" y="${headerY}" dominant-baseline="central" text-anchor="end" fill="${valueColor}" font-weight="600" ${font}>${escape(label)}</text>`)
    parts.push(`<circle cx="${fixed(right - 8 - label.length * 6.6 - 11)}" cy="${headerY}" r="4.5" fill="${palette[framework] ?? fallbackColor}"/>`)
  })
  parts.push(`<line x1="0" y1="${rowTableHeight}" x2="${tableWidth}" y2="${rowTableHeight}" stroke="${textColor}" stroke-opacity="0.5"/>`)
  rows.forEach((row, rowIndex) => {
    const top = rowTableHeight * (rowIndex + 1)
    const middle = top + rowTableHeight / 2
    parts.push(`<text x="0" y="${middle}" dominant-baseline="central" fill="${valueColor}" font-weight="600" ${font}>${escape(row.name)}</text>`)
    row.cells.forEach((cell, index) => {
      const left = nameColumn + index * columnWidth
      const right = left + columnWidth
      const tint = tintOf(cell)
      if (tint) parts.push(`<rect x="${fixed(left + 3)}" y="${top + 3}" width="${fixed(columnWidth - 6)}" height="${rowTableHeight - 6}" rx="3" fill="${hex(tint.color)}" fill-opacity="${tint.opacity.toFixed(3)}"/>`)
      if (cell.best) parts.push(`<text x="${fixed(left + 9)}" y="${middle}" dominant-baseline="central" font-size="10" ${font.replace(/ font-size="11"/, '')}>🏆</text>`)
      if (cell.state !== 'ok') {
        parts.push(`<text x="${fixed(right - 10)}" y="${middle}" dominant-baseline="central" text-anchor="end" fill="${textColor}" ${font}>${escape(cell.text)}</text>`)
        return
      }
      parts.push(`<text x="${fixed(right - 10 - gapColumn)}" y="${middle}" dominant-baseline="central" text-anchor="end" fill="${valueColor}"${cell.best ? ' font-weight="700"' : ''} style="font-variant-numeric: tabular-nums" ${font}>${escape(cell.text)}</text>`)
      if (cell.diff) parts.push(`<text x="${fixed(right - 10)}" y="${middle}" dominant-baseline="central" text-anchor="end" fill="${textColor}" font-size="10" style="font-variant-numeric: tabular-nums" ${font.replace(/ font-size="11"/, '')}>${escape(cell.diff)}</text>`)
    })
    parts.push(`<line x1="0" y1="${top + rowTableHeight}" x2="${tableWidth}" y2="${top + rowTableHeight}" stroke="${textColor}" stroke-opacity="0.25"/>`)
  })
  const total = rowTableHeight * (rows.length + 1) + 1
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${tableWidth}" height="${total}" viewBox="0 0 ${tableWidth} ${total}" role="img" aria-label="${escape(title)}">\n<title>${escape(title)}</title>\n${parts.join('\n')}\n</svg>\n`
}

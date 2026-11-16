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
const gapColumn = 54 // room for "+1114%" in the muted difference column
// Heatmap colors: computeColor from js-framework-benchmark (Apache-2.0, Stefan Krause),
// https://github.com/krausest/js-framework-benchmark/blob/7ebdd8105e5416beb5a1736cf4eae13cf0bc3faa/webdriver-ts-results/src/Common.ts
// `factor` is value / best in the row (>= 1): rgb(99,191,124) green at 1x, rgb(255,236,132)
// yellow at 2x (linear RGB in between), then linear to rgb(249,105,108) red at 4x, capped there.
export function computeColor(factor) {
  if (factor < 2.0) {
    const a = factor - 1.0
    const r = (1.0 - a) * 99 + a * 255
    const g = (1.0 - a) * 191 + a * 236
    const b = (1.0 - a) * 124 + a * 132
    return `rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`
  }
  const a = Math.min((factor - 2.0) / 2.0, 1.0)
  const r = (1.0 - a) * 255 + a * 249
  const g = (1.0 - a) * 236 + a * 105
  const b = (1.0 - a) * 132 + a * 108
  return `rgb(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)})`
}
// Cells are opaque, so their text is dark in both variants; labels outside the cells
// follow the theme (`value`, `muted`).
const themes = {
  light: { value: '#1f2328', muted: '#57606a', cell: '#000', cellMuted: '#3d444d' },
  dark: { value: '#f0f6fc', muted: '#b1bac4', cell: '#000', cellMuted: '#3d444d' },
}

// Text width in px at 11 px / weight 600, measured in Chromium with the table font stack
// (letters and digits; anything else uses the fallback). Used to center header units.
const glyphWidths = { ' ': 3.06, '+': 6.42, '-': 3.66, '.': 3.06, '/': 3.06, '(': 3.66, ')': 3.66, '·': 3.06 }
const letterWidths = '0123456789'.split('').map((c) => [c, 6.12]).concat(Object.entries({
  A: 7.94, B: 7.94, C: 7.94, D: 7.94, E: 7.34, F: 6.72, G: 8.56, H: 7.94, I: 3.06, J: 6.12, K: 7.94, L: 6.72, M: 9.16, N: 7.94, O: 8.56, P: 7.34, Q: 8.56, R: 7.94, S: 7.34, T: 6.72, U: 7.94, V: 7.34, W: 10.38, X: 7.34, Y: 7.34, Z: 6.72,
  a: 6.12, b: 6.72, c: 6.12, d: 6.72, e: 6.12, f: 3.66, g: 6.72, h: 6.72, i: 3.06, j: 3.06, k: 6.12, l: 3.06, m: 9.78, n: 6.72, o: 6.72, p: 6.72, q: 6.72, r: 4.28, s: 6.12, t: 3.66, u: 6.72, v: 6.12, w: 8.56, x: 6.12, y: 6.12, z: 5.5,
}))
for (const [char, width] of letterWidths) glyphWidths[char] = width
export const textWidth = (text) => [...text].reduce((sum, char) => sum + (glyphWidths[char] ?? 6.3), 0)

const cellGap = 3 // space between neighbouring cells
const dotDiameter = 9
const dotLabelGap = 10

// `columns`: [{ framework, label }]; `rows`: [{ name, cells: [{ state, text, best, diff, gap }] }].
// `theme` selects the text colors ('light' or 'dark'); the fills are the same.
export function renderTable({ title, columns, rows, theme = 'light' }) {
  const { value: valueColor, muted, cell: cellColor, cellMuted } = themes[theme]
  const columnWidth = (tableWidth - nameColumn) / columns.length
  const parts = []
  const headerY = rowTableHeight / 2
  columns.forEach(({ framework, label }, index) => {
    // The dot and the label form one unit, centered on the column's cell center.
    const center = nameColumn + (index + 0.5) * columnWidth
    const start = center - (dotDiameter + dotLabelGap + textWidth(label)) / 2
    parts.push(`<circle cx="${fixed(start + dotDiameter / 2)}" cy="${headerY}" r="${dotDiameter / 2}" fill="${palette[framework] ?? fallbackColor}"/>`)
    parts.push(`<text x="${fixed(start + dotDiameter + dotLabelGap)}" y="${headerY}" dominant-baseline="central" fill="${valueColor}" font-weight="600" ${font}>${escape(label)}</text>`)
  })
  rows.forEach((row, rowIndex) => {
    const top = rowTableHeight * (rowIndex + 1)
    const middle = top + rowTableHeight / 2
    parts.push(`<text x="0" y="${middle}" dominant-baseline="central" fill="${valueColor}" font-weight="600" ${font}>${escape(row.name)}</text>`)
    row.cells.forEach((cell, index) => {
      const left = nameColumn + index * columnWidth
      const right = left + columnWidth
      if (cell.state === 'ok') {
        // Separated cells: a 3 px gap on every side and rounded corners.
        parts.push(`<rect x="${fixed(left + cellGap)}" y="${top + cellGap}" width="${fixed(columnWidth - 2 * cellGap)}" height="${rowTableHeight - 2 * cellGap}" rx="3" fill="${computeColor(1 + cell.gap)}"/>`)
      }
      if (cell.best) parts.push(`<text x="${fixed(left + 9)}" y="${middle}" dominant-baseline="central" font-size="10" ${font.replace(/ font-size="11"/, '')}>🏆</text>`)
      if (cell.state !== 'ok') {
        parts.push(`<text x="${fixed(right - 10)}" y="${middle}" dominant-baseline="central" text-anchor="end" fill="${muted}" ${font}>${escape(cell.text)}</text>`)
        return
      }
      parts.push(`<text x="${fixed(right - 10 - gapColumn)}" y="${middle}" dominant-baseline="central" text-anchor="end" fill="${cellColor}"${cell.best ? ' font-weight="700"' : ''} style="font-variant-numeric: tabular-nums" ${font}>${escape(cell.text)}</text>`)
      if (cell.diff) parts.push(`<text x="${fixed(right - 10)}" y="${middle}" dominant-baseline="central" text-anchor="end" fill="${cellMuted}" font-size="10" style="font-variant-numeric: tabular-nums" ${font.replace(/ font-size="11"/, '')}>${escape(cell.diff)}</text>`)
    })
  })
  const total = rowTableHeight * (rows.length + 1)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${tableWidth}" height="${total}" viewBox="0 0 ${tableWidth} ${total}" role="img" aria-label="${escape(title)}">\n<title>${escape(title)}</title>\n${parts.join('\n')}\n</svg>\n`
}

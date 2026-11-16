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
// Heatmap: one fixed scale for all rows. A cell's gap to its row's best (value / best - 1)
// maps to t = min(gap / heatFullGap, 1): 0% is green, heatFullGap or more is red, and the
// colors in between are interpolated continuously in OKLCH (the hue runs through
// yellow/amber, not brown). Fills are translucent so they work on
// light and dark; text colors differ per theme variant because no single color reads on both.
const themes = {
  light: { value: '#1f2328', muted: '#57606a' },
  dark: { value: '#f0f6fc', muted: '#b1bac4' },
}
export const heatEndpoints = { best: '#2da44e', worst: '#e5534b' }
const heatOpacity = 0.5
export const heatFullGap = 1 // +100% or more is full red
const cellGap = 3 // space between neighbouring cells

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const fromLinear = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)
function toOklch(hexColor) {
  const [r, g, b] = [1, 3, 5].map((i) => toLinear(parseInt(hexColor.slice(i, i + 2), 16) / 255))
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const sCone = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * sCone
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * sCone
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * sCone
  return { L, C: Math.hypot(a, bb), h: Math.atan2(bb, a) }
}
function fromOklch({ L, C, h }) {
  const a = C * Math.cos(h), b = C * Math.sin(h)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const sCone = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * sCone, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * sCone, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * sCone]
  return `#${rgb.map((c) => Math.round(Math.min(Math.max(fromLinear(Math.min(Math.max(c, 0), 1)), 0), 1) * 255).toString(16).padStart(2, '0')).join('')}`
}
const bestLch = toOklch(heatEndpoints.best), worstLch = toOklch(heatEndpoints.worst)

// t = 0 gives the best color and t = 1 the worst; hue takes the short way round.
export function heatColor(t) {
  const x = Math.min(Math.max(t, 0), 1)
  let dh = worstLch.h - bestLch.h
  if (dh > Math.PI) dh -= 2 * Math.PI
  if (dh < -Math.PI) dh += 2 * Math.PI
  return fromOklch({ L: bestLch.L + (worstLch.L - bestLch.L) * x, C: bestLch.C + (worstLch.C - bestLch.C) * x, h: bestLch.h + dh * x })
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

const dotDiameter = 9
const dotLabelGap = 10

// `columns`: [{ framework, label }]; `rows`: [{ name, cells: [{ state, text, best, diff, gap }] }].
// `theme` selects the text colors ('light' or 'dark'); the fills are the same.
export function renderTable({ title, columns, rows, theme = 'light' }) {
  const { value: valueColor, muted } = themes[theme]
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
        const t = Math.min(cell.gap / heatFullGap, 1)
        parts.push(`<rect x="${fixed(left + cellGap)}" y="${top + cellGap}" width="${fixed(columnWidth - 2 * cellGap)}" height="${rowTableHeight - 2 * cellGap}" rx="3" fill="${heatColor(t)}" fill-opacity="${heatOpacity}"/>`)
      }
      if (cell.best) parts.push(`<text x="${fixed(left + 9)}" y="${middle}" dominant-baseline="central" font-size="10" ${font.replace(/ font-size="11"/, '')}>🏆</text>`)
      if (cell.state !== 'ok') {
        parts.push(`<text x="${fixed(right - 10)}" y="${middle}" dominant-baseline="central" text-anchor="end" fill="${muted}" ${font}>${escape(cell.text)}</text>`)
        return
      }
      parts.push(`<text x="${fixed(right - 10 - gapColumn)}" y="${middle}" dominant-baseline="central" text-anchor="end" fill="${valueColor}"${cell.best ? ' font-weight="700"' : ''} style="font-variant-numeric: tabular-nums" ${font}>${escape(cell.text)}</text>`)
      if (cell.diff) parts.push(`<text x="${fixed(right - 10)}" y="${middle}" dominant-baseline="central" text-anchor="end" fill="${muted}" font-size="10" style="font-variant-numeric: tabular-nums" ${font.replace(/ font-size="11"/, '')}>${escape(cell.diff)}</text>`)
    })
  })
  const total = rowTableHeight * (rows.length + 1)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${tableWidth}" height="${total}" viewBox="0 0 ${tableWidth} ${total}" role="img" aria-label="${escape(title)}">\n<title>${escape(title)}</title>\n${parts.join('\n')}\n</svg>\n`
}

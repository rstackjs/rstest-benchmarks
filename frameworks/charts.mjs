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
const barMax = 670 // leaves room for the longest value label after the longest bar
const rowHeight = 10
const rowGap = 3
const groupGap = 28
const top = 28

const escape = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const fixed = (number) => number.toFixed(2)

// `groups`: [{ name, bars: [{ framework, label, value, text }] }]. Each group is
// scaled to its largest value, because cases differ by more than 50x.
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
  let y = top
  for (const group of groups) {
    const present = group.bars.filter((bar) => bar.value != null)
    const max = Math.max(...present.map((bar) => bar.value), 0)
    parts.push(`<text x="0" y="${y + labelHeight / 2}" dominant-baseline="central" fill="${textColor}" font-weight="600" ${font}>${escape(group.name)}</text>`)
    y += labelHeight
    for (const bar of group.bars) {
      const barY = y
      if (bar.value == null) {
        parts.push(`<text x="0" y="${barY + rowHeight / 2}" dominant-baseline="central" fill="${textColor}" ${font}>—</text>`)
      } else {
        const length = Math.max(2, max > 0 ? (bar.value / max) * barMax : 2)
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

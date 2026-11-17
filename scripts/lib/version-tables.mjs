import { basename, dirname, join, relative } from 'node:path'
import { renderHeatmap, textWidth } from './heatmap.mjs'

export const tableLegend = '🏆 marks the lowest comparable median in each row. Percentages show change from the baseline.'

// Only rank values which passed the comparison checks against the baseline.
// Preserve raw medians even when the row cannot support a ranking.
export function versionRow(name, entries) {
  const comparable = entries.filter(entry => entry.delta != null)
  const best = comparable.length ? Math.min(entries[0].value, ...comparable.map(entry => entry.value)) : null
  const cells = entries.map(({ value, text, delta, diff }, index) => {
    const ranked = best > 0 && (index === 0 || delta != null)
    return {
      text, diff, delta, state: ranked ? 'ok' : 'unranked',
      best: ranked && value === best,
      gap: ranked ? value / best - 1 : 0,
    }
  })
  return { name, cells }
}

// Return both themes for every metric. A null entry retires an older chart
// when the newly published run has no samples for that metric.
export function readmeTable(metric, rows, labels, data, output, readmePath, assets) {
  const title = metric === 'elapsed' ? 'Elapsed time (s)' : 'Memory comparison (MiB, peak process-tree footprint)'
  const file = join(dirname(output), 'charts', basename(output, '.md') + '-' + metric)
  const pair = labels.length === 2
  const columns = labels.map((label, i) => ({
    label,
    color: i === 0 ? '#848d97' : '#3d7bf0',
    width: pair ? Math.ceil(Math.max(textWidth(label), ...rows.map(row => textWidth(row.cells[i].text))) + 24) : undefined,
  }))
  const nameColumn = Math.ceil(Math.max(130, ...rows.map(row => textWidth(row.name) + 18)))
  const cellWidth = Math.ceil(Math.max(140, ...labels.map(label => textWidth(label) + 48)))
  const changeColumnWidth = pair
    ? Math.ceil(Math.max(textWidth('Candidate Δ'), ...rows.map(row => textWidth('▲ ' + (row.cells[1].diff ?? '—')))) + 24)
    : 0
  const tableWidth = pair
    ? nameColumn + columns[0].width + columns[1].width + changeColumnWidth
    : Math.max(760, nameColumn + cellWidth * labels.length)
  for (const theme of ['light', 'dark']) {
    const path = file + (theme === 'dark' ? '-dark.svg' : '.svg')
    assets.set(path, rows.length ? renderHeatmap({ title, rows, columns, theme, nameColumn, tableWidth, changeColumnWidth }) : null)
  }
  if (!rows.length) return ''
  const link = relative(dirname(readmePath), file).replaceAll('\\', '/')
  return [
    '### ' + title, '',
    '<picture>',
    `<source media="(prefers-color-scheme: dark)" srcset="${link}-dark.svg">`,
    `<img alt="${title}" src="${link}.svg">`,
    '</picture>', '',
    '<details>', '<summary>Table data and comparison notes</summary>', '', data, '', '</details>',
  ].join('\n')
}

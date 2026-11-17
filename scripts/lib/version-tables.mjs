import { basename, dirname, join, relative } from 'node:path'
import { renderHeatmap, textWidth } from './heatmap.mjs'

export const tableLegend = '🏆 marks the lowest comparable median in each row. Percentages show change from the baseline.'

function pairColor(value, best) {
  if (value === best) return '#63bf7c'
  return value / best < 1.2 ? '#ffc078' : '#f28b88'
}

// Only rank values which passed the comparison checks against the baseline.
// Preserve raw medians even when the row cannot support a ranking.
export function versionRow(name, entries) {
  const comparable = entries.filter(entry => entry.delta != null)
  const best = comparable.length ? Math.min(entries[0].value, ...comparable.map(entry => entry.value)) : null
  const cells = entries.map(({ value, text, delta, diff }, index) => {
    const ranked = best > 0 && (index === 0 || delta != null)
    return {
      text, diff, state: ranked ? 'ok' : 'unranked',
      best: ranked && value === best,
      gap: ranked ? value / best - 1 : 0,
      ...(ranked && entries.length === 2 ? { fill: pairColor(value, best) } : {}),
    }
  })
  return { name, cells }
}

// Return both themes for every metric. A null entry retires an older chart
// when the newly published run has no samples for that metric.
export function readmeTable(metric, rows, labels, data, output, readmePath, assets) {
  const title = metric === 'elapsed' ? 'Elapsed time (s)' : 'Memory comparison (MiB, peak process-tree footprint)'
  const file = join(dirname(output), 'charts', basename(output, '.md') + '-' + metric)
  const columns = labels.map((label, i) => ({ label, color: i === 0 ? '#848d97' : '#3d7bf0' }))
  const nameColumn = Math.ceil(Math.max(130, ...rows.map(row => textWidth(row.name) + 18)))
  const cellWidth = Math.ceil(Math.max(140, ...labels.map(label => textWidth(label) + 48)))
  const tableWidth = Math.max(760, nameColumn + cellWidth * labels.length)
  for (const theme of ['light', 'dark']) {
    const path = file + (theme === 'dark' ? '-dark.svg' : '.svg')
    assets.set(path, rows.length ? renderHeatmap({ title, rows, columns, theme, nameColumn, tableWidth }) : null)
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

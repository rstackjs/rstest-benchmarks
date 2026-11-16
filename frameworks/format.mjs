// README presentation of medians: compact values, and each non-best cell shows its
// gap to the best (lowest) value in the row. Detailed reports keep full precision.

export function formatElapsed(ms) {
  const seconds = ms / 1000
  return Number(seconds.toFixed(2)) >= 10 ? `${seconds.toFixed(1)}s` : `${seconds.toFixed(2)}s`
}

export const formatMemory = (bytes) => String(Math.round(bytes / 1024 ** 2))

export function formatDifference(value, best) {
  const percent = Math.round((value / best - 1) * 100)
  return percent === 0 ? '+<1%' : `${percent > 0 ? '+' : ''}${percent}%`
}

// `entries`: one per runner, { value, state } with state 'ok' (complete), 'incomplete'
// or 'missing'. The best value is the lowest unrounded median among complete entries;
// exact ties are all best. Returns { state, text, best, diff, gap } per runner, where
// `diff` is the formatted gap to the best and `gap` the unrounded fraction.
export function relativeEntries(entries, format) {
  const complete = entries.filter((entry) => entry.state === 'ok').map((entry) => entry.value)
  const best = complete.length ? Math.min(...complete) : null
  return entries.map((entry) => {
    if (entry.state !== 'ok') return { state: entry.state, text: entry.state === 'missing' ? '—' : 'INCOMPLETE', best: false, diff: null, gap: 0 }
    const isBest = entry.value === best
    return {
      state: 'ok',
      text: format(entry.value),
      best: isBest,
      diff: isBest ? null : formatDifference(entry.value, best),
      gap: isBest ? 0 : entry.value / best - 1,
    }
  })
}

export const markdownCells = (cells) => cells.map((cell) => {
  if (cell.state !== 'ok') return cell.text
  return cell.best ? `**${cell.text}**` : `${cell.text} (${cell.diff})`
})

export const relativeCells = (entries, format) => markdownCells(relativeEntries(entries, format))

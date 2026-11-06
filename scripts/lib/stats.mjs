export function median(values) {
  if (!values.length) return null
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2
}

export function statistics(values) {
  if (values.some((value) => !Number.isFinite(value) || value < 0))
    throw new Error('Samples must be finite, non-negative numbers')
  if (!values.length)
    return {
      n: 0,
      median: null,
      min: null,
      max: null,
      mean: null,
      sd: null,
      cv: null,
      mad: null,
    }
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length
  const center = median(values)
  const sd =
    values.length > 1
      ? Math.sqrt(
          values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
            (values.length - 1),
        )
      : null
  return {
    n: values.length,
    median: center,
    min: Math.min(...values),
    max: Math.max(...values),
    mean,
    sd,
    cv: sd !== null && mean > 0 ? (sd / mean) * 100 : null,
    mad: median(values.map((value) => Math.abs(value - center))),
  }
}

export const seconds = (value) =>
  value == null ? '—' : `${(Math.round(value) / 1000).toFixed(3)}s`
export const percent = (value) =>
  value == null ? '—' : `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`

// Match exact workload names or full case IDs; exclusions take precedence.
export function selectCases(items, { include, exclude, keys, defaults = () => true }) {
  const parse = (value, option) => {
    if (value == null || !value.trim()) return []
    const names = value.split(',').map((name) => name.trim())
    if (names.some((name) => !name) || new Set(names).size !== names.length)
      throw new Error(`--${option} must contain unique non-empty case IDs`)
    for (const name of names)
      if (!items.some((item) => keys(item).includes(name)))
        throw new Error(`Unknown case for --${option}: ${name}`)
    return names
  }
  const included = parse(include, 'cases')
  const excluded = parse(exclude, 'exclude-cases')
  const selected = items.filter((item) => {
    const names = keys(item)
    return (included.length ? included.some((name) => names.includes(name)) : defaults(item)) &&
      !excluded.some((name) => names.includes(name))
  })
  if (!selected.length) throw new Error('No benchmark cases selected')
  return selected
}

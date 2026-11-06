// Iterators pause before fixture preparation and before every test process.
// Advance one side fully before the other so setup cannot overlap a measurement.
export async function runPaired(
  iterators,
  { reverse = false, offset = 0, signal, onStep = () => {} } = {},
) {
  const sides = Object.keys(iterators)
  if (sides.length < 2)
    throw new Error('Comparison requires at least two sources')
  const states = {}
  try {
    for (const side of sides) states[side] = await iterators[side].next()
    let group = -1
    while (sides.some((side) => !states[side].done)) {
      if (signal?.aborted) throw new Error('Comparison interrupted')
      if (
        sides.some(
          (side) =>
            states[side].done !== states[sides[0]].done ||
            JSON.stringify(states[side].value) !==
              JSON.stringify(states[sides[0]].value),
        )
      )
        throw new Error(
          'Comparison schedules diverged; refusing unpaired measurements',
        )
      const step = states[sides[0]].value
      if (step.kind === 'prepare') group++
      const ordered = reverse ? [...sides].reverse() : sides
      const start = (group + (step.round ?? 0) + offset) % sides.length
      const order = [...ordered.slice(start), ...ordered.slice(0, start)]
      for (const side of order) {
        if (signal?.aborted) throw new Error('Comparison interrupted')
        onStep({ side, ...step })
        states[side] = await iterators[side].next()
      }
    }
    return Object.fromEntries(sides.map((side) => [side, states[side].value]))
  } finally {
    // return() runs the suite's finally block, persisting partial results and releasing locks.
    const cleanup = await Promise.allSettled(
      sides.map((side) => iterators[side].return()),
    )
    const failures = cleanup.filter((result) => result.status === 'rejected')
    if (failures.length)
      throw new AggregateError(
        failures.map((result) => result.reason),
        'Suite cleanup failed',
      )
  }
}

export function selectedFor(group, requested) {
  if (group.suite === 'browser')
    return requested.filter((f) => ['vitest', 'rstest'].includes(f))
  return requested
}

export function orderFor(selected, round) {
  if (selected.length === 4) {
    const permutations = [
      [0, 1, 2, 3],
      [1, 2, 3, 0],
      [2, 3, 0, 1],
      [3, 0, 1, 2],
      [3, 2, 1, 0],
      [2, 1, 0, 3],
      [1, 0, 3, 2],
      [0, 3, 2, 1],
    ]
    return permutations[round % permutations.length].map((i) => selected[i])
  }
  if (selected.length === 3) {
    const permutations = [
      [0, 1, 2],
      [1, 2, 0],
      [2, 0, 1],
      [0, 2, 1],
      [2, 1, 0],
      [1, 0, 2],
    ]
    return permutations[round % 6].map((i) => selected[i])
  }
  const offset = round % selected.length
  const order = selected.length >= 5 && Math.floor(round / selected.length) % 2
    ? [...selected].reverse()
    : selected
  return [...order.slice(offset), ...order.slice(0, offset)]
}

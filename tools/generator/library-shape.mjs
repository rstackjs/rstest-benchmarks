const shapes = {
  small: { internal: 12, core: 15, modules: 12, features: 3, tests: 10 },
  medium: { internal: 40, core: 50, modules: 30, features: 6, tests: 40 },
  large: { internal: 160, core: 200, modules: 120, features: 12, tests: 120 },
}

export function libraryShape(scale = 'medium', dimension = 'combined') {
  if (!Object.hasOwn(shapes, scale))
    throw new Error(`Unknown library scale: ${scale}`)
  if (!['combined', 'files', 'graph'].includes(dimension))
    throw new Error(`Unknown library dimension: ${dimension}`)
  const shape = shapes[scale]
  if (dimension === 'files') return { ...shapes.medium, tests: shape.tests }
  if (dimension === 'graph') return { ...shape, tests: shapes.medium.tests }
  return { ...shape }
}

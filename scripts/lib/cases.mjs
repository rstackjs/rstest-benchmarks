export const POOLS = ['forks', 'threads', 'vmForks', 'vmThreads']
export const SCALES = ['small', 'medium', 'large']
export const SCALED_SUITES = ['pools', 'barrel', 'scaling']

const node = [
  { app: 'micro-utils', name: 'Node startup and utilities' },
  { app: 'node-library', name: 'Node module graph', scale: 'medium' },
  { app: 'node-backend', name: 'Node dependencies and service logic' },
]
const components = ['react', 'vue'].flatMap((framework) =>
  ['jsdom', 'happy-dom', 'chromium'].map((env) => ({
    app: `${framework}-spa`,
    name: `${framework === 'react' ? 'React' : 'Vue'} + ${env === 'chromium' ? 'browser mode' : env}`,
    env,
    ...(env === 'chromium' ? { pool: 'browser', isolate: null } : {}),
  })),
)
const barrel = (scale) => ({
  app: 'barrel-clean',
  name: `barrel graph · ${scale}`,
  scale,
})

export function casesFor(suite, options = {}) {
  const scales = options.scales ?? SCALES
  let base
  switch (suite) {
    case 'main':
      base = [...node, ...components, barrel('medium')]
      break
    case 'coverage':
      // Deliberate workloads, independent of main's display names and membership.
      base = [
        { app: 'node-library', name: 'Node module graph', scale: 'medium' },
        { app: 'node-backend', name: 'Node dependencies and service logic' },
        { app: 'react-spa', name: 'React + jsdom', env: 'jsdom' },
        barrel('medium'),
        barrel('large'),
      ].flatMap((item) =>
        ['none', 'v8', 'istanbul'].map((provider) => ({ ...item, provider })),
      )
      break
    case 'pools':
      base = scales.flatMap((scale) =>
        POOLS.map((pool) => ({
          app: 'node-library',
          name: `${scale} module graph`,
          scale,
          pool,
        })),
      )
      break
    case 'barrel':
      base = scales.flatMap((scale) => [
        barrel(scale),
        { ...barrel(scale), config: 'rstest.no-lazy-barrel.config.ts' },
      ])
      break
    case 'scaling':
      base = ['files', 'graph'].flatMap((dimension) =>
        scales.map((scale) => ({
          app: 'node-library',
          name: `${dimension} scaling · ${scale}`,
          dimension,
          scale,
        })),
      )
      break
    default:
      throw new Error(`Unknown suite: ${suite}`)
  }
  const rows = base
    .map((item) => ({
      pool: 'forks',
      env: 'node',
      isolate: true,
      provider: 'none',
      scale: null,
      dimension: null,
      config: 'default',
      ...item,
    }))
    .filter((item) => !options.apps?.length || options.apps.includes(item.app))
  if (!rows.length) throw new Error('No benchmark cases selected')
  return rows.map((item) => ({
    ...item,
    id: [
      suite,
      item.app,
      item.dimension ?? 'default',
      item.scale ?? 'default',
      item.env,
      item.pool,
      item.provider,
      item.config,
    ].join(':'),
  }))
}

export function unsupportedReason(item, version) {
  if (version === '0.11.0' && ['vmForks', 'vmThreads'].includes(item.pool))
    return 'VM pools are not supported by Rstest 0.11.0'
  return item.app === 'vue-spa' &&
    item.pool === 'browser' &&
    version === '0.11.0'
    ? 'Known Vue browser loader incompatibility on 0.11.0'
    : null
}

export function rotate(items, round, reverse = false) {
  const ordered = reverse ? [...items].reverse() : [...items]
  const offset = round % ordered.length
  return [...ordered.slice(offset), ...ordered.slice(0, offset)]
}

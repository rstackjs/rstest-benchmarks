// barrel-clean — a focused lazy-barrel benchmark.
//
// Every barrel uses named re-exports and every module is explicitly marked
// side-effect-free by the package manifest. Each test imports four symbols
// from the root barrel, so a bundler with lazy-barrel support can avoid
// building the other re-exported modules. The no-lazy config marks the same
// source files as side-effectful, which removes that eligibility without
// changing the test graph or worker settings.

import { createApp, tsModule } from '../../tools/generator/helpers.mjs'

const SCALES = {
  small: { domains: 4, perDomain: 25 },
  medium: { domains: 16, perDomain: 50 },
  large: { domains: 32, perDomain: 100 },
}
const scaleName = process.env.BARREL_SCALE ?? 'medium'
const scale = SCALES[scaleName]

if (!scale)
  throw new Error(`Unknown BARREL_SCALE=${scaleName}; choose small, medium, or large`)

const { domains: DOMAINS, perDomain: PER_DOMAIN } = scale
const TESTS = 20

const app = createApp(import.meta.url)

for (let d = 0; d < DOMAINS; d++) {
  for (let i = 0; i < PER_DOMAIN; i++) {
    app.write(`src/domains/d${d}/m${i}.ts`, tsModule(`d${d}m${i}`, i))
  }
}

app.write(
  'src/index.ts',
  Array.from({ length: DOMAINS }, (_, d) =>
    Array.from({ length: PER_DOMAIN }, (_, i) =>
      `export { d${d}m${i}Compute, d${d}m${i}Default, d${d}m${i}Format } from './domains/d${d}/m${i}'`,
    ).join('\n'),
  ).join('\n') + '\n',
)

for (let t = 0; t < TESTS; t++) {
  const d = t % DOMAINS
  const m = (t * 7) % PER_DOMAIN
  const d2 = (d + 3) % DOMAINS
  const m2 = (t * 7 + 13) % PER_DOMAIN

  app.write(`tests/t${t}.test.ts`, `import { describe, expect, it } from '@rstest/core'
import { d${d}m${m}Compute, d${d}m${m}Default, d${d2}m${m2}Format, d${d2}m${m2}Compute } from '../src'

describe('t${t}', () => {
  it('uses a handful of named exports from the root barrel', () => {
    const result = d${d}m${m}Compute(d${d}m${m}Default)
    expect(result.ok).toBe(true)
  })
  it('formats across domains', () => {
    expect(d${d2}m${m2}Format(d${d2}m${m2}Compute({ id: ${t + 1} }))).toMatch(/^ok:/)
  })
})
`)
}

app.report('barrel-clean', `${scaleName}: ${DOMAINS * PER_DOMAIN + 1} src modules, ${TESTS} test files, named side-effect-free re-exports`)

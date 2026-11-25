// Usage: node scripts/ci-matrix.mjs <frameworks|versions|coverage> [--suites ...] [--cases ...] [--exclude-cases ...]
// Prints the matrix JSON and, in GitHub Actions, writes it to the `matrix` step output.
import { appendFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import { matrixFor } from './lib/ci-matrix.mjs'

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    suites: { type: 'string' },
    cases: { type: 'string' },
    'exclude-cases': { type: 'string' },
  },
})
const [kind] = positionals
if (!['frameworks', 'versions', 'coverage'].includes(kind))
  throw new Error('Use: ci-matrix.mjs <frameworks|versions|coverage>')
const matrix = JSON.stringify(
  matrixFor(kind, {
    suites: values.suites,
    cases: values.cases,
    excludeCases: values['exclude-cases'],
  }),
)
console.log(matrix)
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `matrix=${matrix}\n`)

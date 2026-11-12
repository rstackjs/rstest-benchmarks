// Usage: node scripts/ci-matrix.mjs <frameworks|coverage> [--cases ...] [--exclude-cases ...] [--runner macos-15|ubuntu-24.04]
// Prints the matrix JSON and, in GitHub Actions, writes it to the `matrix` step output.
import { appendFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import { matrixFor } from './lib/ci-matrix.mjs'

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { cases: { type: 'string' }, 'exclude-cases': { type: 'string' }, runner: { type: 'string' } },
})
const [kind] = positionals
if (!['frameworks', 'coverage'].includes(kind)) throw new Error('Use: ci-matrix.mjs <frameworks|coverage>')
const matrix = JSON.stringify(matrixFor(kind, { cases: values.cases, excludeCases: values['exclude-cases'], runner: values.runner }))
console.log(matrix)
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `matrix=${matrix}\n`)

import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { refreshReport } from './publication.mjs'

const { values } = parseArgs({ options: {
  input: { type: 'string' },
  check: { type: 'boolean', default: false },
} })
const root = fileURLToPath(new URL('../', import.meta.url))
refreshReport({ root, input: values.input && resolve(values.input), check: values.check })
console.log(values.check ? 'Framework reports and README are up to date.' : 'Updated framework reports and README from verified samples.')

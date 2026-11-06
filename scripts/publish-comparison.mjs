import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { publishComparison } from './lib/publication.mjs'

const { values } = parseArgs({ options: { input: { type: 'string' } } })
if (!values.input) throw new Error('Use --input results/<comparison>/comparison.json')
const root = fileURLToPath(new URL('..', import.meta.url))
const input = resolve(values.input)
const record = JSON.parse(readFileSync(input, 'utf8'))
const result = publishComparison(root, dirname(input), record)
console.log(`Updated ${result.readmePath} and reports for ${result.suites.join(', ')}.`)

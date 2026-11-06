import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { reportInput } from './lib/publish.mjs'

const [input, output, ...extra] = process.argv.slice(2)
if (!input || !output || extra.length)
  throw new Error('usage: pnpm report:export <result.json> <reports/data/run.json>')
if (resolve(input) === resolve(output))
  throw new Error('Keep the original result; choose a different output path')
const document = reportInput(readFileSync(input, 'utf8'))
mkdirSync(dirname(resolve(output)), { recursive: true })
writeFileSync(output, JSON.stringify(document, null, 2) + '\n', { flag: 'wx' })
console.log(`Exported ${output}`)

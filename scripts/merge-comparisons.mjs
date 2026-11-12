// Usage: node scripts/merge-comparisons.mjs --output results/<dir> <input>...
// Each input is a per-app comparison directory (or comparison.json) from the CI matrix.
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { ciResultDirectory, findArtifactFile } from './lib/ci.mjs'
import { mergeComparisons } from './lib/merge-comparison.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const { values, positionals } = parseArgs({ allowPositionals: true, options: { output: { type: 'string' } } })
if (!values.output || !positionals.length) throw new Error('Usage: merge-comparisons.mjs --output <dir> <input>...')

const inputs = positionals.map((input) => {
  const path = resolve(input)
  const file = findArtifactFile(path, 'comparison.json')
  return { name: path.endsWith('.json') ? basename(dirname(file)) : basename(path), file }
})
const outDir = resolve(values.output)
const comparison = mergeComparisons(root, inputs, outDir)
ciResultDirectory(root, outDir)
console.log(JSON.stringify({ output: join(outDir, 'comparison.json'), inputs: inputs.map((input) => input.name), runs: comparison.runs.map((run) => run.file) }))

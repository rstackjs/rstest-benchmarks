// Usage: node frameworks/merge-results.mjs --output results/<dir> <input>...
// Each input is a per-case result directory (or result.json) from the CI matrix.
import { basename, dirname, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { writeFileSync } from 'node:fs'
import { mergeResults, writeMerged } from './merge.mjs'
import { verify } from './verify.mjs'
import { report } from './report.mjs'
import { root } from './fixtures.mjs'
import { ciResultDirectory, findArtifactFile } from '../scripts/lib/ci.mjs'

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { output: { type: 'string' } },
})
if (!values.output || !positionals.length) throw new Error('Usage: merge-results.mjs --output <dir> <input>...')
const inputs = positionals.map((input) => {
  const file = findArtifactFile(resolve(input), 'result.json')
  // A downloaded artifact is named after its job; use that as the input name.
  const artifact = basename(resolve(input))
  return { name: artifact === 'result.json' ? basename(dirname(file)) : artifact, file }
})
const outDir = resolve(values.output)
const result = mergeResults(inputs)
const file = writeMerged(outDir, result)
result.merged.verification = verify(result.merged, outDir, file)
writeFileSync(file, JSON.stringify(result.merged, null, 2))
report(result.merged, outDir)
ciResultDirectory(root, outDir)
console.log(JSON.stringify({ output: file, inputs: inputs.map((input) => input.name), verification: result.merged.verification }))

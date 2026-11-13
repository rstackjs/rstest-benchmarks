import { mkdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'
import { parseArgs } from 'node:util'
import { verify } from './verify.mjs'

// The merger needs the samples and only the selected source trees, which it
// fingerprints again. One tarball avoids extracting thousands of tiny ZIP files.
export function packResult(directory, output) {
  const record = JSON.parse(readFileSync(join(directory, 'result.json'), 'utf8'))
  verify(record, directory)
  const entries = new Set(['result.json'])
  for (const group of record.plan) for (const framework of group.frameworks) {
    for (const value of [framework, group.item.id])
      if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(value)) throw new Error('Invalid workspace name')
    entries.add(`workspaces/${framework}/${group.item.id}/src`)
  }
  mkdirSync(dirname(output), { recursive: true })
  const r = spawnSync('tar', ['-czf', resolve(output), '-C', resolve(directory), ...entries], { encoding: 'utf8' })
  if (r.status !== 0) throw new Error(`Cannot package merge input: ${r.stderr}`)
  return [...entries]
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { values } = parseArgs({ options: { input: { type: 'string' }, output: { type: 'string' } } })
  if (!values.input || !values.output) throw new Error('Usage: pack-result.mjs --input <result-directory> --output <case.tar.gz>')
  console.log(JSON.stringify({ output: values.output, entries: packResult(values.input, values.output) }))
}

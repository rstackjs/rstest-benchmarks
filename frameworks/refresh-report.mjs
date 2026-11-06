import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { report } from './report.mjs'

const directory = fileURLToPath(new URL('./reports/', import.meta.url))
const readmePath = new URL('./README.md', import.meta.url)
const readme = readFileSync(readmePath, 'utf8')
const startMarker = '<!-- framework-results:start -->'
const endMarker = '<!-- framework-results:end -->'
const start = readme.indexOf(startMarker)
const end = readme.indexOf(endMarker)
if (start < 0 || end <= start)
  throw new Error('Missing or invalid framework result markers in README')
const record = JSON.parse(readFileSync(new URL('./reports/result.json', import.meta.url), 'utf8'))
if (record.status !== 'completed')
  throw new Error('Only completed comparisons can update the published reports')
const tables = report(record, directory)
writeFileSync(readmePath,
  readme.slice(0, start + startMarker.length) + '\n' + tables + '\n' + readme.slice(end),
)
console.log('Updated framework reports and README tables from published samples.')

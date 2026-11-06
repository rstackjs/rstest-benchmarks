import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { comparisonReport, readmeBlock } from './lib/report.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const { values } = parseArgs({
  options: {
    config: { type: 'string' },
    baseline: { type: 'string' },
    candidate: { type: 'string' },
    output: { type: 'string' },
    readme: { type: 'boolean' },
    check: { type: 'boolean' },
  },
})
if (Boolean(values.baseline) !== Boolean(values.candidate))
  throw new Error('Use --baseline and --candidate together')
if (values.config && values.baseline)
  throw new Error('Use either --config or --baseline/--candidate')
if (values.output && !values.baseline)
  throw new Error(
    '--output requires --baseline/--candidate; config reports define their own output paths',
  )
if (values.baseline && (values.readme || values.check))
  throw new Error('README generation/check requires a report config')
const config = values.baseline
  ? {
      reports: [
        {
          title: 'Benchmark comparison',
          output: values.output ?? 'reports/comparison.md',
          columns: [
            { label: 'Baseline', files: values.baseline.split(',') },
            { label: 'Candidate', files: values.candidate.split(',') },
          ],
        },
      ],
    }
  : JSON.parse(
      readFileSync(
        resolve(root, values.config ?? 'reports.config.json'),
        'utf8',
      ),
    )
const generated = config.reports.map((spec) => ({
  spec,
  ...comparisonReport(spec, (file) =>
    JSON.parse(readFileSync(resolve(root, file), 'utf8')),
  ),
}))
let readme = readFileSync(resolve(root, 'README.md'), 'utf8')
for (const { spec, markdown, summary, rssSummary, provenanceNote } of generated) {
  const output = resolve(root, spec.output)
  if (values.check) {
    if (readFileSync(output, 'utf8') !== markdown)
      throw new Error(`Stale report: ${spec.output}`)
  } else {
    mkdirSync(dirname(output), { recursive: true })
    writeFileSync(output, markdown)
    console.log(`Wrote ${output}`)
  }
  if ((values.readme || values.check) && spec.marker) {
    const start = `<!-- benchmark:${spec.marker}:start -->`,
      end = `<!-- benchmark:${spec.marker}:end -->`
    if (!readme.includes(start) || !readme.includes(end))
      throw new Error(`Missing README markers: ${spec.marker}`)
    const from = readme.indexOf(start) + start.length,
      to = readme.indexOf(end, from)
    const body = readmeBlock(spec, { summary, rssSummary, provenanceNote }, (file) =>
      JSON.parse(readFileSync(resolve(root, file), 'utf8')),
    )
    readme = readme.slice(0, from) + body + readme.slice(to)
  }
}
if (values.check && readme !== readFileSync(resolve(root, 'README.md'), 'utf8'))
  throw new Error('Stale README benchmark tables')
if (values.readme) writeFileSync(resolve(root, 'README.md'), readme)

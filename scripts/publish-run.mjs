// Usage: node scripts/publish-run.mjs --run <run id> [--push] [--repo owner/name]
// Publishes a finished Frameworks benchmark, Rstest coverage benchmark or Rstest
// version benchmark run. Needs GITHUB_TOKEN (or GH_TOKEN) with actions: read.
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { publishRun } from './lib/publish-run.mjs'

const { values } = parseArgs({ options: {
  run: { type: 'string' },
  repo: { type: 'string' },
  push: { type: 'boolean', default: false },
} })
if (!values.run) throw new Error('Usage: publish-run.mjs --run <run id> [--push] [--repo owner/name]')
await publishRun({
  root: fileURLToPath(new URL('..', import.meta.url)),
  repository: values.repo ?? process.env.GITHUB_REPOSITORY ?? 'rstackjs/rstest-benchmarks',
  runId: values.run,
  token: process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN,
  apiUrl: process.env.GITHUB_API_URL || 'https://api.github.com',
  push: values.push,
  summaryFile: process.env.GITHUB_STEP_SUMMARY,
})

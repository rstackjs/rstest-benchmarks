import { resolve } from 'node:path'
import { downloadFrameworkArtifacts } from './lib/framework-artifacts.mjs'

const matrix = JSON.parse(process.env.BENCH_MATRIX ?? '{}')
const selected = await downloadFrameworkArtifacts({
  repository: process.env.GITHUB_REPOSITORY,
  runId: process.env.GITHUB_RUN_ID,
  attempt: Number(process.env.GITHUB_RUN_ATTEMPT),
  cases: (matrix.include ?? []).map(item => item.name),
  token: process.env.GITHUB_TOKEN,
  output: resolve('case-results'),
  apiUrl: process.env.GITHUB_API_URL || 'https://api.github.com',
})
console.log(`Downloaded ${selected.length} verified merge inputs`)

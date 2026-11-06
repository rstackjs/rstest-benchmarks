import { appendFileSync } from 'node:fs'
import { relative } from 'node:path'

export function ciContext(env = process.env) {
  if (env.GITHUB_ACTIONS !== 'true') return undefined
  return {
    url: `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}`,
    sha: env.GITHUB_SHA,
    attempt: Number(env.GITHUB_RUN_ATTEMPT),
    job: env.GITHUB_JOB,
    runner: env.RUNNER_NAME,
    image: env.ImageVersion,
  }
}

export function ciResultDirectory(root, directory, env = process.env) {
  if (env.GITHUB_ACTIONS === 'true' && env.GITHUB_OUTPUT)
    appendFileSync(env.GITHUB_OUTPUT, `result-directory=${relative(root, directory)}\n`)
}

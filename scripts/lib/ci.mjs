import { appendFileSync, existsSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'

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

// Locates `filename` for a merge input: the file itself, a directory holding it, or a
// directory whose single subdirectory holds it (the layout of a downloaded artifact).
export function findArtifactFile(input, filename) {
  if (input.endsWith('.json')) return input
  if (existsSync(join(input, filename))) return join(input, filename)
  const nested = readdirSync(input, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(input, entry.name, filename)))
  if (nested.length !== 1) throw new Error(`${input}: expected exactly one ${filename}, found ${nested.length}`)
  return join(input, nested[0].name, filename)
}

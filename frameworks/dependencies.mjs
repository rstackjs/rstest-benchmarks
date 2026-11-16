import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { exactVersion, rstestPackages } from '../scripts/lib/sources.mjs'

export function parseRstestVersion(value) {
  if (value === undefined || value === '') return undefined
  if (exactVersion.test(value)) return { kind: 'npm', requested: value }
  // A commit-addressed pkg.pr.new URL, including the optional owner/repo prefix.
  const preview = /^https:\/\/pkg\.pr\.new\/((?:[\w.-]+\/[\w.-]+\/)?)@rstest\/core@([a-f\d]{7,40})$/.exec(value)
  if (preview) return { kind: 'preview', requested: value, prefix: preview[1], commit: preview[2] }
  throw new Error('--rstest-version requires an exact npm version (including prereleases) or a commit-addressed https://pkg.pr.new/@rstest/core@<sha> URL')
}

export function rstestSpecs(source) {
  return Object.fromEntries(rstestPackages.map(name => [
    `@rstest/${name}`,
    source.kind === 'npm' ? source.requested : `https://pkg.pr.new/${source.prefix}@rstest/${name}@${source.commit}`,
  ]))
}

export function prepareDependencies(root, source, reinstall = false) {
  const pinned = join(root, 'frameworks')
  if (!source) return { directory: pinned }
  const manifest = JSON.parse(readFileSync(join(pinned, 'package.json'), 'utf8'))
  const lock = readFileSync(join(pinned, 'pnpm-lock.yaml'))
  const workspace = readFileSync(join(pinned, 'pnpm-workspace.yaml'), 'utf8')
  const identity = createHash('sha256').update(JSON.stringify({ source, manifest, workspace })).update(lock).digest('hex').slice(0, 20)
  const directory = join(root, 'results', 'framework-dependencies', identity)
  const specs = rstestSpecs(source)
  const wanted = { ...manifest, dependencies: { ...manifest.dependencies, ...specs } }
  const ready = join(directory, 'installed.json')
  if (reinstall || !existsSync(ready) || !existsSync(join(directory, 'node_modules'))) {
    mkdirSync(directory, { recursive: true })
    rmSync(ready, { force: true })
    writeFileSync(join(directory, 'package.json'), JSON.stringify(wanted, null, 2) + '\n')
    cpSync(join(pinned, 'pnpm-lock.yaml'), join(directory, 'pnpm-lock.yaml'))
    // A standalone workspace also prevents pnpm finding the parent apps workspace.
    // Preserve the repository's native build allowlist and pinned exceptions.
    // JSON flow values are valid YAML, including URL-valued overrides.
    const exclusions = Object.keys(specs).map(name => `  - ${JSON.stringify(name)}\n`).join('')
    const config = workspace.includes('minimumReleaseAgeExclude:\n')
      ? workspace.replace('minimumReleaseAgeExclude:\n', `minimumReleaseAgeExclude:\n${exclusions}`)
      : `${workspace}\nminimumReleaseAgeExclude:\n${exclusions}`
    writeFileSync(join(directory, 'pnpm-workspace.yaml'), `${config}\noverrides: ${JSON.stringify(specs)}\n`)
    console.log(`[dependencies] Installing Rstest ${source.requested} in ${directory}`)
    const installed = spawnSync('pnpm', ['install', '--no-frozen-lockfile'], { cwd: directory, stdio: 'inherit' })
    if (installed.status !== 0) throw new Error(`Failed to install Rstest ${source.requested}; see pnpm output above (the core, browser and both coverage packages are required)`)
    // Only mark the installation reusable after checking direct and transitive imports.
    const versions = verifyRstestDependencies(directory, source)
    writeFileSync(ready, JSON.stringify({ source, versions }, null, 2))
  }
  return { directory, source: { ...source, packages: rstestSpecs(source), versions: verifyRstestDependencies(directory, source) } }
}

export function verifyRstestDependencies(directory, source) {
  const versions = {}
  for (const name of rstestPackages) {
    const id = `@rstest/${name}`
    const path = join(directory, 'node_modules', id, 'package.json')
    const pkg = JSON.parse(readFileSync(path, 'utf8'))
    if (pkg.name !== id || (source.kind === 'npm' && pkg.version !== source.requested))
      throw new Error(`Expected ${id}@${source.requested}, got ${pkg.name}@${pkg.version}`)
    versions[id] = pkg.version
    if (name !== 'core') {
      const require = createRequire(realpathSync(path))
      const core = JSON.parse(readFileSync(require.resolve('@rstest/core/package.json'), 'utf8'))
      const direct = JSON.parse(readFileSync(join(directory, 'node_modules/@rstest/core/package.json'), 'utf8'))
      if (core.version !== direct.version || require.resolve('@rstest/core/package.json') !== createRequire(join(directory, 'package.json')).resolve('@rstest/core/package.json'))
        throw new Error(`${id} resolves a different @rstest/core installation`)
    }
  }
  return versions
}

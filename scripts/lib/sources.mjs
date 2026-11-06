import { readFileSync, existsSync, readdirSync, realpathSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { hash, fileHash, filesUnder, inventory } from './provenance.mjs'

export const rstestPackages = [
  'core',
  'browser',
  'coverage-v8',
  'coverage-istanbul',
]
export const exactVersion =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/

export function parseSource(value, cwd) {
  if (exactVersion.test(value ?? ''))
    return { kind: 'npm', version: value, label: value }
  if (value?.startsWith('local:') && value.slice(6)) {
    const path = realpathSync(resolve(cwd, value.slice(6)))
    for (const name of rstestPackages) {
      const manifest = JSON.parse(
        readFileSync(join(path, 'packages', name, 'package.json')),
      )
      if (manifest.name !== `@rstest/${name}`)
        throw new Error(`Unexpected package at ${path}/packages/${name}`)
    }
    return { kind: 'local', path, label: 'local' }
  }
  throw new Error('Use an exact npm version (0.12.6) or local:/path/to/rstest')
}

export function localGit(path) {
  const git = (args) => {
    const result = spawnSync('git', args, {
      cwd: path,
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    })
    if (result.status !== 0)
      throw new Error(`Cannot record local Git state: ${result.stderr}`)
    return result.stdout.trim()
  }
  return {
    commit: git(['rev-parse', 'HEAD']),
    status: git(['status', '--porcelain']),
    diffSha256: hash(git(['diff', '--binary', 'HEAD'])),
    untracked: inventory(
      path,
      git(['ls-files', '--others', '--exclude-standard', '-z'])
        .split('\0')
        .filter(Boolean)
        .map((file) => join(path, file)),
    ),
  }
}

export function builtFiles(packageDir) {
  const files = ['dist', 'bin', 'compiled'].flatMap((name) =>
    filesUnder(join(packageDir, name)),
  )
  if (!files.some((path) => path.startsWith(join(packageDir, 'dist') + '/')))
    throw new Error(`Missing build output: ${packageDir}/dist`)
  return inventory(packageDir, files)
}

export function verifyInstalled(workspace, source) {
  const evidence = {}
  for (const app of readdirSync(join(workspace, 'apps'))) {
    const appDir = join(workspace, 'apps', app)
    const manifest = JSON.parse(readFileSync(join(appDir, 'package.json')))
    for (const name of rstestPackages) {
      const id = `@rstest/${name}`
      if (!manifest.devDependencies?.[id] && !manifest.dependencies?.[id])
        continue
      const packageDir = join(appDir, 'node_modules', id)
      const installed = JSON.parse(
        readFileSync(join(packageDir, 'package.json')),
      )
      const expected =
        source.kind === 'npm' ? source.version : source.packages[name].version
      if (installed.name !== id || installed.version !== expected)
        throw new Error(
          `${app}: expected ${id}@${expected}, resolved ${installed.version}`,
        )
      if (source.kind === 'local') {
        for (const file of source.packages[name].built.files) {
          if (fileHash(join(packageDir, file.path)) !== file.sha256)
            throw new Error(
              `${app}: installed local artifact differs: ${id}/${file.path}`,
            )
        }
      }
      const entry =
        name === 'core'
          ? join(packageDir, 'bin/rstest.js')
          : createRequire(join(appDir, 'package.json')).resolve(id)
      if (!existsSync(entry)) throw new Error(`Missing runtime entry: ${entry}`)
      evidence[`${app}/${id}`] = {
        version: installed.version,
        path: realpathSync(packageDir),
      }
    }
  }
  return evidence
}

export function sourceIdentity(source) {
  const identity =
    source.kind === 'npm'
      ? { kind: 'npm', version: source.version }
      : {
          kind: 'local',
          git: source.git,
          packages: Object.fromEntries(
            Object.entries(source.packages).map(([name, pkg]) => [
              name,
              {
                version: pkg.version,
                archiveSha256: pkg.archiveSha256,
                builtSha256: pkg.built.sha256,
              },
            ]),
          ),
        }
  return {
    ...identity,
    label: source.label,
    ...(source.workloadDependencies
      ? {
          workloadDependencies: Object.fromEntries(
            Object.entries(source.workloadDependencies).map(([app, graph]) => [
              app,
              graph.sha256,
            ]),
          ),
        }
      : {}),
    fingerprint: hash(JSON.stringify(identity)),
  }
}

// Compare the workload's resolved dependency closure, not installation paths.
// Rstest's own dependency branches may change as part of the version under test.
export function workloadDependencies(workspace, apps) {
  const resolvePackage = (from, name) => {
    for (let dir = from; ; dir = dirname(dir)) {
      const manifest = join(dir, 'node_modules', name, 'package.json')
      if (existsSync(manifest)) return realpathSync(manifest)
      if (dirname(dir) === dir) return null
    }
  }
  return Object.fromEntries(
    apps.map((app) => {
      const appDir = join(workspace, 'apps', app)
      const manifest = JSON.parse(readFileSync(join(appDir, 'package.json')))
      const visited = new Set()
      const nodes = new Set()
      const visit = (path) => {
        const pkg = JSON.parse(readFileSync(path))
        const id = `${pkg.name}@${pkg.version}:${fileHash(path)}`
        if (visited.has(path)) return id
        visited.add(path)
        const edges = {}
        for (const name of Object.keys({
          ...pkg.dependencies,
          ...pkg.optionalDependencies,
          ...pkg.peerDependencies,
        }).sort()) {
          if (name.startsWith('@rstest/')) continue
          const target = resolvePackage(dirname(path), name)
          if (
            !target &&
            !pkg.optionalDependencies?.[name] &&
            !pkg.peerDependenciesMeta?.[name]?.optional
          )
            throw new Error(`Missing workload dependency: ${id} -> ${name}`)
          edges[name] = target ? visit(target) : null
        }
        nodes.add(JSON.stringify({ id, edges }))
        return id
      }
      const roots = {}
      for (const name of Object.keys({
        ...manifest.dependencies,
        ...manifest.devDependencies,
      }).sort()) {
        if (name.startsWith('@rstest/')) continue
        const target = resolvePackage(appDir, name)
        if (!target)
          throw new Error(`Missing workload dependency: ${app}/${name}`)
        roots[name] = visit(target)
      }
      const graph = {
        roots,
        packages: [...nodes].sort().map((value) => JSON.parse(value)),
      }
      return [app, { ...graph, sha256: hash(JSON.stringify(graph)) }]
    }),
  )
}

export function verifyWorkloadDependencies(baseline, candidate) {
  for (const app of new Set([
    ...Object.keys(baseline),
    ...Object.keys(candidate),
  ])) {
    if (baseline[app]?.sha256 !== candidate[app]?.sha256)
      throw new Error(
        `Workload dependencies differ for ${app}; inspect comparison.json and both lockfiles before benchmarking`,
      )
  }
}

export function parseSources(baseline, candidates, cwd) {
  const values = (candidates ?? []).flatMap((value) =>
    value.startsWith('local:')
      ? [value]
      : value.split(',').map((item) => item.trim()),
  )
  if (!values.length) throw new Error('At least one --candidate is required')
  const sources = { baseline: parseSource(baseline, cwd) }
  const seen = new Set()
  for (const [index, value] of values.entries()) {
    const source = parseSource(value, cwd)
    const key = `${source.kind}:${source.path ?? source.version}`
    if (seen.has(key)) throw new Error(`Duplicate candidate: ${value}`)
    seen.add(key)
    sources[index === 0 ? 'candidate' : `candidate-${index + 1}`] = source
  }
  return sources
}

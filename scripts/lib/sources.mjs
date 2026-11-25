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

// A preview release publishes separate tarballs under the same repository commit.
export function parsePreview(value) {
  const match = /^(?:@rstest\/([\w-]+)@)?https:\/\/pkg\.pr\.new\/((?:[\w.-]+\/[\w.-]+\/)?)@rstest\/([\w-]+)@([a-f\d]{7,40})$/.exec(value)
  if (!match) return
  const [, installName, prefix, name, commit] = match
  if (!rstestPackages.includes(name) || (installName && installName !== name)) return
  const requested = `https://pkg.pr.new/${prefix}@rstest/core@${commit}`
  return { kind: 'preview', requested, prefix, commit }
}

export function rstestSpecs(source) {
  return Object.fromEntries(rstestPackages.map(name => {
    const id = `@rstest/${name}`
    if (source.kind === 'local') return [id, `file:${source.packages[name].archive}`]
    if (source.kind === 'preview') return [id, `https://pkg.pr.new/${source.prefix}${id}@${source.commit}`]
    return [id, source.version ?? source.requested]
  }))
}

export function parseSource(value, cwd) {
  if (exactVersion.test(value ?? ''))
    return { kind: 'npm', version: value, label: value }
  const preview = parsePreview(value)
  if (preview) return { ...preview, label: `preview ${preview.commit}` }
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
  throw new Error('Use an exact npm version (0.12.6), a commit-addressed pkg.pr.new Rstest URL, or local:/path/to/rstest')
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
  const specs = source.kind === 'preview' ? rstestSpecs(source) : null
  for (const app of readdirSync(join(workspace, 'apps'))) {
    const appDir = join(workspace, 'apps', app)
    const manifest = JSON.parse(readFileSync(join(appDir, 'package.json')))
    for (const name of rstestPackages) {
      const id = `@rstest/${name}`
      const requested = manifest.devDependencies?.[id] ?? manifest.dependencies?.[id]
      if (!requested) continue
      const packageDir = join(appDir, 'node_modules', id)
      const installed = JSON.parse(
        readFileSync(join(packageDir, 'package.json')),
      )
      if (specs && requested !== specs[id])
        throw new Error(`${app}: expected preview dependency ${specs[id]}`)
      const expected = source.kind === 'local' ? source.packages[name].version : source.version
      if (installed.name !== id || !installed.version || (expected && installed.version !== expected))
        throw new Error(
          `${app}: expected ${id}@${expected ?? requested}, resolved ${installed.name}@${installed.version}`,
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
  const identity = { kind: source.kind }
  if (source.kind === 'npm') {
    identity.version = source.version
  } else if (source.kind === 'preview') {
    identity.requested = source.requested
    identity.commit = source.commit
    identity.packages = rstestSpecs(source)
  } else {
    identity.git = source.git
    identity.packages = Object.fromEntries(
      Object.entries(source.packages).map(([name, pkg]) => [
        name,
        {
          version: pkg.version,
          archiveSha256: pkg.archiveSha256,
          builtSha256: pkg.built.sha256,
        },
      ]),
    )
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
        const isPeerOnly = (name) =>
          Boolean(pkg.peerDependencies?.[name]) &&
          !pkg.dependencies?.[name] &&
          !pkg.optionalDependencies?.[name]
        for (const name of Object.keys({
          ...pkg.dependencies,
          ...pkg.optionalDependencies,
          ...pkg.peerDependencies,
        }).sort()) {
          // Skip Rstest packages and Rstest-supplied bundler peers (e.g. rspack-vue-loader -> @rspack/core).
          if (
            name.startsWith('@rstest/') ||
            (isPeerOnly(name) && name.startsWith('@rspack/'))
          )
            continue
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
    const key = `${source.kind}:${source.path ?? source.requested ?? source.version}`
    if (seen.has(key)) throw new Error(`Duplicate candidate: ${value}`)
    seen.add(key)
    sources[index === 0 ? 'candidate' : `candidate-${index + 1}`] = source
  }
  return sources
}

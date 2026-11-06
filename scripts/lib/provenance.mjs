import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, realpathSync } from 'node:fs'
import { join, relative } from 'node:path'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import {
  cpus,
  platform,
  arch,
  release,
  totalmem,
  availableParallelism,
} from 'node:os'

export const hash = (content) =>
  createHash('sha256').update(content).digest('hex')
export const fileHash = (path) =>
  existsSync(path) ? hash(readFileSync(path)) : null

export function filesUnder(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) =>
      entry.isDirectory()
        ? filesUnder(join(dir, entry.name))
        : [join(dir, entry.name)],
    )
}

export function inventory(root, paths) {
  const files = paths
    .sort()
    .map((path) => ({ path: relative(root, path), sha256: fileHash(path) }))
  return { sha256: hash(JSON.stringify(files)), files }
}

export function machine(root) {
  const git = (args) => {
    const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' })
    return result.status === 0 ? result.stdout.trim() : null
  }
  return {
    node: process.version,
    nodePath: realpathSync(process.execPath),
    nodeVersions: process.versions,
    cpu: `${cpus()[0]?.model} × ${cpus().length}`,
    logicalCpuCount: cpus().length,
    platform: `${platform()} ${arch()}`,
    osRelease: release(),
    totalMemoryBytes: totalmem(),
    availableParallelism: availableParallelism(),
    packageManager:
      spawnSync('pnpm', ['--version'], {
        cwd: root,
        encoding: 'utf8',
      }).stdout?.trim() ?? null,
    git: {
      commit: git(['rev-parse', 'HEAD']),
      status: git(['status', '--porcelain']),
    },
    lockfileSha256: fileHash(join(root, 'pnpm-lock.yaml')),
  }
}

export function dependencies(appDir) {
  const manifest = JSON.parse(
    readFileSync(join(appDir, 'package.json'), 'utf8'),
  )
  return Object.fromEntries(
    Object.entries({ ...manifest.dependencies, ...manifest.devDependencies })
      .sort()
      .map(([name, requested]) => {
        const path = join(appDir, 'node_modules', name, 'package.json')
        return [
          name,
          existsSync(path)
            ? {
                requested,
                version: JSON.parse(readFileSync(path, 'utf8')).version,
                path: realpathSync(path),
                manifestSha256: fileHash(path),
              }
            : { requested, version: null, path: null },
        ]
      }),
  )
}

export function browserIdentity(appDir) {
  const { chromium } = createRequire(join(appDir, 'package.json'))('playwright')
  const executablePath = chromium.executablePath()
  const result = spawnSync(executablePath, ['--version'], {
    encoding: 'utf8',
    timeout: 10000,
  })
  return {
    executablePath,
    version: result.status === 0 ? result.stdout.trim() : null,
    error: result.error?.message ?? (result.status ? result.stderr : null),
  }
}

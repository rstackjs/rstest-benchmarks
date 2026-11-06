// Switch the published Rstest line used by this benchmark repository.
// Run `pnpm use-version 0.11.0` or `pnpm use-version 0.12.5`, then `pnpm install`.

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const version = process.argv[2]

if (
  !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/.test(
    version ?? '',
  )
)
  throw new Error('usage: pnpm use-version <exact published version>')

for (const app of readdirSync(join(ROOT, 'apps'))) {
  const packagePath = join(ROOT, 'apps', app, 'package.json')
  if (!existsSync(packagePath)) continue
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'))
  for (const dependencyType of [
    'dependencies',
    'devDependencies',
    'peerDependencies',
  ]) {
    for (const name of [
      '@rstest/core',
      '@rstest/browser',
      '@rstest/coverage-istanbul',
      '@rstest/coverage-v8',
    ]) {
      if (packageJson[dependencyType]?.[name])
        packageJson[dependencyType][name] = version
    }
  }
  writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`)
}

console.log(`Rstest packages set to ${version}; run pnpm install next.`)

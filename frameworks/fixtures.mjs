import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  cpSync,
  symlinkSync,
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { tsModule } from '../tools/generator/helpers.mjs'
export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const frameworks = ['jest', 'vitest', 'rstest']
export const supportedFrameworks = [...frameworks, 'vitest-vmForks', 'rstest-vmForks', 'rstest-vmThreads', 'jest-babel']
export function frameworkFamily(framework) {
  if (framework.startsWith('vitest')) return 'vitest'
  if (framework.startsWith('rstest')) return 'rstest'
  if (framework.startsWith('jest')) return 'jest'
  return framework
}
export const cases = [
  { id: 'minimal-node', fixture: true, optional: true, files: 2, tests: 2 },
  { id: 'minimal-react', fixture: true, optional: true, files: 2, tests: 2 },
  { id: 'startup', app: 'micro-utils', files: 5, tests: 18 },
  { id: 'many-files', leaves: 126, files: 400, tests: 800 },
  { id: 'module-graph', leaves: 999, files: 40, tests: 80 },
  { id: 'backend', app: 'node-backend', files: 16, tests: 45 },
  { id: 'barrel', app: 'barrel-clean', files: 20, tests: 40 },
  { id: 'react', app: 'react-spa', files: 30, tests: 54 },
]
export function write(file, text) {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, text)
}
export function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)],
  )
}
export function fingerprint(dir) {
  const hash = createHash('sha256')
  for (const path of files(dir).sort())
    hash.update(path.slice(dir.length)).update(readFileSync(path))
  return hash.digest('hex')
}
export function generate(directory, selected = frameworks) {
  const generation = join(directory, 'generation')
  cpSync(join(root, 'tools/generator'), join(generation, 'tools/generator'), {
    recursive: true,
  })
  const info = {}
  for (const item of cases) {
    const target = join(generation, 'apps', item.id)
    if (item.fixture) {
      cpSync(join(root, 'frameworks/fixtures', item.id), target, { recursive: true })
    } else if (item.app) {
      mkdirSync(target, { recursive: true })
      cpSync(
        join(root, 'apps', item.app, 'generate.mjs'),
        join(target, 'generate.mjs'),
      )
      const r = spawnSync(process.execPath, ['generate.mjs'], {
        cwd: target,
        env: { ...process.env, BARREL_SCALE: 'large' },
        encoding: 'utf8',
      })
      if (r.status !== 0) throw Error(r.stderr)
    } else {
      for (let i = 0; i < item.leaves; i++)
        write(join(target, `src/leaf${i}.ts`), tsModule(`leaf${i}`, i))
      write(
        join(target, 'src/index.ts'),
        Array.from(
          { length: item.leaves },
          (_, i) => `import { leaf${i}Compute } from './leaf${i}'`,
        ).join('\n') +
          `\nexport const values = [${Array.from({ length: item.leaves }, (_, i) => `leaf${i}Compute({ id: 1 })`).join(', ')}]\n`,
      )
      for (let i = 0; i < item.files; i++)
        write(
          join(target, `tests/t${i}.test.ts`),
          `import { test, expect } from '@rstest/core'\nimport { values } from '../src'\ntest('loads the graph', () => expect(values[0]).toEqual({ ok: true, value: 1 }))\ntest('retains the graph', () => expect(values.at(-1)).toEqual({ ok: true, value: ${item.leaves} }))\n`,
        )
    }
    if (item.id === 'react') {
      const setup = join(target, 'tests/setup.ts')
      write(
        setup,
        readFileSync(setup, 'utf8')
          .replace(
            "import * as jestDomMatchers from '@testing-library/jest-dom/matchers'",
            "import { toBeInTheDocument } from '@testing-library/jest-dom/matchers'",
          )
          .replace(
            'expect.extend(jestDomMatchers)',
            'expect.extend({ toBeInTheDocument })',
          ),
      )
    }
    info[item.id] = {
      ...item,
      sourceHash: fingerprint(join(target, 'src')),
      testHash: fingerprint(join(target, 'tests')),
    }
    for (const framework of selected) {
      const dest = join(directory, 'workspaces', framework, item.id)
      cpSync(join(target, 'src'), join(dest, 'src'), { recursive: true })
      cpSync(join(target, 'tests'), join(dest, 'tests'), { recursive: true })
      for (const path of files(join(dest, 'tests'))) {
        let text = readFileSync(path, 'utf8')
        const original = text
        if (!framework.startsWith('rstest'))
          text = text.replace(
            /import \{([^}]+)\} from '@rstest\/core'/g,
            (_, names) =>
              `import {${names.replace(/\brs\b/g, framework.startsWith('jest') ? 'jest as rs' : 'vi as rs')}} from '${framework.startsWith('jest') ? '@jest/globals' : 'vitest'}'`,
          )
        const normalized = text.replace(
          /import \{([^}]+)\} from '(?:@jest\/globals|vitest)'/g,
          (_, names) =>
            `import {${names.replace(/(?:jest|vi) as rs/g, 'rs')}} from '@rstest/core'`,
        )
        if (normalized !== original)
          throw Error(`Test adaptation mismatch: ${path}`)
        write(path, text)
      }
      write(
        join(dest, 'package.json'),
        JSON.stringify({
          private: true,
          type: 'module',
          ...(item.id === 'barrel' ? { sideEffects: false } : {}),
        }),
      )
      mkdirSync(join(dest, 'node_modules'), { recursive: true })
      for (const name of readdirSync(
        join(root, 'frameworks/node_modules'),
      ).filter((n) => !n.startsWith('.')))
        symlinkSync(
          join(root, 'frameworks/node_modules', name),
          join(dest, 'node_modules', name),
          'dir',
        )
      if (fingerprint(join(dest, 'src')) !== info[item.id].sourceHash)
        throw Error('Source mismatch')
    }
  }
  return info
}

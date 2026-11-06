import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { configure } from '../../frameworks/configs.mjs'
import { frameworkFamily } from '../../frameworks/fixtures.mjs'
import { selectedFor } from '../../frameworks/order.mjs'
const require = createRequire(import.meta.url)

test('Jest Babel retains default transform while SWC keeps its existing transform', (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'framework-babel-'))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  for (const framework of ['jest', 'jest-babel']) configure(join(directory, framework), framework, { id: 'react' })
  const swc = require(join(directory, 'jest/jest.config.cjs'))
  const babel = require(join(directory, 'jest-babel/jest.config.cjs'))
  const { transform, ...shared } = swc
  assert.equal(Object.values(transform)[0][0], '@swc/jest')
  assert.equal(Object.hasOwn(babel, 'transform'), false)
  assert.deepEqual(babel, shared)
  const presets = require(join(directory, 'jest-babel/babel.config.cjs')).presets
  assert.deepEqual(presets, [
    ['@babel/preset-env', { targets: { node: 'current' }, modules: 'commonjs' }],
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic' }],
  ])
  assert.equal(frameworkFamily('jest-babel'), 'jest')
  assert.deepEqual(selectedFor({ suite: 'browser' }, ['jest', 'jest-babel', 'vitest']), ['vitest'])
  assert.match(readFileSync(join(directory, 'jest-babel/babel.config.cjs'), 'utf8'), /preset-typescript/)
})

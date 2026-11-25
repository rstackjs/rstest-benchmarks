// minimal-node — two-file Node.js baseline aligned with frameworks/fixtures/minimal-node.
import { createApp } from '../../tools/generator/helpers.mjs'

const app = createApp(import.meta.url)

app.write('src/add.ts', `export function add(a: number, b: number) {
  return a + b
}
`)

app.write('tests/add.test.ts', `import { test, expect } from '@rstest/core'
import { add } from '../src/add'

test('adds two numbers', () => {
  expect(add(1, 2)).toBe(3)
})
`)

app.write('tests/add-negative.test.ts', `import { test, expect } from '@rstest/core'
import { add } from '../src/add'

test('adds negative numbers', () => {
  expect(add(-1, -2)).toBe(-3)
})
`)

app.report('minimal-node', '1 src module, 2 files, 2 tests')

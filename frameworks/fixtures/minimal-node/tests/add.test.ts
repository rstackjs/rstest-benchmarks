import { test, expect } from '@rstest/core'
import { add } from '../src/add'

test('adds two numbers', () => {
  expect(add(1, 2)).toBe(3)
})

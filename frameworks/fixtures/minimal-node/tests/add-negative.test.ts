import { test, expect } from '@rstest/core'
import { add } from '../src/add'

test('adds negative numbers', () => {
  expect(add(-1, -2)).toBe(-3)
})

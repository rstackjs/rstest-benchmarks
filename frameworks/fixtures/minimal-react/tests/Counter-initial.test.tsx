import { test, expect } from '@rstest/core'
import { cleanup, render } from '@testing-library/react/pure'
import { Counter } from '../src/Counter'

test('starts the counter at zero', () => {
  try {
    const { getByRole } = render(<Counter />)
    expect(getByRole('button').textContent).toBe('Count: 0')
  } finally {
    cleanup()
  }
})

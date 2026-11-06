import { test, expect } from '@rstest/core'
import { cleanup, fireEvent, render } from '@testing-library/react/pure'
import { Counter } from '../src/Counter'

test('increments the counter', () => {
  try {
    const { getByRole } = render(<Counter />)
    const button = getByRole('button')
    expect(button.textContent).toBe('Count: 0')
    fireEvent.click(button)
    expect(button.textContent).toBe('Count: 1')
  } finally {
    cleanup()
  }
})

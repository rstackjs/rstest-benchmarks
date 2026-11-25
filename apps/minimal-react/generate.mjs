// minimal-react — two-file React + jsdom baseline aligned with frameworks/fixtures/minimal-react.
import { createApp } from '../../tools/generator/helpers.mjs'

const app = createApp(import.meta.url)

app.write('src/Counter.tsx', `import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>
}
`)

app.write('tests/Counter.test.tsx', `import { test, expect } from '@rstest/core'
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
`)

app.write('tests/Counter-initial.test.tsx', `import { test, expect } from '@rstest/core'
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
`)

app.report('minimal-react', '1 src module, 2 files, 2 tests')

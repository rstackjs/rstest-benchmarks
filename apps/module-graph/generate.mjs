// module-graph — 999 eager leaf modules, 40 test files / 80 tests.
// Matches the frameworks benchmark `module-graph` workload byte-for-byte.
import { createApp, tsModule } from '../../tools/generator/helpers.mjs'

const LEAVES = 999
const FILES = 40
const app = createApp(import.meta.url)

for (let i = 0; i < LEAVES; i++)
  app.write(`src/leaf${i}.ts`, tsModule(`leaf${i}`, i))

app.write(
  'src/index.ts',
  Array.from(
    { length: LEAVES },
    (_, i) => `import { leaf${i}Compute } from './leaf${i}'`,
  ).join('\n') +
    `\nexport const values = [${Array.from({ length: LEAVES }, (_, i) => `leaf${i}Compute({ id: 1 })`).join(', ')}]\n`,
)

for (let i = 0; i < FILES; i++)
  app.write(
    `tests/t${i}.test.ts`,
    `import { test, expect } from '@rstest/core'\nimport { values } from '../src'\ntest('loads the graph', () => expect(values[0]).toEqual({ ok: true, value: 1 }))\ntest('retains the graph', () => expect(values.at(-1)).toEqual({ ok: true, value: ${LEAVES} }))\n`,
  )

app.report('module-graph', `${LEAVES + 1} src modules, ${FILES} files, ${FILES * 2} tests`)

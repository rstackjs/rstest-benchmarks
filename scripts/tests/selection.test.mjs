import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { casesFor } from '../lib/cases.mjs'
import { selectCases } from '../lib/selection.mjs'
import { suiteSteps } from '../runner.mjs'

const root = fileURLToPath(new URL('../..', import.meta.url))
function cli(script, args) {
  return spawnSync(process.execPath, [script, ...args, '--dry-run'], { cwd: root, encoding: 'utf8' })
}
const versions = ['--baseline', '0.11.0', '--candidate', '0.12.6']

test('selection trims input, excludes after inclusion and rejects invalid or empty selections', () => {
  const items = [{ id: 'a' }, { id: 'b' }]
  const options = { keys: (item) => [item.id] }
  assert.deepEqual(selectCases(items, { ...options, include: ' a, b ', exclude: 'a' }), [{ id: 'b' }])
  assert.deepEqual(selectCases(items, { ...options, include: '', exclude: '' }), items)
  for (const exclude of ['typo', 'a,a', 'a,', 'a,b'])
    assert.throws(() => selectCases(items, { ...options, exclude }))
})

test('framework CLI can exclude only browser mode while retaining the DOM case', () => {
  const result = cli('frameworks/run.mjs', ['--cases', 'backend,react', '--exclude-cases', 'browser/react/none'])
  assert.equal(result.status, 0, result.stderr)
  const { groups } = JSON.parse(result.stdout)
  assert.deepEqual(groups.map((g) => `${g.suite}/${g.item.id}`), ['main/backend', 'main/react'])
  const defaults = cli('frameworks/run.mjs', ['--exclude-cases', 'many-files'])
  assert.equal(defaults.status, 0, defaults.stderr)
  assert(JSON.parse(defaults.stdout).groups.every((g) => !g.item.optional && g.item.id !== 'many-files'))
})

test('version CLI filters across suites and skips suites left empty', () => {
  const result = cli('scripts/compare.mjs', [...versions, '--suites', 'all', '--cases', 'node-backend'])
  assert.equal(result.status, 0, result.stderr)
  const { matrix } = JSON.parse(result.stdout)
  assert.deepEqual(Object.keys(matrix), ['main', 'coverage'])
  assert.equal(matrix.main.length, 1)
  assert.deepEqual(matrix.coverage.map((item) => item.provider), ['none', 'v8', 'istanbul'])
})

test('coverage exclusion can target one provider without losing controls', () => {
  const excluded = casesFor('coverage').find((item) => item.app === 'node-backend' && item.provider === 'istanbul').id
  const result = cli('scripts/compare.mjs', [...versions, '--suites', 'coverage', '--cases', 'node-backend', '--exclude-cases', excluded])
  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(JSON.parse(result.stdout).matrix.coverage.map((item) => item.provider), ['none', 'v8'])
})

test('both CLIs fail before preparation for unknown IDs or an empty selection', () => {
  for (const [script, args, name] of [
    ['scripts/compare.mjs', versions, 'node-backend'],
    ['frameworks/run.mjs', [], 'backend'],
  ]) {
    for (const exclude of ['typo', name]) {
      const result = cli(script, [...args, '--cases', name, '--exclude-cases', exclude])
      assert.notEqual(result.status, 0)
      assert.match(result.stderr, /Unknown case|No benchmark cases selected/)
    }
  }
})

test('suite execution consumes the filtered matrix rather than restoring all cases', async () => {
  const id = casesFor('coverage').find((item) => item.app === 'node-backend' && item.provider === 'v8').id
  const output = []
  const log = console.log
  try {
    console.log = (text) => output.push(text)
    for await (const step of suiteSteps('coverage', ['--list'], { caseIds: [id] })) {}
  } finally {
    console.log = log
  }
  assert.deepEqual(JSON.parse(output[0]).cases.map((item) => item.id), [id])
})

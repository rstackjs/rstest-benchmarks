import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { configure } from '../../frameworks/configs.mjs'
import { selectedFor, orderFor } from '../../frameworks/order.mjs'
import { frameworkFamily } from '../../frameworks/fixtures.mjs'

for (const pool of ['vmForks', 'vmThreads']) test(`${pool} changes only the pool and cannot be mislabeled as browser mode`, (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'framework-pools-'))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  const item = { id: 'react' }
  configure(join(directory, 'default'), 'rstest', item)
  configure(join(directory, 'vm'), `rstest-${pool}`, item)
  const normal = readFileSync(join(directory, 'default/rstest.config.mjs'), 'utf8')
  const vm = readFileSync(join(directory, 'vm/rstest.config.mjs'), 'utf8')
  assert(vm.includes(`pool: '${pool}',`))
  assert.equal(vm.replace(`pool: '${pool}',`, ''), normal)
  const requested = ['rstest', `rstest-${pool}`]
  assert.deepEqual(selectedFor({ suite: 'main', item }, requested), requested)
  assert.deepEqual(selectedFor({ suite: 'browser', item }, requested), ['rstest'])
})

test('Vitest vmForks changes only the pool and uses the Vitest CLI and test adaptation', (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'vitest-vmforks-'))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  const item = { id: 'react' }
  configure(join(directory, 'default'), 'vitest', item)
  configure(join(directory, 'vm'), 'vitest-vmForks', item)
  const normal = readFileSync(join(directory, 'default/vitest.config.mjs'), 'utf8')
  const vm = readFileSync(join(directory, 'vm/vitest.config.mjs'), 'utf8')
  assert(vm.includes("pool: 'vmForks',"))
  assert.equal(vm.replace("pool: 'vmForks',", ''), normal)
  assert.equal(frameworkFamily('vitest-vmForks'), 'vitest')
  const requested = ['jest', 'vitest', 'vitest-vmForks', 'rstest', 'rstest-vmForks']
  assert.deepEqual(selectedFor({ suite: 'main', item }, requested), requested)
  assert.deepEqual(selectedFor({ suite: 'coverage', item }, requested), requested)
  assert.deepEqual(selectedFor({ suite: 'browser', item }, requested), ['vitest', 'rstest'])
})

test('five runners rotate in both directions and occupy each position twice in ten rounds', () => {
  const selected = ['jest', 'vitest', 'vitest-vmForks', 'rstest', 'rstest-vmForks']
  const rounds = Array.from({ length: 10 }, (_, round) => orderFor(selected, round))
  for (const order of rounds) assert.deepEqual([...order].sort(), [...selected].sort())
  for (const framework of selected)
    for (let position = 0; position < selected.length; position++)
      assert.equal(rounds.filter((order) => order[position] === framework).length, 2)
  assert.deepEqual(rounds[0], selected)
  assert.deepEqual(rounds[5], [...selected].reverse())
})

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { configure } from '../../frameworks/configs.mjs'
import { selectedFor } from '../../frameworks/order.mjs'

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

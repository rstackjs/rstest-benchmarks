import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { assertMemorySupported, assertPublishableMemory, memoryDescription, memoryKind, memoryKinds, sharedMemoryKind } from '../lib/memory.mjs'
import { execute } from '../lib/process.mjs'

const MiB = 1024 ** 2

test('memory measurement supports macOS and Linux only and never falls back to RSS', () => {
  assert.doesNotThrow(() => assertMemorySupported('darwin'))
  assert.doesNotThrow(() => assertMemorySupported('linux'))
  assert.throws(() => assertMemorySupported('win32'), /macOS.*Linux.*no RSS fallback/)
})

test('each platform records its own memory kind', () => {
  assert.equal(memoryKind('darwin'), 'macOS phys_footprint tree sum')
  assert.equal(memoryKind('linux'), 'Linux cgroup v2 anon+shmem peak')
  assert.throws(() => memoryKind('freebsd'), /no RSS fallback/)
  assert.match(memoryDescription(memoryKinds.linux), /anon.*shmem.*cgroupPeakBytes/)
  assert.match(memoryDescription(memoryKinds.darwin), /phys_footprint/)
})

test('records of different memory kinds are never mixed', () => {
  assert.equal(sharedMemoryKind([memoryKinds.darwin, null, memoryKinds.darwin]), memoryKinds.darwin)
  assert.equal(sharedMemoryKind([null]), null)
  assert.throws(() => sharedMemoryKind([memoryKinds.darwin, memoryKinds.linux], 'merge'), /merge: cannot mix memory kinds.*not comparable across platforms/)
})

test('only macOS memory data can be published', () => {
  assert.doesNotThrow(() => assertPublishableMemory(memoryKinds.darwin, 'result.json'))
  assert.throws(() => assertPublishableMemory(memoryKinds.linux, 'result.json'), /result\.json: cannot publish memory data of kind "Linux cgroup v2 anon\+shmem peak".*job summaries and artifacts only/)
  assert.throws(() => assertPublishableMemory(undefined, 'result.json'), /kind "unknown"/)
})

const macos = { skip: process.platform !== 'darwin' && 'requires macOS' }

async function peak(t, script) {
  const dir = mkdtempSync(join(tmpdir(), 'memory-test-'))
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  const result = await execute({
    command: [process.execPath, '-e', script],
    cwd: dir,
    env: process.env,
    prefix: join(dir, 'run'),
    timeoutMs: 60000,
    memory: true,
  })
  assert.equal(result.exitCode, 0, readFileSync(result.stderrPath, 'utf8'))
  assert.equal(result.error, null)
  return result.memoryBytes
}

test('footprint sums the whole process tree', macos, async (t) => {
  const idle = await peak(t, 'setTimeout(() => {}, 500)')
  assert.ok(idle > 0)
  // Five children each allocate and touch 100 MB, then stay alive for sampling.
  const child = `const b = Buffer.alloc(100 * 1024 * 1024, 1); setTimeout(() => b.length, 1500)`
  const tree = await peak(
    t,
    `const { spawn } = require('node:child_process')
     let n = 0
     for (let i = 0; i < 5; i++)
       spawn(process.execPath, ['-e', ${JSON.stringify(child)}], { stdio: 'ignore' }).on('exit', () => {})
     setTimeout(() => {}, 2500)`,
  )
  // Remove the parent and the five children's idle Node footprint (about
  // 11 MiB each); what remains is the 5 x 100 MB of touched buffers.
  const extra = (tree - 6 * idle) / MiB
  assert.ok(extra > 450 && extra < 560, `expected about +500 MiB, got ${extra.toFixed(1)}`)
})

test('missing samples yield null rather than zero', macos, async (t) => {
  const bytes = await peak(t, '0')
  assert.ok(bytes === null || bytes > 0)
})

test('timing runs start no sampler and carry no memory field', macos, async (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'memory-test-'))
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  const result = await execute({
    command: [process.execPath, '-e', 'setTimeout(() => {}, 300)'],
    cwd: dir,
    env: process.env,
    prefix: join(dir, 'timing'),
    timeoutMs: 60000,
  })
  assert.equal(result.exitCode, 0)
  assert.equal('memoryBytes' in result, false)
})

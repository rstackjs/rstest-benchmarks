// Memory sampler. macOS: sums ri_phys_footprint over the command's process tree
// every ~50 ms and reports the peak of that sum. Linux: peak of the command's
// cgroup v2 anon + shmem, sampled every ~50 ms (see cgroup.mjs). The macOS
// sampler is adapted from rstackjs/build-tools-performance (scripts/memory.ts, commit
// f9adccb), MIT License, Copyright (c) 2023 farm-fe.
import { execFile } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import { promisify } from 'node:util'
import { spawn } from 'node:child_process'
import { createCgroupSampler } from './cgroup.mjs'

const exec = promisify(execFile)
export const sampleIntervalMs = 50

// The metric differs per platform, so records name it and never mix.
export const memoryKinds = {
  darwin: 'macOS phys_footprint tree sum',
  linux: 'Linux cgroup v2 anon+shmem peak',
}

export function memoryKind(platform = process.platform) {
  const kind = memoryKinds[platform]
  if (!kind)
    throw new Error(
      `Memory measurement supports macOS (process-tree phys_footprint) and Linux (cgroup v2); got ${platform}. There is no RSS fallback.`,
    )
  return kind
}

export function assertMemorySupported(platform = process.platform) {
  memoryKind(platform)
}

export function memoryDescription(kind) {
  return kind === memoryKinds.linux
    ? "the peak of the command's cgroup v2 `anon` + `shmem` (non-reclaimable memory; page cache excluded), sampled every ~50 ms. `memory.peak` is stored per memory sample as `cgroupPeakBytes` for diagnostics only"
    : "the peak of the summed macOS physical footprint (`phys_footprint`) over the command's process tree, sampled every ~50 ms and excluding the benchmark driver"
}

// A set of records or rows must share one memory kind; null means none carries memory.
export function sharedMemoryKind(kinds, source = 'input') {
  const distinct = [...new Set(kinds.filter((kind) => kind != null))]
  if (distinct.length > 1)
    throw new Error(`${source}: cannot mix memory kinds (${distinct.join(' vs ')}); values are not comparable across platforms`)
  return distinct[0] ?? null
}

// Only macOS memory data may be published; Linux results stay in job summaries and artifacts.
export function assertPublishableMemory(kind, source) {
  if (kind !== memoryKinds.darwin)
    throw new Error(
      `${source}: cannot publish memory data of kind "${kind ?? 'unknown'}"; publication requires "${memoryKinds.darwin}". Linux results are for job summaries and artifacts only.`,
    )
}

// Compile the C helper once, before any timed run. Needs Xcode Command Line Tools.
export async function createMemorySampler() {
  if (process.platform === 'linux') return createCgroupSampler()
  assertMemorySupported()
  const directory = mkdtempSync(join(tmpdir(), 'rstest-benchmarks-memory-'))
  const binary = join(directory, 'footprint')
  const close = () => rmSync(directory, { recursive: true, force: true })
  try {
    await exec('cc', [
      '-O2',
      '-Wall',
      '-Wextra',
      join(import.meta.dirname, 'memory-footprint.c'),
      '-o',
      binary,
    ])
  } catch (cause) {
    close()
    throw new Error(
      `Failed to compile the memory-footprint helper (install Xcode Command Line Tools): ${cause.message}`,
    )
  }

  async function snapshot(rootPid) {
    for (let attempt = 0; ; attempt++) {
      try {
        const { stdout } = await exec(binary, [String(rootPid)])
        return JSON.parse(stdout)
      } catch (error) {
        // A setuid child such as ps can temporarily deny access. Retry the
        // whole snapshot so no partial process-tree total enters the results.
        if (error.code !== 75 || attempt === 9) throw error
        await sleep(10)
      }
    }
  }

  // Pay first-execution/OS validation costs before starting a measured command.
  await snapshot(process.pid)

  return {
    kind: 'darwin',
    snapshot,
    close,
    // Plain spawn plus the process-tree monitor: the child leads its own process
    // group, so the driver itself is never part of the sum.
    launch({ command, cwd, env, stdio }) {
      const child = spawn(command[0], command.slice(1), { cwd, env, detached: true, stdio })
      const exit = new Promise((resolve) => child.on('close', (exitCode, signal) => resolve({ exitCode, signal })))
      const monitor = child.pid ? this.start(child.pid) : null
      return {
        child,
        exit,
        kill: (signal) => {
          try { process.kill(-child.pid, signal) } catch (cause) { if (cause.code !== 'ESRCH') throw cause }
        },
        async stop() {
          return { memoryBytes: monitor ? await monitor.stop() : null }
        },
      }
    },
    // rootPid must be the leader of the command's own process group; the
    // benchmark driver itself is therefore never part of the sum.
    start(rootPid) {
      let peak = null
      let stopped = false
      let failure
      const loop = (async () => {
        while (!stopped) {
          const started = Date.now()
          const processes = await snapshot(rootPid)
          if (processes.length) {
            const total = processes.reduce((sum, item) => sum + item.bytes, 0)
            if (peak === null || total > peak) peak = total
          }
          if (!stopped)
            await sleep(Math.max(0, sampleIntervalMs - (Date.now() - started)))
        }
      })().catch((error) => {
        failure = error
      })
      return {
        // Peak of the per-snapshot process-tree sum, or null without samples.
        async stop() {
          stopped = true
          await loop
          if (failure) throw failure
          return peak
        },
      }
    },
  }
}

let shared
// One sampler (and one compilation) per driver process.
export function getMemorySampler() {
  if (!shared) {
    shared = createMemorySampler()
    shared.then((sampler) => process.once('exit', sampler.close), () => {})
  }
  return shared
}

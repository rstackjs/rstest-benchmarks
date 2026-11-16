// Process-tree memory sampler for macOS: sums ri_phys_footprint over the
// command's process tree every ~50 ms and reports the peak of that sum.
//
// Adapted from rstackjs/build-tools-performance (scripts/memory.ts, commit
// f9adccb), MIT License, Copyright (c) 2023 farm-fe.
import { execFile } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import { promisify } from 'node:util'

const exec = promisify(execFile)
export const sampleIntervalMs = 50

export function assertMemorySupported(platform = process.platform) {
  if (platform !== 'darwin')
    throw new Error(
      `Memory measurement requires macOS (process-tree phys_footprint); got ${platform}. There is no RSS fallback.`,
    )
}

// Compile the C helper once, before any timed run. Needs Xcode Command Line Tools.
export async function createMemorySampler() {
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
    snapshot,
    close,
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

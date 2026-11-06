import { spawn } from 'node:child_process'
import { openSync, closeSync, readFileSync } from 'node:fs'

export async function execute({
  command,
  cwd,
  env,
  prefix,
  timeoutMs,
  signal,
  graceful = false,
}) {
  const startedAt = new Date().toISOString()
  const start = performance.now()
  const stdoutPath = `${prefix}.stdout.log`
  const stderrPath = `${prefix}.stderr.log`
  const stdout = openSync(stdoutPath, 'wx')
  const stderr = openSync(stderrPath, 'wx')
  let timedOut = false
  let interrupted = false
  let error = null
  let killTimer
  const child = spawn(command[0], command.slice(1), {
    cwd,
    env,
    detached: process.platform !== 'win32',
    stdio: ['ignore', stdout, stderr],
  })
  const stop = () => {
    const kill = (signal) => {
      try {
        if (process.platform === 'win32') child.kill(signal)
        else process.kill(-child.pid, signal)
      } catch (cause) {
        if (cause.code !== 'ESRCH') error = cause.message
      }
    }
    kill(graceful ? 'SIGTERM' : 'SIGKILL')
    if (graceful && !killTimer) killTimer = setTimeout(() => kill('SIGKILL'), 2000)
  }
  const abort = () => {
    interrupted = true
    stop()
  }
  const timer = setTimeout(() => {
    timedOut = true
    stop()
  }, timeoutMs)
  signal?.addEventListener('abort', abort, { once: true })
  if (signal?.aborted) abort()
  const result = await new Promise((resolve) => {
    child.on('error', (cause) => {
      error = cause.message
    })
    child.on('close', (exitCode, exitSignal) =>
      resolve({ exitCode, signal: exitSignal }),
    )
  })
  clearTimeout(timer)
  clearTimeout(killTimer)
  signal?.removeEventListener('abort', abort)
  closeSync(stdout)
  closeSync(stderr)
  return {
    startedAt,
    endedAt: new Date().toISOString(),
    wallMs: performance.now() - start,
    ...result,
    timedOut,
    interrupted,
    error,
    stdoutPath,
    stderrPath,
  }
}

export function reportCounts(output, expectedFiles, expectedTests) {
  // Only accept the reporter's complete JSON summary, not test console output.
  const blocks = [...output.matchAll(/```json\s*([\s\S]*?)```/g)]
  for (const block of blocks.reverse()) {
    let report
    try {
      report = JSON.parse(block[1])
    } catch {
      continue
    }
    const counts = report.counts ?? report.summary ?? report
    if (!Number.isInteger(counts.testFiles)) continue
    if (
      counts.testFiles !== expectedFiles ||
      !Number.isInteger(counts.passedTests) ||
      counts.passedTests <= 0 ||
      counts.failedFiles !== 0 ||
      counts.failedTests !== 0 ||
      (counts.tests != null && counts.tests !== counts.passedTests) ||
      (counts.skippedTests ?? 0) !== 0 ||
      (counts.todoTests ?? 0) !== 0 ||
      (expectedTests != null && counts.passedTests !== expectedTests)
    )
      throw new Error(
        `Unexpected test counts: ${JSON.stringify(counts)}; expected ${expectedFiles} files / ${expectedTests ?? 'positive'} passing tests`,
      )
    return counts
  }
  throw new Error('Missing structured Markdown reporter summary')
}

export function readRss(path, platform) {
  const output = readFileSync(path, 'utf8')
  const match =
    platform === 'darwin'
      ? output.match(/(\d+)\s+maximum resident set size/i)
      : output.match(/maximum resident set size \(kbytes\):\s+(\d+)/i)
  if (!match) throw new Error('Missing /usr/bin/time maximum resident set size')
  return Number(match[1]) * (platform === 'darwin' ? 1 : 1024)
}

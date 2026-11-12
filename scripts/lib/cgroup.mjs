// Linux memory sampler: runs each measured command in its own cgroup v2 and
// samples that cgroup's memory.stat (anon + shmem) every ~50 ms. memory.peak is
// read once at the end as a diagnostic.
//
// Two ways to get a cgroup are supported and detected at startup:
//   direct  - a writable cgroup v2 tree (for example a container with a private
//             cgroup namespace): a child cgroup is created per run.
//   systemd - `sudo systemd-run --scope` (GitHub-hosted Ubuntu runners): a
//             transient scope per run, running as the invoking user.
// Each command runs under a small `sh` wrapper that also starts a `sleep` holder,
// so the cgroup outlives the command and its counters can be read after it exits.
import { execFileSync, spawn, spawnSync } from 'node:child_process'
import {
  existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync,
  rmSync, rmdirSync, writeFileSync, accessSync, constants,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'

export const sampleIntervalMs = 50
const root = '/sys/fs/cgroup'
const wrapper = [
  'ef=$1; shift',
  // Direct mode moves the shell into the run's cgroup before anything forks.
  '[ -n "$CGROUP_DIR" ] && echo $$ > "$CGROUP_DIR/cgroup.procs"',
  'sleep 86400 & holder=$!',
  '"$@"; code=$?',
  'printf %s "$code" > "$ef.tmp" && mv "$ef.tmp" "$ef"',
  'wait "$holder"',
].join('\n')

const fail = (message) => {
  throw new Error(`${message} There is no RSS fallback.`)
}
const ownCgroup = () => {
  const line = readFileSync('/proc/self/cgroup', 'utf8').split('\n').find((entry) => entry.startsWith('0::'))
  return line ? line.slice(3) : null
}

// Direct mode needs the memory controller delegated to our own cgroup's children.
// A cgroup with member processes cannot delegate, so move them into a child first.
function prepareDirect(base) {
  const controllers = (dir) => readFileSync(join(dir, 'cgroup.controllers'), 'utf8').split(/\s+/)
  const subtree = () => readFileSync(join(base, 'cgroup.subtree_control'), 'utf8').split(/\s+/)
  if (!controllers(base).includes('memory')) return false
  if (!subtree().includes('memory')) {
    const holder = join(base, 'driver')
    mkdirSync(holder, { recursive: true })
    for (const pid of readFileSync(join(base, 'cgroup.procs'), 'utf8').split(/\s+/).filter(Boolean))
      try { writeFileSync(join(holder, 'cgroup.procs'), pid) } catch { /* exited */ }
    writeFileSync(join(base, 'cgroup.subtree_control'), '+memory')
  }
  return true
}

function detect() {
  if (!existsSync(join(root, 'cgroup.controllers')))
    fail('Linux memory measurement needs cgroup v2 mounted at /sys/fs/cgroup.')
  const own = ownCgroup()
  if (own !== null) {
    const base = join(root, own)
    try {
      accessSync(base, constants.W_OK)
      if (prepareDirect(base)) return { mode: 'direct', base }
    } catch { /* not writable: try systemd */ }
  }
  const sudo = spawnSync('sudo', ['-n', 'true'])
  const systemd = spawnSync('systemd-run', ['--version'])
  if (sudo.status === 0 && systemd.status === 0 && existsSync('/run/systemd/system')) {
    // Learn where transient scopes live (normally system.slice/<unit>.scope).
    const unit = `rstest-bench-probe-${process.pid}`
    const probe = spawnSync('sudo', ['-n', 'systemd-run', '--scope', '--quiet', `--unit=${unit}`, '-p', 'MemoryAccounting=yes', '--', 'cat', '/proc/self/cgroup'], { encoding: 'utf8' })
    const path = probe.stdout?.split('\n').find((entry) => entry.startsWith('0::'))?.slice(3)
    if (probe.status === 0 && path?.includes(unit)) return { mode: 'systemd', template: path.replace(unit, '%UNIT%') }
  }
  return fail(
    'Linux memory measurement needs a writable cgroup v2 tree (e.g. a container with a private cgroup namespace) or sudo with systemd-run, and neither is available.',
  )
}

const statTotal = (dir) => {
  let anon = 0
  let shmem = 0
  for (const line of readFileSync(join(dir, 'memory.stat'), 'utf8').split('\n')) {
    const [key, value] = line.split(' ')
    if (key === 'anon') anon = Number(value)
    else if (key === 'shmem') shmem = Number(value)
  }
  return anon + shmem
}
const readPeak = (dir) => {
  try { return Number(readFileSync(join(dir, 'memory.peak'), 'utf8')) } catch { return null }
}

export function createCgroupSampler() {
  const environment = detect()
  let sequence = 0
  const directory = mkdtempSync(join(tmpdir(), 'rstest-benchmarks-cgroup-'))
  const close = () => rmSync(directory, { recursive: true, force: true })

  function launch({ command, cwd, env, stdio }) {
    const id = `rstest-bench-${process.pid}-${sequence++}`
    const exitFile = join(directory, id)
    let cgroup
    let child
    let scopeKill
    if (environment.mode === 'direct') {
      cgroup = join(environment.base, id)
      mkdirSync(cgroup)
      child = spawn('sh', ['-c', wrapper, 'sh', exitFile, ...command], {
        cwd, stdio, detached: true, env: { ...env, CGROUP_DIR: cgroup },
      })
      scopeKill = (signal) => {
        try { process.kill(-child.pid, signal) } catch { /* gone */ }
        if (signal === 'SIGKILL') try { writeFileSync(join(cgroup, 'cgroup.kill'), '1') } catch { /* gone */ }
      }
    } else {
      cgroup = join(root, environment.template.replace('%UNIT%', id))
      child = spawn('sudo', [
        '-n', '--preserve-env', 'systemd-run', '--scope', '--quiet', '--collect', `--unit=${id}`,
        '-p', 'MemoryAccounting=yes', `--uid=${process.getuid()}`, `--gid=${process.getgid()}`,
        `--setenv=PATH=${env.PATH ?? process.env.PATH}`, '--', 'sh', '-c', wrapper, 'sh', exitFile, ...command,
      ], { cwd, stdio, detached: true, env })
      scopeKill = (signal) => {
        spawnSync('sudo', ['-n', 'systemctl', 'kill', '-s', signal, `${id}.scope`])
      }
    }
    const closed = new Promise((resolve) => child.on('close', (exitCode, signal) => resolve({ exitCode, signal })))
    child.on('error', () => {})
    // The command is done when the wrapper wrote its exit code (the scope stays
    // alive for the holder) or, if it never got that far, when the wrapper ends.
    const exit = (async () => {
      for (;;) {
        if (existsSync(exitFile)) return { exitCode: Number(readFileSync(exitFile, 'utf8')), signal: null }
        const ended = await Promise.race([closed, sleep(10).then(() => null)])
        if (ended) return existsSync(exitFile) ? { exitCode: Number(readFileSync(exitFile, 'utf8')), signal: null } : ended
      }
    })()

    let peak = null
    let stopped = false
    const sampling = (async () => {
      while (!stopped) {
        const started = Date.now()
        try {
          const total = statTotal(cgroup)
          if (peak === null || total > peak) peak = total
        } catch { /* cgroup not created yet or already gone */ }
        if (!stopped) await sleep(Math.max(0, sampleIntervalMs - (Date.now() - started)))
      }
    })()

    return {
      child,
      exit,
      kill: scopeKill,
      // Final sample and memory.peak, then kill leftovers and remove the cgroup.
      async stop() {
        stopped = true
        await sampling
        let cgroupPeakBytes = null
        try {
          const total = statTotal(cgroup)
          if (peak === null || total > peak) peak = total
          cgroupPeakBytes = readPeak(cgroup)
        } catch { /* already gone (e.g. the run was killed) */ }
        scopeKill('SIGKILL')
        await closed
        if (environment.mode === 'direct')
          for (let attempt = 0; attempt < 50; attempt++) {
            try { rmdirSync(cgroup); break } catch { await sleep(20) }
          }
        rmSync(exitFile, { force: true })
        return { memoryBytes: peak, cgroupPeakBytes }
      },
    }
  }
  return { kind: 'linux', mode: environment.mode, launch, close }
}

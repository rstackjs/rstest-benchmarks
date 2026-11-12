// Usage: node measure.mjs [--cwd DIR] [--workers-env VAR] -- command args...
// Runs the command under /usr/bin/time -v inside this container's cgroup and prints one JSON line.
import { spawn, spawnSync, fork } from 'node:child_process'
import { readFileSync, mkdirSync, rmSync, readdirSync, existsSync } from 'node:fs'
const argv = process.argv.slice(2)
const sep = argv.indexOf('--')
const opts = argv.slice(0, sep), cmd = argv.slice(sep + 1)
const get = (k) => { const i = opts.indexOf(k); return i < 0 ? undefined : opts[i + 1] }
const cwd = get('--cwd') ?? '/'
const slotVar = get('--slot-var')
const MiB = 1048576
const cg = '/sys/fs/cgroup' + readFileSync('/proc/self/cgroup', 'utf8').trim().split('\n').pop().split('::')[1] + '/'
if (get('--cold') === '1') for (const p of ['.cache', 'node_modules/.cache', 'node_modules/.vite', 'node_modules/.vite-temp', 'dist', '.rstest-results', 'coverage']) rmSync(`${cwd}/${p}`, { recursive: true, force: true })
const env = { ...process.env, CI: 'true', NO_COLOR: '1', LC_ALL: 'C', NODE_DISABLE_COMPILE_CACHE: '1', RTL_SKIP_AUTO_CLEANUP: 'true' }
delete env.NODE_COMPILE_CACHE
rmSync('/tmp/m', { recursive: true, force: true }); mkdirSync('/tmp/m/workers', { recursive: true })
env.FRAMEWORK_REPORT = '/tmp/m/counts.json'
if (slotVar) { env.BENCH_WORKER_REPORT_DIR = '/tmp/m/workers'; env.BENCH_WORKER_SLOT_VARIABLE = slotVar }
const sampler = fork(new URL('./sampler.mjs', import.meta.url).pathname, ['/tmp/m/series.json'])
await new Promise((r) => sampler.once('message', r))
const peak0 = Number(readFileSync(cg + 'memory.peak', 'utf8'))
const start = Date.now()
import { openSync } from 'node:fs'
const logFd = openSync('/tmp/m/out.txt', 'w')
const child = spawn('/usr/bin/time', ['-v', '-o', '/tmp/m/time.txt', ...cmd], { cwd, env, stdio: ['ignore', logFd, logFd], detached: true })
let timedOut = false
const killer = setTimeout(() => { timedOut = true; try { process.kill(-child.pid, 'SIGKILL') } catch {} }, 150000)
let spawnError = null
const code = await new Promise((r) => { child.on('exit', (c) => r(c)); child.on('error', (e) => { spawnError = `${e.code ?? ''} ${e.message}`; r(-1) }) })
clearTimeout(killer)
const wallMs = Date.now() - start
const procsAtEnd = readFileSync(cg + 'cgroup.procs', 'utf8').trim().split('\n').length
const peakAfter = Number(readFileSync(cg + 'memory.peak', 'utf8'))
const statAfter = readFileSync(cg + 'memory.stat', 'utf8')
sampler.kill('SIGTERM')
await new Promise((r) => sampler.on('exit', r))
const rows = JSON.parse(readFileSync('/tmp/m/series.json', 'utf8'))
let maxCur = 0, maxAnon = 0, atPeak = null
for (const [t, cur, s] of rows) { if (t > start - 0) {} ; if (cur > maxCur) { maxCur = cur; atPeak = s } ; if (s.anon > maxAnon) maxAnon = s.anon }
const time = existsSync('/tmp/m/time.txt') ? readFileSync('/tmp/m/time.txt', 'utf8') : ''
const maxrssKb = Number((time.match(/Maximum resident set size \(kbytes\): (\d+)/) ?? [])[1])
let counts = null; try { counts = JSON.parse(readFileSync('/tmp/m/counts.json', 'utf8')) } catch {}
let workers = null
try { const ids = readdirSync('/tmp/m/workers').map((f) => JSON.parse(readFileSync('/tmp/m/workers/' + f, 'utf8'))); workers = { slots: new Set(ids.map((w) => w.slotId)).size, processes: new Set(ids.map((w) => w.pid)).size } } catch {}
const stat = Object.fromEntries(statAfter.trim().split('\n').map((l) => l.split(' ')).map(([k, v]) => [k, Number(v)]))
const tail = (code === 0 && !timedOut && !spawnError) ? undefined : (existsSync('/tmp/m/out.txt') ? readFileSync('/tmp/m/out.txt', 'utf8').slice(-800) : '')
console.log(JSON.stringify({
  timedOut, spawnError, tail, procsAtEnd, exit: code, wallMs,
  peakMiB: peakAfter / MiB, peakBeforeMiB: peak0 / MiB,
  sampledPeakMiB: maxCur / MiB, sampledPeakAnonMiB: maxAnon / MiB, anonAtPeakMiB: atPeak ? atPeak.anon / MiB : null, fileAtPeakMiB: atPeak ? atPeak.file / MiB : null, shmemAtPeakMiB: atPeak ? (atPeak.shmem ?? 0) / MiB : null,
  endAnonMiB: stat.anon / MiB, endFileMiB: stat.file / MiB, samples: rows.length,
  maxrssMiB: maxrssKb / 1024, counts: counts && { files: counts.files, tests: counts.tests, passed: counts.passed, failed: counts.failed, skipped: counts.skipped, errors: counts.errors }, workers,
}))

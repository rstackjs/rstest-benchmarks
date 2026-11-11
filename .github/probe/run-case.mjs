// Usage: node run-case.mjs CASE RUNS OUT.jsonl
// For one case: every framework x worker setting, RUNS interleaved rounds (cell order rotated per round),
// drop_caches before each measurement, each measurement in its own transient systemd scope.
import { spawnSync } from 'node:child_process'
import { appendFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import os from 'node:os'
const [caseId, runsArg, out] = process.argv.slice(2)
const runs = Number(runsArg)
const root = process.env.GITHUB_WORKSPACE
const { cases } = await import(pathToFileURL(join(root, 'frameworks/fixtures.mjs')))
const item = cases.find((c) => c.id === caseId)
if (!item) throw Error('unknown case ' + caseId)
const NM = join(root, 'frameworks/node_modules')
const WS = join(root, 'results/ws/workspaces')
const family = (f) => f.split('-')[0]
const bin = { jest: join(NM, 'jest/bin/jest.js'), vitest: join(NM, 'vitest/vitest.mjs'), rstest: join(NM, '@rstest/core/bin/rstest.js') }
const slot = { jest: 'JEST_WORKER_ID', vitest: 'VITEST_POOL_ID', rstest: 'RSTEST_WORKER_ID' }
const fws = ['jest', 'vitest', 'rstest', 'vitest-vmForks', 'rstest-vmForks']
const settings = ['default', 'mw4']
const cmdFor = (fw, setting) => {
  const fam = family(fw)
  const base = fam === 'jest' ? ['--config', 'jest.config.cjs'] : ['run', '--config', fam + '.config.mjs']
  const w = setting === 'mw4' ? (fam === 'rstest' ? ['--pool.maxWorkers', '4'] : ['--maxWorkers=4']) : []
  return ['node', bin[fam], ...base, ...w]
}
const cells = fws.flatMap((framework) => settings.map((setting) => ({ framework, setting })))
const dropCaches = () => spawnSync('sudo', ['sh', '-c', 'sync; echo 3 > /proc/sys/vm/drop_caches'])
const scope = (args) => spawnSync('sudo', ['systemd-run', '--scope', '--quiet', '-p', 'MemoryAccounting=yes',
  `--uid=${process.getuid()}`, `--gid=${process.getgid()}`, `--setenv=PATH=${process.env.PATH}`, `--setenv=HOME=${process.env.HOME}`, '--', ...args], { encoding: 'utf8' })
const parse = (r) => { try { return JSON.parse(r.stdout.trim().split('\n').pop()) } catch { return { error: (r.stderr || r.stdout || '').slice(0, 400) } } }
const host = { cpus: os.cpus().length, cpu: os.cpus()[0]?.model, totalMemMiB: os.totalmem() / 1048576, node: process.version, kernel: os.release(), load: os.loadavg() }
const emit = (row) => { appendFileSync(out, JSON.stringify({ case: caseId, host, ...row }) + '\n'); return row }
const probe = join(root, '.github/probe/measure.mjs')
for (let i = 0; i < runs; i++) {
  dropCaches()
  const j = parse(scope(['node', probe, '--', 'sleep', '1']))
  emit({ kind: 'idle', run: i, ...j })
}
for (let run = 0; run < runs; run++) {
  const k = run % cells.length
  for (const { framework, setting } of [...cells.slice(k), ...cells.slice(0, k)]) {
    const cwd = join(WS, framework, caseId)
    dropCaches()
    const t0 = Date.now()
    const j = parse(scope(['node', probe, '--cwd', cwd, '--cold', '1', '--slot-var', slot[family(framework)], '--', ...cmdFor(framework, setting)]))
    const c = j.counts
    const ok = j.exit === 0 && c && c.files === item.files && c.tests === item.tests && c.passed === item.tests && c.failed === 0 && !c.skipped && !c.errors
    emit({ kind: 'run', framework, setting, run, ok: !!ok, ...j })
    console.log(`${caseId} ${framework} ${setting} #${run} ok=${!!ok} peak=${j.peakMiB?.toFixed(0)} anon=${j.sampledPeakAnonMiB?.toFixed(0)} maxrss=${j.maxrssMiB?.toFixed(0)} wall=${j.wallMs} workers=${JSON.stringify(j.workers)} ${j.error ?? ''}`)
  }
}

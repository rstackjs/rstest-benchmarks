// Samples cgroup v2 memory.current + memory.stat (anon/file/shmem) every 10 ms; writes the series on SIGTERM.
import { readFileSync, writeFileSync } from 'node:fs'
const cg = '/sys/fs/cgroup' + readFileSync('/proc/self/cgroup', 'utf8').trim().split('\n').pop().split('::')[1] + '/'
const t0 = process.hrtime.bigint()
const rows = []
const stat = () => {
  const o = {}
  for (const l of readFileSync(cg + 'memory.stat', 'utf8').split('\n')) { const [k, v] = l.split(' '); if (k === 'anon' || k === 'file' || k === 'shmem' || k === 'file_mapped') o[k] = Number(v) }
  return o
}
const tick = () => {
  const cur = Number(readFileSync(cg + 'memory.current', 'utf8'))
  rows.push([Number(process.hrtime.bigint() - t0) / 1e6, cur, stat()])
}
const timer = setInterval(tick, 10)
const done = () => { clearInterval(timer); tick(); writeFileSync(process.argv[2], JSON.stringify(rows)); process.exit(0) }
process.on('SIGTERM', done)
process.send?.('ready')

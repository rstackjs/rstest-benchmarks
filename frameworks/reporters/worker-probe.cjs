const { existsSync, writeFileSync } = require('node:fs')
const { join } = require('node:path')
const { threadId } = require('node:worker_threads')

const directory = process.env.BENCH_WORKER_REPORT_DIR
if (directory) {
  const slotVariable = process.env.BENCH_WORKER_SLOT_VARIABLE
  const slotId = process.env[slotVariable]
  const path = join(directory, `${process.pid}-${threadId}.json`)
  // Fork isolation can recycle a slot into a new process; VM files can reuse it.
  if (!existsSync(path)) writeFileSync(path, JSON.stringify({
    slotVariable,
    slotId: slotId ?? null,
    pid: process.pid,
    threadId,
  }))
}

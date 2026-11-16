import { createHash } from 'node:crypto'

// Keep samples and comparison evidence; full execution artifacts stay external.
export function reportInput(source) {
  const document = JSON.parse(source)
  if (document.schemaVersion !== 2 || !document.meta || !Array.isArray(document.results))
    throw new Error('Report publication requires a schema v2 result')
  if (document.status === 'running')
    throw new Error('Wait for the benchmark run to finish before publishing')
  if (document.meta.publication)
    throw new Error('Export from the original result, not an already published input')

  delete document.generations
  for (const key of ['cwd', 'nodePath', 'invocation']) delete document.meta[key]
  if (document.meta.runner) delete document.meta.runner.files
  for (const git of [document.meta.git, document.meta.source?.git]) {
    if (!git) continue
    if (typeof git.status === 'string') {
      git.dirty = git.status.length > 0
      delete git.status
    }
    if (git.untracked) delete git.untracked.files
  }
  document.meta.publication = {
    format: 1,
    sourceSha256: createHash('sha256').update(source).digest('hex'),
  }

  for (const row of document.results) {
    for (const key of ['cwd', 'stats', 'memoryStats']) delete row[key]
    for (const key of ['fixture', 'configs']) {
      if (row[key]) delete row[key].files
    }
    for (const dependency of Object.values(row.dependencies ?? {}))
      delete dependency.path
    if (row.browser) delete row.browser.executablePath
    for (const sample of [...row.samples, ...(row.memorySamples ?? [])]) {
      for (const key of ['command', 'stdoutPath', 'stderrPath']) delete sample[key]
    }
  }
  return document
}

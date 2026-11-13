import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { reportInput } from '../lib/publish.mjs'
import { comparisonReport } from '../lib/report.mjs'

test('publication preserves measurements and compatibility checks without local artifacts', () => {
  const document = {
    schemaVersion: 2, runId: 'run', suite: 'coverage', status: 'completed',
    meta: {
      node: 'v24.11.1', cpu: 'test', platform: 'test', cwd: '/local/workspace',
      git: { commit: 'revision', status: '?? private-notes.md' },
      source: { kind: 'local', git: { commit: 'source-revision', status: '', untracked: { sha256: 'untracked', files: ['private-file'] } } },
      options: { runs: 3 }, runner: { sha256: 'runner', files: ['source'] },
    },
    generations: [{ command: ['/local/generator'] }],
    results: [{
      app: 'fixture', name: 'fixture', status: 'passed', expectedFiles: 1, tests: 2,
      fixture: { sha256: 'fixture', files: ['source'] },
      configs: { sha256: 'config', files: ['config'] },
      dependencies: { '@rstest/core': { version: '0.12.5', path: '/local/install' } },
      samples: [100, 10, 20, 30].map((wallMs, index) => ({
        phase: index ? 'timed' : 'warmup', status: 'passed', wallMs,
        order: index, counts: { tests: 2 },
        command: ['/local/node'], stdoutPath: 'logs/output',
      })),
      memorySamples: [10, 20, 30].map((wallMs, index) => ({
        phase: 'timed', status: 'passed', memoryBytes: wallMs * 1024, order: index,
        command: ['/local/node'], stdoutPath: 'logs/memory-output',
      })),
    }, {
      app: 'failure', status: 'failed',
      samples: [{ phase: 'timed', status: 'failed', wallMs: 7, exitCode: 1 }],
    }, { app: 'skip', status: 'skipped', reason: 'unsupported', samples: [] }],
  }
  const source = JSON.stringify(document)
  const exported = reportInput(source)
  assert.equal(exported.meta.publication.sourceSha256, createHash('sha256').update(source).digest('hex'))
  assert.equal(exported.results[0].fixture.sha256, 'fixture')
  assert.equal(exported.meta.cwd, undefined)
  assert.deepEqual(exported.meta.git, { commit: 'revision', dirty: true })
  assert.deepEqual(exported.meta.source.git, { commit: 'source-revision', dirty: false, untracked: { sha256: 'untracked' } })
  assert.equal(exported.generations, undefined)
  assert.equal(exported.meta.runner.files, undefined)
  assert.equal(exported.results[0].fixture.files, undefined)
  assert.equal(exported.results[0].dependencies['@rstest/core'].path, undefined)
  assert.equal(exported.results[0].samples[0].command, undefined)
  assert.equal(exported.results[0].memorySamples[0].command, undefined)
  assert.equal(exported.results[0].memorySamples[0].stdoutPath, undefined)
  assert.deepEqual(exported.results[1], document.results[1])
  assert.deepEqual(exported.results[2], document.results[2])
  const spec = { columns: [
    { label: 'Base', files: ['base'] }, { label: 'Candidate', files: ['candidate'] },
  ] }
  const original = comparisonReport(spec, () => document)
  const published = comparisonReport(spec, () => exported)
  assert.equal(original.summary, published.summary)
  assert.equal(original.markdown.split('## Inputs and provenance')[0], published.markdown.split('## Inputs and provenance')[0])
  const otherHost = structuredClone(exported)
  otherHost.meta.node = 'v24.12.0'
  assert.match(comparisonReport(spec, file => file === 'base' ? exported : otherHost).summary, /incompatible: node/)
  assert.throws(() => reportInput(JSON.stringify(exported)), /original result/)
  assert.throws(() => reportInput(JSON.stringify({ ...document, status: 'running' })), /finish/)
})

test('export CLI keeps source intact and refuses to overwrite an existing file', () => {
  const dir = mkdtempSync(join(tmpdir(), 'rstest-publish-'))
  try {
    const source = JSON.stringify({ schemaVersion: 2, status: 'completed', meta: {}, results: [] })
    const input = join(dir, 'result.json'), output = join(dir, 'published.json')
    writeFileSync(input, source)
    const cli = (...args) => spawnSync(process.execPath, ['scripts/export-report-input.mjs', ...args], {
      cwd: fileURLToPath(new URL('../..', import.meta.url)), encoding: 'utf8',
    })
    assert.equal(cli(input, output).status, 0)
    assert.equal(readFileSync(input, 'utf8'), source)
    const saved = readFileSync(output, 'utf8')
    assert.notEqual(cli(input, output).status, 0)
    assert.equal(readFileSync(output, 'utf8'), saved)
    assert.notEqual(cli(input, input).status, 0)
    assert.equal(readFileSync(input, 'utf8'), source)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

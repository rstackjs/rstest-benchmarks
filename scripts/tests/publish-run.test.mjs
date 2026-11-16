import assert from 'node:assert/strict'
import { test } from 'node:test'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { classifyRun, extractComparisonArchive, selectPublishArtifacts } from '../lib/publish-run.mjs'

const run = (extra = {}) => ({ id: 77, name: 'Frameworks benchmark', path: '.github/workflows/benchmark-frameworks.yml', status: 'completed', conclusion: 'success', run_attempt: 2, ...extra })
const artifact = (name, extra = {}) => ({ id: Math.floor(Math.random() * 1e6), name, expired: false, digest: `sha256:${'a'.repeat(64)}`, ...extra })

test('only completed, successful benchmark runs can be published', () => {
  assert.equal(classifyRun(run()).kind, 'frameworks')
  assert.equal(classifyRun(run({ path: '.github/workflows/benchmark-version-coverage.yml@refs/heads/main' })).kind, 'coverage')
  assert.equal(classifyRun(run({ path: '.github/workflows/benchmark-versions.yml' })).kind, 'versions')
  assert.throws(() => classifyRun(run({ status: 'in_progress', conclusion: null })), /not completed/)
  assert.throws(() => classifyRun(run({ conclusion: 'failure' })), /concluded with "failure"/)
  assert.throws(() => classifyRun(run({ path: '.github/workflows/other.yml', name: 'Other' })), /not a benchmark workflow/)
})

test('framework runs select the latest per-case result artifact of each case', () => {
  const workflow = classifyRun(run())
  const artifacts = [
    artifact('benchmark-frameworks-result-barrel-77-1'),
    artifact('benchmark-frameworks-result-barrel-77-2'),
    artifact('benchmark-frameworks-result-react-browser-77-1'),
    artifact('benchmark-frameworks-case-barrel-77-2'),
    artifact('benchmark-frameworks-result-barrel-78-1'),
  ]
  const selected = selectPublishArtifacts(workflow, artifacts, run())
  assert.deepEqual(selected.map((a) => `${a.caseName}:${a.sourceAttempt}`).sort(), ['barrel:2', 'react-browser:1'])
  assert.throws(() => selectPublishArtifacts(workflow, [artifact('benchmark-frameworks-case-barrel-77-1')], run()), /no per-case result artifacts/)
  assert.throws(() => selectPublishArtifacts(workflow, [artifact('benchmark-frameworks-result-barrel-77-2', { expired: true })], run()), /expired/)
})

test('comparison runs need exactly one unexpired merged artifact for the latest attempt', () => {
  const workflow = classifyRun(run({ path: '.github/workflows/benchmark-version-coverage.yml' }))
  const name = (attempt) => `benchmark-version-coverage-merged-macOS-77-${attempt}`
  assert.equal(selectPublishArtifacts(workflow, [artifact(name(1)), artifact(name(2))], run())[0].name, name(2))
  assert.throws(() => selectPublishArtifacts(workflow, [artifact('benchmark-version-coverage-case-a-macOS-77-1')], run()), /no benchmark-version-coverage-merged-/)
  assert.throws(() => selectPublishArtifacts(workflow, [artifact(name(2), { expired: true })], run()), /expired/)
  assert.throws(() => selectPublishArtifacts(workflow, [artifact(name(2)), artifact(`benchmark-version-coverage-merged-Linux-77-2`)], run()), /Ambiguous/)
})

function zipOf(t, files) {
  const dir = mkdtempSync(join(tmpdir(), 'publish-run-'))
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  const source = join(dir, 'source')
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(join(source, path, '..'), { recursive: true })
    writeFileSync(join(source, path), content)
  }
  const zip = join(dir, 'a.zip')
  const result = spawnSync('zip', ['-qr', zip, ...Object.keys(files).map((p) => p.split('/')[0])], { cwd: source })
  assert.equal(result.status, 0)
  return { dir, zip }
}

test('comparison archives extract only one result directory with comparison.json', (t) => {
  const good = zipOf(t, { 'ci-version-coverage-merged-77/comparison.json': '{}', 'ci-version-coverage-merged-77/baseline/result.json': '{}' })
  const file = extractComparisonArchive(good.zip, join(good.dir, 'results'))
  assert.equal(file, join(good.dir, 'results', 'ci-version-coverage-merged-77', 'comparison.json'))
  assert.throws(() => extractComparisonArchive(zipOf(t, { 'ci-a/comparison.json': '{}', 'ci-b/x': '1' }).zip, join(good.dir, 'r2')), /exactly one result directory/)
  assert.throws(() => extractComparisonArchive(zipOf(t, { 'ci-a/other.json': '{}' }).zip, join(good.dir, 'r3')), /missing comparison.json/)
  assert.throws(() => extractComparisonArchive(zipOf(t, { 'results/comparison.json': '{}' }).zip, join(good.dir, 'r4')), /Unexpected result directory name/)
})

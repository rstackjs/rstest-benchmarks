import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseRstestVersion, rstestSpecs } from '../../frameworks/dependencies.mjs'

test('framework Rstest override accepts exact npm versions and commit-addressed previews', () => {
  assert.equal(parseRstestVersion(undefined), undefined)
  for (const version of ['0.12.5', '0.13.0-beta.1']) {
    const source = parseRstestVersion(version)
    assert.equal(source.kind, 'npm')
    assert.deepEqual(Object.values(rstestSpecs(source)), Array(4).fill(version))
  }
  for (const prefix of ['', 'web-infra-dev/rstest/']) {
    const source = parseRstestVersion(`https://pkg.pr.new/${prefix}@rstest/core@abcdef012345`)
    assert.equal(source.kind, 'preview')
    assert.deepEqual(rstestSpecs(source), Object.fromEntries(['core', 'browser', 'coverage-v8', 'coverage-istanbul'].map(name => [
      `@rstest/${name}`, `https://pkg.pr.new/${prefix}@rstest/${name}@abcdef012345`,
    ])))
  }
  for (const version of ['latest', '^0.12.6', '0.12', 'https://elsewhere.test/pkg', 'https://pkg.pr.new/@rstest/core@main', 'https://pkg.pr.new/@rstest/browser@abcdef0'])
    assert.throws(() => parseRstestVersion(version), /exact npm version/)
})

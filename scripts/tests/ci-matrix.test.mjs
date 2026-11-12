import assert from 'node:assert/strict'
import { test } from 'node:test'
import { coverageUnits, frameworkUnits, matrixFor } from '../lib/ci-matrix.mjs'

const allCases = 'minimal-node,minimal-react,startup,many-files,module-graph,backend,barrel,react'
const names = (units) => units.map((unit) => unit.name)

test('framework matrix has one unit per case and keeps browser react separate', () => {
  const units = frameworkUnits({ cases: allCases })
  assert.deepEqual(names(units), [...allCases.split(','), 'react-browser'])
  assert.deepEqual(units.at(-1), { name: 'react-browser', suite: 'browser', cases: 'browser/react/none' })
  assert.deepEqual(units.find((unit) => unit.name === 'react'), { name: 'react', suite: 'main', cases: 'main/react/none' })
  assert.deepEqual(matrixFor('frameworks', { cases: allCases }), { include: units.map((unit) => ({ ...unit, runner: 'macos-15' })) })
})

test('framework matrix honours cases and exclude_cases like the CLI', () => {
  assert.deepEqual(names(frameworkUnits({ cases: 'react' })), ['react', 'react-browser'])
  assert.deepEqual(names(frameworkUnits({ cases: 'main/react/none' })), ['react'])
  assert.deepEqual(names(frameworkUnits({ cases: allCases, excludeCases: 'barrel' })), [...allCases.split(',').filter((name) => name !== 'barrel'), 'react-browser'])
  assert.deepEqual(names(frameworkUnits({ cases: allCases, excludeCases: 'browser/react/none' })), allCases.split(','))
  // Excluding react removes both the jsdom and the browser unit.
  assert.deepEqual(names(frameworkUnits({ cases: allCases, excludeCases: 'react' })), allCases.split(',').filter((name) => name !== 'react'))
  assert.throws(() => frameworkUnits({ cases: 'nope' }), /Unknown case/)
  assert.throws(() => frameworkUnits({ cases: 'react', excludeCases: 'react' }), /No benchmark cases selected/)
})

test('coverage matrix has one unit per app with its provider controls', () => {
  const units = coverageUnits({})
  assert.deepEqual(names(units), ['node-library', 'node-backend', 'react-spa', 'barrel-clean'])
  assert.equal(units.find((unit) => unit.name === 'node-backend').cases.split(',').length, 3)
  assert.equal(units.find((unit) => unit.name === 'barrel-clean').cases.split(',').length, 6)
  assert.deepEqual(names(coverageUnits({ cases: 'node-backend' })), ['node-backend'])
  assert.deepEqual(names(coverageUnits({ excludeCases: 'react-spa' })), ['node-library', 'node-backend', 'barrel-clean'])
  const noIstanbul = coverageUnits({ cases: 'node-backend', excludeCases: 'coverage:node-backend:default:default:node:forks:istanbul:default' })
  assert.equal(noIstanbul[0].cases.split(',').length, 2)
})

test('matrix units carry the selected runner and refuse unknown ones', () => {
  const linux = matrixFor('frameworks', { cases: allCases, runner: 'ubuntu-24.04' })
  assert.equal(linux.include.length, 9)
  assert(linux.include.every((unit) => unit.runner === 'ubuntu-24.04'))
  assert.deepEqual(linux.include.at(-1), { name: 'react-browser', suite: 'browser', cases: 'browser/react/none', runner: 'ubuntu-24.04' })
  assert(matrixFor('coverage', { runner: 'ubuntu-24.04' }).include.every((unit) => unit.runner === 'ubuntu-24.04'))
  // An empty runner (non-dispatch events) selects the macOS default.
  assert(matrixFor('frameworks', { cases: allCases, runner: '' }).include.every((unit) => unit.runner === 'macos-15'))
  assert.throws(() => matrixFor('frameworks', { cases: allCases, runner: 'windows-latest' }), /Unknown runner/)
})

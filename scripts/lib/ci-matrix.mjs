// Builds the per-job work units of the CI matrix workflows from the same case
// selection rules (`cases`, `exclude-cases`) the local CLIs use.
import { cases as frameworkCases } from '../../frameworks/fixtures.mjs'
import { casesFor } from './cases.mjs'
import { selectCases } from './selection.mjs'

const VERSION_SUITES = ['main', 'scaling', 'barrel', 'pools']

// Framework units: one per main case, plus browser/react in its own unit so a
// browser problem cannot take the react main data down.
export function frameworkUnits({ cases, excludeCases } = {}) {
  const groups = [
    ...frameworkCases.map((item) => ({ item, suite: 'main' })),
    { item: frameworkCases.find((item) => item.id === 'react'), suite: 'browser' },
  ]
  return selectCases(groups, {
    include: cases,
    exclude: excludeCases,
    keys: (g) => [g.item.id, `${g.suite}/${g.item.id}/none`],
  }).map((g) => ({
    name: g.suite === 'browser' ? `${g.item.id}-browser` : g.item.id,
    suite: g.suite,
    cases: `${g.suite}/${g.item.id}/none`,
  }))
}

function versionUnitName(suite, item) {
  if (suite === 'main') {
    if (item.app === 'many-files') return 'main-many-files'
    if (item.app === 'module-graph') return 'main-module-graph'
    if (item.app === 'minimal-react' || item.app === 'react-spa') return 'main-react'
    if (item.app === 'vue-spa') return 'main-vue'
    return 'main-node'
  }
  if (suite === 'scaling') return `scaling-${item.dimension}`
  if (suite === 'pools') return item.scale === 'large' ? 'pools-large' : 'pools-small-medium'
  return suite
}

// Version units: split across suites and heavy/browser workloads so each runner
// finishes quickly and only browser jobs need Chromium.
export function versionUnits({ suites = 'main,scaling,pools', cases, excludeCases } = {}) {
  const requested = (suites || 'main,scaling,pools') === 'all'
    ? VERSION_SUITES
    : String(suites || 'main,scaling,pools').split(',').map((s) => s.trim()).filter(Boolean)
  if (
    !requested.length ||
    new Set(requested).size !== requested.length ||
    requested.some((suite) => !VERSION_SUITES.includes(suite))
  )
    throw new Error(`suites must select unique values from ${VERSION_SUITES.join(',')}, or all`)

  const all = requested.flatMap((suite) =>
    casesFor(suite).map((item) => ({ suite, item })),
  )
  const selected = selectCases(all, {
    include: cases,
    exclude: excludeCases,
    keys: ({ item }) => [item.app, item.id],
  })
  const units = new Map()
  for (const { suite, item } of selected) {
    const name = versionUnitName(suite, item)
    if (!units.has(name)) units.set(name, { name, suite, ids: [] })
    units.get(name).ids.push(item.id)
  }
  return [...units.values()].map(({ name, suite, ids }) => ({
    name,
    suite,
    cases: ids.join(','),
  }))
}

// Coverage units: one per app (a barrel app keeps its scales together, and every
// unit keeps the none/V8/Istanbul controls of its cases on the same host).
export function coverageUnits({ cases, excludeCases } = {}) {
  const selected = selectCases(casesFor('coverage'), {
    include: cases,
    exclude: excludeCases,
    keys: (item) => [item.app, item.id],
  })
  const byApp = new Map()
  for (const item of selected) byApp.set(item.app, [...(byApp.get(item.app) ?? []), item.id])
  return [...byApp].map(([app, ids]) => ({ name: app, cases: ids.join(',') }))
}

export const matrixFor = (kind, options) => ({
  include:
    kind === 'frameworks'
      ? frameworkUnits(options)
      : kind === 'versions'
        ? versionUnits(options)
        : coverageUnits(options),
})

// Builds the per-job work units of the CI matrix workflows from the same case
// selection rules (`cases`, `exclude-cases`) the local CLIs use.
import { cases as frameworkCases } from '../../frameworks/fixtures.mjs'
import { casesFor } from './cases.mjs'
import { selectCases } from './selection.mjs'

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

// Runners the benchmark jobs may use; pull requests and pushes always use the default.
export const runners = ['macos-15', 'ubuntu-24.04']

export function matrixFor(kind, { runner, ...options } = {}) {
  const selected = runner || runners[0]
  if (!runners.includes(selected))
    throw new Error(`Unknown runner: ${selected} (use ${runners.join(' or ')})`)
  const units = kind === 'frameworks' ? frameworkUnits(options) : coverageUnits(options)
  return { include: units.map((unit) => ({ ...unit, runner: selected })) }
}

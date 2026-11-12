import { unsupportedReason } from './cases.mjs'

export function frameworkRunCounts(groups, conditions, runs) {
  const combinations = groups.reduce(
    (sum, group) => sum + group.frameworks.length,
    0,
  )
  return {
    timed: combinations * conditions.length * runs,
    memory: combinations * conditions.length * runs,
    warmup: conditions.includes('warm') ? combinations : 0,
  }
}

export function versionRunCounts(items, options, versionFor) {
  const supported = items.filter(
    (item) => !unsupportedReason(item, versionFor(item)),
  ).length
  // Coverage items (ids start with the suite name) also get a separate memory pass.
  const withMemory = items.filter(
    (item) => item.id.startsWith('coverage:') && !unsupportedReason(item, versionFor(item)),
  ).length
  return {
    timed: supported * options.runs,
    memory: withMemory * options.runs,
    warmup: supported * options.warmup,
  }
}

export function createProgress({ timed, warmup, memory = 0 }, log = console.log) {
  const total = timed + warmup + memory
  let current = 0
  log(
    `[plan] ${total} executions: ${timed} timed + ${memory} memory + ${warmup} warmup; setup and unsupported combinations excluded`,
  )
  return {
    start(label) {
      const prefix = `[${++current}/${total}] ${label}`
      log(`${prefix}: starting`)
      return (result) => log(`${prefix}: ${result}`)
    },
  }
}

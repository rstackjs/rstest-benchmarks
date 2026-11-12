export function formatCpu(host) {
  const parallelism = host.availableParallelism ?? host.parallelism
  return `${host.cpu}; logical CPUs: ${host.logicalCpuCount ?? 'not recorded'}; available parallelism: ${parallelism ?? 'not recorded'}`
}

// Matrix jobs run on different machines of one runner class. Merged records keep
// the fields that vary as a sorted list of distinct values, so reports show that
// hosts vary instead of presenting one machine's details as the whole run.
export function mergeHosts(hosts, keys) {
  const merged = {}
  for (const key of keys) {
    const values = [...new Set(hosts.map((host) => host?.[key]).filter((value) => value !== undefined))].sort()
    if (values.length === 1) merged[key] = values[0]
    else if (values.length > 1) merged[key] = values.join(' | ')
  }
  return merged
}

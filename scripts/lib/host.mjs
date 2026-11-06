export function formatCpu(host) {
  const parallelism = host.availableParallelism ?? host.parallelism
  return `${host.cpu}; logical CPUs: ${host.logicalCpuCount ?? 'not recorded'}; available parallelism: ${parallelism ?? 'not recorded'}`
}

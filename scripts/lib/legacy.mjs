// Published data recorded before the footprint sampler carries `rssBytes`
// (OS maxrss) and no `memorySamples`. It is rejected instead of being
// relabelled or silently dropped.
const message = (source, field) =>
  `${source}: legacy maxrss data (${field}); republish with the footprint sampler`

const hasLegacyFields = (samples) =>
  samples.some(
    (sample) => typeof sample === 'object' && sample && 'rssBytes' in sample,
  )

// `record` has `samples` and, once published with the sampler, `memorySamples`.
export function assertNoLegacyMemory(source, { samples = [], memorySamples, rssSamples },
  requireMemory) {
  if (rssSamples || hasLegacyFields(samples))
    throw new Error(message(source, rssSamples ? 'rssSamples' : 'rssBytes'))
  if (requireMemory && !Array.isArray(memorySamples))
    throw new Error(message(source, 'missing memorySamples'))
}

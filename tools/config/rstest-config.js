/**
 * Applies the benchmark matrix to Rstest's config shape.
 *
 * Rstest exposes the pool and test environment at the top level.
 */
export function benchTest(defaults = {}) {
  const env = process.env
  const test = { ...defaults }
  const bool = value => !['false', '0'].includes(value)

  if (env.BENCH_POOL)
    test.pool = { ...(test.pool ?? {}), type: env.BENCH_POOL }
  if (env.BENCH_ENV)
    test.testEnvironment = env.BENCH_ENV
  if (env.BENCH_ISOLATE)
    test.isolate = bool(env.BENCH_ISOLATE)
  if (env.BENCH_MAX_WORKERS) {
    test.pool = {
      ...(test.pool ?? {}),
      maxWorkers: env.BENCH_MAX_WORKERS.endsWith('%')
        ? env.BENCH_MAX_WORKERS
        : Number(env.BENCH_MAX_WORKERS),
    }
  }

  return test
}

export function benchBrowser() {
  if (!process.env.BENCH_BROWSER || ['false', '0'].includes(process.env.BENCH_BROWSER))
    return {}

  return {
    browser: {
      enabled: true,
      provider: 'playwright',
      browser: 'chromium',
      headless: true,
    },
  }
}

# Framework comparison design

The six main workloads, coverage and browser suites are implemented in `frameworks/`. See [running instructions](../frameworks/README.md). Scale variants remain optional extensions.

## Versions

Resolved from the npm `latest` tags on 2026-11-04:

| Framework | Version | TypeScript / JSX transform |
| --- | --- | --- |
| Jest | 30.5.2 | `@swc/jest` 0.2.39 |
| Vitest | 5.1.0 | Built-in default pipeline |
| Rstest | 0.12.6 | Built-in default pipeline |

Use published packages and pin exact versions before measuring. Record the resolved transformer, Vite/Rsbuild/Rspack, coverage provider, and workload dependencies in each result. Resolve `latest` once per comparison, never between rounds. This compares usable framework stacks, including their transformation and module execution strategies.

Jest's published `jest-environment-jsdom@30.5.2` depends on `jsdom@^26.1.0`. Pin jsdom 26.1.0 for all three frameworks in the shared DOM scenario. React, Testing Library, and application dependencies must also resolve to identical versions. Framework-owned dependencies may differ and must be recorded.

## Shared workloads

The first scorecard has six cases. Scale variants are optional extensions so that the main comparison stays readable. The main sizes below describe the implemented shared fixtures.

| Case | Main size | Performance question | Optional scale variants |
| --- | --- | --- | --- |
| Small Node project | 5 test files, 18 tests, 8 source modules | How much does a small useful suite cost end to end? | None |
| Tiny Node project | 1 test file, 1 test, 1 source module | What is the startup overhead for a minimal Node project? | None |
| Tiny React project | 1 test file, 1 test, 1 component | What is the startup and DOM setup overhead for a minimal React project? | None |
| Many test files | 400 test files, 2 tests per file, 127 shared source modules | How does per-file isolation and scheduling scale? | 40 / 100 / 400 files; fixed source graph and per-file work |
| Large module graph | 40 test files, 80 tests, 1,000 source modules | What is the cost of transforming and evaluating a broad graph? | About 100 / 500 / 1,000 modules; identical test files |
| Node backend | Reuse the 16-file, 45-test backend workload | How do real dependency loading and service operations perform together? | No initial size matrix |
| Sparse barrel imports | 20 test files, 40 tests, 3,200 leaf modules | What happens when tests import a few exports through a large public entry point? | 100 / 800 / 3,200 leaf modules |
| React + jsdom | Reuse the 30-file, 54-test React workload | What does component testing cost, including DOM setup, rendering and cleanup? | 30 / 300 files with the component graph held fixed |

The two tiny-project workloads are opt-in and are not included in the default matrix. Their command and results are documented with the workload list in [framework comparison instructions](../frameworks/README.md#workloads).

The module-graph workload must eagerly reach all generated leaves; it must not accidentally become another sparse-barrel case. Increasing its graph also increases deterministic module initialization work, so its result is not compiler time alone.

The barrel fixture uses pure leaves and identical side-effect metadata for all frameworks. Its result is specific to sparse imports. Keep each framework's default optimizations; a Rstest lazy-barrel-off control belongs in a separate diagnostic and must not be presented as a substitute for Jest or Vitest.

The backend uses Express, Zod, Pino, Day.js and Lodash with in-memory operations. It does not open a server, connect to a database, or wait on external services. Its elapsed time is not HTTP throughput.

React tests share the same component source and interactions. CSS imports need an equivalent minimal handling strategy in all three configurations. Each test must unmount and clean up. Individual mock, spy, timer or snapshot API benchmarks are outside the initial scorecard.

## Additional comparisons

- **Coverage:** use the backend and React + jsdom fixtures with none, V8, and Istanbul-based coverage. Jest's Istanbul-based provider is named `babel`; Vitest and Rstest use `istanbul`. Verify SWC instrumentation compatibility when implementing. Fix the included source set, exclusions and report output, check that all intended files are covered, and record provider versions. Compare total elapsed time and overhead relative to each framework's no-coverage control; do not assume identical coverage percentages establish identical instrumentation semantics.
- **Browser mode:** compare Vitest and Rstest on the same React fixture and headless Chromium build. Jest has no corresponding built-in browser mode in this design; mark it as not applicable rather than comparing jsdom against Chromium.

## Measurement protocol

1. Generate application sources and test bodies once. Only the framework API imports and necessary runner configuration may differ. Verify identical test identities, counts, source hashes and workload dependency graphs.
2. Use one pinned Node version on the same host, default framework concurrency and isolation, and record their resolved settings. Keep default optimizations enabled. An equal-worker-count investigation can follow if concurrency explains a result.
3. Disable Node compile cache in every framework process and worker with `NODE_DISABLE_COMPILE_CACHE=1`; remove inherited `NODE_COMPILE_CACHE`.
4. Report two cache conditions separately: **empty framework caches**, cleared before each measured invocation; and **warm framework caches**, cleared once before one warmup per framework/case, then retained for six measured invocations. Each invocation starts a fresh process. This does not clear OS page caches or simulate a completely fresh machine. Vitest 5.1's default filesystem module cache remains enabled, with a case-local directory for controlled cleanup. Record framework cache settings; cache tuning belongs in a separately labeled variant.
5. Run six measured rounds per framework/case/cache condition. Rotate through all six permutations of Jest, Vitest and Rstest to balance both position and pairwise order. Never overlap installations, fixture generation or benchmark processes with another timed run.
6. Measure process start through exit, including transformation, workers, execution, reporting and shutdown. Prepare dependencies outside the timing interval. Use small reporter adapters that emit matching final counts and failure information, without per-test success output.
7. Collect OS maxrss through the same timing wrapper for all frameworks. Preserve its platform-specific meaning; it is not the simultaneous sum of all worker memory. Keep warmup and failed samples, but only complete passing runs receive comparison percentages.
8. Save every sample, command, cache action, environment, resolved version, test count and fixture/config fingerprint. Report median wall time and median maxrss; link to variability details. Avoid an overall arithmetic average across unrelated workloads.

The six default main cases produce 108 measured invocations per cache condition: 6 cases × 3 frameworks × 6 rounds. Running both conditions gives 216 measured invocations, plus 18 warmups for the warm-cache condition. The two tiny-project cases, coverage, scaling and browser comparisons are additional suites.

## Implementation boundaries

Keep shared fixtures independent of framework imports. Add adapters for commands, configuration, cache cleanup, count validation and version/provenance collection. Reuse the current process measurement, statistics and report-publication code where its assumptions hold; replace Rstest-only identities and compatibility checks before using them for cross-framework reports.

Publish framework comparisons under their own report configuration and output paths. Each row should show Jest, Vitest and Rstest values, with a clearly named baseline. Present elapsed time and RSS in separate compact tables. Unsupported browser combinations and noisy samples remain explicit.

## References

- [Jest package](https://www.npmjs.com/package/jest) and [stable versions](https://jestjs.io/versions).
- [Vitest 5.1 announcement](https://main.vitest.dev/blog/vitest-5-1).
- [Rstest package](https://www.npmjs.com/package/@rstest/core).
- [SWC Jest integration](https://swc.rs/docs/usage/jest).

The exact version table above was checked with `npm view <package>@latest version`; indexed package pages can lag behind registry tags.

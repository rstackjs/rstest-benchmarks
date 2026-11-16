# Workload design

## Admission criteria

A workload must answer a performance question, define its changing and fixed variables, and produce deterministic inputs with verifiable passing tests. More API coverage is not itself a reason to add a benchmark. Natural hooks, timers and assertions remain in application fixtures, but individual API microbenchmarks belong in a targeted investigation, not the default release scorecard.

## Baseline and focused comparisons

`pnpm bench --list` prints the baseline; every suite supports `--list`. Applications live under `apps/`, matrix definitions under `scripts/lib/cases.mjs`, shared generation/configuration under `tools/`, and all execution goes through `scripts/runner.mjs`.

- **Startup:** `micro-utils` is a small dependency-free suite. It includes real test work, so its wall time is not a direct measurement of CLI startup alone.
- **Module loading:** `node-library` exercises a layered TypeScript graph, shared modules and public entry points. The baseline uses the medium combined shape.
- **Dependencies and test bodies:** `node-backend` exercises CJS/ESM interoperability, validation and in-memory service operations. It does not start an HTTP server or database; do not describe its wall time as HTTP throughput.
- **Component execution:** React and Vue each run in jsdom, happy-dom and headless Chromium. Source/tests are shared across environments. The matrix measures whole-suite cost, including setup and teardown, not only rendering or environment creation. Vue unmounts wrappers after each test.
- **Pools:** compare forks, threads, vmForks and vmThreads on identical fixtures within each size, with isolation enabled and version-specific default concurrency. Combined sizes grow both graph and file count and are not a pure file-count experiment.
- **Scaling:** use eager imports so all generated leaf modules are reachable, avoiding a hidden lazy-barrel shortcut. File scaling changes only test-file count (10/40/120), with 127 source modules and two tests per file. Graph scaling changes source-module count (43/127/493), with 40 byte-identical test files and 80 tests. Graph growth includes module initialization work; it is not a compiler-only benchmark. These synthetic graphs are distinct from the baseline layered library.
- **Barrels:** grow the export surface (100/800/3,200 leaf modules plus one root barrel), keeping 20 test files and 40 tests. Compare default behavior with a config that declares the same modules side-effectful. The latter is an eligibility control, not a literal implementation of another test framework. Unreachable intermediate barrel files are not generated. This is a sparse-import workload, not a universal claim about barrels.
- **Coverage:** explicitly select the layered library, backend, React + jsdom, and two barrel sizes; cross them with none/V8/Istanbul. This matrix is independent of baseline names/membership. Include a no-coverage control using the same timing and memory sampler. End-to-end differences include reporting; they are not isolated instrumentation times or proof of equivalent coverage accuracy.

## Baseline fixture sizes

| Baseline workload | Purpose |
|---|---|
| `micro-utils` | 8 source modules and 5 test files; startup-dominated Node suite |
| `node-library` | 127 source modules and 40 test files; medium library graph |
| `node-backend` | 43 source modules and 16 test files; Express, Zod, Pino, Day.js, and Lodash |
| `react-spa` / jsdom | 92 TypeScript/TSX modules, CSS, Testing Library, and 30 test files |
| `react-spa` / happy-dom | The same React fixture using Rstest's `happy-dom` environment |
| `react-spa` / Chromium | The same React fixture executed through Rstest browser mode |
| `vue-spa` / jsdom, happy-dom, Chromium | 47 modules, 37 Vue SFCs, 20 test files; SFC compilation and component mount/update/unmount |
| `barrel-clean` / medium | 801 source modules and 20 test files; sparse imports from a wide export surface |

## Workload revisions

Application directory names are stable identifiers, not a requirement to preserve a particular workload shape. Fixture/config hashes and retained snapshots distinguish revisions. A new baseline requires running both compared versions with the same revision and declared cache policy.

## Deliberate gaps

Watch invalidation, persistent build-cache experiments, multi-project startup, browser-specific automation and long-lived memory growth need their own timing boundaries and validation. Adding them to a `rstest run` matrix would not measure the intended behavior. No such performance claims are made here.

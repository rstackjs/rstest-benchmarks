# Rstest benchmarks

Compare Jest + SWC, Vitest, and Rstest on shared Node and React workloads. The optional `rstest-vmForks` runner adds Rstest's VM forks pool to the comparison. Each run reports whole-process elapsed time and RSS for cold and warm framework caches.

For comparisons between Rstest releases or a local checkout, see [Rstest version benchmarks](versions/README.md).

## Quick start

Use Node.js 24, the pnpm version pinned in this repository, and macOS or Linux for RSS collection. Run from the repository root:

```sh
pnpm --dir frameworks install --frozen-lockfile
pnpm --dir frameworks exec playwright install chromium
pnpm compare:frameworks --runs 6
```

Dependencies are pinned in [package.json](frameworks/package.json) and [pnpm-lock.yaml](frameworks/pnpm-lock.yaml). The runner installs missing dependencies automatically; Chromium must be installed before browser measurements.

The default run includes main, coverage and browser suites: **456 timed invocations and 38 warmups**. It writes reports, samples, logs and source snapshots to `results/frameworks-*/`. It does not update the repository README or Rstest release reports.

```sh
# One workload, all three frameworks
pnpm compare:frameworks --suites main --cases many-files --runs 6

# Warm framework caches only
pnpm compare:frameworks --suites main --conditions warm --runs 6
```

## Run in CI

The [Benchmark workflow](.github/workflows/benchmark.yml) runs framework comparisons on pull requests and pushes to `main`. Use **Actions → Benchmark → Run workflow** to choose the runner OS, repetition count or Rstest version comparison mode. All compared runners execute sequentially on the same host; CI uploads reports and raw execution artifacts without committing results.

To update this page from a successful full framework run, download its artifact and extract it under `results/`, preserving the run directory:

```sh
pnpm report:frameworks --input results/<run>/result.json
pnpm report:frameworks:check
```

The updater checks the complete matrix and samples, then updates the tables, versions, machine details and CI source link together. See [CI and report publication](docs/ci.md) for artifact layout, partial runs and version reports.

## Workloads

| Case | Test files / tests | Workload |
| --- | ---: | --- |
| `startup` | 5 / 18 | Small Node utility package with 8 source modules |
| `minimal-node` | 1 / 1 | Tiny Node project: one source module and one test |
| `minimal-react` | 1 / 1 | Tiny React project: one component test using jsdom and Testing Library |
| `many-files` | 400 / 800 | Many isolated test files sharing 127 source modules |
| `module-graph` | 40 / 80 | Eager loading of a 1,000-module graph |
| `backend` | 16 / 45 | Dependency loading and in-memory service operations |
| `barrel` | 20 / 40 | Sparse imports from a barrel exporting 3,200 leaf modules |
| `react` | 30 / 54 | React component tests using jsdom and Testing Library |

Coverage compares none/V8/Istanbul on selected workloads, including no-coverage controls. Browser mode runs the React workload in Chromium with Vitest and the default Rstest runner. The two tiny-project workloads are opt-in and measure startup overhead; they are excluded from the default matrix. Run them with:

```sh
pnpm compare:frameworks --suites main --cases minimal-node,minimal-react --frameworks jest,vitest,rstest,rstest-vmForks --runs 8
```

Each has one source file, one test file and one test. [Node](frameworks/fixtures/minimal-node/tests/add.test.ts) exercises an addition function; [React](frameworks/fixtures/minimal-react/tests/Counter.test.tsx) renders a counter in jsdom and clicks it once. They measure tiny-project startup overhead, not throughput on larger projects.

## Results

🥇 and 🥈 mark the lowest and second-lowest distinct unrounded medians in each row; exact ties share the marker. They do not indicate statistical significance.

<!-- framework-results:start -->

Measured 2026-11-06 (UTC) on Apple M4 Max, darwin arm64, Node v24.11.1; 14 available CPUs. jest **30.5.2**, vitest **5.1.0**, rstest **0.12.6**, rstest-vmForks **0.12.6**; @swc/jest **0.2.39**.

8 timed runs per supported case and cache condition; all **928 timed samples and 58 warmups passed**. Node compile cache is disabled. Default concurrency; named Rstest pool variants change only the pool. Cold and warm framework caches are reported separately; OS page cache and background load are uncontrolled. Browser mode compares Vitest against default Rstest only.

Reproduce this matrix using the matching source checkout and pinned dependencies:

```sh
pnpm compare:frameworks --suites main,coverage,browser --cases minimal-node,minimal-react,startup,many-files,module-graph,backend,barrel,react --frameworks jest,vitest,rstest,rstest-vmForks --runs 8
```

**Main suite · cold cache · elapsed time**

| Case | Jest + SWC | Vitest | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: |
| Node · single-file | 0.44s | 0.30s | 🥇 0.24s | 🥈 0.26s |
| React · single-file | 0.76s | 0.64s | 🥇 0.51s | 🥈 0.54s |
| Node startup | 0.65s | 0.34s | 🥇 0.27s | 🥈 0.30s |
| Many files | 🥈 3.20s | 7.06s | 4.62s | 🥇 1.11s |
| Module graph | 7.17s | 4.69s | 🥈 1.01s | 🥇 0.78s |
| Backend | 1.15s | 0.88s | 🥇 0.63s | 🥈 0.73s |
| Barrel | 21.99s | 9.94s | 🥈 0.56s | 🥇 0.47s |
| React + jsdom | 2.39s | 3.94s | 🥈 1.74s | 🥇 1.18s |

**Main suite · cold cache · RSS (MiB)**

| Case | Jest + SWC | Vitest | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: |
| Node · single-file | 🥇 101.73 | 🥈 116.45 | 129.59 | 128.85 |
| React · single-file | 🥈 182.49 | 🥇 157.73 | 262.34 | 262.43 |
| Node startup | 🥇 93.20 | 🥈 122.80 | 140.07 | 139.54 |
| Many files | 🥇 202.16 | 🥈 217.23 | 385.74 | 286.70 |
| Module graph | 🥇 207.59 | 311.98 | 372.55 | 🥈 287.53 |
| Backend | 🥈 151.85 | 🥇 137.45 | 154.85 | 155.45 |
| Barrel | 363.26 | 429.61 | 🥇 163.47 | 🥈 163.73 |
| React + jsdom | 🥈 182.54 | 🥇 176.92 | 444.17 | 357.92 |

**Main suite · warm cache · elapsed time**

| Case | Jest + SWC | Vitest | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: |
| Node · single-file | 🥇 0.21s | 0.27s | 🥈 0.23s | 0.27s |
| React · single-file | 🥈 0.52s | 0.58s | 🥇 0.50s | 0.53s |
| Node startup | 🥇 0.26s | 0.28s | 🥈 0.27s | 0.29s |
| Many files | 🥈 2.20s | 6.21s | 4.47s | 🥇 1.10s |
| Module graph | 2.38s | 3.10s | 🥈 0.97s | 🥇 0.75s |
| Backend | 0.80s | 0.76s | 🥇 0.70s | 🥈 0.73s |
| Barrel | 5.20s | 5.43s | 🥈 0.48s | 🥇 0.45s |
| React + jsdom | 2.26s | 4.04s | 🥈 1.67s | 🥇 1.13s |

**Main suite · warm cache · RSS (MiB)**

| Case | Jest + SWC | Vitest | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: |
| Node · single-file | 🥇 94.88 | 🥈 114.16 | 129.01 | 129.13 |
| React · single-file | 🥈 170.76 | 🥇 159.03 | 268.55 | 267.31 |
| Node startup | 🥇 107.67 | 🥈 116.68 | 139.25 | 138.64 |
| Many files | 🥇 195.02 | 🥈 200.84 | 387.97 | 288.22 |
| Module graph | 🥇 192.76 | 🥈 239.39 | 390.24 | 286.01 |
| Backend | 284.42 | 🥇 126.57 | 🥈 154.72 | 155.31 |
| Barrel | 277.62 | 398.31 | 🥇 163.08 | 🥈 164.14 |
| React + jsdom | 🥇 174.19 | 🥈 178.22 | 436.37 | 364.05 |

<!-- framework-results:end -->

RSS is OS maxrss, not total concurrent worker memory. Full coverage/browser comparisons are in the [complete report](frameworks/reports/report.md), with [variability](frameworks/reports/variability.md) and [all samples and provenance](frameworks/reports/result.json). The tiny-project rows above are part of the same run and result set. Published framework reports use fixed paths in `frameworks/reports/`; each update replaces the current report and samples. Previous results remain available in Git history. Run `pnpm report:frameworks` to regenerate the reports and README tables from the published samples.

See [workload design](docs/framework-comparison.md) for performance questions and fixture details. The proposed scaling extensions are not part of the implemented default matrix.

## Options

| Option | Default | Meaning |
| --- | --- | --- |
| `--runs` | `6` | Timed repetitions per framework/case/cache condition |
| `--conditions` | `cold,warm` | Cache conditions, reported separately |
| `--suites` | `main,coverage,browser` | Comma-separated suites |
| `--cases` | six main cases | Comma-separated case IDs from the table; also accepts `minimal-node,minimal-react` |
| `--frameworks` | `jest,vitest,rstest` | Select frameworks; optional entries: `rstest-vmForks`, `jest-babel` |
| `--install` | off | Reinstall pinned dependencies before measuring |
| `--label` | `frameworks` | Result directory prefix |

With three frameworks, use a multiple of six runs to balance order. For four-framework comparisons including `rstest-vmForks`, use a multiple of eight. Browser mode compares Vitest and the default Rstest runner.

## Measurement and limitations

- **Elapsed time:** process start through exit, including configuration, transformation, workers, tests, reporting and shutdown. Installations, fixture generation and cache cleanup happen outside the timed interval.
- **Cold / warm:** cold clears framework caches before every invocation; warm retains them after one warmup. Every invocation starts a new process. Node compile cache is disabled; OS page caches and background load are uncontrolled.
- **Concurrency:** each framework retains its default scheduling and isolation. Jest may choose in-band execution for small suites using cached test timings, so warm results include scheduling decisions as well as transform-cache reuse.
- **RSS:** median OS maxrss from `/usr/bin/time`, not the simultaneous total of worker or browser memory. Thread and fork pools have different process layouts; their maxrss ratios are not total-memory ratios.
- **Statistics:** medians and rankings use unrounded samples; tables display two decimal places. Detailed variability includes absolute standard deviation, range and CV. Evaluate both absolute and relative variation before rerunning a case. Rerun all compared runners for that case under the same cache conditions and balanced order, retaining the original batch; do not select only favorable samples.

Test bodies and application sources are shared. Jest uses SWC with CommonJS output; Vitest and Rstest use their built-in pipelines. Vitest's filesystem module cache remains enabled and is scoped to each generated case. React uses the same jsdom 26.1.0 and one cleanup per test. Jest maps CSS to a minimal object because assertions do not inspect styling; browser/bundler configurations process CSS normally.

Coverage verifies matching executable source-file sets. Type declarations and React barrels containing only re-exports are excluded. Matching files do not prove identical statement or branch instrumentation. These are comparisons of runnable test stacks, including their module-loading strategies.

Each result retains installed versions, the lockfile, generated sources, adapted tests, config fingerprints and a measurement-harness snapshot. Unsupported combinations remain explicit in the report.

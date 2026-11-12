# Rstest benchmarks

Compare Jest + SWC, Vitest, and Rstest on shared Node and React workloads. The optional `vitest-vmForks` and `rstest-vmForks` runners add VM forks pools to the comparison. Each run reports whole-process elapsed time and process-tree memory for cold and warm framework caches.

For comparisons between Rstest releases or a local checkout, see [Rstest version benchmark](versions/README.md).

## Quick start

Use Node.js 24, the pnpm version pinned in this repository, and macOS for memory collection (Xcode Command Line Tools must provide `cc`; Linux is not supported for memory measurement). Run from the repository root:

```sh
pnpm --dir frameworks install --frozen-lockfile
pnpm --dir frameworks exec playwright install chromium
pnpm compare:frameworks --runs 6
```

Dependencies are pinned in [package.json](frameworks/package.json) and [pnpm-lock.yaml](frameworks/pnpm-lock.yaml). The runner installs missing dependencies automatically; Chromium must be installed before browser measurements.

The default run includes main and browser suites: **240 timed invocations and 20 warmups**. It writes reports, samples, logs and source snapshots to `results/frameworks-*/`. It does not update the repository README or Rstest release reports.

```sh
# One workload, all three frameworks
pnpm compare:frameworks --suites main --cases many-files --runs 6

# Warm framework caches only
pnpm compare:frameworks --suites main --conditions warm --runs 6
```

## Run in CI

The [Frameworks benchmark workflow](.github/workflows/benchmark-frameworks.yml) runs main and browser suites on pull requests and pushes to `main`. Use **Actions → Frameworks benchmark → Run workflow** to choose the runner OS, repetition count or cases. Rstest release comparisons have separate manual workflows for [performance](.github/workflows/benchmark-versions.yml) and [coverage](.github/workflows/benchmark-version-coverage.yml). All compared runners execute sequentially on the same host; CI uploads reports and raw execution artifacts without committing results.

To update this page from a successful framework run with all eight cases and browser mode, download its artifact and extract it under `results/`, preserving the run directory:

```sh
pnpm report:frameworks --input results/<run>/result.json
pnpm report:frameworks:check
```

The updater checks the complete matrix and samples, then updates the tables, versions, machine details and CI source link together. See [CI and report publication](docs/ci.md) for artifact layout, partial runs and version reports.

## Workloads

| Case | Test files / tests | Workload |
| --- | ---: | --- |
| `startup` | 5 / 18 | Small Node utility package with 8 source modules |
| `minimal-node` | 2 / 2 | Tiny Node project: two test files sharing one source module |
| `minimal-react` | 2 / 2 | Tiny React project: two component test files using jsdom and Testing Library |
| `many-files` | 400 / 800 | Many isolated test files sharing 127 source modules |
| `module-graph` | 40 / 80 | Eager loading of a 1,000-module graph |
| `backend` | 16 / 45 | Dependency loading and in-memory service operations |
| `barrel` | 20 / 40 | Sparse imports from a barrel exporting 3,200 leaf modules |
| `react` | 30 / 54 | React component tests using jsdom and Testing Library |

Optional cross-framework coverage measurements are available locally with `--suites coverage`; CI does not run them. Browser mode runs the React workload in Chromium with Vitest and the default Rstest runner. The two tiny-project workloads are opt-in and measure startup overhead; they are excluded from the default matrix. Run them with:

```sh
pnpm compare:frameworks --suites main --cases minimal-node,minimal-react --frameworks jest,vitest,vitest-vmForks,rstest,rstest-vmForks --runs 5
```

Each has one source file and two test files, with one test per file. [Node](frameworks/fixtures/minimal-node/tests/add.test.ts) exercises an addition function; [React](frameworks/fixtures/minimal-react/tests/Counter.test.tsx) renders a counter in jsdom. They measure tiny-project startup and file scheduling overhead. Framework defaults determine whether tests execute in workers or in the runner process; observed worker counts are recorded in the report.

## Results

Data from GitHub Actions run <id> (<date>, commit <sha>). <!-- TODO: fill in from the published CI run; do not publish memory numbers without it. -->

> The tables below predate the footprint metric: their memory columns are OS maxrss from `/usr/bin/time` and are replaced by process-tree footprint numbers on the next published CI run.

🥇 and 🥈 mark the lowest and second-lowest distinct unrounded medians in each row; exact ties share the marker. They do not indicate statistical significance.

The published single-file rows below predate the two-file minimal workloads. Their recorded measurements remain unchanged; new runs report the two-file workloads separately.

<!-- framework-results:start -->

Measured 2026-11-06 (UTC) on Apple M4 Max; logical CPUs: not recorded; available parallelism: 14; darwin arm64, Node v24.11.1. jest **30.5.2**, vitest **5.1.0**, rstest **0.12.6**, rstest-vmForks **0.12.6**; @swc/jest **0.2.39**.

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

**Main suite · cold cache · Memory (MiB, process-tree footprint peak)**

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

**Main suite · warm cache · Memory (MiB, process-tree footprint peak)**

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

Memory is the median across runs of the peak summed process-tree footprint (see [Memory methodology](#memory-methodology)). Full coverage/browser comparisons are in the [complete report](frameworks/reports/report.md), with [variability](frameworks/reports/variability.md) and [all samples and provenance](frameworks/reports/result.json). The tiny-project rows above are part of the same run and result set. Published framework reports use fixed paths in `frameworks/reports/`; each update replaces the current report and samples. Previous results remain available in Git history. Run `pnpm report:frameworks` to regenerate the reports and README tables from the published samples.

See [workload design](docs/framework-comparison.md) for performance questions and fixture details. The proposed scaling extensions are not part of the implemented default matrix.

## Options

| Option | Default | Meaning |
| --- | --- | --- |
| `--runs` | `6` | Timed repetitions per framework/case/cache condition |
| `--conditions` | `cold,warm` | Cache conditions, reported separately |
| `--suites` | `main,browser` | Comma-separated suites; coverage is opt-in |
| `--cases` | six main cases | Comma-separated case IDs or full `suite/case/provider` IDs; also accepts `minimal-node,minimal-react` |
| `--exclude-cases` | none | Exclude case IDs after applying `--cases` |
| `--dry-run` | off | Print the selected workload without installing or running tests |
| `--frameworks` | `jest,vitest,rstest` | Select frameworks; optional entries: `vitest-vmForks`, `rstest-vmForks`, `jest-babel` |
| `--install` | off | Reinstall pinned dependencies before measuring |
| `--label` | `frameworks` | Result directory prefix |

With three frameworks, use a multiple of six runs to balance order. For four-framework comparisons including `rstest-vmForks`, use a multiple of eight. With both Vitest and Rstest vmForks variants (five runners), CI defaults to five runs; ten is optional for forward/reverse and browser order balancing. Browser mode compares Vitest and the default Rstest runner.

## Measurement and limitations

- **Elapsed time:** process start through exit, including configuration, transformation, workers, tests, reporting and shutdown. Installations, fixture generation and cache cleanup happen outside the timed interval.
- **Cold / warm:** cold clears framework caches before every invocation; warm retains them after one warmup. Every invocation starts a new process. Node compile cache is disabled; OS page caches and background load are uncontrolled.
- **Concurrency:** each framework retains its default scheduling and isolation. Jest may choose in-band execution for small suites using cached test timings, so warm results include scheduling decisions as well as transform-cache reuse.
- **Observed workers:** reports and CI summaries show the distinct worker slots that executed test setup, collected from Jest, Vitest and Rstest runtime IDs. Counts are not inferred from CPU counts or configured limits. Recycled processes do not add slots; browser mode is marked separately. The shared probe writes once per process/thread per invocation, and its overhead is included in elapsed time. Raw samples retain slot IDs, process IDs and thread IDs.
- **Memory:** see [Memory methodology](#memory-methodology). The metric is the peak process-tree physical footprint.
- **Statistics:** medians and rankings use unrounded samples; tables display two decimal places. Detailed variability includes absolute standard deviation, range and CV. Evaluate both absolute and relative variation before rerunning a case. Rerun all compared runners for that case under the same cache conditions and balanced order, retaining the original batch; do not select only favorable samples.

Test bodies and application sources are shared. Jest uses SWC with CommonJS output; Vitest and Rstest use their built-in pipelines. Vitest's filesystem module cache remains enabled and is scoped to each generated case. React uses the same jsdom 26.1.0 and one cleanup per test. Jest maps CSS to a minimal object because assertions do not inspect styling; browser/bundler configurations process CSS normally.

Coverage verifies matching executable source-file sets. Type declarations and React barrels containing only re-exports are excluded. Matching files do not prove identical statement or branch instrumentation. These are comparisons of runnable test stacks, including their module-loading strategies.

Each result retains installed versions, the lockfile, generated sources, adapted tests, config fingerprints and a measurement-harness snapshot. Unsupported combinations remain explicit in the report.

## Memory methodology

- Sample the benchmarked command's process tree every ~50 ms, excluding the benchmark driver itself, and sum each process's macOS **physical footprint** (`ri_phys_footprint` from `proc_pid_rusage`). Footprint counts private dirty and compressed memory; shared clean pages and the page cache are not counted, so per-process values can be summed across workers.
- Timing and memory are measured in **separate passes**, as in build-tools-performance. The timing pass runs with no sampler. A memory pass then reruns the same command under the sampler with the same preparation (cold clears the framework caches again; warm reuses the warmed caches). Elapsed time comes only from the timing pass and memory only from the memory pass. A memory run must match its timing run's exit code and test counts or the sample fails. There is one memory run per timed run (warmups get none).
- The sampler is a small C helper compiled once per run with `cc` (Xcode Command Line Tools required). On other platforms memory measurement fails with an error; there is no RSS fallback.
- Report the **peak** of the summed footprint for each memory run, and the **median across runs** in MiB.
- Measured on GitHub Actions `macos-15`; hardware may vary between runs. Published numbers come from the named CI run and commit stated in [Results](#results).
- The sampling interval is fixed at 50 ms. **Known limitation:** very short runs (about 0.3 s, such as the `minimal-*` workloads) can miss a brief peak in a short-lived worker, so their memory values are noisy and can read low. Compare medians over several runs rather than single samples.
- The sampler is adapted from [rstackjs/build-tools-performance](https://github.com/rstackjs/build-tools-performance) (MIT, Copyright (c) 2023 farm-fe).

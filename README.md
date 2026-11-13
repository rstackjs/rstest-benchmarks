# Rstest benchmarks

Compare Jest + SWC, Vitest, and Rstest on shared Node and React workloads. The optional `vitest-vmForks` and `rstest-vmForks` runners add VM forks pools to the comparison. Each run reports whole-process elapsed time and process-tree memory for cold and warm framework caches.

For comparisons between Rstest releases or a local checkout, see [Rstest version benchmark](versions/README.md).

## Quick start

Use Node.js 26, the pnpm version pinned in this repository, and macOS for memory collection (Xcode Command Line Tools must provide `cc`; Linux is not supported for memory measurement). Run from the repository root:

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

## Select a Rstest version

`--rstest-version` accepts an exact npm version (including prereleases) or a commit-addressed pkg.pr.new URL for `@rstest/core`:

```sh
pnpm compare:frameworks --rstest-version 0.12.5 --suites main --cases minimal-node --runs 5
pnpm compare:frameworks --rstest-version 'https://pkg.pr.new/@rstest/core@<commit-sha>' --runs 5
```

Replace `<commit-sha>` with the published preview's commit hash. Repository-qualified URLs such as `https://pkg.pr.new/web-infra-dev/rstest/@rstest/core@<commit-sha>` are also supported. The core, browser, V8 coverage and Istanbul coverage packages must all be available for that release or commit; they are installed together, including transitive core overrides. Mutable tags such as `latest` and branch URLs are rejected.

The runner installs the selected packages in an isolated directory under `results/framework-dependencies/`, leaving the repository's pinned packages unchanged. Other direct dependencies retain their pinned versions. Each result records the requested source, resolved versions and effective dependency manifest, workspace configuration and lockfile. Omitting the option uses the checked-in lockfile. This option applies to the framework comparison; `use-version` changes the separate Rstest version-benchmark apps.

## Run in CI

The [Frameworks benchmark workflow](.github/workflows/benchmark-frameworks.yml) runs main and browser suites on pull requests and pushes to `main`. Use **Actions → Frameworks benchmark → Run workflow** to choose the repetition count, cases or `rstest_version` (the same value as the local option). Each case runs in its own matrix job and a final job merges the per-case results into one verified result. Rstest release comparisons have separate manual workflows for [performance](.github/workflows/benchmark-versions.yml) and [coverage](.github/workflows/benchmark-version-coverage.yml) (also one job per app, merged). Within a job, all compared runners execute sequentially on the same host; CI uploads reports and raw execution artifacts without committing results.

To update this page from a successful framework run with all eight cases and browser mode, download its merged artifact (`benchmark-frameworks-merged-...`) and extract it under `results/`, preserving the run directory:

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

> The tables below use macOS process-tree physical footprint. These memory values are not comparable with the previous OS maxrss measurements. This publication covers the main and browser suites; cross-framework coverage is not included.

🥇 and 🥈 mark the lowest and second-lowest distinct unrounded medians in each row; exact ties share the marker. They do not indicate statistical significance.

<!-- framework-results:start -->

Measured 2026-11-13 (UTC) on Apple M4 Max; logical CPUs: 14; available parallelism: 14; darwin arm64, Node v26.13.0. jest **30.5.2**, vitest **5.1.0**, vitest-vmForks **5.1.0**, rstest **0.12.6**, rstest-vmForks **0.12.6**; @swc/jest **0.2.39**.

5 timed runs per supported case and cache condition; all **420 timed samples and 42 warmups passed**. Node compile cache is disabled. Default concurrency; named Rstest pool variants change only the pool. Cold and warm framework caches are reported separately; OS page cache and background load are uncontrolled. Browser mode compares Vitest against default Rstest only.

Reproduce this matrix using the matching source checkout and pinned dependencies:

```sh
pnpm compare:frameworks --suites main,browser --cases minimal-node,minimal-react,startup,many-files,module-graph,backend,barrel,react --frameworks jest,vitest,vitest-vmForks,rstest,rstest-vmForks --runs 5
```

**Main suite · cold cache · elapsed time**

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| Node · 2 files | 0.33s | 0.27s | 0.29s | 🥇 0.21s | 🥈 0.22s |
| React · 2 files | 0.62s | 0.51s | 0.50s | 🥈 0.47s | 🥇 0.46s |
| Node startup | 0.38s | 0.28s | 0.31s | 🥇 0.21s | 🥈 0.24s |
| Many files | 2.15s | 4.67s | 🥈 1.85s | 3.28s | 🥇 0.94s |
| Module graph | 4.02s | 3.15s | 2.68s | 🥈 0.80s | 🥇 0.59s |
| Backend | 0.72s | 0.58s | 0.59s | 🥇 0.44s | 🥈 0.48s |
| Barrel | 11.77s | 7.97s | 7.80s | 🥈 0.43s | 🥇 0.37s |
| React + jsdom | 1.26s | 1.84s | 🥈 1.07s | 1.12s | 🥇 0.85s |

**Main suite · cold cache · Memory (MiB, process-tree footprint peak)**

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| Node · 2 files | 277.49 | 🥇 100.82 | 128.45 | 🥈 107.48 | 139.47 |
| React · 2 files | 395.36 | 🥇 253.42 | 🥈 275.20 | 423.07 | 426.56 |
| Node startup | 373.83 | 🥈 166.61 | 234.43 | 🥇 155.86 | 252.26 |
| Many files | 2199.37 | 🥈 613.07 | 2329.38 | 🥇 534.20 | 1349.10 |
| Module graph | 1993.77 | 1190.47 | 1828.53 | 🥇 806.43 | 🥈 1135.53 |
| Backend | 1102.47 | 🥈 702.08 | 734.43 | 🥇 591.34 | 952.44 |
| Barrel | 3522.33 | 2242.67 | 2376.27 | 🥇 285.76 | 🥈 557.81 |
| React + jsdom | 1737.90 | 🥇 1394.42 | 1775.21 | 🥈 1599.71 | 1916.81 |

**Main suite · warm cache · elapsed time**

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| Node · 2 files | 🥇 0.19s | 0.21s | 0.23s | 🥈 0.21s | 0.23s |
| React · 2 files | 🥈 0.42s | 0.47s | 0.48s | 🥇 0.41s | 0.45s |
| Node startup | 🥇 0.21s | 0.21s | 0.24s | 🥈 0.21s | 0.24s |
| Many files | 1.89s | 4.50s | 🥈 1.63s | 3.54s | 🥇 0.93s |
| Module graph | 1.29s | 1.89s | 1.47s | 🥈 0.69s | 🥇 0.53s |
| Backend | 0.63s | 0.48s | 0.47s | 🥇 0.43s | 🥈 0.47s |
| Barrel | 3.96s | 4.14s | 3.84s | 🥈 0.42s | 🥇 0.34s |
| React + jsdom | 1.19s | 1.59s | 🥈 0.91s | 1.07s | 🥇 0.78s |

**Main suite · warm cache · Memory (MiB, process-tree footprint peak)**

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| Node · 2 files | 🥇 52.29 | 🥈 101.42 | 128.81 | 102.01 | 137.84 |
| React · 2 files | 🥇 126.34 | 🥈 249.54 | 283.30 | 408.09 | 416.54 |
| Node startup | 🥇 56.16 | 166.58 | 244.39 | 🥈 132.05 | 243.90 |
| Many files | 2200.93 | 🥈 577.02 | 2411.58 | 🥇 549.67 | 1371.60 |
| Module graph | 1825.50 | 1193.91 | 1822.79 | 🥇 781.96 | 🥈 1093.99 |
| Backend | 🥇 221.73 | 621.27 | 728.31 | 🥈 594.15 | 967.85 |
| Barrel | 2751.64 | 2267.95 | 2396.94 | 🥇 309.28 | 🥈 576.13 |
| React + jsdom | 1644.10 | 🥇 1377.54 | 1664.50 | 🥈 1507.76 | 1874.34 |

<!-- framework-results:end -->

Memory is the peak sum of physical footprints across the measured process tree. Full browser comparisons are in the [complete report](frameworks/reports/report.md), with [variability](frameworks/reports/variability.md) and [all samples and provenance](frameworks/reports/result.json). The tiny-project rows above are part of the same run and result set. Published framework reports use fixed paths in `frameworks/reports/`; each update replaces the current report and samples. Previous results remain available in Git history. Run `pnpm report:frameworks` to regenerate the reports and README tables from the published samples.

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

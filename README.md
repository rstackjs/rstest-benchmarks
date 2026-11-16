# Rstest benchmarks

Median elapsed time and memory of Jest + SWC, Vitest and Rstest on shared Node and React workloads. The `vitest-vmForks` and `rstest-vmForks` runners add VM forks pools to the comparison. Each run reports whole-process elapsed time and process-tree memory for cold and warm framework caches.

For comparisons between Rstest releases or a local checkout, see [Rstest version benchmark](versions/README.md).

## Results

🥇 and 🥈 mark the lowest and second-lowest distinct unrounded medians in each row; exact ties share the marker. They do not indicate statistical significance. This publication covers the main and browser suites; cross-framework coverage is not included.

<!-- framework-results:start -->

Run [43416806164](https://github.com/rstackjs/rstest-benchmarks/actions/runs/43416806164) (attempt 1), commit `00b7304` · 2026-11-13 · Apple M1 (Virtual), 3 CPUs, GitHub-hosted macOS runner image 20261104.0514.1 · Node v26.13.0 · jest **30.5.2**, vitest **5.1.0**, vitest-vmForks **5.1.0**, rstest **0.12.6**, rstest-vmForks **0.12.6**, @swc/jest **0.2.39**

### Elapsed time, cold cache

![Elapsed time, cold cache](frameworks/reports/charts/cold-elapsed.svg)

Within a case, bar length is proportional to the value. Across cases, the longest bar grows with the case's largest value on a log scale, so compare lengths only within a case.

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| Backend | 🥈 1.17s | 2.43s | 1.30s | 1.95s | 🥇 1.03s |
| Barrel | 12.11s | 19.71s | 14.08s | 🥈 1.71s | 🥇 0.77s |
| Many files | 🥈 6.02s | 30.15s | 10.12s | 21.29s | 🥇 4.04s |
| Node · 2 files | 0.65s | 0.50s | 0.56s | 🥇 0.44s | 🥈 0.47s |
| React · 2 files | 0.88s | 🥇 0.84s | 🥈 0.87s | 0.98s | 0.91s |
| Module graph | 5.32s | 11.02s | 6.74s | 🥈 4.05s | 🥇 2.58s |
| React + jsdom | 🥈 1.80s | 6.79s | 1.91s | 5.76s | 🥇 1.77s |
| Node startup | 0.68s | 0.81s | 0.78s | 🥈 0.67s | 🥇 0.54s |

### Memory, cold cache (MiB, peak process-tree footprint)

![Memory (MiB, peak process-tree footprint), cold cache](frameworks/reports/charts/cold-memory.svg)

Within a case, bar length is proportional to the value. Across cases, the longest bar grows with the case's largest value on a log scale, so compare lengths only within a case.

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| Backend | 372.07 | 🥈 164.14 | 301.33 | 🥇 160.70 | 327.74 |
| Barrel | 1094.01 | 567.95 | 1008.64 | 🥇 140.90 | 🥈 167.09 |
| Many files | 455.83 | 🥇 188.56 | 504.33 | 🥈 222.99 | 496.07 |
| Node · 2 files | 120.01 | 🥇 108.36 | 129.87 | 🥈 111.39 | 128.85 |
| React · 2 files | 🥈 237.01 | 🥇 236.77 | 257.34 | 381.60 | 362.12 |
| Module graph | 570.64 | 🥈 300.20 | 628.19 | 🥇 275.06 | 457.91 |
| React + jsdom | 481.96 | 🥇 267.51 | 476.24 | 🥈 412.78 | 597.65 |
| Node startup | 134.87 | 🥇 115.36 | 138.56 | 🥈 117.08 | 138.39 |

<details>
<summary>Warm cache</summary>

**Warm cache · Elapsed time**

![Elapsed time, warm cache](frameworks/reports/charts/warm-elapsed.svg)

Within a case, bar length is proportional to the value. Across cases, the longest bar grows with the case's largest value on a log scale, so compare lengths only within a case.

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| Backend | 🥈 1.03s | 1.94s | 1.06s | 1.73s | 🥇 0.93s |
| Barrel | 4.92s | 9.43s | 5.60s | 🥈 1.31s | 🥇 0.59s |
| Many files | 🥈 5.35s | 26.92s | 8.72s | 24.28s | 🥇 4.01s |
| Node · 2 files | 🥇 0.35s | 0.46s | 0.45s | 🥈 0.39s | 0.46s |
| React · 2 files | 🥇 0.63s | 🥈 0.81s | 0.89s | 0.85s | 0.91s |
| Module graph | 🥈 3.17s | 9.08s | 4.05s | 4.86s | 🥇 2.77s |
| React + jsdom | 🥇 1.65s | 6.67s | 🥈 2.05s | 5.83s | 2.09s |
| Node startup | 🥇 0.52s | 0.73s | 0.73s | 0.74s | 🥈 0.54s |

**Warm cache · Memory (MiB, peak process-tree footprint)**

![Memory (MiB, peak process-tree footprint), warm cache](frameworks/reports/charts/warm-memory.svg)

Within a case, bar length is proportional to the value. Across cases, the longest bar grows with the case's largest value on a log scale, so compare lengths only within a case.

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| Backend | 207.73 | 🥇 155.34 | 294.88 | 🥈 163.31 | 327.05 |
| Barrel | 845.15 | 494.29 | 990.74 | 🥇 142.49 | 🥈 166.67 |
| Many files | 449.71 | 🥇 156.43 | 477.19 | 🥈 220.77 | 500.15 |
| Node · 2 files | 🥇 48.13 | 🥈 106.94 | 126.41 | 112.28 | 128.38 |
| React · 2 files | 🥇 128.28 | 🥈 234.86 | 258.74 | 358.21 | 355.37 |
| Module graph | 533.59 | 🥇 244.36 | 559.47 | 🥈 269.15 | 453.67 |
| React + jsdom | 494.53 | 🥇 250.57 | 456.65 | 🥈 390.12 | 587.78 |
| Node startup | 🥇 62.72 | 🥈 111.58 | 134.48 | 118.24 | 140.53 |

</details>

<details>
<summary>Browser mode</summary>

**Browser mode · cold cache · Elapsed time**

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| React + jsdom · browser | — | 🥇 4.36s | — | 🥈 5.79s | — |

**Browser mode · cold cache · Memory (MiB, peak process-tree footprint)**

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| React + jsdom · browser | — | 🥈 916.64 | — | 🥇 360.63 | — |

**Browser mode · warm cache · Elapsed time**

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| React + jsdom · browser | — | 🥇 3.94s | — | 🥈 5.71s | — |

**Browser mode · warm cache · Memory (MiB, peak process-tree footprint)**

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| React + jsdom · browser | — | 🥈 797.42 | — | 🥇 355.00 | — |

</details>

<details>
<summary>Run details and reproduction</summary>

5 timed runs per supported case and cache condition; all **420 timed samples and 42 warmups passed**. Node compile cache is disabled. Default concurrency; named Rstest pool variants change only the pool. Cold and warm framework caches are reported separately; OS page cache and background load are uncontrolled. Browser mode compares Vitest against default Rstest only.

Reproduce this matrix using the matching source checkout and pinned dependencies:

```sh
pnpm compare:frameworks --suites main,browser --cases minimal-node,minimal-react,startup,many-files,module-graph,backend,barrel,react --frameworks jest,vitest,vitest-vmForks,rstest,rstest-vmForks --runs 5
```

The full runner list is in the [complete report](frameworks/reports/report.md).

</details>

<!-- framework-results:end -->

## Methodology

- **Elapsed time:** wall time of the whole process, from start to exit, taken in a timing pass without a memory sampler. The tables show the median of the timed runs.
- **Memory:** the peak of the summed macOS physical footprint (`phys_footprint`) over the benchmarked process tree, sampled every 50 ms (fixed) in a separate memory pass that reruns the same command. The tables show the median of the runs in MiB.
- **Cold and warm cache:** cold clears the framework caches before every run. Warm keeps them after one warmup. Every run starts a new process.
- **Concurrency:** each framework keeps its default scheduling and isolation.
- **Host:** GitHub-hosted macOS runner (`macos-15`). Hardware can vary between runs, so compare frameworks only within one published run. Published numbers come from the run and commit named in the provenance line.
- **Limits:** very short runs (about 0.3 s, such as the `minimal-*` workloads) can miss a brief memory peak in a short-lived worker, so their memory values are noisy and can read low. Compare medians over several runs rather than single samples. OS page cache and background load are not controlled. The memory values are not comparable with the earlier OS maxrss numbers.

## More information

<details>
<summary>Measurement details</summary>

- **Elapsed time:** includes configuration, transformation, workers, tests, reporting and shutdown. Installations, fixture generation and cache cleanup happen outside the timed interval.
- **Cold / warm:** Node compile cache is disabled.
- **Concurrency:** Jest may choose in-band execution for small suites using cached test timings, so warm results include scheduling decisions as well as transform-cache reuse.
- **Observed workers:** reports and CI summaries show the distinct worker slots that executed test setup, collected from Jest, Vitest and Rstest runtime IDs. Counts are not inferred from CPU counts or configured limits. Recycled processes do not add slots; browser mode is marked separately. The shared probe writes once per process/thread per invocation, and its overhead is included in elapsed time. Raw samples retain slot IDs, process IDs and thread IDs.
- **Statistics:** medians and rankings use unrounded samples; tables display two decimal places. Detailed variability includes absolute standard deviation, range and CV. Evaluate both absolute and relative variation before rerunning a case. Rerun all compared runners for that case under the same cache conditions and balanced order, retaining the original batch; do not select only favorable samples.

Test bodies and application sources are shared. Jest uses SWC with CommonJS output; Vitest and Rstest use their built-in pipelines. Vitest's filesystem module cache remains enabled and is scoped to each generated case. React uses the same jsdom 26.1.0 and one cleanup per test. Jest maps CSS to a minimal object because assertions do not inspect styling; browser/bundler configurations process CSS normally.

Coverage verifies matching executable source-file sets. Type declarations and React barrels containing only re-exports are excluded. Matching files do not prove identical statement or branch instrumentation. These are comparisons of runnable test stacks, including their module-loading strategies.

Each result retains installed versions, the lockfile, generated sources, adapted tests, config fingerprints and a measurement-harness snapshot. Unsupported combinations remain explicit in the report.

</details>

<details>
<summary>Memory measurement details</summary>

- The sampler walks the benchmarked command's process tree, excluding the benchmark driver itself, and sums each process's `ri_phys_footprint` from `proc_pid_rusage`. Footprint counts private dirty and compressed memory; shared clean pages and the page cache are not counted, so per-process values can be summed across workers.
- Timing and memory are measured in **separate passes**, as in build-tools-performance. The timing pass runs with no sampler. A memory pass then reruns the same command under the sampler with the same preparation (cold clears the framework caches again; warm reuses the warmed caches). Elapsed time comes only from the timing pass and memory only from the memory pass. A memory run must match its timing run's exit code and test counts or the sample fails. There is one memory run per timed run (warmups get none).
- The sampler is a small C helper compiled once per run with `cc` (Xcode Command Line Tools required). On other platforms memory measurement fails with an error; there is no RSS fallback.
- Each memory run reports the **peak** of the summed footprint.
- The sampler is adapted from [rstackjs/build-tools-performance](https://github.com/rstackjs/build-tools-performance) (MIT, Copyright (c) 2023 farm-fe).

</details>

<details>
<summary>Workloads</summary>

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

</details>

<details>
<summary>Run locally</summary>

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

</details>

<details>
<summary>Select a Rstest version</summary>

`--rstest-version` accepts an exact npm version (including prereleases) or a commit-addressed pkg.pr.new URL for `@rstest/core`:

```sh
pnpm compare:frameworks --rstest-version 0.12.5 --suites main --cases minimal-node --runs 5
pnpm compare:frameworks --rstest-version 'https://pkg.pr.new/@rstest/core@<commit-sha>' --runs 5
```

Replace `<commit-sha>` with the published preview's commit hash. Repository-qualified URLs such as `https://pkg.pr.new/web-infra-dev/rstest/@rstest/core@<commit-sha>` are also supported. The core, browser, V8 coverage and Istanbul coverage packages must all be available for that release or commit; they are installed together, including transitive core overrides. Mutable tags such as `latest` and branch URLs are rejected.

The runner installs the selected packages in an isolated directory under `results/framework-dependencies/`, leaving the repository's pinned packages unchanged. Other direct dependencies retain their pinned versions. Each result records the requested source, resolved versions and effective dependency manifest, workspace configuration and lockfile. Omitting the option uses the checked-in lockfile. This option applies to the framework comparison; `use-version` changes the separate Rstest version-benchmark apps.

</details>

<details>
<summary>Options</summary>

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

</details>

<details>
<summary>Run in CI and publish results</summary>

The [Frameworks benchmark workflow](.github/workflows/benchmark-frameworks.yml) runs main and browser suites on pull requests and pushes to `main`. Use **Actions → Frameworks benchmark → Run workflow** to choose the repetition count, cases or `rstest_version` (the same value as the local option). Each case runs in its own matrix job and a final job merges the per-case results into one verified result. Rstest release comparisons have separate manual workflows for [performance](.github/workflows/benchmark-versions.yml) and [coverage](.github/workflows/benchmark-version-coverage.yml) (also one job per app, merged). Within a job, all compared runners execute sequentially on the same host; CI uploads reports and raw execution artifacts without committing results.

To update this page from a successful framework run with all eight cases and browser mode, download its merged artifact (`benchmark-frameworks-merged-...`) and extract it under `results/`, preserving the run directory:

```sh
pnpm report:frameworks --input results/<run>/result.json
pnpm report:frameworks:check
```

To publish without downloading anything, run **Actions → Publish results → Run workflow** with the run ID. It regenerates the README, reports and charts from that run and commits them to `main`.

The updater checks the complete matrix and samples, then updates the tables, versions, machine details and CI source link together. See [CI and report publication](docs/ci.md) for artifact layout, partial runs and version reports.

</details>

<details>
<summary>Full reports and published data</summary>

Memory is the peak sum of physical footprints across the measured process tree. Full browser comparisons are in the [complete report](frameworks/reports/report.md), with [variability](frameworks/reports/variability.md) and [all samples and provenance](frameworks/reports/result.json). The tiny-project rows above are part of the same run and result set. Published framework reports use fixed paths in `frameworks/reports/`; each update replaces the current report and samples. Previous results remain available in Git history. Run `pnpm report:frameworks` to regenerate the reports and README tables from the published samples.

See [workload design](docs/framework-comparison.md) for performance questions and fixture details. The proposed scaling extensions are not part of the implemented default matrix.

</details>

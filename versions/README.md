# Rstest version benchmark

Reproducible workloads for comparing Rstest releases and configurations: Node.js, React, Vue, browser mode, worker pools, module graphs, barrels, and coverage.

For Jest / Vitest / Rstest comparisons, see the [main README](../README.md).

## Selected results

<!-- benchmark:versions:start -->

Source: [GitHub Actions](https://github.com/rstackjs/rstest-benchmarks/actions/runs/44705238824), commit `ac4d313ba287853df47348ad44b1f1f2f6b11a5b`, attempt 1.

Sources: baseline: **0.12.6** (npm); candidate: **1.0.0-beta.0** (npm). Measured 2026-11-20 (UTC); Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64, Node v26.13.0.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 10 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

Bold marks the lowest comparable median. Candidate Δ shows the change from baseline: red ▲ for higher values and green ▼ for lower values.

### Elapsed time (s)

<picture>
<source media="(prefers-color-scheme: dark)" srcset="../reports/charts/versions-elapsed-dark.svg">
<img alt="Elapsed time (s)" src="../reports/charts/versions-elapsed.svg">
</picture>

<details>
<summary>Table data and comparison notes</summary>

| Case | baseline: 0.12.6 | candidate: 1.0.0-beta.0 | Δ |
| --- | --- | --- | --- |
| Node startup and utilities | 0.73s | 0.66s | -9.63% |
| Node module graph | 2.63s | 2.32s | -11.59% |
| Node dependencies and service logic | 1.85s | 1.67s | -9.79% |
| React + jsdom | 9.53s | 10.06s | +5.53% |
| React + happy-dom | 5.33s | 4.66s | -12.60% |
| React + browser mode | 5.33s | 5.12s | -3.89% |
| Vue + jsdom | 6.88s | 6.76s | -1.73% |
| Vue + happy-dom | 3.73s | 3.44s | -7.76% |
| Vue + browser mode | 3.71s | 3.59s | -3.32% |
| barrel graph · medium | 1.60s | 1.47s | -8.45% |

</details>

### Memory comparison (MiB, peak process-tree footprint)

<picture>
<source media="(prefers-color-scheme: dark)" srcset="../reports/charts/versions-memory-dark.svg">
<img alt="Memory comparison (MiB, peak process-tree footprint)" src="../reports/charts/versions-memory.svg">
</picture>

<details>
<summary>Table data and comparison notes</summary>

| Case | baseline: 0.12.6 | candidate: 1.0.0-beta.0 | Δ |
| --- | --- | --- | --- |
| Node startup and utilities | 117.84 | 119.55 | +1.45% |
| Node module graph | 153.94 | 153.40 | -0.35% |
| Node dependencies and service logic | 167.37 | 162.41 | -2.97% |
| React + jsdom | 606.41 | 415.84 | -31.43% |
| React + happy-dom | 368.80 | 298.77 | -18.99% |
| React + browser mode | 365.66 | 402.40 | +10.05% |
| Vue + jsdom | 597.86 | 423.86 | -29.10% |
| Vue + happy-dom | 348.01 | 284.52 | -18.25% |
| Vue + browser mode | 343.91 | 385.89 | +12.21% |
| barrel graph · medium | 137.63 | 137.64 | +0.00% |

</details>

[Full report, variability and inputs](../reports/versions.md). Generated from published samples and compatibility fingerprints; full logs and snapshots are stored separately.

<!-- benchmark:versions:end -->

The [report index](../reports/README.md) links all five comparisons. [Recorded samples](../reports/data/README.md) are included for report verification; full execution artifacts are stored separately.

## Coverage results

<!-- benchmark:coverage:start -->

Source: [GitHub Actions](https://github.com/rstackjs/rstest-benchmarks/actions/runs/44043582845), commit `969876e9fc43ca83e8a41e8e1873b6687fa45c16`, attempt 1.

Sources: baseline: **0.12.6** (npm); candidate: **preview 2869d12** (preview). Measured 2026-11-17 (UTC); Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64, Node v26.13.0.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 15 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

Bold marks the lowest comparable median. Candidate Δ shows the change from baseline: red ▲ for higher values and green ▼ for lower values.

### Elapsed time (s)

<picture>
<source media="(prefers-color-scheme: dark)" srcset="../reports/charts/coverage-elapsed-dark.svg">
<img alt="Elapsed time (s)" src="../reports/charts/coverage-elapsed.svg">
</picture>

<details>
<summary>Table data and comparison notes</summary>

| Case | baseline: 0.12.6 | candidate: preview 2869d12 | Δ |
| --- | --- | --- | --- |
| barrel graph · medium / none | 1.63s | 1.57s | -4.19% |
| barrel graph · medium / v8 | 2.31s | 2.38s | +3.15% |
| barrel graph · medium / istanbul | 1.71s | 1.99s | +16.30% |
| barrel graph · large / none | 1.58s | 1.61s | +2.01% |
| barrel graph · large / v8 | 2.12s | 2.21s | +4.41% |
| barrel graph · large / istanbul | 1.82s | 1.82s | -0.03% |
| Node dependencies and service logic / none | 2.27s | 2.15s | -5.09% |
| Node dependencies and service logic / v8 | 3.00s | 3.25s | +8.18% |
| Node dependencies and service logic / istanbul | 2.49s | 2.32s | -6.57% |
| Node module graph / none | 3.37s | 3.29s | -2.61% |
| Node module graph / v8 | 5.07s | 5.50s | +8.44% |
| Node module graph / istanbul | 4.49s | 4.37s | -2.52% |
| React + jsdom / none | 11.04s | 10.27s | -6.99% |
| React + jsdom / v8 | 12.16s | 12.53s | +3.02% |
| React + jsdom / istanbul | 11.43s | 10.49s | -8.28% |

</details>

### Memory comparison (MiB, peak process-tree footprint)

<picture>
<source media="(prefers-color-scheme: dark)" srcset="../reports/charts/coverage-memory-dark.svg">
<img alt="Memory comparison (MiB, peak process-tree footprint)" src="../reports/charts/coverage-memory.svg">
</picture>

<details>
<summary>Table data and comparison notes</summary>

| Case | baseline: 0.12.6 | candidate: preview 2869d12 | Δ |
| --- | --- | --- | --- |
| barrel graph · medium / none | 139.41 | 137.90 | -1.09% |
| barrel graph · medium / v8 | 148.21 | 148.06 | -0.10% |
| barrel graph · medium / istanbul | 169.24 | 166.05 | -1.88% |
| barrel graph · large / none | 143.58 | 143.99 | +0.28% |
| barrel graph · large / v8 | 156.76 | 156.56 | -0.12% |
| barrel graph · large / istanbul | 177.11 | 176.75 | -0.21% |
| Node dependencies and service logic / none | 165.25 | 160.40 | -2.93% |
| Node dependencies and service logic / v8 | 181.95 | 180.79 | -0.64% |
| Node dependencies and service logic / istanbul | 193.01 | 198.56 | +2.88% |
| Node module graph / none | 155.34 | 151.80 | -2.28% |
| Node module graph / v8 | 210.46 | 220.79 | +4.91% |
| Node module graph / istanbul | 243.91 | 222.40 | -8.82% |
| React + jsdom / none | 604.70 | 454.94 | -24.77% |
| React + jsdom / v8 | 603.65 | 467.48 | -22.56% |
| React + jsdom / istanbul | 621.40 | 483.60 | -22.18% |

</details>

[Full report, variability and inputs](../reports/coverage.md). Generated from published samples and compatibility fingerprints; full logs and snapshots are stored separately.

<!-- benchmark:coverage:end -->

## Compare versions

Use Node.js 26 and the pnpm version pinned in `package.json`. Run from the repository root:

```sh
# Two npm releases
pnpm compare --baseline 0.12.5 --candidate 0.12.6

# npm release vs local source (replace the checkout path)
pnpm compare --baseline 0.12.6 --candidate local:../rstest
```

Both sides accept an exact npm version, a commit-addressed pkg.pr.new Rstest link, or `local:<path>`. The command installs dependencies, builds local sources, and installs Chromium when needed. No manual version switching or separate build is required.

By default, it runs the **main suite**, with **1 warmup + 5 timed runs per case**, alternating versions each round. Node compile cache is disabled. Open the printed `results/<comparison>/README.md` for the report; samples and logs are retained alongside it.

| Add to either command | Purpose |
| --- | --- |
| `--cases node-backend` | Compare one workload across selected suites |
| `--exclude-cases vue-spa` | Skip all Vue cases; full case IDs can target individual variants |
| `--suites all` | Include scaling, barrels, worker pools, and coverage/memory |
| `--runs 10` | Collect more samples |

`compare` leaves this page unchanged by default. Add `--update-readme` to publish the selected suites, including their samples, reports, and measurement notes. Failed comparisons do not publish.

```sh
# Compare multiple candidates against one baseline
pnpm compare --baseline 0.12.4 --candidate 0.12.5,0.12.6 --runs 6

# Run all suites and update README/report data
pnpm compare --baseline 0.12.5 --candidate 0.12.6 --suites all --runs 6 --update-readme
```

Repeat `--candidate` to mix npm, preview and local sources. With N total sources, use a multiple of N timed runs to balance order positions. See [all options and publication behavior](../docs/running.md#compare-versions).

## Run in CI

In **Actions**, choose [Rstest version benchmark](../.github/workflows/benchmark-versions.yml) for the main comparison shown below (scaling, barrel and pools are opt-in through `suites`), or [Rstest coverage benchmark](../.github/workflows/benchmark-version-coverage.yml) for coverage and memory. Enable `memory` on the version workflow to measure peak process-tree footprint alongside elapsed time. Coverage measures footprint automatically. Both workflows accept baseline/candidate npm versions or pkg.pr.new Rstest links, and the repetition count (both run on macOS), defaulting to six timed runs per case. Coverage includes fresh no-coverage controls on the same host. To publish either successful run after extracting its artifact under `results/`:

```sh
pnpm report:versions --input results/<comparison>/comparison.json
pnpm report:check
```

This updates only the selected suites on this page and in the version reports. Importing performance and coverage artifacts separately preserves the other tables and each run’s host information; samples from the two hosts are not merged. The framework comparison homepage stays unchanged. See [CI and report publication](../docs/ci.md).

## Suites

| Command | Measures | Results |
| --- | --- | --- |
| `pnpm bench` | Node workloads; React and Vue in jsdom, happy-dom, and browser mode (Chromium); a medium barrel graph | [Main](../reports/versions.md) |
| `pnpm bench:scaling` | File count and module graph size, varied independently | [Scaling](../reports/scaling.md) |
| `pnpm bench:pools` | Node worker pool modes across three suite sizes | [Pools](../reports/pools.md) |
| `pnpm bench:barrel` | Lazy-barrel eligibility across three graph sizes | [Barrels](../reports/barrel.md) |
| `pnpm bench:coverage` | No coverage, V8, and Istanbul overhead, including memory | [Coverage](../reports/coverage.md) |

All commands accept `--list` and `--runs`. See [workload design](../docs/workloads.md) for fixture sizes and controlled variables.

## Measurement

- Whole-process elapsed time, including CLI, build, workers/browser, tests, and reporting. By default, one warmup precedes five timed runs; the median is reported.
- Node compile cache is disabled. Rstest caches are retained between timed runs, so these results do not represent a fresh CI job with no history.
- Default worker concurrency and `forks + isolate:true` for Node/DOM, except in the pool suite. Coverage memory is the peak process-tree physical footprint on macOS (see [Memory methodology](../README.md#methodology)).
- All samples are retained. Reports include variability and unsupported cases; small differences and results from different machines or workloads need separate verification.

See [measurement details and result format](../docs/results.md) for cache policy, comparison checks, and statistics.

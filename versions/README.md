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

Source: [GitHub Actions](https://github.com/rstackjs/rstest-benchmarks/actions/runs/44705244270), commit `ac4d313ba287853df47348ad44b1f1f2f6b11a5b`, attempt 1.

Sources: baseline: **0.12.6** (npm); candidate: **1.0.0-beta.0** (npm). Measured 2026-11-20 (UTC); Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64, Node v26.13.0.

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

| Case | baseline: 0.12.6 | candidate: 1.0.0-beta.0 | Δ |
| --- | --- | --- | --- |
| barrel graph · medium / none | 1.04s | 0.92s | -12.02% |
| barrel graph · medium / v8 | 1.44s | 1.29s | -10.10% |
| barrel graph · medium / istanbul | 1.14s | 1.02s | -10.08% |
| barrel graph · large / none | 1.05s | 0.89s | -15.31% |
| barrel graph · large / v8 | 1.45s | 1.31s | -9.46% |
| barrel graph · large / istanbul | 1.14s | 1.03s | -9.55% |
| Node dependencies and service logic / none | 2.28s | 2.27s | -0.25% |
| Node dependencies and service logic / v8 | 3.39s | 3.12s | -7.79% |
| Node dependencies and service logic / istanbul | 2.68s | 2.40s | -10.57% |
| Node module graph / none | 2.93s | 2.63s | -10.36% |
| Node module graph / v8 | 4.73s | 3.97s | -16.12% |
| Node module graph / istanbul | 3.88s | 3.40s | -12.52% |
| React + jsdom / none | 11.58s | 10.47s | -9.59% |
| React + jsdom / v8 | 14.12s | 12.26s | -13.15% |
| React + jsdom / istanbul | 11.97s | 11.01s | -8.02% |

</details>

### Memory comparison (MiB, peak process-tree footprint)

<picture>
<source media="(prefers-color-scheme: dark)" srcset="../reports/charts/coverage-memory-dark.svg">
<img alt="Memory comparison (MiB, peak process-tree footprint)" src="../reports/charts/coverage-memory.svg">
</picture>

<details>
<summary>Table data and comparison notes</summary>

| Case | baseline: 0.12.6 | candidate: 1.0.0-beta.0 | Δ |
| --- | --- | --- | --- |
| barrel graph · medium / none | 138.28 | 136.69 | -1.15% |
| barrel graph · medium / v8 | 147.39 | 146.35 | -0.71% |
| barrel graph · medium / istanbul | 169.18 | 166.79 | -1.41% |
| barrel graph · large / none | 145.53 | 144.82 | -0.49% |
| barrel graph · large / v8 | 156.76 | 155.91 | -0.54% |
| barrel graph · large / istanbul | 177.32 | 179.14 | +1.03% |
| Node dependencies and service logic / none | 162.51 | 168.19 | +3.50% |
| Node dependencies and service logic / v8 | 178.00 | 175.82 | -1.23% |
| Node dependencies and service logic / istanbul | 191.72 | 197.90 | +3.22% |
| Node module graph / none | 154.67 | 153.90 | -0.50% |
| Node module graph / v8 | 216.58 | 215.14 | -0.67% |
| Node module graph / istanbul | 240.72 | 223.84 | -7.01% |
| React + jsdom / none | 606.32 | 421.81 | -30.43% |
| React + jsdom / v8 | 604.84 | 424.55 | -29.81% |
| React + jsdom / istanbul | 626.06 | 444.62 | -28.98% |

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

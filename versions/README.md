# Rstest version benchmark

Reproducible workloads for comparing Rstest releases and configurations: Node.js, React, Vue, browser mode, worker pools, module graphs, barrels, and coverage.

For Jest / Vitest / Rstest comparisons, see the [main README](../README.md).

## Compare versions

Use Node.js 24 and the pnpm version pinned in `package.json`. Run from the repository root:

```sh
# Two npm releases
pnpm compare --baseline 0.12.5 --candidate 0.12.6

# npm release vs local source (replace the checkout path)
pnpm compare --baseline 0.12.6 --candidate local:../rstest
```

Both sides accept an exact npm version or `local:<path>`. The command installs dependencies, builds local sources, and installs Chromium when needed. No manual version switching or separate build is required.

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

Repeat `--candidate` to mix npm and local sources. With N total sources, use a multiple of N timed runs to balance order positions. See [all options and publication behavior](../docs/running.md#compare-versions).

## Run in CI

In **Actions**, choose [Rstest version benchmark](../.github/workflows/benchmark-versions.yml) for the main comparison shown below (scaling, barrel and pools are opt-in through `suites`), or [Rstest coverage benchmark](../.github/workflows/benchmark-version-coverage.yml) for coverage and RSS. Both workflows accept baseline/candidate npm versions, a runner OS and the repetition count, defaulting to six timed runs per case. Coverage includes fresh no-coverage controls on the same host. To publish either successful run after extracting its artifact under `results/`:

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
- Default worker concurrency and `forks + isolate:true` for Node/DOM, except in the pool suite. Coverage memory is the peak process-tree physical footprint on macOS (see [Memory methodology](../README.md#memory-methodology)).
- All samples are retained. Reports include variability and unsupported cases; small differences and results from different machines or workloads need separate verification.

See [measurement details and result format](../docs/results.md) for cache policy, comparison checks, and statistics.

## Selected results

<!-- benchmark:versions:start -->

Sources: baseline: **0.11.0** (npm); candidate: **0.12.6** (npm). Measured 2026-11-06 (UTC); Apple M4 Max × 14, darwin arm64, Node v24.11.1.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 10 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

| Case | baseline: 0.11.0 | candidate: 0.12.6 | Δ | Notes |
| --- | --- | --- | --- | --- |
| Node startup and utilities | 0.25s | 0.27s | +8.42% | — |
| Node module graph | 0.61s | 0.69s | +14.18% | — |
| Node dependencies and service logic | 0.53s | 0.56s | +5.55% | — |
| React + jsdom | 3.62s | 1.72s | -52.62% | — |
| React + happy-dom | 1.96s | 1.02s | -47.84% | — |
| React + browser mode | 1.38s | 1.42s | +2.92% | — |
| Vue + jsdom | 2.63s | 1.48s | -43.73% | — |
| Vue + happy-dom | 1.48s | 0.89s | -40.08% | — |
| Vue + browser mode | SKIPPED | 1.31s | — | skipped / passed |
| barrel graph · medium | 0.44s | 0.47s | +8.04% | — |

[Full report, variability and inputs](../reports/versions.md). Generated from published samples and compatibility fingerprints; full logs and snapshots are stored separately.

<!-- benchmark:versions:end -->

The [report index](../reports/README.md) links all five comparisons. [Recorded samples](../reports/data/README.md) are included for report verification; full execution artifacts are stored separately.

## Coverage results

<!-- benchmark:coverage:start -->

Sources: baseline: **0.11.0** (npm); candidate: **0.12.6** (npm). Measured 2026-11-06 (UTC); Apple M4 Max × 14, darwin arm64, Node v24.11.1.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 15 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

| Case | baseline: 0.11.0 | candidate: 0.12.6 | Δ |
| --- | --- | --- | --- |
| Node module graph / none | 0.67s | 0.70s | +5.02% |
| Node module graph / v8 | 1.32s | 1.08s | -18.13% |
| Node module graph / istanbul | 0.99s | 0.86s | -12.82% |
| Node dependencies and service logic / none | 0.58s | 0.62s | +7.02% |
| Node dependencies and service logic / v8 | 0.82s | 0.79s | -4.18% |
| Node dependencies and service logic / istanbul | 0.69s | 0.65s | -5.59% |
| React + jsdom / none | 3.68s | 1.86s | -49.59% |
| React + jsdom / v8 | 4.18s | 2.27s | -45.75% |
| React + jsdom / istanbul | 4.04s | 1.99s | -50.72% |
| barrel graph · medium / none | 0.41s | 0.43s | +6.97% |
| barrel graph · medium / v8 | 0.63s | 0.62s | -1.82% |
| barrel graph · medium / istanbul | 0.53s | 0.50s | -6.42% |
| barrel graph · large / none | 0.44s | 0.45s | +1.60% |
| barrel graph · large / v8 | 0.64s | 0.61s | -4.01% |
| barrel graph · large / istanbul | 0.59s | 0.52s | -12.27% |

### Memory comparison

Median of the per-run peak process-tree physical footprint in MiB; negative percentages mean less memory.

| Case | baseline: 0.11.0 | candidate: 0.12.6 | Δ |
| --- | --- | --- | --- |
| Node module graph / none | 202.37 | 211.61 | +4.57% |
| Node module graph / v8 | 422.49 | 345.38 | -18.25% |
| Node module graph / istanbul | 304.63 | 336.74 | +10.54% |
| Node dependencies and service logic / none | 169.91 | 179.90 | +5.88% |
| Node dependencies and service logic / v8 | 213.02 | 215.48 | +1.15% |
| Node dependencies and service logic / istanbul | 209.96 | 218.64 | +4.13% |
| React + jsdom / none | 538.51 | 535.93 | -0.48% |
| React + jsdom / v8 | 751.02 | 744.12 | -0.92% |
| React + jsdom / istanbul | 461.52 | 575.39 | +24.67% |
| barrel graph · medium / none | 173.40 | 181.17 | +4.48% |
| barrel graph · medium / v8 | 202.46 | 203.30 | +0.42% |
| barrel graph · medium / istanbul | 213.21 | 219.60 | +3.00% |
| barrel graph · large / none | 181.84 | 188.88 | +3.87% |
| barrel graph · large / v8 | 208.60 | 219.97 | +5.45% |
| barrel graph · large / istanbul | 220.05 | 231.27 | +5.09% |

[Full report, variability and inputs](../reports/coverage.md). Generated from published samples and compatibility fingerprints; full logs and snapshots are stored separately.

<!-- benchmark:coverage:end -->

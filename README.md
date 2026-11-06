# Rstest benchmarks

Reproducible workloads for comparing Rstest releases and configurations: Node.js, React, Vue, browser mode, worker pools, module graphs, barrels, and coverage.

## Compare versions

Use Node.js 24 and the pnpm version pinned in `package.json`. Run from this directory:

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
| `--apps node-backend` | Compare one workload |
| `--suites all` | Include scaling, barrels, worker pools, and coverage/RSS |
| `--runs 10` | Collect more samples |

`compare` leaves README data unchanged by default. Add `--update-readme` to publish the selected suites, including their samples, reports, and measurement notes. Failed comparisons do not publish.

```sh
# Compare multiple candidates against one baseline
pnpm compare --baseline 0.12.4 --candidate 0.12.5,0.12.6 --runs 6

# Run all suites and update README/report data
pnpm compare --baseline 0.12.5 --candidate 0.12.6 --suites all --runs 6 --update-readme
```

Repeat `--candidate` to mix npm and local sources. With N total sources, use a multiple of N timed runs to balance order positions. See [all options and publication behavior](docs/running.md#compare-versions).

## Suites

| Command | Measures | Results |
| --- | --- | --- |
| `pnpm bench` | Node workloads; React and Vue in jsdom, happy-dom, and browser mode (Chromium); a medium barrel graph | [Main](reports/versions.md) |
| `pnpm bench:scaling` | File count and module graph size, varied independently | [Scaling](reports/scaling.md) |
| `pnpm bench:pools` | Forks, threads, vmForks, and vmThreads across three suite sizes | [Pools](reports/pools.md) |
| `pnpm bench:barrel` | Lazy-barrel eligibility across three graph sizes | [Barrels](reports/barrel.md) |
| `pnpm bench:coverage` | No coverage, V8, and Istanbul overhead, including RSS | [Coverage](reports/coverage.md) |

All commands accept `--list` and `--runs`. See [workload design](docs/workloads.md) for fixture sizes and controlled variables.

## Measurement

- Whole-process elapsed time, including CLI, build, workers/browser, tests, and reporting. By default, one warmup precedes five timed runs; the median is reported.
- Node compile cache is disabled. Rstest caches are retained between timed runs, so these results do not represent a fresh CI job with no history.
- Default worker concurrency and `forks + isolate:true` for Node/DOM, except in the pool suite. Coverage RSS is OS maxrss, not a simultaneous sum of all worker memory.
- All samples are retained. Reports include variability and unsupported cases; small differences and results from different machines or workloads need separate verification.

See [measurement details and result format](docs/results.md) for cache policy, comparison checks, and statistics.

## Selected results

<!-- benchmark:versions:start -->

Sources: baseline: **0.11.0** (npm); candidate: **0.12.6** (npm). Measured 2026-11-06 (UTC); Apple M4 Max × 14, darwin arm64, Node v24.11.1.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 10 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

| Case | baseline: 0.11.0 | candidate: 0.12.6 | Notes |
| --- | --- | --- | --- |
| Node startup and utilities | 0.252s | 0.273s (+8.4%) | — |
| Node module graph | 0.608s | 0.694s (+14.2%) | high variation (CV > 10%) |
| Node dependencies and service logic | 0.532s | 0.561s (+5.5%) | — |
| React + jsdom | 3.625s | 1.717s (**-52.6%**) | high variation (CV > 10%) |
| React + happy-dom | 1.955s | 1.020s (**-47.8%**) | high variation (CV > 10%) |
| React + browser mode | 1.382s | 1.422s (+2.9%) | high variation (CV > 10%) |
| Vue + jsdom | 2.631s | 1.480s (**-43.7%**) | high variation (CV > 10%) |
| Vue + happy-dom | 1.483s | 0.889s (**-40.1%**) | high variation (CV > 10%) |
| Vue + browser mode | SKIPPED | 1.310s | skipped / passed |
| barrel graph · medium | 0.439s | 0.475s (+8.0%) | — |

[Full report, variability and inputs](reports/versions.md). Generated from published samples and compatibility fingerprints; full logs and snapshots are stored separately.

<!-- benchmark:versions:end -->

The [report index](reports/README.md) links all five comparisons. [Recorded samples](reports/data/README.md) are included for report verification; full execution artifacts are stored separately.

## Coverage results

<!-- benchmark:coverage:start -->

Sources: baseline: **0.11.0** (npm); candidate: **0.12.6** (npm). Measured 2026-11-06 (UTC); Apple M4 Max × 14, darwin arm64, Node v24.11.1.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 15 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

| Case | baseline: 0.11.0 | candidate: 0.12.6 | Notes |
| --- | --- | --- | --- |
| Node module graph / none | 0.667s | 0.700s (+5.0%) | — |
| Node module graph / v8 | 1.322s | 1.082s (**-18.1%**) | — |
| Node module graph / istanbul | 0.991s | 0.864s (**-12.8%**) | — |
| Node dependencies and service logic / none | 0.576s | 0.616s (+7.0%) | — |
| Node dependencies and service logic / v8 | 0.824s | 0.789s (**-4.2%**) | — |
| Node dependencies and service logic / istanbul | 0.690s | 0.652s (**-5.6%**) | high variation (CV > 10%) |
| React + jsdom / none | 3.683s | 1.857s (**-49.6%**) | high variation (CV > 10%) |
| React + jsdom / v8 | 4.184s | 2.270s (**-45.8%**) | — |
| React + jsdom / istanbul | 4.041s | 1.991s (**-50.7%**) | high variation (CV > 10%) |
| barrel graph · medium / none | 0.407s | 0.435s (+7.0%) | — |
| barrel graph · medium / v8 | 0.631s | 0.620s (**-1.8%**) | high variation (CV > 10%) |
| barrel graph · medium / istanbul | 0.531s | 0.497s (**-6.4%**) | high variation (CV > 10%) |
| barrel graph · large / none | 0.439s | 0.446s (+1.6%) | — |
| barrel graph · large / v8 | 0.637s | 0.612s (**-4.0%**) | high variation (CV > 10%) |
| barrel graph · large / istanbul | 0.590s | 0.518s (**-12.3%**) | high variation (CV > 10%) |

### RSS comparison

Median maxrss in MiB; negative percentages mean less memory. This is OS maxrss, not the simultaneous total of all worker processes.

| Case | baseline: 0.11.0 | candidate: 0.12.6 |
| --- | --- | --- |
| Node module graph / none | 202.4 | 211.6 (+4.6%) |
| Node module graph / v8 | 422.5 | 345.4 (**-18.3%**) |
| Node module graph / istanbul | 304.6 | 336.7 (+10.5%) |
| Node dependencies and service logic / none | 169.9 | 179.9 (+5.9%) |
| Node dependencies and service logic / v8 | 213.0 | 215.5 (+1.2%) |
| Node dependencies and service logic / istanbul | 210.0 | 218.6 (+4.1%) |
| React + jsdom / none | 538.5 | 535.9 (**-0.5%**) |
| React + jsdom / v8 | 751.0 | 744.1 (**-0.9%**) |
| React + jsdom / istanbul | 461.5 | 575.4 (+24.7%) |
| barrel graph · medium / none | 173.4 | 181.2 (+4.5%) |
| barrel graph · medium / v8 | 202.5 | 203.3 (+0.4%) |
| barrel graph · medium / istanbul | 213.2 | 219.6 (+3.0%) |
| barrel graph · large / none | 181.8 | 188.9 (+3.9%) |
| barrel graph · large / v8 | 208.6 | 220.0 (+5.4%) |
| barrel graph · large / istanbul | 220.1 | 231.3 (+5.1%) |

[Full report, variability and inputs](reports/coverage.md). Generated from published samples and compatibility fingerprints; full logs and snapshots are stored separately.

<!-- benchmark:coverage:end -->

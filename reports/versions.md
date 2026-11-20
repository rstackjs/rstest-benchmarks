# main: 0.12.6 vs 1.0.0-beta.0

Source: [GitHub Actions](https://github.com/rstackjs/rstest-benchmarks/actions/runs/44705238824), commit `ac4d313ba287853df47348ad44b1f1f2f6b11a5b`, attempt 1.

Sources: baseline: **0.12.6** (npm); candidate: **1.0.0-beta.0** (npm). Measured 2026-11-20 (UTC); Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64, Node v26.13.0.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 10 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

Generated from raw samples. Change = (candidate / baseline − 1) × 100%; negative means faster. The first value column is the baseline. Values display two decimal places; changes use unrounded medians. All repetitions are retained; combined batches use the median of pooled samples, not the median of batch medians.

🏆 marks the lowest comparable median in each row. Percentages show change from the baseline.

### Elapsed time (s)

| Case | baseline: 0.12.6 | candidate: 1.0.0-beta.0 |
| --- | --- | --- |
| Node startup and utilities | 0.73s | **🏆 0.66s** (-9.63%) |
| Node module graph | 2.63s | **🏆 2.32s** (-11.59%) |
| Node dependencies and service logic | 1.85s | **🏆 1.67s** (-9.79%) |
| React + jsdom | **🏆 9.53s** | 10.06s (+5.53%) |
| React + happy-dom | 5.33s | **🏆 4.66s** (-12.60%) |
| React + browser mode | 5.33s | **🏆 5.12s** (-3.89%) |
| Vue + jsdom | 6.88s | **🏆 6.76s** (-1.73%) |
| Vue + happy-dom | 3.73s | **🏆 3.44s** (-7.76%) |
| Vue + browser mode | 3.71s | **🏆 3.59s** (-3.32%) |
| barrel graph · medium | 1.60s | **🏆 1.47s** (-8.45%) |

### Memory comparison (MiB, peak process-tree footprint)

| Case | baseline: 0.12.6 | candidate: 1.0.0-beta.0 |
| --- | --- | --- |
| Node startup and utilities | **🏆 117.84** | 119.55 (+1.45%) |
| Node module graph | 153.94 | **🏆 153.40** (-0.35%) |
| Node dependencies and service logic | 167.37 | **🏆 162.41** (-2.97%) |
| React + jsdom | 606.41 | **🏆 415.84** (-31.43%) |
| React + happy-dom | 368.80 | **🏆 298.77** (-18.99%) |
| React + browser mode | **🏆 365.66** | 402.40 (+10.05%) |
| Vue + jsdom | 597.86 | **🏆 423.86** (-29.10%) |
| Vue + happy-dom | 348.01 | **🏆 284.52** (-18.25%) |
| Vue + browser mode | **🏆 343.91** | 385.89 (+12.21%) |
| barrel graph · medium | **🏆 137.63** | 137.64 (+0.00%) |

## Variability

MAD is unscaled. CV uses sample standard deviation (n − 1). Evaluate CV together with absolute SD and range before deciding whether a fluctuation warrants a rerun. Small sample counts do not establish a regression. Failed or incomplete batches never receive a speedup percentage.

| Case | Column | Status | n | Median | Min–max | MAD | SD | CV | Files | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Node startup and utilities | baseline: 0.12.6 | passed | 6 | 0.73s | 0.62s–0.92s | 0.10s | 0.12s | 16.34% | 5 | 18 |
| Node startup and utilities | candidate: 1.0.0-beta.0 | passed | 6 | 0.66s | 0.56s–0.87s | 0.09s | 0.12s | 17.73% | 5 | 18 |
| Node module graph | baseline: 0.12.6 | passed | 6 | 2.63s | 2.21s–3.14s | 0.17s | 0.32s | 11.89% | 40 | 122 |
| Node module graph | candidate: 1.0.0-beta.0 | passed | 6 | 2.32s | 1.92s–2.81s | 0.24s | 0.32s | 13.57% | 40 | 122 |
| Node dependencies and service logic | baseline: 0.12.6 | passed | 6 | 1.85s | 1.76s–2.15s | 0.07s | 0.15s | 7.94% | 16 | 45 |
| Node dependencies and service logic | candidate: 1.0.0-beta.0 | passed | 6 | 1.67s | 1.63s–2.27s | 0.02s | 0.25s | 14.10% | 16 | 45 |
| React + jsdom | baseline: 0.12.6 | passed | 6 | 9.53s | 8.97s–11.12s | 0.24s | 0.74s | 7.62% | 30 | 54 |
| React + jsdom | candidate: 1.0.0-beta.0 | passed | 6 | 10.06s | 8.93s–11.62s | 0.66s | 0.97s | 9.63% | 30 | 54 |
| React + happy-dom | baseline: 0.12.6 | passed | 6 | 5.33s | 4.71s–7.51s | 0.28s | 1.02s | 18.42% | 30 | 54 |
| React + happy-dom | candidate: 1.0.0-beta.0 | passed | 6 | 4.66s | 3.92s–5.90s | 0.49s | 0.75s | 15.92% | 30 | 54 |
| React + browser mode | baseline: 0.12.6 | passed | 6 | 5.33s | 4.67s–7.46s | 0.62s | 1.05s | 18.76% | 30 | 54 |
| React + browser mode | candidate: 1.0.0-beta.0 | passed | 6 | 5.12s | 4.71s–6.44s | 0.40s | 0.68s | 12.75% | 30 | 54 |
| Vue + jsdom | baseline: 0.12.6 | passed | 6 | 6.88s | 6.28s–7.74s | 0.43s | 0.57s | 8.34% | 20 | 20 |
| Vue + jsdom | candidate: 1.0.0-beta.0 | passed | 6 | 6.76s | 5.76s–9.11s | 0.50s | 1.17s | 16.70% | 20 | 20 |
| Vue + happy-dom | baseline: 0.12.6 | passed | 6 | 3.73s | 3.14s–4.09s | 0.32s | 0.41s | 11.09% | 20 | 20 |
| Vue + happy-dom | candidate: 1.0.0-beta.0 | passed | 6 | 3.44s | 3.29s–3.79s | 0.13s | 0.20s | 5.69% | 20 | 20 |
| Vue + browser mode | baseline: 0.12.6 | passed | 6 | 3.71s | 2.83s–4.51s | 0.20s | 0.55s | 15.00% | 20 | 20 |
| Vue + browser mode | candidate: 1.0.0-beta.0 | passed | 6 | 3.59s | 2.90s–3.78s | 0.16s | 0.32s | 9.26% | 20 | 20 |
| barrel graph · medium | baseline: 0.12.6 | passed | 6 | 1.60s | 1.30s–2.13s | 0.22s | 0.32s | 19.68% | 20 | 40 |
| barrel graph · medium | candidate: 1.0.0-beta.0 | passed | 6 | 1.47s | 1.07s–1.78s | 0.19s | 0.26s | 17.95% | 20 | 40 |

## Memory

Peak process-tree physical footprint in MiB (macOS `phys_footprint`, summed every ~50 ms).

| Case | Column | Status | n | Median MiB | Min–max MiB | CV |
| --- | --- | --- | --- | --- | --- | --- |
| Node startup and utilities | baseline: 0.12.6 | passed | 6 | 117.84 | 110.81–123.47 | 4.43% |
| Node startup and utilities | candidate: 1.0.0-beta.0 | passed | 6 | 119.55 | 117.28–125.94 | 3.19% |
| Node module graph | baseline: 0.12.6 | passed | 6 | 153.94 | 153.46–159.01 | 1.44% |
| Node module graph | candidate: 1.0.0-beta.0 | passed | 6 | 153.40 | 151.40–158.29 | 1.58% |
| Node dependencies and service logic | baseline: 0.12.6 | passed | 6 | 167.37 | 161.90–176.58 | 3.25% |
| Node dependencies and service logic | candidate: 1.0.0-beta.0 | passed | 6 | 162.41 | 154.90–164.44 | 2.45% |
| React + jsdom | baseline: 0.12.6 | passed | 6 | 606.41 | 591.55–610.65 | 1.19% |
| React + jsdom | candidate: 1.0.0-beta.0 | passed | 6 | 415.84 | 414.76–430.57 | 1.73% |
| React + happy-dom | baseline: 0.12.6 | passed | 6 | 368.80 | 359.76–374.81 | 1.50% |
| React + happy-dom | candidate: 1.0.0-beta.0 | passed | 6 | 298.77 | 290.20–306.59 | 2.32% |
| React + browser mode | baseline: 0.12.6 | passed | 6 | 365.66 | 361.08–370.55 | 1.01% |
| React + browser mode | candidate: 1.0.0-beta.0 | passed | 6 | 402.40 | 397.81–407.37 | 0.83% |
| Vue + jsdom | baseline: 0.12.6 | passed | 6 | 597.86 | 585.37–607.12 | 1.33% |
| Vue + jsdom | candidate: 1.0.0-beta.0 | passed | 6 | 423.86 | 410.84–433.57 | 1.92% |
| Vue + happy-dom | baseline: 0.12.6 | passed | 6 | 348.01 | 332.54–362.84 | 3.14% |
| Vue + happy-dom | candidate: 1.0.0-beta.0 | passed | 6 | 284.52 | 264.14–298.37 | 3.92% |
| Vue + browser mode | baseline: 0.12.6 | passed | 6 | 343.91 | 341.63–348.74 | 0.78% |
| Vue + browser mode | candidate: 1.0.0-beta.0 | passed | 6 | 385.89 | 379.57–398.23 | 1.96% |
| barrel graph · medium | baseline: 0.12.6 | passed | 6 | 137.63 | 132.41–139.02 | 1.82% |
| barrel graph · medium | candidate: 1.0.0-beta.0 | passed | 6 | 137.64 | 135.91–139.54 | 1.05% |

## Inputs and provenance

- `reports/data/ci-versions-2026-11-20T08-47-46-373Z-b2279e99-baseline-main.json`: 2026-11-20T08:47:46.447Z; Node v26.13.0; Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64; lockfile SHA-256: 7123888d5cfe1ee770452ece3fca53bf0702544ea23a11b4dce7557cace858c1. Source: npm / 0.12.6; fingerprint: 7d901a930ef93f885c74f9d3e8ab22dbdaef06698b4f32a0611c98105e956bde.
- `reports/data/ci-versions-2026-11-20T08-47-47-100Z-f9c20a97-candidate-main.json`: 2026-11-20T08:47:47.117Z; Node v26.13.0; Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64; lockfile SHA-256: 3189e3bdf680f02ef94d8e8b29067aec01e6af202664c2dd6bec30d13e046561. Source: npm / 1.0.0-beta.0; fingerprint: 22c18089a7d8dc72e12a16256816f9dace6407187ca2d943a0df1e79ab08b28a.

Published inputs retain every sample, warmup, test count, timestamp and compatibility fingerprint. Full logs, commands and source snapshots are stored separately; meta.publication.sourceSha256 identifies the original result JSON.
Versions are measured in paired case/round order, alternating the first side each round and fixture. No benchmark processes overlap. Workload dependencies, fixtures, configurations, harness and host compatibility are checked before calculating changes.

# scaling: 0.12.6 vs 1.0.0-beta.0

Source: [GitHub Actions](https://github.com/rstackjs/rstest-benchmarks/actions/runs/44710050665), commit `0eae38429b438c4afae9e02b21a70cdbe0a7beef`, attempt 1.

Sources: baseline: **0.12.6** (npm); candidate: **1.0.0-beta.0** (npm). Measured 2026-11-20 (UTC); Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64, Node v26.13.0.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 6 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

Generated from raw samples. Change = (candidate / baseline − 1) × 100%; negative means faster. The first value column is the baseline. Values display two decimal places; changes use unrounded medians. All repetitions are retained; combined batches use the median of pooled samples, not the median of batch medians.

🏆 marks the lowest comparable median in each row. Percentages show change from the baseline.

### Elapsed time (s)

| Case | baseline: 0.12.6 | candidate: 1.0.0-beta.0 |
| --- | --- | --- |
| files scaling · small | 0.65s | **🏆 0.57s** (-12.47%) |
| files scaling · medium | 1.88s | **🏆 1.63s** (-13.71%) |
| files scaling · large | 5.15s | **🏆 4.44s** (-13.74%) |
| graph scaling · small | 1.79s | **🏆 1.62s** (-9.28%) |
| graph scaling · medium | 2.01s | **🏆 1.79s** (-11.05%) |
| graph scaling · large | 2.46s | **🏆 2.12s** (-13.77%) |

### Memory comparison (MiB, peak process-tree footprint)

| Case | baseline: 0.12.6 | candidate: 1.0.0-beta.0 |
| --- | --- | --- |
| files scaling · small | 141.98 | **🏆 137.79** (-2.95%) |
| files scaling · medium | 149.18 | **🏆 146.38** (-1.88%) |
| files scaling · large | 170.50 | **🏆 166.72** (-2.22%) |
| graph scaling · small | 140.12 | **🏆 136.93** (-2.28%) |
| graph scaling · medium | 147.30 | **🏆 146.58** (-0.49%) |
| graph scaling · large | 239.18 | **🏆 193.17** (-19.24%) |

## Variability

MAD is unscaled. CV uses sample standard deviation (n − 1). Evaluate CV together with absolute SD and range before deciding whether a fluctuation warrants a rerun. Small sample counts do not establish a regression. Failed or incomplete batches never receive a speedup percentage.

| Case | Column | Status | n | Median | Min–max | MAD | SD | CV | Files | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| files scaling · small | baseline: 0.12.6 | passed | 6 | 0.65s | 0.60s–0.71s | 0.02s | 0.04s | 5.70% | 10 | 20 |
| files scaling · small | candidate: 1.0.0-beta.0 | passed | 6 | 0.57s | 0.55s–0.59s | 0.01s | 0.01s | 2.20% | 10 | 20 |
| files scaling · medium | baseline: 0.12.6 | passed | 6 | 1.88s | 1.80s–2.07s | 0.04s | 0.09s | 4.92% | 40 | 80 |
| files scaling · medium | candidate: 1.0.0-beta.0 | passed | 6 | 1.63s | 1.58s–1.78s | 0.04s | 0.08s | 4.78% | 40 | 80 |
| files scaling · large | baseline: 0.12.6 | passed | 6 | 5.15s | 4.96s–5.28s | 0.07s | 0.12s | 2.24% | 120 | 240 |
| files scaling · large | candidate: 1.0.0-beta.0 | passed | 6 | 4.44s | 4.38s–4.46s | 0.01s | 0.04s | 0.84% | 120 | 240 |
| graph scaling · small | baseline: 0.12.6 | passed | 6 | 1.79s | 1.69s–1.82s | 0.02s | 0.05s | 2.65% | 40 | 80 |
| graph scaling · small | candidate: 1.0.0-beta.0 | passed | 6 | 1.62s | 1.53s–1.74s | 0.09s | 0.09s | 5.46% | 40 | 80 |
| graph scaling · medium | baseline: 0.12.6 | passed | 6 | 2.01s | 1.81s–2.11s | 0.08s | 0.12s | 5.94% | 40 | 80 |
| graph scaling · medium | candidate: 1.0.0-beta.0 | passed | 6 | 1.79s | 1.63s–1.89s | 0.08s | 0.10s | 5.94% | 40 | 80 |
| graph scaling · large | baseline: 0.12.6 | passed | 6 | 2.46s | 2.23s–2.62s | 0.13s | 0.16s | 6.73% | 40 | 80 |
| graph scaling · large | candidate: 1.0.0-beta.0 | passed | 6 | 2.12s | 1.96s–2.28s | 0.09s | 0.12s | 5.84% | 40 | 80 |

## Memory

Peak process-tree physical footprint in MiB (macOS `phys_footprint`, summed every ~50 ms).

| Case | Column | Status | n | Median MiB | Min–max MiB | CV |
| --- | --- | --- | --- | --- | --- | --- |
| files scaling · small | baseline: 0.12.6 | passed | 6 | 141.98 | 139.80–145.76 | 1.59% |
| files scaling · small | candidate: 1.0.0-beta.0 | passed | 6 | 137.79 | 131.72–144.47 | 3.23% |
| files scaling · medium | baseline: 0.12.6 | passed | 6 | 149.18 | 146.32–150.90 | 1.14% |
| files scaling · medium | candidate: 1.0.0-beta.0 | passed | 6 | 146.38 | 143.13–149.68 | 1.69% |
| files scaling · large | baseline: 0.12.6 | passed | 6 | 170.50 | 166.90–174.35 | 1.81% |
| files scaling · large | candidate: 1.0.0-beta.0 | passed | 6 | 166.72 | 165.60–172.40 | 1.60% |
| graph scaling · small | baseline: 0.12.6 | passed | 6 | 140.12 | 136.47–145.88 | 2.31% |
| graph scaling · small | candidate: 1.0.0-beta.0 | passed | 6 | 136.93 | 132.61–138.83 | 1.67% |
| graph scaling · medium | baseline: 0.12.6 | passed | 6 | 147.30 | 143.83–150.94 | 1.56% |
| graph scaling · medium | candidate: 1.0.0-beta.0 | passed | 6 | 146.58 | 145.15–149.55 | 1.20% |
| graph scaling · large | baseline: 0.12.6 | passed | 6 | 239.18 | 232.54–246.82 | 2.24% |
| graph scaling · large | candidate: 1.0.0-beta.0 | passed | 6 | 193.17 | 184.16–198.17 | 2.63% |

## Inputs and provenance

- `reports/data/ci-versions-2026-11-20T09-27-17-825Z-39572c14-baseline-scaling.json`: 2026-11-20T09:27:17.854Z; Node v26.13.0; Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64; lockfile SHA-256: 7123888d5cfe1ee770452ece3fca53bf0702544ea23a11b4dce7557cace858c1. Source: npm / 0.12.6; fingerprint: 7d901a930ef93f885c74f9d3e8ab22dbdaef06698b4f32a0611c98105e956bde.
- `reports/data/ci-versions-2026-11-20T09-27-18-257Z-d23a4283-candidate-scaling.json`: 2026-11-20T09:27:18.270Z; Node v26.13.0; Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64; lockfile SHA-256: 3189e3bdf680f02ef94d8e8b29067aec01e6af202664c2dd6bec30d13e046561. Source: npm / 1.0.0-beta.0; fingerprint: 22c18089a7d8dc72e12a16256816f9dace6407187ca2d943a0df1e79ab08b28a.

Published inputs retain every sample, warmup, test count, timestamp and compatibility fingerprint. Full logs, commands and source snapshots are stored separately; meta.publication.sourceSha256 identifies the original result JSON.
Versions are measured in paired case/round order, alternating the first side each round and fixture. No benchmark processes overlap. Workload dependencies, fixtures, configurations, harness and host compatibility are checked before calculating changes.

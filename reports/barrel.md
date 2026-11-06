# barrel: 0.11.0 vs 0.12.6

Sources: baseline: **0.11.0** (npm); candidate: **0.12.6** (npm). Measured 2026-11-06 (UTC); Apple M4 Max × 14, darwin arm64, Node v24.11.1.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 6 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

Generated from raw samples. Change = (candidate / baseline − 1) × 100%; negative means faster. The first value column is the baseline; each Δ column shows the change relative to it. Values display two decimal places; changes use unrounded medians. All repetitions are retained; combined batches use the median of pooled samples, not the median of batch medians.

| Case | baseline: 0.11.0 | candidate: 0.12.6 | Δ |
| --- | --- | --- | --- |
| barrel graph · small / default | 0.43s | 0.45s | +4.75% |
| barrel graph · small / lazy-barrel disabled | 0.44s | 0.47s | +6.35% |
| barrel graph · medium / default | 0.45s | 0.48s | +5.84% |
| barrel graph · medium / lazy-barrel disabled | 0.60s | 0.63s | +4.02% |
| barrel graph · large / default | 0.45s | 0.49s | +9.22% |
| barrel graph · large / lazy-barrel disabled | 1.12s | 1.23s | +9.93% |

## Variability

MAD is unscaled. CV uses sample standard deviation (n − 1). Evaluate CV together with absolute SD and range before deciding whether a fluctuation warrants a rerun. Small sample counts do not establish a regression. Failed or incomplete batches never receive a speedup percentage.

| Case | Column | Status | n | Median | Min–max | MAD | SD | CV | Files | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| barrel graph · small / default | baseline: 0.11.0 | passed | 6 | 0.43s | 0.42s–0.44s | 0.00s | 0.01s | 1.51% | 20 | 40 |
| barrel graph · small / default | candidate: 0.12.6 | passed | 6 | 0.45s | 0.44s–0.47s | 0.01s | 0.01s | 3.03% | 20 | 40 |
| barrel graph · small / lazy-barrel disabled | baseline: 0.11.0 | passed | 6 | 0.44s | 0.43s–0.45s | 0.00s | 0.01s | 1.75% | 20 | 40 |
| barrel graph · small / lazy-barrel disabled | candidate: 0.12.6 | passed | 6 | 0.47s | 0.45s–0.50s | 0.01s | 0.02s | 3.62% | 20 | 40 |
| barrel graph · medium / default | baseline: 0.11.0 | passed | 6 | 0.45s | 0.42s–0.46s | 0.01s | 0.02s | 3.66% | 20 | 40 |
| barrel graph · medium / default | candidate: 0.12.6 | passed | 6 | 0.48s | 0.43s–0.51s | 0.03s | 0.03s | 6.56% | 20 | 40 |
| barrel graph · medium / lazy-barrel disabled | baseline: 0.11.0 | passed | 6 | 0.60s | 0.59s–0.64s | 0.02s | 0.02s | 3.96% | 20 | 40 |
| barrel graph · medium / lazy-barrel disabled | candidate: 0.12.6 | passed | 6 | 0.63s | 0.61s–0.66s | 0.01s | 0.02s | 2.95% | 20 | 40 |
| barrel graph · large / default | baseline: 0.11.0 | passed | 6 | 0.45s | 0.43s–0.50s | 0.01s | 0.02s | 5.16% | 20 | 40 |
| barrel graph · large / default | candidate: 0.12.6 | passed | 6 | 0.49s | 0.46s–0.51s | 0.01s | 0.02s | 3.12% | 20 | 40 |
| barrel graph · large / lazy-barrel disabled | baseline: 0.11.0 | passed | 6 | 1.12s | 1.05s–1.19s | 0.03s | 0.05s | 4.45% | 20 | 40 |
| barrel graph · large / lazy-barrel disabled | candidate: 0.12.6 | passed | 6 | 1.23s | 1.14s–1.36s | 0.06s | 0.08s | 6.37% | 20 | 40 |

## Inputs and provenance

- `reports/data/releases-0110-0126-2026-11-06T03-35-39-993Z-0458303c-baseline-barrel.json`: 2026-11-06T03:35:40.014Z; Node v24.11.1; Apple M4 Max × 14; darwin arm64; lockfile SHA-256: 7f35af5876a5c68b2da3985e75cf92db3f4ae3891a513ba7c354e587e09b8421. Source: npm / 0.11.0; fingerprint: 27da13cc2b4ab0a6ce1f46eab28f7cf323a8fce1a7074ae84c2b26d151792f8c.
- `reports/data/releases-0110-0126-2026-11-06T03-35-42-602Z-85140dec-candidate-barrel.json`: 2026-11-06T03:35:42.619Z; Node v24.11.1; Apple M4 Max × 14; darwin arm64; lockfile SHA-256: 7123888d5cfe1ee770452ece3fca53bf0702544ea23a11b4dce7557cace858c1. Source: npm / 0.12.6; fingerprint: 7d901a930ef93f885c74f9d3e8ab22dbdaef06698b4f32a0611c98105e956bde.

Published inputs retain every sample, warmup, test count, timestamp and compatibility fingerprint. Full logs, commands and source snapshots are stored separately; meta.publication.sourceSha256 identifies the original result JSON.
Versions are measured in paired case/round order, alternating the first side each round and fixture. No benchmark processes overlap. Workload dependencies, fixtures, configurations, harness and host compatibility are checked before calculating changes.

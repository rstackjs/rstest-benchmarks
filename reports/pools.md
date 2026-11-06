# pools: 0.11.0 vs 0.12.6

Sources: baseline: **0.11.0** (npm); candidate: **0.12.6** (npm). Measured 2026-11-06 (UTC); Apple M4 Max × 14, darwin arm64, Node v24.11.1.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 12 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

Generated from raw samples. Change = (candidate / baseline − 1) × 100%; negative means faster. The first value column is the baseline; each Δ column shows the change relative to it. Values display two decimal places; changes use unrounded medians. All repetitions are retained; combined batches use the median of pooled samples, not the median of batch medians.

| Case | baseline: 0.11.0 | candidate: 0.12.6 | Δ | Notes |
| --- | --- | --- | --- | --- |
| small module graph / forks | 0.33s | 0.35s | +8.28% | — |
| small module graph / threads | 0.27s | 0.29s | +6.87% | — |
| small module graph / vmForks | SKIPPED | 0.38s | — | skipped / passed |
| small module graph / vmThreads | SKIPPED | 0.32s | — | skipped / passed |
| medium module graph / forks | 0.69s | 0.72s | +4.77% | — |
| medium module graph / threads | 0.53s | 0.56s | +6.12% | — |
| medium module graph / vmForks | SKIPPED | 0.50s | — | skipped / passed |
| medium module graph / vmThreads | SKIPPED | 0.43s | — | skipped / passed |
| large module graph / forks | 1.57s | 1.70s | +8.39% | — |
| large module graph / threads | 1.14s | 1.24s | +8.54% | — |
| large module graph / vmForks | SKIPPED | 0.73s | — | skipped / passed |
| large module graph / vmThreads | SKIPPED | 0.64s | — | skipped / passed |

## Variability

MAD is unscaled. CV uses sample standard deviation (n − 1). Evaluate CV together with absolute SD and range before deciding whether a fluctuation warrants a rerun. Small sample counts do not establish a regression. Failed or incomplete batches never receive a speedup percentage.

| Case | Column | Status | n | Median | Min–max | MAD | SD | CV | Files | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| small module graph / forks | baseline: 0.11.0 | passed | 6 | 0.33s | 0.31s–0.39s | 0.02s | 0.03s | 8.97% | 10 | 29 |
| small module graph / forks | candidate: 0.12.6 | passed | 6 | 0.35s | 0.32s–0.49s | 0.02s | 0.06s | 16.86% | 10 | 29 |
| small module graph / threads | baseline: 0.11.0 | passed | 6 | 0.27s | 0.27s–0.29s | 0.00s | 0.01s | 3.06% | 10 | 29 |
| small module graph / threads | candidate: 0.12.6 | passed | 6 | 0.29s | 0.28s–0.31s | 0.01s | 0.01s | 4.13% | 10 | 29 |
| small module graph / vmForks | baseline: 0.11.0 | skipped | 0 | — | —–— | — | — | — | 10 | unknown |
| small module graph / vmForks | candidate: 0.12.6 | passed | 6 | 0.38s | 0.36s–0.39s | 0.02s | 0.02s | 4.31% | 10 | 29 |
| small module graph / vmThreads | baseline: 0.11.0 | skipped | 0 | — | —–— | — | — | — | 10 | unknown |
| small module graph / vmThreads | candidate: 0.12.6 | passed | 6 | 0.32s | 0.31s–0.35s | 0.00s | 0.01s | 4.31% | 10 | 29 |
| medium module graph / forks | baseline: 0.11.0 | passed | 6 | 0.69s | 0.66s–0.73s | 0.01s | 0.02s | 3.29% | 40 | 122 |
| medium module graph / forks | candidate: 0.12.6 | passed | 6 | 0.72s | 0.66s–0.80s | 0.05s | 0.05s | 7.27% | 40 | 122 |
| medium module graph / threads | baseline: 0.11.0 | passed | 6 | 0.53s | 0.50s–0.65s | 0.02s | 0.05s | 9.99% | 40 | 122 |
| medium module graph / threads | candidate: 0.12.6 | passed | 6 | 0.56s | 0.52s–0.80s | 0.02s | 0.10s | 17.00% | 40 | 122 |
| medium module graph / vmForks | baseline: 0.11.0 | skipped | 0 | — | —–— | — | — | — | 40 | unknown |
| medium module graph / vmForks | candidate: 0.12.6 | passed | 6 | 0.50s | 0.48s–0.53s | 0.01s | 0.02s | 3.79% | 40 | 122 |
| medium module graph / vmThreads | baseline: 0.11.0 | skipped | 0 | — | —–— | — | — | — | 40 | unknown |
| medium module graph / vmThreads | candidate: 0.12.6 | passed | 6 | 0.43s | 0.42s–0.50s | 0.01s | 0.03s | 6.81% | 40 | 122 |
| large module graph / forks | baseline: 0.11.0 | passed | 6 | 1.57s | 1.40s–1.73s | 0.08s | 0.12s | 7.39% | 120 | 366 |
| large module graph / forks | candidate: 0.12.6 | passed | 6 | 1.70s | 1.48s–2.33s | 0.13s | 0.30s | 16.41% | 120 | 366 |
| large module graph / threads | baseline: 0.11.0 | passed | 6 | 1.14s | 1.08s–1.21s | 0.01s | 0.04s | 3.60% | 120 | 366 |
| large module graph / threads | candidate: 0.12.6 | passed | 6 | 1.24s | 1.11s–1.41s | 0.11s | 0.12s | 9.35% | 120 | 366 |
| large module graph / vmForks | baseline: 0.11.0 | skipped | 0 | — | —–— | — | — | — | 120 | unknown |
| large module graph / vmForks | candidate: 0.12.6 | passed | 6 | 0.73s | 0.72s–0.84s | 0.01s | 0.05s | 6.51% | 120 | 366 |
| large module graph / vmThreads | baseline: 0.11.0 | skipped | 0 | — | —–— | — | — | — | 120 | unknown |
| large module graph / vmThreads | candidate: 0.12.6 | passed | 6 | 0.64s | 0.63s–0.97s | 0.01s | 0.13s | 18.94% | 120 | 366 |

## Inputs and provenance

- `reports/data/releases-0110-0126-2026-11-06T03-36-40-100Z-8f8715f5-baseline-pools.json`: 2026-11-06T03:36:40.118Z; Node v24.11.1; Apple M4 Max × 14; logical CPUs: not recorded; available parallelism: 14; darwin arm64; lockfile SHA-256: 7f35af5876a5c68b2da3985e75cf92db3f4ae3891a513ba7c354e587e09b8421. Source: npm / 0.11.0; fingerprint: 27da13cc2b4ab0a6ce1f46eab28f7cf323a8fce1a7074ae84c2b26d151792f8c.
- `reports/data/releases-0110-0126-2026-11-06T03-36-42-128Z-6045e160-candidate-pools.json`: 2026-11-06T03:36:42.146Z; Node v24.11.1; Apple M4 Max × 14; logical CPUs: not recorded; available parallelism: 14; darwin arm64; lockfile SHA-256: 7123888d5cfe1ee770452ece3fca53bf0702544ea23a11b4dce7557cace858c1. Source: npm / 0.12.6; fingerprint: 7d901a930ef93f885c74f9d3e8ab22dbdaef06698b4f32a0611c98105e956bde.

Published inputs retain every sample, warmup, test count, timestamp and compatibility fingerprint. Full logs, commands and source snapshots are stored separately; meta.publication.sourceSha256 identifies the original result JSON.
Versions are measured in paired case/round order, alternating the first side each round and fixture. No benchmark processes overlap. Workload dependencies, fixtures, configurations, harness and host compatibility are checked before calculating changes.

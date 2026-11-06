# pools: 0.11.0 vs 0.12.6

Sources: baseline: **0.11.0** (npm); candidate: **0.12.6** (npm). Measured 2026-11-06 (UTC); Apple M4 Max × 14, darwin arm64, Node v24.11.1.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 12 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

Generated from raw samples. Change = (candidate / baseline − 1) × 100%; negative means faster. The first column is the baseline. All repetitions are retained; combined batches use the median of pooled samples, not the median of batch medians.

| Case | baseline: 0.11.0 | candidate: 0.12.6 | Notes |
| --- | --- | --- | --- |
| small module graph / forks | 0.328s | 0.355s (+8.3%) | high variation (CV > 10%) |
| small module graph / threads | 0.273s | 0.292s (+6.9%) | — |
| small module graph / vmForks | SKIPPED | 0.378s | skipped / passed |
| small module graph / vmThreads | SKIPPED | 0.323s | skipped / passed |
| medium module graph / forks | 0.690s | 0.723s (+4.8%) | — |
| medium module graph / threads | 0.532s | 0.564s (+6.1%) | high variation (CV > 10%) |
| medium module graph / vmForks | SKIPPED | 0.498s | skipped / passed |
| medium module graph / vmThreads | SKIPPED | 0.431s | skipped / passed |
| large module graph / forks | 1.568s | 1.699s (+8.4%) | high variation (CV > 10%) |
| large module graph / threads | 1.141s | 1.238s (+8.5%) | — |
| large module graph / vmForks | SKIPPED | 0.735s | skipped / passed |
| large module graph / vmThreads | SKIPPED | 0.643s | skipped / passed |

## Variability

MAD is unscaled. CV uses sample standard deviation (n − 1). CV > 10% is flagged as high variation, not as a significance test; small sample counts do not establish a regression. Failed or incomplete batches never receive a speedup percentage.

| Case | Column | Status | n | Median | Min–max | MAD | CV | Files | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| small module graph / forks | baseline: 0.11.0 | passed | 6 | 0.328s | 0.307s–0.387s | 0.019s | 9.0% | 10 | 29 |
| small module graph / forks | candidate: 0.12.6 | passed | 6 | 0.355s | 0.323s–0.494s | 0.017s | 16.9% | 10 | 29 |
| small module graph / threads | baseline: 0.11.0 | passed | 6 | 0.273s | 0.267s–0.289s | 0.004s | 3.1% | 10 | 29 |
| small module graph / threads | candidate: 0.12.6 | passed | 6 | 0.292s | 0.278s–0.306s | 0.012s | 4.1% | 10 | 29 |
| small module graph / vmForks | baseline: 0.11.0 | skipped | 0 | — | —–— | — | — | 10 | unknown |
| small module graph / vmForks | candidate: 0.12.6 | passed | 6 | 0.378s | 0.358s–0.394s | 0.015s | 4.3% | 10 | 29 |
| small module graph / vmThreads | baseline: 0.11.0 | skipped | 0 | — | —–— | — | — | 10 | unknown |
| small module graph / vmThreads | candidate: 0.12.6 | passed | 6 | 0.323s | 0.309s–0.350s | 0.005s | 4.3% | 10 | 29 |
| medium module graph / forks | baseline: 0.11.0 | passed | 6 | 0.690s | 0.663s–0.730s | 0.014s | 3.3% | 40 | 122 |
| medium module graph / forks | candidate: 0.12.6 | passed | 6 | 0.723s | 0.665s–0.798s | 0.050s | 7.3% | 40 | 122 |
| medium module graph / threads | baseline: 0.11.0 | passed | 6 | 0.532s | 0.496s–0.652s | 0.017s | 10.0% | 40 | 122 |
| medium module graph / threads | candidate: 0.12.6 | passed | 6 | 0.564s | 0.521s–0.797s | 0.024s | 17.0% | 40 | 122 |
| medium module graph / vmForks | baseline: 0.11.0 | skipped | 0 | — | —–— | — | — | 40 | unknown |
| medium module graph / vmForks | candidate: 0.12.6 | passed | 6 | 0.498s | 0.475s–0.528s | 0.011s | 3.8% | 40 | 122 |
| medium module graph / vmThreads | baseline: 0.11.0 | skipped | 0 | — | —–— | — | — | 40 | unknown |
| medium module graph / vmThreads | candidate: 0.12.6 | passed | 6 | 0.431s | 0.420s–0.499s | 0.010s | 6.8% | 40 | 122 |
| large module graph / forks | baseline: 0.11.0 | passed | 6 | 1.568s | 1.399s–1.731s | 0.076s | 7.4% | 120 | 366 |
| large module graph / forks | candidate: 0.12.6 | passed | 6 | 1.699s | 1.479s–2.327s | 0.126s | 16.4% | 120 | 366 |
| large module graph / threads | baseline: 0.11.0 | passed | 6 | 1.141s | 1.080s–1.207s | 0.012s | 3.6% | 120 | 366 |
| large module graph / threads | candidate: 0.12.6 | passed | 6 | 1.238s | 1.110s–1.405s | 0.109s | 9.3% | 120 | 366 |
| large module graph / vmForks | baseline: 0.11.0 | skipped | 0 | — | —–— | — | — | 120 | unknown |
| large module graph / vmForks | candidate: 0.12.6 | passed | 6 | 0.735s | 0.716s–0.843s | 0.014s | 6.5% | 120 | 366 |
| large module graph / vmThreads | baseline: 0.11.0 | skipped | 0 | — | —–— | — | — | 120 | unknown |
| large module graph / vmThreads | candidate: 0.12.6 | passed | 6 | 0.643s | 0.632s–0.965s | 0.008s | 18.9% | 120 | 366 |

## Inputs and provenance

- `reports/data/releases-0110-0126-2026-11-06T03-36-40-100Z-8f8715f5-baseline-pools.json`: 2026-11-06T03:36:40.118Z; Node v24.11.1; Apple M4 Max × 14; darwin arm64; lockfile SHA-256: 7f35af5876a5c68b2da3985e75cf92db3f4ae3891a513ba7c354e587e09b8421. Source: npm / 0.11.0; fingerprint: 27da13cc2b4ab0a6ce1f46eab28f7cf323a8fce1a7074ae84c2b26d151792f8c.
- `reports/data/releases-0110-0126-2026-11-06T03-36-42-128Z-6045e160-candidate-pools.json`: 2026-11-06T03:36:42.146Z; Node v24.11.1; Apple M4 Max × 14; darwin arm64; lockfile SHA-256: 7123888d5cfe1ee770452ece3fca53bf0702544ea23a11b4dce7557cace858c1. Source: npm / 0.12.6; fingerprint: 7d901a930ef93f885c74f9d3e8ab22dbdaef06698b4f32a0611c98105e956bde.

Published inputs retain every sample, warmup, test count, timestamp and compatibility fingerprint. Full logs, commands and source snapshots are stored separately; meta.publication.sourceSha256 identifies the original result JSON.
Versions are measured in paired case/round order, alternating the first side each round and fixture. No benchmark processes overlap. Workload dependencies, fixtures, configurations, harness and host compatibility are checked before calculating changes.

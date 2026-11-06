# barrel: 0.11.0 vs 0.12.6

Sources: baseline: **0.11.0** (npm); candidate: **0.12.6** (npm). Measured 2026-11-06 (UTC); Apple M4 Max × 14, darwin arm64, Node v24.11.1.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 6 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

Generated from raw samples. Change = (candidate / baseline − 1) × 100%; negative means faster. The first column is the baseline. All repetitions are retained; combined batches use the median of pooled samples, not the median of batch medians.

| Case | baseline: 0.11.0 | candidate: 0.12.6 | Notes |
| --- | --- | --- | --- |
| barrel graph · small / default | 0.433s | 0.453s (+4.8%) | — |
| barrel graph · small / lazy-barrel disabled | 0.441s | 0.469s (+6.4%) | — |
| barrel graph · medium / default | 0.454s | 0.480s (+5.8%) | — |
| barrel graph · medium / lazy-barrel disabled | 0.603s | 0.627s (+4.0%) | — |
| barrel graph · large / default | 0.448s | 0.490s (+9.2%) | — |
| barrel graph · large / lazy-barrel disabled | 1.115s | 1.226s (+9.9%) | — |

## Variability

MAD is unscaled. CV uses sample standard deviation (n − 1). CV > 10% is flagged as high variation, not as a significance test; small sample counts do not establish a regression. Failed or incomplete batches never receive a speedup percentage.

| Case | Column | Status | n | Median | Min–max | MAD | CV | Files | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| barrel graph · small / default | baseline: 0.11.0 | passed | 6 | 0.433s | 0.419s–0.437s | 0.002s | 1.5% | 20 | 40 |
| barrel graph · small / default | candidate: 0.12.6 | passed | 6 | 0.453s | 0.442s–0.473s | 0.011s | 3.0% | 20 | 40 |
| barrel graph · small / lazy-barrel disabled | baseline: 0.11.0 | passed | 6 | 0.441s | 0.428s–0.450s | 0.004s | 1.7% | 20 | 40 |
| barrel graph · small / lazy-barrel disabled | candidate: 0.12.6 | passed | 6 | 0.469s | 0.449s–0.501s | 0.005s | 3.6% | 20 | 40 |
| barrel graph · medium / default | baseline: 0.11.0 | passed | 6 | 0.454s | 0.420s–0.463s | 0.009s | 3.7% | 20 | 40 |
| barrel graph · medium / default | candidate: 0.12.6 | passed | 6 | 0.480s | 0.433s–0.509s | 0.026s | 6.6% | 20 | 40 |
| barrel graph · medium / lazy-barrel disabled | baseline: 0.11.0 | passed | 6 | 0.603s | 0.586s–0.641s | 0.016s | 4.0% | 20 | 40 |
| barrel graph · medium / lazy-barrel disabled | candidate: 0.12.6 | passed | 6 | 0.627s | 0.611s–0.664s | 0.009s | 3.0% | 20 | 40 |
| barrel graph · large / default | baseline: 0.11.0 | passed | 6 | 0.448s | 0.435s–0.499s | 0.011s | 5.2% | 20 | 40 |
| barrel graph · large / default | candidate: 0.12.6 | passed | 6 | 0.490s | 0.465s–0.508s | 0.009s | 3.1% | 20 | 40 |
| barrel graph · large / lazy-barrel disabled | baseline: 0.11.0 | passed | 6 | 1.115s | 1.049s–1.193s | 0.027s | 4.5% | 20 | 40 |
| barrel graph · large / lazy-barrel disabled | candidate: 0.12.6 | passed | 6 | 1.226s | 1.145s–1.360s | 0.056s | 6.4% | 20 | 40 |

## Inputs and provenance

- `reports/data/releases-0110-0126-2026-11-06T03-35-39-993Z-0458303c-baseline-barrel.json`: 2026-11-06T03:35:40.014Z; Node v24.11.1; Apple M4 Max × 14; darwin arm64; lockfile SHA-256: 7f35af5876a5c68b2da3985e75cf92db3f4ae3891a513ba7c354e587e09b8421. Source: npm / 0.11.0; fingerprint: 27da13cc2b4ab0a6ce1f46eab28f7cf323a8fce1a7074ae84c2b26d151792f8c.
- `reports/data/releases-0110-0126-2026-11-06T03-35-42-602Z-85140dec-candidate-barrel.json`: 2026-11-06T03:35:42.619Z; Node v24.11.1; Apple M4 Max × 14; darwin arm64; lockfile SHA-256: 7123888d5cfe1ee770452ece3fca53bf0702544ea23a11b4dce7557cace858c1. Source: npm / 0.12.6; fingerprint: 7d901a930ef93f885c74f9d3e8ab22dbdaef06698b4f32a0611c98105e956bde.

Published inputs retain every sample, warmup, test count, timestamp and compatibility fingerprint. Full logs, commands and source snapshots are stored separately; meta.publication.sourceSha256 identifies the original result JSON.
Versions are measured in paired case/round order, alternating the first side each round and fixture. No benchmark processes overlap. Workload dependencies, fixtures, configurations, harness and host compatibility are checked before calculating changes.

# scaling: 0.11.0 vs 0.12.6

Sources: baseline: **0.11.0** (npm); candidate: **0.12.6** (npm). Measured 2026-11-06 (UTC); Apple M4 Max × 14, darwin arm64, Node v24.11.1.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 6 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

Generated from raw samples. Change = (candidate / baseline − 1) × 100%; negative means faster. The first column is the baseline. All repetitions are retained; combined batches use the median of pooled samples, not the median of batch medians.

| Case | baseline: 0.11.0 | candidate: 0.12.6 | Notes |
| --- | --- | --- | --- |
| files scaling · small | 0.314s | 0.324s (+3.2%) | high variation (CV > 10%) |
| files scaling · medium | 0.712s | 0.802s (+12.7%) | high variation (CV > 10%) |
| files scaling · large | 1.448s | 1.552s (+7.2%) | — |
| graph scaling · small | 0.657s | 0.674s (+2.6%) | — |
| graph scaling · medium | 0.707s | 0.773s (+9.4%) | high variation (CV > 10%) |
| graph scaling · large | 0.811s | 0.854s (+5.3%) | — |

## Variability

MAD is unscaled. CV uses sample standard deviation (n − 1). CV > 10% is flagged as high variation, not as a significance test; small sample counts do not establish a regression. Failed or incomplete batches never receive a speedup percentage.

| Case | Column | Status | n | Median | Min–max | MAD | CV | Files | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| files scaling · small | baseline: 0.11.0 | passed | 6 | 0.314s | 0.295s–0.549s | 0.018s | 27.8% | 10 | 20 |
| files scaling · small | candidate: 0.12.6 | passed | 6 | 0.324s | 0.319s–0.475s | 0.005s | 17.7% | 10 | 20 |
| files scaling · medium | baseline: 0.11.0 | passed | 6 | 0.712s | 0.637s–0.957s | 0.009s | 14.8% | 40 | 80 |
| files scaling · medium | candidate: 0.12.6 | passed | 6 | 0.802s | 0.700s–0.993s | 0.070s | 14.2% | 40 | 80 |
| files scaling · large | baseline: 0.11.0 | passed | 6 | 1.448s | 1.338s–1.599s | 0.092s | 7.0% | 120 | 240 |
| files scaling · large | candidate: 0.12.6 | passed | 6 | 1.552s | 1.421s–1.811s | 0.044s | 8.5% | 120 | 240 |
| graph scaling · small | baseline: 0.11.0 | passed | 6 | 0.657s | 0.609s–0.722s | 0.036s | 6.5% | 40 | 80 |
| graph scaling · small | candidate: 0.12.6 | passed | 6 | 0.674s | 0.621s–0.708s | 0.028s | 4.9% | 40 | 80 |
| graph scaling · medium | baseline: 0.11.0 | passed | 6 | 0.707s | 0.647s–0.878s | 0.052s | 11.7% | 40 | 80 |
| graph scaling · medium | candidate: 0.12.6 | passed | 6 | 0.773s | 0.661s–0.859s | 0.053s | 9.4% | 40 | 80 |
| graph scaling · large | baseline: 0.11.0 | passed | 6 | 0.811s | 0.791s–0.838s | 0.017s | 2.4% | 40 | 80 |
| graph scaling · large | candidate: 0.12.6 | passed | 6 | 0.854s | 0.819s–0.896s | 0.016s | 3.1% | 40 | 80 |

## Inputs and provenance

- `reports/data/releases-0110-0126-2026-11-06T03-34-24-999Z-c32b180d-baseline-scaling.json`: 2026-11-06T03:34:25.015Z; Node v24.11.1; Apple M4 Max × 14; darwin arm64; lockfile SHA-256: 7f35af5876a5c68b2da3985e75cf92db3f4ae3891a513ba7c354e587e09b8421. Source: npm / 0.11.0; fingerprint: 27da13cc2b4ab0a6ce1f46eab28f7cf323a8fce1a7074ae84c2b26d151792f8c.
- `reports/data/releases-0110-0126-2026-11-06T03-34-27-040Z-27fe0e8d-candidate-scaling.json`: 2026-11-06T03:34:27.057Z; Node v24.11.1; Apple M4 Max × 14; darwin arm64; lockfile SHA-256: 7123888d5cfe1ee770452ece3fca53bf0702544ea23a11b4dce7557cace858c1. Source: npm / 0.12.6; fingerprint: 7d901a930ef93f885c74f9d3e8ab22dbdaef06698b4f32a0611c98105e956bde.

Published inputs retain every sample, warmup, test count, timestamp and compatibility fingerprint. Full logs, commands and source snapshots are stored separately; meta.publication.sourceSha256 identifies the original result JSON.
Versions are measured in paired case/round order, alternating the first side each round and fixture. No benchmark processes overlap. Workload dependencies, fixtures, configurations, harness and host compatibility are checked before calculating changes.

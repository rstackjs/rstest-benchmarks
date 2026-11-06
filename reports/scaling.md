# scaling: 0.11.0 vs 0.12.6

Sources: baseline: **0.11.0** (npm); candidate: **0.12.6** (npm). Measured 2026-11-06 (UTC); Apple M4 Max × 14, darwin arm64, Node v24.11.1.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 6 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

Generated from raw samples. Change = (candidate / baseline − 1) × 100%; negative means faster. The first value column is the baseline; each Δ column shows the change relative to it. Values display two decimal places; changes use unrounded medians. All repetitions are retained; combined batches use the median of pooled samples, not the median of batch medians.

| Case | baseline: 0.11.0 | candidate: 0.12.6 | Δ |
| --- | --- | --- | --- |
| files scaling · small | 0.31s | 0.32s | +3.20% |
| files scaling · medium | 0.71s | 0.80s | +12.65% |
| files scaling · large | 1.45s | 1.55s | +7.19% |
| graph scaling · small | 0.66s | 0.67s | +2.64% |
| graph scaling · medium | 0.71s | 0.77s | +9.35% |
| graph scaling · large | 0.81s | 0.85s | +5.28% |

## Variability

MAD is unscaled. CV uses sample standard deviation (n − 1). Evaluate CV together with absolute SD and range before deciding whether a fluctuation warrants a rerun. Small sample counts do not establish a regression. Failed or incomplete batches never receive a speedup percentage.

| Case | Column | Status | n | Median | Min–max | MAD | SD | CV | Files | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| files scaling · small | baseline: 0.11.0 | passed | 6 | 0.31s | 0.29s–0.55s | 0.02s | 0.10s | 27.76% | 10 | 20 |
| files scaling · small | candidate: 0.12.6 | passed | 6 | 0.32s | 0.32s–0.48s | 0.00s | 0.06s | 17.74% | 10 | 20 |
| files scaling · medium | baseline: 0.11.0 | passed | 6 | 0.71s | 0.64s–0.96s | 0.01s | 0.11s | 14.78% | 40 | 80 |
| files scaling · medium | candidate: 0.12.6 | passed | 6 | 0.80s | 0.70s–0.99s | 0.07s | 0.12s | 14.19% | 40 | 80 |
| files scaling · large | baseline: 0.11.0 | passed | 6 | 1.45s | 1.34s–1.60s | 0.09s | 0.10s | 6.97% | 120 | 240 |
| files scaling · large | candidate: 0.12.6 | passed | 6 | 1.55s | 1.42s–1.81s | 0.04s | 0.13s | 8.47% | 120 | 240 |
| graph scaling · small | baseline: 0.11.0 | passed | 6 | 0.66s | 0.61s–0.72s | 0.04s | 0.04s | 6.49% | 40 | 80 |
| graph scaling · small | candidate: 0.12.6 | passed | 6 | 0.67s | 0.62s–0.71s | 0.03s | 0.03s | 4.94% | 40 | 80 |
| graph scaling · medium | baseline: 0.11.0 | passed | 6 | 0.71s | 0.65s–0.88s | 0.05s | 0.08s | 11.65% | 40 | 80 |
| graph scaling · medium | candidate: 0.12.6 | passed | 6 | 0.77s | 0.66s–0.86s | 0.05s | 0.07s | 9.37% | 40 | 80 |
| graph scaling · large | baseline: 0.11.0 | passed | 6 | 0.81s | 0.79s–0.84s | 0.02s | 0.02s | 2.36% | 40 | 80 |
| graph scaling · large | candidate: 0.12.6 | passed | 6 | 0.85s | 0.82s–0.90s | 0.02s | 0.03s | 3.08% | 40 | 80 |

## Inputs and provenance

- `reports/data/releases-0110-0126-2026-11-06T03-34-24-999Z-c32b180d-baseline-scaling.json`: 2026-11-06T03:34:25.015Z; Node v24.11.1; Apple M4 Max × 14; darwin arm64; lockfile SHA-256: 7f35af5876a5c68b2da3985e75cf92db3f4ae3891a513ba7c354e587e09b8421. Source: npm / 0.11.0; fingerprint: 27da13cc2b4ab0a6ce1f46eab28f7cf323a8fce1a7074ae84c2b26d151792f8c.
- `reports/data/releases-0110-0126-2026-11-06T03-34-27-040Z-27fe0e8d-candidate-scaling.json`: 2026-11-06T03:34:27.057Z; Node v24.11.1; Apple M4 Max × 14; darwin arm64; lockfile SHA-256: 7123888d5cfe1ee770452ece3fca53bf0702544ea23a11b4dce7557cace858c1. Source: npm / 0.12.6; fingerprint: 7d901a930ef93f885c74f9d3e8ab22dbdaef06698b4f32a0611c98105e956bde.

Published inputs retain every sample, warmup, test count, timestamp and compatibility fingerprint. Full logs, commands and source snapshots are stored separately; meta.publication.sourceSha256 identifies the original result JSON.
Versions are measured in paired case/round order, alternating the first side each round and fixture. No benchmark processes overlap. Workload dependencies, fixtures, configurations, harness and host compatibility are checked before calculating changes.

# main: 0.11.0 vs 0.12.6

Sources: baseline: **0.11.0** (npm); candidate: **0.12.6** (npm). Measured 2026-11-06 (UTC); Apple M4 Max × 14, darwin arm64, Node v24.11.1.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 10 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

Generated from raw samples. Change = (candidate / baseline − 1) × 100%; negative means faster. The first value column is the baseline; each Δ column shows the change relative to it. Values display two decimal places; changes use unrounded medians. All repetitions are retained; combined batches use the median of pooled samples, not the median of batch medians.

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

## Variability

MAD is unscaled. CV uses sample standard deviation (n − 1). Evaluate CV together with absolute SD and range before deciding whether a fluctuation warrants a rerun. Small sample counts do not establish a regression. Failed or incomplete batches never receive a speedup percentage.

| Case | Column | Status | n | Median | Min–max | MAD | SD | CV | Files | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Node startup and utilities | baseline: 0.11.0 | passed | 6 | 0.25s | 0.24s–0.30s | 0.01s | 0.02s | 8.58% | 5 | 18 |
| Node startup and utilities | candidate: 0.12.6 | passed | 6 | 0.27s | 0.27s–0.29s | 0.01s | 0.01s | 2.87% | 5 | 18 |
| Node module graph | baseline: 0.11.0 | passed | 6 | 0.61s | 0.58s–0.80s | 0.02s | 0.08s | 12.89% | 40 | 122 |
| Node module graph | candidate: 0.12.6 | passed | 6 | 0.69s | 0.63s–0.77s | 0.05s | 0.06s | 8.71% | 40 | 122 |
| Node dependencies and service logic | baseline: 0.11.0 | passed | 6 | 0.53s | 0.53s–0.57s | 0.00s | 0.02s | 3.44% | 16 | 45 |
| Node dependencies and service logic | candidate: 0.12.6 | passed | 6 | 0.56s | 0.55s–0.61s | 0.01s | 0.02s | 3.83% | 16 | 45 |
| React + jsdom | baseline: 0.11.0 | passed | 6 | 3.62s | 3.48s–3.79s | 0.05s | 0.10s | 2.82% | 30 | 54 |
| React + jsdom | candidate: 0.12.6 | passed | 6 | 1.72s | 1.69s–2.81s | 0.02s | 0.44s | 23.05% | 30 | 54 |
| React + happy-dom | baseline: 0.11.0 | passed | 6 | 1.96s | 1.90s–2.40s | 0.05s | 0.20s | 9.78% | 30 | 54 |
| React + happy-dom | candidate: 0.12.6 | passed | 6 | 1.02s | 1.01s–6.01s | 0.01s | 2.04s | 110.06% | 30 | 54 |
| React + browser mode | baseline: 0.11.0 | passed | 6 | 1.38s | 1.34s–1.69s | 0.03s | 0.13s | 9.25% | 30 | 54 |
| React + browser mode | candidate: 0.12.6 | passed | 6 | 1.42s | 1.36s–1.92s | 0.06s | 0.22s | 14.43% | 30 | 54 |
| Vue + jsdom | baseline: 0.11.0 | passed | 6 | 2.63s | 2.52s–3.60s | 0.09s | 0.41s | 14.68% | 20 | 20 |
| Vue + jsdom | candidate: 0.12.6 | passed | 6 | 1.48s | 1.45s–2.25s | 0.03s | 0.31s | 19.41% | 20 | 20 |
| Vue + happy-dom | baseline: 0.11.0 | passed | 6 | 1.48s | 1.47s–4.23s | 0.01s | 1.11s | 56.14% | 20 | 20 |
| Vue + happy-dom | candidate: 0.12.6 | passed | 6 | 0.89s | 0.84s–3.05s | 0.03s | 0.88s | 68.94% | 20 | 20 |
| Vue + browser mode | baseline: 0.11.0 | skipped | 0 | — | —–— | — | — | — | 20 | unknown |
| Vue + browser mode | candidate: 0.12.6 | passed | 6 | 1.31s | 1.18s–2.02s | 0.10s | 0.32s | 22.54% | 20 | 20 |
| barrel graph · medium | baseline: 0.11.0 | passed | 6 | 0.44s | 0.42s–0.46s | 0.02s | 0.02s | 4.47% | 20 | 40 |
| barrel graph · medium | candidate: 0.12.6 | passed | 6 | 0.47s | 0.46s–0.51s | 0.01s | 0.02s | 4.16% | 20 | 40 |

## Inputs and provenance

- `reports/data/releases-0110-0126-2026-11-06T03-31-19-069Z-c8f4536f-baseline-main.json`: 2026-11-06T03:31:19.090Z; Node v24.11.1; Apple M4 Max × 14; logical CPUs: not recorded; available parallelism: 14; darwin arm64; lockfile SHA-256: 7f35af5876a5c68b2da3985e75cf92db3f4ae3891a513ba7c354e587e09b8421. Source: npm / 0.11.0; fingerprint: 27da13cc2b4ab0a6ce1f46eab28f7cf323a8fce1a7074ae84c2b26d151792f8c.
- `reports/data/releases-0110-0126-2026-11-06T03-31-20-664Z-c3b4c790-candidate-main.json`: 2026-11-06T03:31:20.678Z; Node v24.11.1; Apple M4 Max × 14; logical CPUs: not recorded; available parallelism: 14; darwin arm64; lockfile SHA-256: 7123888d5cfe1ee770452ece3fca53bf0702544ea23a11b4dce7557cace858c1. Source: npm / 0.12.6; fingerprint: 7d901a930ef93f885c74f9d3e8ab22dbdaef06698b4f32a0611c98105e956bde.

Published inputs retain every sample, warmup, test count, timestamp and compatibility fingerprint. Full logs, commands and source snapshots are stored separately; meta.publication.sourceSha256 identifies the original result JSON.
Versions are measured in paired case/round order, alternating the first side each round and fixture. No benchmark processes overlap. Workload dependencies, fixtures, configurations, harness and host compatibility are checked before calculating changes.

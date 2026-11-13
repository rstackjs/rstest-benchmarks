# coverage: 0.11.0 vs 0.12.6

Source: [GitHub Actions](https://github.com/rstackjs/rstest-benchmarks/actions/runs/43413826291), commit `6560450c5a8b34baff4bd5bc31d3d9f49b4dd661`, attempt 1.

Sources: baseline: **0.11.0** (npm); candidate: **0.12.6** (npm). Measured 2026-11-13 (UTC); Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64, Node v26.13.0.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 15 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

Generated from raw samples. Change = (candidate / baseline − 1) × 100%; negative means faster. The first value column is the baseline; each Δ column shows the change relative to it. Values display two decimal places; changes use unrounded medians. All repetitions are retained; combined batches use the median of pooled samples, not the median of batch medians.

| Case | baseline: 0.11.0 | candidate: 0.12.6 | Δ |
| --- | --- | --- | --- |
| barrel graph · medium / none | 1.09s | 1.16s | +6.79% |
| barrel graph · medium / v8 | 1.87s | 1.73s | -7.70% |
| barrel graph · medium / istanbul | 1.53s | 1.29s | -15.58% |
| barrel graph · large / none | 1.50s | 1.50s | -0.33% |
| barrel graph · large / v8 | 2.41s | 2.25s | -6.71% |
| barrel graph · large / istanbul | 2.05s | 1.70s | -17.33% |
| Node dependencies and service logic / none | 1.85s | 2.32s | +25.41% |
| Node dependencies and service logic / v8 | 3.14s | 2.92s | -7.00% |
| Node dependencies and service logic / istanbul | 2.65s | 2.28s | -13.77% |
| Node module graph / none | 2.43s | 2.40s | -1.35% |
| Node module graph / v8 | 4.69s | 4.13s | -11.87% |
| Node module graph / istanbul | 4.13s | 3.54s | -14.34% |
| React + jsdom / none | 11.99s | 10.30s | -14.14% |
| React + jsdom / v8 | 15.20s | 12.40s | -18.40% |
| React + jsdom / istanbul | 12.04s | 10.77s | -10.54% |

## Variability

MAD is unscaled. CV uses sample standard deviation (n − 1). Evaluate CV together with absolute SD and range before deciding whether a fluctuation warrants a rerun. Small sample counts do not establish a regression. Failed or incomplete batches never receive a speedup percentage.

| Case | Column | Status | n | Median | Min–max | MAD | SD | CV | Files | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| barrel graph · medium / none | baseline: 0.11.0 | passed | 6 | 1.09s | 0.95s–1.12s | 0.03s | 0.07s | 6.58% | 20 | 40 |
| barrel graph · medium / none | candidate: 0.12.6 | passed | 6 | 1.16s | 1.02s–1.39s | 0.06s | 0.13s | 10.90% | 20 | 40 |
| barrel graph · medium / v8 | baseline: 0.11.0 | passed | 6 | 1.87s | 1.69s–2.36s | 0.15s | 0.26s | 13.40% | 20 | 40 |
| barrel graph · medium / v8 | candidate: 0.12.6 | passed | 6 | 1.73s | 1.51s–2.01s | 0.11s | 0.18s | 10.52% | 20 | 40 |
| barrel graph · medium / istanbul | baseline: 0.11.0 | passed | 6 | 1.53s | 1.33s–1.88s | 0.18s | 0.22s | 14.02% | 20 | 40 |
| barrel graph · medium / istanbul | candidate: 0.12.6 | passed | 6 | 1.29s | 1.17s–1.65s | 0.11s | 0.18s | 13.23% | 20 | 40 |
| barrel graph · large / none | baseline: 0.11.0 | passed | 6 | 1.50s | 1.08s–1.67s | 0.13s | 0.22s | 15.57% | 20 | 40 |
| barrel graph · large / none | candidate: 0.12.6 | passed | 6 | 1.50s | 1.22s–1.59s | 0.05s | 0.13s | 9.11% | 20 | 40 |
| barrel graph · large / v8 | baseline: 0.11.0 | passed | 6 | 2.41s | 1.75s–3.21s | 0.32s | 0.51s | 21.38% | 20 | 40 |
| barrel graph · large / v8 | candidate: 0.12.6 | passed | 6 | 2.25s | 1.54s–2.61s | 0.10s | 0.36s | 16.39% | 20 | 40 |
| barrel graph · large / istanbul | baseline: 0.11.0 | passed | 6 | 2.05s | 1.80s–2.54s | 0.18s | 0.28s | 13.34% | 20 | 40 |
| barrel graph · large / istanbul | candidate: 0.12.6 | passed | 6 | 1.70s | 1.55s–1.88s | 0.10s | 0.12s | 7.20% | 20 | 40 |
| Node dependencies and service logic / none | baseline: 0.11.0 | passed | 6 | 1.85s | 1.71s–2.28s | 0.09s | 0.25s | 12.79% | 16 | 45 |
| Node dependencies and service logic / none | candidate: 0.12.6 | passed | 6 | 2.32s | 2.08s–2.50s | 0.10s | 0.15s | 6.46% | 16 | 45 |
| Node dependencies and service logic / v8 | baseline: 0.11.0 | passed | 6 | 3.14s | 2.72s–5.57s | 0.41s | 1.12s | 31.18% | 16 | 45 |
| Node dependencies and service logic / v8 | candidate: 0.12.6 | passed | 6 | 2.92s | 2.26s–3.76s | 0.43s | 0.56s | 19.18% | 16 | 45 |
| Node dependencies and service logic / istanbul | baseline: 0.11.0 | passed | 6 | 2.65s | 2.45s–4.01s | 0.19s | 0.59s | 20.70% | 16 | 45 |
| Node dependencies and service logic / istanbul | candidate: 0.12.6 | passed | 6 | 2.28s | 1.79s–3.59s | 0.25s | 0.65s | 27.73% | 16 | 45 |
| Node module graph / none | baseline: 0.11.0 | passed | 6 | 2.43s | 2.07s–2.82s | 0.20s | 0.27s | 11.23% | 40 | 122 |
| Node module graph / none | candidate: 0.12.6 | passed | 6 | 2.40s | 2.05s–3.18s | 0.22s | 0.42s | 16.46% | 40 | 122 |
| Node module graph / v8 | baseline: 0.11.0 | passed | 6 | 4.69s | 4.34s–5.17s | 0.18s | 0.29s | 6.04% | 40 | 122 |
| Node module graph / v8 | candidate: 0.12.6 | passed | 6 | 4.13s | 3.31s–4.52s | 0.36s | 0.53s | 13.34% | 40 | 122 |
| Node module graph / istanbul | baseline: 0.11.0 | passed | 6 | 4.13s | 3.72s–5.10s | 0.27s | 0.50s | 12.02% | 40 | 122 |
| Node module graph / istanbul | candidate: 0.12.6 | passed | 6 | 3.54s | 3.17s–3.90s | 0.12s | 0.24s | 6.90% | 40 | 122 |
| React + jsdom / none | baseline: 0.11.0 | passed | 6 | 11.99s | 10.65s–17.24s | 0.41s | 2.32s | 18.35% | 30 | 54 |
| React + jsdom / none | candidate: 0.12.6 | passed | 6 | 10.30s | 9.29s–11.60s | 0.38s | 0.79s | 7.60% | 30 | 54 |
| React + jsdom / v8 | baseline: 0.11.0 | passed | 6 | 15.20s | 13.12s–15.49s | 0.22s | 1.01s | 6.87% | 30 | 54 |
| React + jsdom / v8 | candidate: 0.12.6 | passed | 6 | 12.40s | 11.32s–14.04s | 0.63s | 0.96s | 7.63% | 30 | 54 |
| React + jsdom / istanbul | baseline: 0.11.0 | passed | 6 | 12.04s | 10.79s–13.48s | 0.74s | 1.03s | 8.40% | 30 | 54 |
| React + jsdom / istanbul | candidate: 0.12.6 | passed | 6 | 10.77s | 9.38s–13.91s | 0.49s | 1.57s | 14.32% | 30 | 54 |

## Memory

Peak process-tree physical footprint in MiB (macOS `phys_footprint`, summed every ~50 ms).

| Case | Column | Status | n | Median MiB | Min–max MiB | CV |
| --- | --- | --- | --- | --- | --- | --- |
| barrel graph · medium / none | baseline: 0.11.0 | passed | 6 | 130.13 | 127.14–132.46 | 1.51% |
| barrel graph · medium / none | candidate: 0.12.6 | passed | 6 | 137.65 | 134.87–140.68 | 1.44% |
| barrel graph · medium / v8 | baseline: 0.11.0 | passed | 6 | 166.20 | 161.73–168.53 | 1.44% |
| barrel graph · medium / v8 | candidate: 0.12.6 | passed | 6 | 148.49 | 144.90–151.37 | 1.51% |
| barrel graph · medium / istanbul | baseline: 0.11.0 | passed | 6 | 181.99 | 179.15–186.54 | 1.39% |
| barrel graph · medium / istanbul | candidate: 0.12.6 | passed | 6 | 169.06 | 166.99–170.96 | 0.86% |
| barrel graph · large / none | baseline: 0.11.0 | passed | 6 | 140.07 | 137.44–147.47 | 3.15% |
| barrel graph · large / none | candidate: 0.12.6 | passed | 6 | 145.18 | 143.64–147.54 | 1.03% |
| barrel graph · large / v8 | baseline: 0.11.0 | passed | 6 | 176.35 | 172.95–181.47 | 1.74% |
| barrel graph · large / v8 | candidate: 0.12.6 | passed | 6 | 158.93 | 155.70–160.90 | 1.31% |
| barrel graph · large / istanbul | baseline: 0.11.0 | passed | 6 | 193.49 | 190.87–199.51 | 1.76% |
| barrel graph · large / istanbul | candidate: 0.12.6 | passed | 6 | 176.88 | 175.10–179.23 | 0.93% |
| Node dependencies and service logic / none | baseline: 0.11.0 | passed | 6 | 164.19 | 151.65–169.19 | 4.29% |
| Node dependencies and service logic / none | candidate: 0.12.6 | passed | 6 | 165.59 | 162.36–167.28 | 1.28% |
| Node dependencies and service logic / v8 | baseline: 0.11.0 | passed | 6 | 186.43 | 182.13–191.73 | 2.04% |
| Node dependencies and service logic / v8 | candidate: 0.12.6 | passed | 6 | 178.27 | 172.39–181.21 | 2.02% |
| Node dependencies and service logic / istanbul | baseline: 0.11.0 | passed | 6 | 204.62 | 199.14–208.80 | 1.54% |
| Node dependencies and service logic / istanbul | candidate: 0.12.6 | passed | 6 | 200.90 | 189.34–203.03 | 2.89% |
| Node module graph / none | baseline: 0.11.0 | passed | 6 | 156.94 | 149.91–162.87 | 2.70% |
| Node module graph / none | candidate: 0.12.6 | passed | 6 | 154.58 | 152.68–156.69 | 0.98% |
| Node module graph / v8 | baseline: 0.11.0 | passed | 6 | 270.91 | 268.39–275.30 | 0.92% |
| Node module graph / v8 | candidate: 0.12.6 | passed | 6 | 218.68 | 191.58–228.12 | 7.26% |
| Node module graph / istanbul | baseline: 0.11.0 | passed | 6 | 272.56 | 268.16–284.26 | 2.41% |
| Node module graph / istanbul | candidate: 0.12.6 | passed | 6 | 244.66 | 227.92–250.95 | 3.27% |
| React + jsdom / none | baseline: 0.11.0 | passed | 6 | 503.69 | 490.97–517.54 | 2.08% |
| React + jsdom / none | candidate: 0.12.6 | passed | 6 | 598.55 | 596.65–613.92 | 1.25% |
| React + jsdom / v8 | baseline: 0.11.0 | passed | 6 | 666.48 | 613.06–676.09 | 3.52% |
| React + jsdom / v8 | candidate: 0.12.6 | passed | 6 | 604.18 | 596.99–609.87 | 0.90% |
| React + jsdom / istanbul | baseline: 0.11.0 | passed | 6 | 512.04 | 495.15–537.18 | 3.07% |
| React + jsdom / istanbul | candidate: 0.12.6 | passed | 6 | 629.39 | 604.26–639.31 | 2.07% |

## Inputs and provenance

- `reports/data/ci-version-coverage-merged-2026-11-13T11-20-49-673Z-baseline-coverage.json`: 2026-11-13T11:03:52.614Z; Node v26.13.0; Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64; lockfile SHA-256: 7f35af5876a5c68b2da3985e75cf92db3f4ae3891a513ba7c354e587e09b8421. Source: npm / 0.11.0; fingerprint: 27da13cc2b4ab0a6ce1f46eab28f7cf323a8fce1a7074ae84c2b26d151792f8c.
- `reports/data/ci-version-coverage-merged-2026-11-13T11-20-49-673Z-candidate-coverage.json`: 2026-11-13T11:03:53.070Z; Node v26.13.0; Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64; lockfile SHA-256: 7123888d5cfe1ee770452ece3fca53bf0702544ea23a11b4dce7557cace858c1. Source: npm / 0.12.6; fingerprint: 7d901a930ef93f885c74f9d3e8ab22dbdaef06698b4f32a0611c98105e956bde.

Published inputs retain every sample, warmup, test count, timestamp and compatibility fingerprint. Full logs, commands and source snapshots are stored separately; meta.publication.sourceSha256 identifies the original result JSON.
Versions are measured in paired case/round order, alternating the first side each round and fixture. No benchmark processes overlap. Workload dependencies, fixtures, configurations, harness and host compatibility are checked before calculating changes.

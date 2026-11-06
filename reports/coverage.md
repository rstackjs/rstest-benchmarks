# coverage: 0.11.0 vs 0.12.6

Sources: baseline: **0.11.0** (npm); candidate: **0.12.6** (npm). Measured 2026-11-06 (UTC); Apple M4 Max × 14, darwin arm64, Node v24.11.1.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 15 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

Generated from raw samples. Change = (candidate / baseline − 1) × 100%; negative means faster. The first value column is the baseline; each Δ column shows the change relative to it. Values display two decimal places; changes use unrounded medians. All repetitions are retained; combined batches use the median of pooled samples, not the median of batch medians.

| Case | baseline: 0.11.0 | candidate: 0.12.6 | Δ |
| --- | --- | --- | --- |
| Node module graph / none | 0.67s | 0.70s | +5.02% |
| Node module graph / v8 | 1.32s | 1.08s | -18.13% |
| Node module graph / istanbul | 0.99s | 0.86s | -12.82% |
| Node dependencies and service logic / none | 0.58s | 0.62s | +7.02% |
| Node dependencies and service logic / v8 | 0.82s | 0.79s | -4.18% |
| Node dependencies and service logic / istanbul | 0.69s | 0.65s | -5.59% |
| React + jsdom / none | 3.68s | 1.86s | -49.59% |
| React + jsdom / v8 | 4.18s | 2.27s | -45.75% |
| React + jsdom / istanbul | 4.04s | 1.99s | -50.72% |
| barrel graph · medium / none | 0.41s | 0.43s | +6.97% |
| barrel graph · medium / v8 | 0.63s | 0.62s | -1.82% |
| barrel graph · medium / istanbul | 0.53s | 0.50s | -6.42% |
| barrel graph · large / none | 0.44s | 0.45s | +1.60% |
| barrel graph · large / v8 | 0.64s | 0.61s | -4.01% |
| barrel graph · large / istanbul | 0.59s | 0.52s | -12.27% |

## Variability

MAD is unscaled. CV uses sample standard deviation (n − 1). Evaluate CV together with absolute SD and range before deciding whether a fluctuation warrants a rerun. Small sample counts do not establish a regression. Failed or incomplete batches never receive a speedup percentage.

| Case | Column | Status | n | Median | Min–max | MAD | SD | CV | Files | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Node module graph / none | baseline: 0.11.0 | passed | 6 | 0.67s | 0.64s–0.68s | 0.01s | 0.01s | 2.16% | 40 | 122 |
| Node module graph / none | candidate: 0.12.6 | passed | 6 | 0.70s | 0.66s–0.74s | 0.03s | 0.03s | 4.31% | 40 | 122 |
| Node module graph / v8 | baseline: 0.11.0 | passed | 6 | 1.32s | 1.25s–1.36s | 0.03s | 0.04s | 3.21% | 40 | 122 |
| Node module graph / v8 | candidate: 0.12.6 | passed | 6 | 1.08s | 1.06s–1.25s | 0.02s | 0.07s | 6.69% | 40 | 122 |
| Node module graph / istanbul | baseline: 0.11.0 | passed | 6 | 0.99s | 0.97s–1.00s | 0.01s | 0.01s | 1.28% | 40 | 122 |
| Node module graph / istanbul | candidate: 0.12.6 | passed | 6 | 0.86s | 0.82s–0.94s | 0.04s | 0.05s | 5.49% | 40 | 122 |
| Node dependencies and service logic / none | baseline: 0.11.0 | passed | 6 | 0.58s | 0.56s–0.59s | 0.01s | 0.01s | 2.18% | 16 | 45 |
| Node dependencies and service logic / none | candidate: 0.12.6 | passed | 6 | 0.62s | 0.60s–0.74s | 0.01s | 0.05s | 8.25% | 16 | 45 |
| Node dependencies and service logic / v8 | baseline: 0.11.0 | passed | 6 | 0.82s | 0.80s–0.87s | 0.02s | 0.02s | 3.00% | 16 | 45 |
| Node dependencies and service logic / v8 | candidate: 0.12.6 | passed | 6 | 0.79s | 0.77s–0.80s | 0.01s | 0.02s | 1.98% | 16 | 45 |
| Node dependencies and service logic / istanbul | baseline: 0.11.0 | passed | 6 | 0.69s | 0.66s–1.01s | 0.02s | 0.13s | 17.94% | 16 | 45 |
| Node dependencies and service logic / istanbul | candidate: 0.12.6 | passed | 6 | 0.65s | 0.64s–0.74s | 0.02s | 0.04s | 5.86% | 16 | 45 |
| React + jsdom / none | baseline: 0.11.0 | passed | 6 | 3.68s | 3.68s–5.25s | 0.01s | 0.63s | 15.66% | 30 | 54 |
| React + jsdom / none | candidate: 0.12.6 | passed | 6 | 1.86s | 1.80s–1.97s | 0.04s | 0.06s | 3.41% | 30 | 54 |
| React + jsdom / v8 | baseline: 0.11.0 | passed | 6 | 4.18s | 4.01s–4.38s | 0.07s | 0.12s | 2.97% | 30 | 54 |
| React + jsdom / v8 | candidate: 0.12.6 | passed | 6 | 2.27s | 2.20s–2.43s | 0.04s | 0.09s | 3.70% | 30 | 54 |
| React + jsdom / istanbul | baseline: 0.11.0 | passed | 6 | 4.04s | 3.73s–5.71s | 0.24s | 0.74s | 17.33% | 30 | 54 |
| React + jsdom / istanbul | candidate: 0.12.6 | passed | 6 | 1.99s | 1.88s–2.16s | 0.07s | 0.10s | 5.04% | 30 | 54 |
| barrel graph · medium / none | baseline: 0.11.0 | passed | 6 | 0.41s | 0.39s–0.43s | 0.01s | 0.01s | 3.40% | 20 | 40 |
| barrel graph · medium / none | candidate: 0.12.6 | passed | 6 | 0.43s | 0.42s–0.47s | 0.01s | 0.02s | 4.10% | 20 | 40 |
| barrel graph · medium / v8 | baseline: 0.11.0 | passed | 6 | 0.63s | 0.60s–0.86s | 0.03s | 0.11s | 15.79% | 20 | 40 |
| barrel graph · medium / v8 | candidate: 0.12.6 | passed | 6 | 0.62s | 0.58s–0.76s | 0.03s | 0.07s | 10.48% | 20 | 40 |
| barrel graph · medium / istanbul | baseline: 0.11.0 | passed | 6 | 0.53s | 0.52s–0.88s | 0.01s | 0.14s | 24.32% | 20 | 40 |
| barrel graph · medium / istanbul | candidate: 0.12.6 | passed | 6 | 0.50s | 0.48s–0.51s | 0.01s | 0.01s | 1.89% | 20 | 40 |
| barrel graph · large / none | baseline: 0.11.0 | passed | 6 | 0.44s | 0.41s–0.45s | 0.00s | 0.01s | 2.89% | 20 | 40 |
| barrel graph · large / none | candidate: 0.12.6 | passed | 6 | 0.45s | 0.42s–0.52s | 0.02s | 0.04s | 7.73% | 20 | 40 |
| barrel graph · large / v8 | baseline: 0.11.0 | passed | 6 | 0.64s | 0.60s–0.66s | 0.01s | 0.02s | 3.11% | 20 | 40 |
| barrel graph · large / v8 | candidate: 0.12.6 | passed | 6 | 0.61s | 0.58s–0.75s | 0.03s | 0.08s | 12.07% | 20 | 40 |
| barrel graph · large / istanbul | baseline: 0.11.0 | passed | 6 | 0.59s | 0.54s–0.69s | 0.05s | 0.06s | 10.08% | 20 | 40 |
| barrel graph · large / istanbul | candidate: 0.12.6 | passed | 6 | 0.52s | 0.51s–0.53s | 0.00s | 0.01s | 1.18% | 20 | 40 |

## Memory

OS `/usr/bin/time` maxrss in MiB; not a simultaneous process-tree peak.

| Case | Column | Status | n | Median MiB | Min–max MiB | CV |
| --- | --- | --- | --- | --- | --- | --- |
| Node module graph / none | baseline: 0.11.0 | passed | 6 | 202.37 | 201.34–203.72 | 0.44% |
| Node module graph / none | candidate: 0.12.6 | passed | 6 | 211.61 | 210.44–215.20 | 0.87% |
| Node module graph / v8 | baseline: 0.11.0 | passed | 6 | 422.49 | 413.28–425.20 | 1.02% |
| Node module graph / v8 | candidate: 0.12.6 | passed | 6 | 345.38 | 338.11–353.52 | 1.73% |
| Node module graph / istanbul | baseline: 0.11.0 | passed | 6 | 304.63 | 297.52–306.44 | 1.06% |
| Node module graph / istanbul | candidate: 0.12.6 | passed | 6 | 336.74 | 332.25–341.55 | 1.14% |
| Node dependencies and service logic / none | baseline: 0.11.0 | passed | 6 | 169.91 | 165.23–173.83 | 1.73% |
| Node dependencies and service logic / none | candidate: 0.12.6 | passed | 6 | 179.90 | 174.17–181.52 | 1.56% |
| Node dependencies and service logic / v8 | baseline: 0.11.0 | passed | 6 | 213.02 | 210.83–214.73 | 0.63% |
| Node dependencies and service logic / v8 | candidate: 0.12.6 | passed | 6 | 215.48 | 206.58–219.97 | 2.38% |
| Node dependencies and service logic / istanbul | baseline: 0.11.0 | passed | 6 | 209.96 | 207.95–213.05 | 0.80% |
| Node dependencies and service logic / istanbul | candidate: 0.12.6 | passed | 6 | 218.64 | 215.84–221.48 | 1.04% |
| React + jsdom / none | baseline: 0.11.0 | passed | 6 | 538.51 | 460.31–590.58 | 9.07% |
| React + jsdom / none | candidate: 0.12.6 | passed | 6 | 535.93 | 520.59–546.59 | 1.97% |
| React + jsdom / v8 | baseline: 0.11.0 | passed | 6 | 751.02 | 722.22–797.27 | 3.77% |
| React + jsdom / v8 | candidate: 0.12.6 | passed | 6 | 744.12 | 698.64–758.00 | 3.54% |
| React + jsdom / istanbul | baseline: 0.11.0 | passed | 6 | 461.52 | 453.25–477.45 | 1.89% |
| React + jsdom / istanbul | candidate: 0.12.6 | passed | 6 | 575.39 | 557.66–580.05 | 1.58% |
| barrel graph · medium / none | baseline: 0.11.0 | passed | 6 | 173.40 | 169.77–175.06 | 1.25% |
| barrel graph · medium / none | candidate: 0.12.6 | passed | 6 | 181.17 | 179.56–185.45 | 1.22% |
| barrel graph · medium / v8 | baseline: 0.11.0 | passed | 6 | 202.46 | 196.64–203.20 | 1.26% |
| barrel graph · medium / v8 | candidate: 0.12.6 | passed | 6 | 203.30 | 200.75–206.14 | 1.07% |
| barrel graph · medium / istanbul | baseline: 0.11.0 | passed | 6 | 213.21 | 210.05–215.31 | 0.94% |
| barrel graph · medium / istanbul | candidate: 0.12.6 | passed | 6 | 219.60 | 214.92–222.52 | 1.43% |
| barrel graph · large / none | baseline: 0.11.0 | passed | 6 | 181.84 | 176.00–186.25 | 1.92% |
| barrel graph · large / none | candidate: 0.12.6 | passed | 6 | 188.88 | 185.78–193.83 | 1.51% |
| barrel graph · large / v8 | baseline: 0.11.0 | passed | 6 | 208.60 | 208.05–212.69 | 0.88% |
| barrel graph · large / v8 | candidate: 0.12.6 | passed | 6 | 219.97 | 213.97–226.84 | 1.90% |
| barrel graph · large / istanbul | baseline: 0.11.0 | passed | 6 | 220.05 | 217.53–223.25 | 0.86% |
| barrel graph · large / istanbul | candidate: 0.12.6 | passed | 6 | 231.27 | 224.91–233.97 | 1.58% |

## Inputs and provenance

- `reports/data/releases-0110-0126-2026-11-06T03-38-14-514Z-06dbc7cd-baseline-coverage.json`: 2026-11-06T03:38:14.532Z; Node v24.11.1; Apple M4 Max × 14; logical CPUs: not recorded; available parallelism: 14; darwin arm64; lockfile SHA-256: 7f35af5876a5c68b2da3985e75cf92db3f4ae3891a513ba7c354e587e09b8421. Source: npm / 0.11.0; fingerprint: 27da13cc2b4ab0a6ce1f46eab28f7cf323a8fce1a7074ae84c2b26d151792f8c.
- `reports/data/releases-0110-0126-2026-11-06T03-38-16-748Z-631fde57-candidate-coverage.json`: 2026-11-06T03:38:16.765Z; Node v24.11.1; Apple M4 Max × 14; logical CPUs: not recorded; available parallelism: 14; darwin arm64; lockfile SHA-256: 7123888d5cfe1ee770452ece3fca53bf0702544ea23a11b4dce7557cace858c1. Source: npm / 0.12.6; fingerprint: 7d901a930ef93f885c74f9d3e8ab22dbdaef06698b4f32a0611c98105e956bde.

Published inputs retain every sample, warmup, test count, timestamp and compatibility fingerprint. Full logs, commands and source snapshots are stored separately; meta.publication.sourceSha256 identifies the original result JSON.
Versions are measured in paired case/round order, alternating the first side each round and fixture. No benchmark processes overlap. Workload dependencies, fixtures, configurations, harness and host compatibility are checked before calculating changes.

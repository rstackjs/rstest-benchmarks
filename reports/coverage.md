# coverage: 0.12.6 vs preview 2869d12

Source: [GitHub Actions](https://github.com/rstackjs/rstest-benchmarks/actions/runs/44043582845), commit `969876e9fc43ca83e8a41e8e1873b6687fa45c16`, attempt 1.

Sources: baseline: **0.12.6** (npm); candidate: **preview 2869d12** (preview). Measured 2026-11-17 (UTC); Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64, Node v26.13.0.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 15 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

Generated from raw samples. Change = (candidate / baseline − 1) × 100%; negative means faster. The first value column is the baseline. Values display two decimal places; changes use unrounded medians. All repetitions are retained; combined batches use the median of pooled samples, not the median of batch medians.

🏆 marks the lowest comparable median in each row. Percentages show change from the baseline.

### Elapsed time (s)

| Case | baseline: 0.12.6 | candidate: preview 2869d12 |
| --- | --- | --- |
| barrel graph · medium / none | 1.63s | **🏆 1.57s** (-4.19%) |
| barrel graph · medium / v8 | **🏆 2.31s** | 2.38s (+3.15%) |
| barrel graph · medium / istanbul | **🏆 1.71s** | 1.99s (+16.30%) |
| barrel graph · large / none | **🏆 1.58s** | 1.61s (+2.01%) |
| barrel graph · large / v8 | **🏆 2.12s** | 2.21s (+4.41%) |
| barrel graph · large / istanbul | 1.82s | **🏆 1.82s** (-0.03%) |
| Node dependencies and service logic / none | 2.27s | **🏆 2.15s** (-5.09%) |
| Node dependencies and service logic / v8 | **🏆 3.00s** | 3.25s (+8.18%) |
| Node dependencies and service logic / istanbul | 2.49s | **🏆 2.32s** (-6.57%) |
| Node module graph / none | 3.37s | **🏆 3.29s** (-2.61%) |
| Node module graph / v8 | **🏆 5.07s** | 5.50s (+8.44%) |
| Node module graph / istanbul | 4.49s | **🏆 4.37s** (-2.52%) |
| React + jsdom / none | 11.04s | **🏆 10.27s** (-6.99%) |
| React + jsdom / v8 | **🏆 12.16s** | 12.53s (+3.02%) |
| React + jsdom / istanbul | 11.43s | **🏆 10.49s** (-8.28%) |

### Memory comparison (MiB, peak process-tree footprint)

| Case | baseline: 0.12.6 | candidate: preview 2869d12 |
| --- | --- | --- |
| barrel graph · medium / none | 139.41 | **🏆 137.90** (-1.09%) |
| barrel graph · medium / v8 | 148.21 | **🏆 148.06** (-0.10%) |
| barrel graph · medium / istanbul | 169.24 | **🏆 166.05** (-1.88%) |
| barrel graph · large / none | **🏆 143.58** | 143.99 (+0.28%) |
| barrel graph · large / v8 | 156.76 | **🏆 156.56** (-0.12%) |
| barrel graph · large / istanbul | 177.11 | **🏆 176.75** (-0.21%) |
| Node dependencies and service logic / none | 165.25 | **🏆 160.40** (-2.93%) |
| Node dependencies and service logic / v8 | 181.95 | **🏆 180.79** (-0.64%) |
| Node dependencies and service logic / istanbul | **🏆 193.01** | 198.56 (+2.88%) |
| Node module graph / none | 155.34 | **🏆 151.80** (-2.28%) |
| Node module graph / v8 | **🏆 210.46** | 220.79 (+4.91%) |
| Node module graph / istanbul | 243.91 | **🏆 222.40** (-8.82%) |
| React + jsdom / none | 604.70 | **🏆 454.94** (-24.77%) |
| React + jsdom / v8 | 603.65 | **🏆 467.48** (-22.56%) |
| React + jsdom / istanbul | 621.40 | **🏆 483.60** (-22.18%) |

## Variability

MAD is unscaled. CV uses sample standard deviation (n − 1). Evaluate CV together with absolute SD and range before deciding whether a fluctuation warrants a rerun. Small sample counts do not establish a regression. Failed or incomplete batches never receive a speedup percentage.

| Case | Column | Status | n | Median | Min–max | MAD | SD | CV | Files | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| barrel graph · medium / none | baseline: 0.12.6 | passed | 6 | 1.63s | 1.37s–1.95s | 0.21s | 0.24s | 14.29% | 20 | 40 |
| barrel graph · medium / none | candidate: preview 2869d12 | passed | 6 | 1.57s | 1.41s–2.26s | 0.09s | 0.31s | 18.59% | 20 | 40 |
| barrel graph · medium / v8 | baseline: 0.12.6 | passed | 6 | 2.31s | 1.78s–3.10s | 0.30s | 0.52s | 21.22% | 20 | 40 |
| barrel graph · medium / v8 | candidate: preview 2869d12 | passed | 6 | 2.38s | 2.08s–2.96s | 0.24s | 0.35s | 14.39% | 20 | 40 |
| barrel graph · medium / istanbul | baseline: 0.12.6 | passed | 6 | 1.71s | 1.47s–2.17s | 0.23s | 0.27s | 15.45% | 20 | 40 |
| barrel graph · medium / istanbul | candidate: preview 2869d12 | passed | 6 | 1.99s | 1.44s–3.05s | 0.35s | 0.59s | 28.68% | 20 | 40 |
| barrel graph · large / none | baseline: 0.12.6 | passed | 6 | 1.58s | 1.41s–1.80s | 0.07s | 0.13s | 8.56% | 20 | 40 |
| barrel graph · large / none | candidate: preview 2869d12 | passed | 6 | 1.61s | 1.07s–1.83s | 0.08s | 0.26s | 16.71% | 20 | 40 |
| barrel graph · large / v8 | baseline: 0.12.6 | passed | 6 | 2.12s | 1.70s–2.51s | 0.11s | 0.27s | 12.69% | 20 | 40 |
| barrel graph · large / v8 | candidate: preview 2869d12 | passed | 6 | 2.21s | 2.09s–2.60s | 0.10s | 0.20s | 8.80% | 20 | 40 |
| barrel graph · large / istanbul | baseline: 0.12.6 | passed | 6 | 1.82s | 1.37s–1.91s | 0.08s | 0.21s | 12.17% | 20 | 40 |
| barrel graph · large / istanbul | candidate: preview 2869d12 | passed | 6 | 1.82s | 1.56s–2.33s | 0.12s | 0.27s | 14.51% | 20 | 40 |
| Node dependencies and service logic / none | baseline: 0.12.6 | passed | 6 | 2.27s | 2.07s–2.98s | 0.19s | 0.40s | 16.70% | 16 | 45 |
| Node dependencies and service logic / none | candidate: preview 2869d12 | passed | 6 | 2.15s | 1.96s–2.55s | 0.06s | 0.20s | 9.30% | 16 | 45 |
| Node dependencies and service logic / v8 | baseline: 0.12.6 | passed | 6 | 3.00s | 2.75s–3.59s | 0.12s | 0.29s | 9.35% | 16 | 45 |
| Node dependencies and service logic / v8 | candidate: preview 2869d12 | passed | 6 | 3.25s | 2.74s–4.20s | 0.38s | 0.53s | 16.01% | 16 | 45 |
| Node dependencies and service logic / istanbul | baseline: 0.12.6 | passed | 6 | 2.49s | 2.32s–2.84s | 0.17s | 0.23s | 9.17% | 16 | 45 |
| Node dependencies and service logic / istanbul | candidate: preview 2869d12 | passed | 6 | 2.32s | 2.24s–2.75s | 0.03s | 0.19s | 7.79% | 16 | 45 |
| Node module graph / none | baseline: 0.12.6 | passed | 6 | 3.37s | 3.05s–3.85s | 0.18s | 0.29s | 8.32% | 40 | 122 |
| Node module graph / none | candidate: preview 2869d12 | passed | 6 | 3.29s | 3.11s–5.54s | 0.14s | 0.94s | 25.23% | 40 | 122 |
| Node module graph / v8 | baseline: 0.12.6 | passed | 6 | 5.07s | 4.92s–6.20s | 0.13s | 0.48s | 9.25% | 40 | 122 |
| Node module graph / v8 | candidate: preview 2869d12 | passed | 6 | 5.50s | 4.82s–5.76s | 0.15s | 0.37s | 6.97% | 40 | 122 |
| Node module graph / istanbul | baseline: 0.12.6 | passed | 6 | 4.49s | 4.09s–5.02s | 0.24s | 0.34s | 7.50% | 40 | 122 |
| Node module graph / istanbul | candidate: preview 2869d12 | passed | 6 | 4.37s | 4.07s–5.12s | 0.11s | 0.36s | 7.98% | 40 | 122 |
| React + jsdom / none | baseline: 0.12.6 | passed | 6 | 11.04s | 8.45s–11.76s | 0.69s | 1.26s | 11.85% | 30 | 54 |
| React + jsdom / none | candidate: preview 2869d12 | passed | 6 | 10.27s | 8.83s–13.43s | 0.65s | 1.64s | 15.74% | 30 | 54 |
| React + jsdom / v8 | baseline: 0.12.6 | passed | 6 | 12.16s | 10.85s–17.76s | 1.30s | 2.73s | 20.83% | 30 | 54 |
| React + jsdom / v8 | candidate: preview 2869d12 | passed | 6 | 12.53s | 10.81s–14.49s | 0.75s | 1.27s | 10.10% | 30 | 54 |
| React + jsdom / istanbul | baseline: 0.12.6 | passed | 6 | 11.43s | 9.76s–14.49s | 0.74s | 1.60s | 13.61% | 30 | 54 |
| React + jsdom / istanbul | candidate: preview 2869d12 | passed | 6 | 10.49s | 9.06s–12.50s | 0.90s | 1.30s | 12.37% | 30 | 54 |

## Memory

Peak process-tree physical footprint in MiB (macOS `phys_footprint`, summed every ~50 ms).

| Case | Column | Status | n | Median MiB | Min–max MiB | CV |
| --- | --- | --- | --- | --- | --- | --- |
| barrel graph · medium / none | baseline: 0.12.6 | passed | 6 | 139.41 | 135.60–142.02 | 1.65% |
| barrel graph · medium / none | candidate: preview 2869d12 | passed | 6 | 137.90 | 136.40–138.52 | 0.66% |
| barrel graph · medium / v8 | baseline: 0.12.6 | passed | 6 | 148.21 | 143.59–150.84 | 2.05% |
| barrel graph · medium / v8 | candidate: preview 2869d12 | passed | 6 | 148.06 | 145.63–150.49 | 1.30% |
| barrel graph · medium / istanbul | baseline: 0.12.6 | passed | 6 | 169.24 | 166.27–170.40 | 0.86% |
| barrel graph · medium / istanbul | candidate: preview 2869d12 | passed | 6 | 166.05 | 162.38–167.19 | 1.20% |
| barrel graph · large / none | baseline: 0.12.6 | passed | 6 | 143.58 | 141.27–145.71 | 1.04% |
| barrel graph · large / none | candidate: preview 2869d12 | passed | 6 | 143.99 | 142.18–146.21 | 1.09% |
| barrel graph · large / v8 | baseline: 0.12.6 | passed | 6 | 156.76 | 155.15–159.66 | 1.06% |
| barrel graph · large / v8 | candidate: preview 2869d12 | passed | 6 | 156.56 | 153.93–158.49 | 1.08% |
| barrel graph · large / istanbul | baseline: 0.12.6 | passed | 6 | 177.11 | 174.54–180.18 | 1.39% |
| barrel graph · large / istanbul | candidate: preview 2869d12 | passed | 6 | 176.75 | 172.33–178.36 | 1.35% |
| Node dependencies and service logic / none | baseline: 0.12.6 | passed | 6 | 165.25 | 162.36–169.42 | 1.63% |
| Node dependencies and service logic / none | candidate: preview 2869d12 | passed | 6 | 160.40 | 155.56–168.81 | 2.78% |
| Node dependencies and service logic / v8 | baseline: 0.12.6 | passed | 6 | 181.95 | 170.25–192.60 | 4.77% |
| Node dependencies and service logic / v8 | candidate: preview 2869d12 | passed | 6 | 180.79 | 176.35–183.74 | 1.45% |
| Node dependencies and service logic / istanbul | baseline: 0.12.6 | passed | 6 | 193.01 | 187.01–194.20 | 1.51% |
| Node dependencies and service logic / istanbul | candidate: preview 2869d12 | passed | 6 | 198.56 | 192.89–199.42 | 1.40% |
| Node module graph / none | baseline: 0.12.6 | passed | 6 | 155.34 | 151.23–158.54 | 1.59% |
| Node module graph / none | candidate: preview 2869d12 | passed | 6 | 151.80 | 150.11–152.79 | 0.63% |
| Node module graph / v8 | baseline: 0.12.6 | passed | 6 | 210.46 | 203.66–230.00 | 4.29% |
| Node module graph / v8 | candidate: preview 2869d12 | passed | 6 | 220.79 | 190.02–226.62 | 6.32% |
| Node module graph / istanbul | baseline: 0.12.6 | passed | 6 | 243.91 | 226.81–247.89 | 3.18% |
| Node module graph / istanbul | candidate: preview 2869d12 | passed | 6 | 222.40 | 215.69–227.74 | 1.99% |
| React + jsdom / none | baseline: 0.12.6 | passed | 6 | 604.70 | 590.13–614.34 | 1.79% |
| React + jsdom / none | candidate: preview 2869d12 | passed | 6 | 454.94 | 443.96–468.21 | 1.83% |
| React + jsdom / v8 | baseline: 0.12.6 | passed | 6 | 603.65 | 597.69–607.79 | 0.59% |
| React + jsdom / v8 | candidate: preview 2869d12 | passed | 6 | 467.48 | 459.66–487.52 | 2.23% |
| React + jsdom / istanbul | baseline: 0.12.6 | passed | 6 | 621.40 | 591.49–633.50 | 2.56% |
| React + jsdom / istanbul | candidate: preview 2869d12 | passed | 6 | 483.60 | 475.32–487.37 | 1.10% |

## Inputs and provenance

- `reports/data/ci-version-coverage-merged-2026-11-17T08-29-04-595Z-baseline-coverage.json`: 2026-11-17T08:12:07.427Z; Node v26.13.0; Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64; lockfile SHA-256: 7123888d5cfe1ee770452ece3fca53bf0702544ea23a11b4dce7557cace858c1. Source: npm / 0.12.6; fingerprint: 7d901a930ef93f885c74f9d3e8ab22dbdaef06698b4f32a0611c98105e956bde.
- `reports/data/ci-version-coverage-merged-2026-11-17T08-29-04-595Z-candidate-coverage.json`: 2026-11-17T08:12:07.953Z; Node v26.13.0; Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64; lockfile SHA-256: 436e18bf9cc56def07f5d0d348e132d1d092f44771ab185453ce6c96612db8b2. Source: preview / preview 2869d12; fingerprint: 9aa50715d3eda69399e6a9934691f55a10796fa3269263786ea805d653c5f8ba.

Published inputs retain every sample, warmup, test count, timestamp and compatibility fingerprint. Full logs, commands and source snapshots are stored separately; meta.publication.sourceSha256 identifies the original result JSON.
Versions are measured in paired case/round order, alternating the first side each round and fixture. No benchmark processes overlap. Workload dependencies, fixtures, configurations, harness and host compatibility are checked before calculating changes.

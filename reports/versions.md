# main: 0.12.6 vs preview 2869d12

Source: [GitHub Actions](https://github.com/rstackjs/rstest-benchmarks/actions/runs/44030402016), commit `6ebc46edf65eadfe13d080f716d19ef4475f5d0e`, attempt 1.

Sources: baseline: **0.12.6** (npm); candidate: **preview 2869d12** (preview). Measured 2026-11-17 (UTC); Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64, Node v26.13.0.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 10 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

Generated from raw samples. Change = (candidate / baseline − 1) × 100%; negative means faster. The first value column is the baseline. Values display two decimal places; changes use unrounded medians. All repetitions are retained; combined batches use the median of pooled samples, not the median of batch medians.

🏆 marks the lowest comparable median in each row. Percentages show change from the baseline.

### Elapsed time (s)

| Case | baseline: 0.12.6 | candidate: preview 2869d12 |
| --- | --- | --- |
| Node startup and utilities | **🏆 0.52s** | 0.63s (+21.39%) |
| Node module graph | **🏆 2.73s** | 2.78s (+1.85%) |
| Node dependencies and service logic | 2.12s | **🏆 2.07s** (-2.43%) |
| React + jsdom | 9.77s | **🏆 9.76s** (-0.13%) |
| React + happy-dom | 5.31s | **🏆 4.80s** (-9.57%) |
| React + browser mode | **🏆 5.97s** | 6.78s (+13.56%) |
| Vue + jsdom | 5.77s | **🏆 5.75s** (-0.25%) |
| Vue + happy-dom | **🏆 2.88s** | 3.13s (+8.54%) |
| Vue + browser mode | **🏆 3.25s** | 3.59s (+10.71%) |
| barrel graph · medium | **🏆 1.37s** | 1.38s (+0.44%) |

### Memory comparison (MiB, peak process-tree footprint)

| Case | baseline: 0.12.6 | candidate: preview 2869d12 |
| --- | --- | --- |
| Node startup and utilities | 124.93 | **🏆 122.77** (-1.73%) |
| Node module graph | 154.70 | **🏆 150.49** (-2.72%) |
| Node dependencies and service logic | **🏆 163.53** | 164.37 (+0.52%) |
| React + jsdom | 606.88 | **🏆 463.11** (-23.69%) |
| React + happy-dom | 364.49 | **🏆 297.56** (-18.36%) |
| React + browser mode | **🏆 362.03** | 365.43 (+0.94%) |
| Vue + jsdom | 598.69 | **🏆 456.49** (-23.75%) |
| Vue + happy-dom | 347.74 | **🏆 293.65** (-15.55%) |
| Vue + browser mode | **🏆 345.86** | 346.22 (+0.10%) |
| barrel graph · medium | 137.55 | **🏆 135.61** (-1.41%) |

## Variability

MAD is unscaled. CV uses sample standard deviation (n − 1). Evaluate CV together with absolute SD and range before deciding whether a fluctuation warrants a rerun. Small sample counts do not establish a regression. Failed or incomplete batches never receive a speedup percentage.

| Case | Column | Status | n | Median | Min–max | MAD | SD | CV | Files | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Node startup and utilities | baseline: 0.12.6 | passed | 6 | 0.52s | 0.46s–0.77s | 0.04s | 0.11s | 20.14% | 5 | 18 |
| Node startup and utilities | candidate: preview 2869d12 | passed | 6 | 0.63s | 0.49s–1.04s | 0.14s | 0.21s | 30.88% | 5 | 18 |
| Node module graph | baseline: 0.12.6 | passed | 6 | 2.73s | 2.45s–3.23s | 0.20s | 0.28s | 10.28% | 40 | 122 |
| Node module graph | candidate: preview 2869d12 | passed | 6 | 2.78s | 2.43s–3.33s | 0.19s | 0.32s | 11.39% | 40 | 122 |
| Node dependencies and service logic | baseline: 0.12.6 | passed | 6 | 2.12s | 1.95s–2.17s | 0.05s | 0.09s | 4.31% | 16 | 45 |
| Node dependencies and service logic | candidate: preview 2869d12 | passed | 6 | 2.07s | 1.94s–2.27s | 0.13s | 0.14s | 6.70% | 16 | 45 |
| React + jsdom | baseline: 0.12.6 | passed | 6 | 9.77s | 8.31s–12.83s | 1.45s | 2.00s | 19.60% | 30 | 54 |
| React + jsdom | candidate: preview 2869d12 | passed | 6 | 9.76s | 8.50s–12.43s | 0.86s | 1.40s | 13.95% | 30 | 54 |
| React + happy-dom | baseline: 0.12.6 | passed | 6 | 5.31s | 4.43s–7.37s | 0.58s | 1.24s | 21.46% | 30 | 54 |
| React + happy-dom | candidate: preview 2869d12 | passed | 6 | 4.80s | 4.49s–5.21s | 0.31s | 0.30s | 6.23% | 30 | 54 |
| React + browser mode | baseline: 0.12.6 | passed | 6 | 5.97s | 4.68s–7.14s | 0.60s | 0.88s | 14.72% | 30 | 54 |
| React + browser mode | candidate: preview 2869d12 | passed | 6 | 6.78s | 5.57s–8.65s | 0.91s | 1.16s | 16.60% | 30 | 54 |
| Vue + jsdom | baseline: 0.12.6 | passed | 6 | 5.77s | 5.22s–8.25s | 0.46s | 1.24s | 19.67% | 20 | 20 |
| Vue + jsdom | candidate: preview 2869d12 | passed | 6 | 5.75s | 5.43s–8.95s | 0.22s | 1.35s | 21.08% | 20 | 20 |
| Vue + happy-dom | baseline: 0.12.6 | passed | 6 | 2.88s | 2.61s–3.51s | 0.18s | 0.32s | 10.79% | 20 | 20 |
| Vue + happy-dom | candidate: preview 2869d12 | passed | 6 | 3.13s | 2.55s–3.67s | 0.38s | 0.44s | 14.00% | 20 | 20 |
| Vue + browser mode | baseline: 0.12.6 | passed | 6 | 3.25s | 2.83s–4.15s | 0.37s | 0.51s | 15.32% | 20 | 20 |
| Vue + browser mode | candidate: preview 2869d12 | passed | 6 | 3.59s | 2.57s–3.95s | 0.29s | 0.57s | 16.93% | 20 | 20 |
| barrel graph · medium | baseline: 0.12.6 | passed | 6 | 1.37s | 1.19s–1.49s | 0.11s | 0.13s | 9.35% | 20 | 40 |
| barrel graph · medium | candidate: preview 2869d12 | passed | 6 | 1.38s | 1.28s–1.73s | 0.08s | 0.16s | 11.55% | 20 | 40 |

## Memory

Peak process-tree physical footprint in MiB (macOS `phys_footprint`, summed every ~50 ms).

| Case | Column | Status | n | Median MiB | Min–max MiB | CV |
| --- | --- | --- | --- | --- | --- | --- |
| Node startup and utilities | baseline: 0.12.6 | passed | 6 | 124.93 | 120.78–125.94 | 1.87% |
| Node startup and utilities | candidate: preview 2869d12 | passed | 6 | 122.77 | 117.56–124.00 | 2.43% |
| Node module graph | baseline: 0.12.6 | passed | 6 | 154.70 | 152.18–155.41 | 0.98% |
| Node module graph | candidate: preview 2869d12 | passed | 6 | 150.49 | 147.02–152.29 | 1.27% |
| Node dependencies and service logic | baseline: 0.12.6 | passed | 6 | 163.53 | 159.61–170.17 | 2.45% |
| Node dependencies and service logic | candidate: preview 2869d12 | passed | 6 | 164.37 | 156.68–168.39 | 2.61% |
| React + jsdom | baseline: 0.12.6 | passed | 6 | 606.88 | 599.29–618.01 | 1.32% |
| React + jsdom | candidate: preview 2869d12 | passed | 6 | 463.11 | 439.02–469.38 | 2.44% |
| React + happy-dom | baseline: 0.12.6 | passed | 6 | 364.49 | 357.01–369.67 | 1.53% |
| React + happy-dom | candidate: preview 2869d12 | passed | 6 | 297.56 | 293.82–303.98 | 1.21% |
| React + browser mode | baseline: 0.12.6 | passed | 6 | 362.03 | 348.88–374.96 | 2.60% |
| React + browser mode | candidate: preview 2869d12 | passed | 6 | 365.43 | 352.35–368.24 | 1.67% |
| Vue + jsdom | baseline: 0.12.6 | passed | 6 | 598.69 | 591.11–617.72 | 1.58% |
| Vue + jsdom | candidate: preview 2869d12 | passed | 6 | 456.49 | 446.31–466.96 | 1.50% |
| Vue + happy-dom | baseline: 0.12.6 | passed | 6 | 347.74 | 326.39–364.09 | 3.71% |
| Vue + happy-dom | candidate: preview 2869d12 | passed | 6 | 293.65 | 281.98–298.34 | 2.00% |
| Vue + browser mode | baseline: 0.12.6 | passed | 6 | 345.86 | 339.74–351.16 | 1.09% |
| Vue + browser mode | candidate: preview 2869d12 | passed | 6 | 346.22 | 335.32–350.35 | 1.59% |
| barrel graph · medium | baseline: 0.12.6 | passed | 6 | 137.55 | 134.04–141.46 | 2.02% |
| barrel graph · medium | candidate: preview 2869d12 | passed | 6 | 135.61 | 135.24–137.47 | 0.71% |

## Inputs and provenance

- `reports/data/ci-versions-2026-11-17T06-28-33-087Z-b0a8577c-baseline-main.json`: 2026-11-17T06:28:33.123Z; Node v26.13.0; Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64; lockfile SHA-256: 7123888d5cfe1ee770452ece3fca53bf0702544ea23a11b4dce7557cace858c1. Source: npm / 0.12.6; fingerprint: 7d901a930ef93f885c74f9d3e8ab22dbdaef06698b4f32a0611c98105e956bde.
- `reports/data/ci-versions-2026-11-17T06-28-33-538Z-8c5bb046-candidate-main.json`: 2026-11-17T06:28:33.552Z; Node v26.13.0; Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64; lockfile SHA-256: 436e18bf9cc56def07f5d0d348e132d1d092f44771ab185453ce6c96612db8b2. Source: preview / preview 2869d12; fingerprint: 9aa50715d3eda69399e6a9934691f55a10796fa3269263786ea805d653c5f8ba.

Published inputs retain every sample, warmup, test count, timestamp and compatibility fingerprint. Full logs, commands and source snapshots are stored separately; meta.publication.sourceSha256 identifies the original result JSON.
Versions are measured in paired case/round order, alternating the first side each round and fixture. No benchmark processes overlap. Workload dependencies, fixtures, configurations, harness and host compatibility are checked before calculating changes.

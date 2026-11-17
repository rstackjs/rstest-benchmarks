# coverage: 0.12.6 vs preview 2869d12

Source: [GitHub Actions](https://github.com/rstackjs/rstest-benchmarks/actions/runs/44030332154), commit `6ebc46edf65eadfe13d080f716d19ef4475f5d0e`, attempt 1.

Sources: baseline: **0.12.6** (npm); candidate: **preview 2869d12** (preview). Measured 2026-11-17 (UTC); Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64, Node v26.13.0.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 15 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

Generated from raw samples. Change = (candidate / baseline − 1) × 100%; negative means faster. The first value column is the baseline. Values display two decimal places; changes use unrounded medians. All repetitions are retained; combined batches use the median of pooled samples, not the median of batch medians.

🏆 marks the lowest comparable median in each row. Percentages show change from the baseline.

### Elapsed time (s)

| Case | baseline: 0.12.6 | candidate: preview 2869d12 |
| --- | --- | --- |
| barrel graph · medium / none | **🏆 1.12s** | 1.24s (+11.14%) |
| barrel graph · medium / v8 | **🏆 1.61s** | 1.63s (+1.00%) |
| barrel graph · medium / istanbul | **🏆 1.32s** | 1.35s (+1.77%) |
| barrel graph · large / none | 1.41s | **🏆 1.39s** (-1.13%) |
| barrel graph · large / v8 | **🏆 1.86s** | 2.03s (+8.90%) |
| barrel graph · large / istanbul | **🏆 1.61s** | 1.75s (+8.57%) |
| Node dependencies and service logic / none | 1.68s | **🏆 1.57s** (-6.59%) |
| Node dependencies and service logic / v8 | **🏆 2.32s** | 2.67s (+15.19%) |
| Node dependencies and service logic / istanbul | **🏆 1.75s** | 1.93s (+10.24%) |
| Node module graph / none | 3.54s | **🏆 3.05s** (-14.02%) |
| Node module graph / v8 | **🏆 4.52s** | 4.80s (+6.09%) |
| Node module graph / istanbul | 4.39s | **🏆 4.24s** (-3.60%) |
| React + jsdom / none | **🏆 8.55s** | 8.68s (+1.56%) |
| React + jsdom / v8 | 11.26s | **🏆 11.02s** (-2.15%) |
| React + jsdom / istanbul | **🏆 8.47s** | 9.37s (+10.57%) |

### Memory comparison (MiB, peak process-tree footprint)

| Case | baseline: 0.12.6 | candidate: preview 2869d12 |
| --- | --- | --- |
| barrel graph · medium / none | 138.29 | **🏆 136.58** (-1.23%) |
| barrel graph · medium / v8 | **🏆 147.81** | 149.31 (+1.01%) |
| barrel graph · medium / istanbul | 167.87 | **🏆 167.65** (-0.13%) |
| barrel graph · large / none | **🏆 144.90** | 145.26 (+0.25%) |
| barrel graph · large / v8 | 159.66 | **🏆 159.28** (-0.24%) |
| barrel graph · large / istanbul | 180.30 | **🏆 177.54** (-1.53%) |
| Node dependencies and service logic / none | **🏆 162.24** | 163.93 (+1.04%) |
| Node dependencies and service logic / v8 | 181.23 | **🏆 176.63** (-2.54%) |
| Node dependencies and service logic / istanbul | **🏆 193.63** | 198.84 (+2.69%) |
| Node module graph / none | 154.76 | **🏆 151.37** (-2.19%) |
| Node module graph / v8 | **🏆 209.98** | 212.45 (+1.18%) |
| Node module graph / istanbul | 239.69 | **🏆 222.24** (-7.28%) |
| React + jsdom / none | 609.92 | **🏆 457.12** (-25.05%) |
| React + jsdom / v8 | 602.69 | **🏆 469.78** (-22.05%) |
| React + jsdom / istanbul | 621.43 | **🏆 479.69** (-22.81%) |

## Variability

MAD is unscaled. CV uses sample standard deviation (n − 1). Evaluate CV together with absolute SD and range before deciding whether a fluctuation warrants a rerun. Small sample counts do not establish a regression. Failed or incomplete batches never receive a speedup percentage.

| Case | Column | Status | n | Median | Min–max | MAD | SD | CV | Files | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| barrel graph · medium / none | baseline: 0.12.6 | passed | 6 | 1.12s | 1.02s–1.31s | 0.06s | 0.11s | 9.47% | 20 | 40 |
| barrel graph · medium / none | candidate: preview 2869d12 | passed | 6 | 1.24s | 1.00s–1.35s | 0.10s | 0.15s | 12.87% | 20 | 40 |
| barrel graph · medium / v8 | baseline: 0.12.6 | passed | 6 | 1.61s | 1.38s–1.77s | 0.13s | 0.15s | 9.27% | 20 | 40 |
| barrel graph · medium / v8 | candidate: preview 2869d12 | passed | 6 | 1.63s | 1.49s–1.86s | 0.09s | 0.13s | 8.13% | 20 | 40 |
| barrel graph · medium / istanbul | baseline: 0.12.6 | passed | 6 | 1.32s | 1.07s–1.45s | 0.12s | 0.18s | 14.00% | 20 | 40 |
| barrel graph · medium / istanbul | candidate: preview 2869d12 | passed | 6 | 1.35s | 1.18s–1.48s | 0.12s | 0.14s | 10.63% | 20 | 40 |
| barrel graph · large / none | baseline: 0.12.6 | passed | 6 | 1.41s | 1.13s–1.60s | 0.07s | 0.16s | 11.27% | 20 | 40 |
| barrel graph · large / none | candidate: preview 2869d12 | passed | 6 | 1.39s | 1.30s–1.72s | 0.08s | 0.18s | 12.02% | 20 | 40 |
| barrel graph · large / v8 | baseline: 0.12.6 | passed | 6 | 1.86s | 1.72s–2.55s | 0.09s | 0.30s | 15.11% | 20 | 40 |
| barrel graph · large / v8 | candidate: preview 2869d12 | passed | 6 | 2.03s | 1.68s–2.18s | 0.11s | 0.18s | 9.10% | 20 | 40 |
| barrel graph · large / istanbul | baseline: 0.12.6 | passed | 6 | 1.61s | 1.48s–2.08s | 0.09s | 0.22s | 12.89% | 20 | 40 |
| barrel graph · large / istanbul | candidate: preview 2869d12 | passed | 6 | 1.75s | 1.57s–1.90s | 0.09s | 0.12s | 7.02% | 20 | 40 |
| Node dependencies and service logic / none | baseline: 0.12.6 | passed | 6 | 1.68s | 1.48s–1.92s | 0.17s | 0.20s | 11.89% | 16 | 45 |
| Node dependencies and service logic / none | candidate: preview 2869d12 | passed | 6 | 1.57s | 1.43s–1.98s | 0.11s | 0.25s | 14.76% | 16 | 45 |
| Node dependencies and service logic / v8 | baseline: 0.12.6 | passed | 6 | 2.32s | 2.20s–2.59s | 0.10s | 0.17s | 7.03% | 16 | 45 |
| Node dependencies and service logic / v8 | candidate: preview 2869d12 | passed | 6 | 2.67s | 2.29s–3.30s | 0.10s | 0.33s | 12.34% | 16 | 45 |
| Node dependencies and service logic / istanbul | baseline: 0.12.6 | passed | 6 | 1.75s | 1.36s–2.15s | 0.28s | 0.32s | 17.82% | 16 | 45 |
| Node dependencies and service logic / istanbul | candidate: preview 2869d12 | passed | 6 | 1.93s | 1.36s–2.30s | 0.22s | 0.35s | 17.81% | 16 | 45 |
| Node module graph / none | baseline: 0.12.6 | passed | 6 | 3.54s | 2.93s–4.14s | 0.53s | 0.52s | 14.71% | 40 | 122 |
| Node module graph / none | candidate: preview 2869d12 | passed | 6 | 3.05s | 2.77s–3.23s | 0.04s | 0.15s | 4.92% | 40 | 122 |
| Node module graph / v8 | baseline: 0.12.6 | passed | 6 | 4.52s | 4.16s–5.20s | 0.14s | 0.36s | 7.84% | 40 | 122 |
| Node module graph / v8 | candidate: preview 2869d12 | passed | 6 | 4.80s | 4.62s–5.49s | 0.15s | 0.33s | 6.79% | 40 | 122 |
| Node module graph / istanbul | baseline: 0.12.6 | passed | 6 | 4.39s | 3.80s–4.72s | 0.28s | 0.38s | 8.79% | 40 | 122 |
| Node module graph / istanbul | candidate: preview 2869d12 | passed | 6 | 4.24s | 3.88s–5.90s | 0.17s | 0.74s | 16.66% | 40 | 122 |
| React + jsdom / none | baseline: 0.12.6 | passed | 6 | 8.55s | 7.78s–12.88s | 0.76s | 1.96s | 21.29% | 30 | 54 |
| React + jsdom / none | candidate: preview 2869d12 | passed | 6 | 8.68s | 7.75s–9.87s | 0.86s | 1.00s | 11.43% | 30 | 54 |
| React + jsdom / v8 | baseline: 0.12.6 | passed | 6 | 11.26s | 9.16s–16.90s | 1.06s | 2.72s | 23.16% | 30 | 54 |
| React + jsdom / v8 | candidate: preview 2869d12 | passed | 6 | 11.02s | 9.52s–14.19s | 0.83s | 1.68s | 15.11% | 30 | 54 |
| React + jsdom / istanbul | baseline: 0.12.6 | passed | 6 | 8.47s | 7.55s–10.58s | 0.69s | 1.24s | 13.99% | 30 | 54 |
| React + jsdom / istanbul | candidate: preview 2869d12 | passed | 6 | 9.37s | 7.77s–10.19s | 0.73s | 1.06s | 11.59% | 30 | 54 |

## Memory

Peak process-tree physical footprint in MiB (macOS `phys_footprint`, summed every ~50 ms).

| Case | Column | Status | n | Median MiB | Min–max MiB | CV |
| --- | --- | --- | --- | --- | --- | --- |
| barrel graph · medium / none | baseline: 0.12.6 | passed | 6 | 138.29 | 134.18–140.04 | 1.83% |
| barrel graph · medium / none | candidate: preview 2869d12 | passed | 6 | 136.58 | 133.43–139.32 | 1.40% |
| barrel graph · medium / v8 | baseline: 0.12.6 | passed | 6 | 147.81 | 147.31–148.68 | 0.41% |
| barrel graph · medium / v8 | candidate: preview 2869d12 | passed | 6 | 149.31 | 146.57–150.48 | 0.93% |
| barrel graph · medium / istanbul | baseline: 0.12.6 | passed | 6 | 167.87 | 165.58–169.55 | 0.87% |
| barrel graph · medium / istanbul | candidate: preview 2869d12 | passed | 6 | 167.65 | 164.82–169.55 | 0.94% |
| barrel graph · large / none | baseline: 0.12.6 | passed | 6 | 144.90 | 139.49–147.32 | 1.86% |
| barrel graph · large / none | candidate: preview 2869d12 | passed | 6 | 145.26 | 141.21–145.88 | 1.39% |
| barrel graph · large / v8 | baseline: 0.12.6 | passed | 6 | 159.66 | 156.06–161.40 | 1.30% |
| barrel graph · large / v8 | candidate: preview 2869d12 | passed | 6 | 159.28 | 155.09–162.18 | 1.76% |
| barrel graph · large / istanbul | baseline: 0.12.6 | passed | 6 | 180.30 | 176.30–183.05 | 1.24% |
| barrel graph · large / istanbul | candidate: preview 2869d12 | passed | 6 | 177.54 | 174.57–179.86 | 1.16% |
| Node dependencies and service logic / none | baseline: 0.12.6 | passed | 6 | 162.24 | 160.42–169.19 | 1.99% |
| Node dependencies and service logic / none | candidate: preview 2869d12 | passed | 6 | 163.93 | 155.65–167.06 | 2.98% |
| Node dependencies and service logic / v8 | baseline: 0.12.6 | passed | 6 | 181.23 | 170.45–184.16 | 2.74% |
| Node dependencies and service logic / v8 | candidate: preview 2869d12 | passed | 6 | 176.63 | 167.98–179.54 | 2.66% |
| Node dependencies and service logic / istanbul | baseline: 0.12.6 | passed | 6 | 193.63 | 189.31–198.80 | 2.12% |
| Node dependencies and service logic / istanbul | candidate: preview 2869d12 | passed | 6 | 198.84 | 190.92–204.11 | 2.38% |
| Node module graph / none | baseline: 0.12.6 | passed | 6 | 154.76 | 150.91–158.09 | 1.55% |
| Node module graph / none | candidate: preview 2869d12 | passed | 6 | 151.37 | 148.35–153.97 | 1.34% |
| Node module graph / v8 | baseline: 0.12.6 | passed | 6 | 209.98 | 180.44–225.85 | 9.81% |
| Node module graph / v8 | candidate: preview 2869d12 | passed | 6 | 212.45 | 192.69–218.87 | 4.71% |
| Node module graph / istanbul | baseline: 0.12.6 | passed | 6 | 239.69 | 231.06–246.67 | 2.55% |
| Node module graph / istanbul | candidate: preview 2869d12 | passed | 6 | 222.24 | 210.11–229.74 | 3.30% |
| React + jsdom / none | baseline: 0.12.6 | passed | 6 | 609.92 | 588.81–622.86 | 2.10% |
| React + jsdom / none | candidate: preview 2869d12 | passed | 6 | 457.12 | 451.63–471.90 | 1.57% |
| React + jsdom / v8 | baseline: 0.12.6 | passed | 6 | 602.69 | 588.71–620.65 | 2.11% |
| React + jsdom / v8 | candidate: preview 2869d12 | passed | 6 | 469.78 | 454.14–477.88 | 1.83% |
| React + jsdom / istanbul | baseline: 0.12.6 | passed | 6 | 621.43 | 596.45–642.26 | 2.54% |
| React + jsdom / istanbul | candidate: preview 2869d12 | passed | 6 | 479.69 | 476.76–487.04 | 0.75% |

## Inputs and provenance

- `reports/data/ci-version-coverage-merged-2026-11-17T06-47-42-796Z-baseline-coverage.json`: 2026-11-17T06:31:15.911Z; Node v26.13.0; Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64; lockfile SHA-256: 7123888d5cfe1ee770452ece3fca53bf0702544ea23a11b4dce7557cace858c1. Source: npm / 0.12.6; fingerprint: 7d901a930ef93f885c74f9d3e8ab22dbdaef06698b4f32a0611c98105e956bde.
- `reports/data/ci-version-coverage-merged-2026-11-17T06-47-42-796Z-candidate-coverage.json`: 2026-11-17T06:31:16.518Z; Node v26.13.0; Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64; lockfile SHA-256: 436e18bf9cc56def07f5d0d348e132d1d092f44771ab185453ce6c96612db8b2. Source: preview / preview 2869d12; fingerprint: 9aa50715d3eda69399e6a9934691f55a10796fa3269263786ea805d653c5f8ba.

Published inputs retain every sample, warmup, test count, timestamp and compatibility fingerprint. Full logs, commands and source snapshots are stored separately; meta.publication.sourceSha256 identifies the original result JSON.
Versions are measured in paired case/round order, alternating the first side each round and fixture. No benchmark processes overlap. Workload dependencies, fixtures, configurations, harness and host compatibility are checked before calculating changes.

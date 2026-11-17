# main: 0.12.6 vs preview 2869d12

Source: [GitHub Actions](https://github.com/rstackjs/rstest-benchmarks/actions/runs/44043587285), commit `969876e9fc43ca83e8a41e8e1873b6687fa45c16`, attempt 1.

Sources: baseline: **0.12.6** (npm); candidate: **preview 2869d12** (preview). Measured 2026-11-17 (UTC); Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64, Node v26.13.0.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 10 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

Generated from raw samples. Change = (candidate / baseline − 1) × 100%; negative means faster. The first value column is the baseline. Values display two decimal places; changes use unrounded medians. All repetitions are retained; combined batches use the median of pooled samples, not the median of batch medians.

🏆 marks the lowest comparable median in each row. Percentages show change from the baseline.

### Elapsed time (s)

| Case | baseline: 0.12.6 | candidate: preview 2869d12 |
| --- | --- | --- |
| Node startup and utilities | **🏆 0.90s** | 0.90s (+0.73%) |
| Node module graph | **🏆 4.23s** | 4.34s (+2.54%) |
| Node dependencies and service logic | **🏆 3.08s** | 3.08s (+0.05%) |
| React + jsdom | **🏆 14.02s** | 14.26s (+1.75%) |
| React + happy-dom | **🏆 8.16s** | 8.37s (+2.50%) |
| React + browser mode | 7.77s | **🏆 7.50s** (-3.43%) |
| Vue + jsdom | 6.03s | **🏆 5.74s** (-4.88%) |
| Vue + happy-dom | 3.08s | **🏆 2.97s** (-3.64%) |
| Vue + browser mode | 3.11s | **🏆 3.06s** (-1.54%) |
| barrel graph · medium | **🏆 1.26s** | 1.31s (+3.92%) |

### Memory comparison (MiB, peak process-tree footprint)

| Case | baseline: 0.12.6 | candidate: preview 2869d12 |
| --- | --- | --- |
| Node startup and utilities | 121.92 | **🏆 121.16** (-0.62%) |
| Node module graph | 154.80 | **🏆 150.96** (-2.48%) |
| Node dependencies and service logic | 165.31 | **🏆 164.03** (-0.78%) |
| React + jsdom | 607.41 | **🏆 456.31** (-24.88%) |
| React + happy-dom | 367.31 | **🏆 297.59** (-18.98%) |
| React + browser mode | 370.66 | **🏆 367.88** (-0.75%) |
| Vue + jsdom | 592.66 | **🏆 459.45** (-22.48%) |
| Vue + happy-dom | 346.12 | **🏆 297.55** (-14.03%) |
| Vue + browser mode | **🏆 343.01** | 346.90 (+1.13%) |
| barrel graph · medium | 140.03 | **🏆 137.27** (-1.97%) |

## Variability

MAD is unscaled. CV uses sample standard deviation (n − 1). Evaluate CV together with absolute SD and range before deciding whether a fluctuation warrants a rerun. Small sample counts do not establish a regression. Failed or incomplete batches never receive a speedup percentage.

| Case | Column | Status | n | Median | Min–max | MAD | SD | CV | Files | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Node startup and utilities | baseline: 0.12.6 | passed | 6 | 0.90s | 0.78s–1.22s | 0.10s | 0.17s | 17.79% | 5 | 18 |
| Node startup and utilities | candidate: preview 2869d12 | passed | 6 | 0.90s | 0.83s–0.99s | 0.01s | 0.05s | 5.47% | 5 | 18 |
| Node module graph | baseline: 0.12.6 | passed | 6 | 4.23s | 3.38s–5.45s | 0.21s | 0.69s | 16.16% | 40 | 122 |
| Node module graph | candidate: preview 2869d12 | passed | 6 | 4.34s | 4.13s–4.71s | 0.16s | 0.22s | 4.96% | 40 | 122 |
| Node dependencies and service logic | baseline: 0.12.6 | passed | 6 | 3.08s | 2.94s–3.45s | 0.11s | 0.20s | 6.35% | 16 | 45 |
| Node dependencies and service logic | candidate: preview 2869d12 | passed | 6 | 3.08s | 2.55s–3.89s | 0.38s | 0.52s | 16.82% | 16 | 45 |
| React + jsdom | baseline: 0.12.6 | passed | 6 | 14.02s | 11.42s–16.20s | 1.03s | 1.66s | 11.96% | 30 | 54 |
| React + jsdom | candidate: preview 2869d12 | passed | 6 | 14.26s | 11.46s–16.23s | 0.97s | 1.64s | 11.71% | 30 | 54 |
| React + happy-dom | baseline: 0.12.6 | passed | 6 | 8.16s | 7.44s–8.33s | 0.10s | 0.39s | 4.85% | 30 | 54 |
| React + happy-dom | candidate: preview 2869d12 | passed | 6 | 8.37s | 6.79s–9.90s | 1.48s | 1.51s | 18.01% | 30 | 54 |
| React + browser mode | baseline: 0.12.6 | passed | 6 | 7.77s | 5.36s–10.62s | 1.28s | 1.86s | 23.56% | 30 | 54 |
| React + browser mode | candidate: preview 2869d12 | passed | 6 | 7.50s | 6.23s–11.20s | 1.12s | 2.11s | 25.64% | 30 | 54 |
| Vue + jsdom | baseline: 0.12.6 | passed | 6 | 6.03s | 5.60s–6.70s | 0.05s | 0.36s | 5.87% | 20 | 20 |
| Vue + jsdom | candidate: preview 2869d12 | passed | 6 | 5.74s | 5.19s–6.31s | 0.19s | 0.38s | 6.55% | 20 | 20 |
| Vue + happy-dom | baseline: 0.12.6 | passed | 6 | 3.08s | 2.82s–3.57s | 0.22s | 0.28s | 9.00% | 20 | 20 |
| Vue + happy-dom | candidate: preview 2869d12 | passed | 6 | 2.97s | 2.60s–3.06s | 0.07s | 0.17s | 5.83% | 20 | 20 |
| Vue + browser mode | baseline: 0.12.6 | passed | 6 | 3.11s | 2.96s–3.96s | 0.12s | 0.42s | 12.60% | 20 | 20 |
| Vue + browser mode | candidate: preview 2869d12 | passed | 6 | 3.06s | 2.80s–3.70s | 0.22s | 0.38s | 11.83% | 20 | 20 |
| barrel graph · medium | baseline: 0.12.6 | passed | 6 | 1.26s | 1.17s–1.52s | 0.08s | 0.14s | 10.87% | 20 | 40 |
| barrel graph · medium | candidate: preview 2869d12 | passed | 6 | 1.31s | 1.12s–1.67s | 0.06s | 0.19s | 14.10% | 20 | 40 |

## Memory

Peak process-tree physical footprint in MiB (macOS `phys_footprint`, summed every ~50 ms).

| Case | Column | Status | n | Median MiB | Min–max MiB | CV |
| --- | --- | --- | --- | --- | --- | --- |
| Node startup and utilities | baseline: 0.12.6 | passed | 6 | 121.92 | 118.25–124.36 | 2.19% |
| Node startup and utilities | candidate: preview 2869d12 | passed | 6 | 121.16 | 119.31–125.60 | 2.03% |
| Node module graph | baseline: 0.12.6 | passed | 6 | 154.80 | 153.19–157.43 | 1.16% |
| Node module graph | candidate: preview 2869d12 | passed | 6 | 150.96 | 150.46–151.72 | 0.28% |
| Node dependencies and service logic | baseline: 0.12.6 | passed | 6 | 165.31 | 159.20–173.69 | 2.85% |
| Node dependencies and service logic | candidate: preview 2869d12 | passed | 6 | 164.03 | 157.08–168.16 | 2.66% |
| React + jsdom | baseline: 0.12.6 | passed | 6 | 607.41 | 586.51–623.06 | 1.96% |
| React + jsdom | candidate: preview 2869d12 | passed | 6 | 456.31 | 449.26–461.54 | 1.05% |
| React + happy-dom | baseline: 0.12.6 | passed | 6 | 367.31 | 359.04–377.01 | 1.61% |
| React + happy-dom | candidate: preview 2869d12 | passed | 6 | 297.59 | 284.37–304.57 | 2.29% |
| React + browser mode | baseline: 0.12.6 | passed | 6 | 370.66 | 351.64–381.57 | 2.84% |
| React + browser mode | candidate: preview 2869d12 | passed | 6 | 367.88 | 355.93–376.80 | 2.03% |
| Vue + jsdom | baseline: 0.12.6 | passed | 6 | 592.66 | 589.28–599.42 | 0.65% |
| Vue + jsdom | candidate: preview 2869d12 | passed | 6 | 459.45 | 455.53–463.12 | 0.68% |
| Vue + happy-dom | baseline: 0.12.6 | passed | 6 | 346.12 | 312.07–361.47 | 5.38% |
| Vue + happy-dom | candidate: preview 2869d12 | passed | 6 | 297.55 | 287.58–299.14 | 1.60% |
| Vue + browser mode | baseline: 0.12.6 | passed | 6 | 343.01 | 338.97–347.99 | 0.91% |
| Vue + browser mode | candidate: preview 2869d12 | passed | 6 | 346.90 | 340.26–349.72 | 1.17% |
| barrel graph · medium | baseline: 0.12.6 | passed | 6 | 140.03 | 137.74–140.40 | 0.72% |
| barrel graph · medium | candidate: preview 2869d12 | passed | 6 | 137.27 | 134.13–138.83 | 1.29% |

## Inputs and provenance

- `reports/data/ci-versions-2026-11-17T08-12-45-872Z-25eabb13-baseline-main.json`: 2026-11-17T08:12:45.947Z; Node v26.13.0; Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64; lockfile SHA-256: 7123888d5cfe1ee770452ece3fca53bf0702544ea23a11b4dce7557cace858c1. Source: npm / 0.12.6; fingerprint: 7d901a930ef93f885c74f9d3e8ab22dbdaef06698b4f32a0611c98105e956bde.
- `reports/data/ci-versions-2026-11-17T08-12-46-521Z-041af128-candidate-main.json`: 2026-11-17T08:12:46.554Z; Node v26.13.0; Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64; lockfile SHA-256: 436e18bf9cc56def07f5d0d348e132d1d092f44771ab185453ce6c96612db8b2. Source: preview / preview 2869d12; fingerprint: 9aa50715d3eda69399e6a9934691f55a10796fa3269263786ea805d653c5f8ba.

Published inputs retain every sample, warmup, test count, timestamp and compatibility fingerprint. Full logs, commands and source snapshots are stored separately; meta.publication.sourceSha256 identifies the original result JSON.
Versions are measured in paired case/round order, alternating the first side each round and fixture. No benchmark processes overlap. Workload dependencies, fixtures, configurations, harness and host compatibility are checked before calculating changes.

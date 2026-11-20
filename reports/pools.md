# pools: 0.12.6 vs 1.0.0-beta.0

Source: [GitHub Actions](https://github.com/rstackjs/rstest-benchmarks/actions/runs/44710050665), commit `0eae38429b438c4afae9e02b21a70cdbe0a7beef`, attempt 1.

Sources: baseline: **0.12.6** (npm); candidate: **1.0.0-beta.0** (npm). Measured 2026-11-20 (UTC); Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64, Node v26.13.0.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 12 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

Generated from raw samples. Change = (candidate / baseline − 1) × 100%; negative means faster. The first value column is the baseline. Values display two decimal places; changes use unrounded medians. All repetitions are retained; combined batches use the median of pooled samples, not the median of batch medians.

🏆 marks the lowest comparable median in each row. Percentages show change from the baseline.

### Elapsed time (s)

| Case | baseline: 0.12.6 | candidate: 1.0.0-beta.0 |
| --- | --- | --- |
| small module graph / forks | 0.76s | **🏆 0.67s** (-12.35%) |
| small module graph / threads | 0.67s | **🏆 0.58s** (-13.47%) |
| small module graph / vmForks | **🏆 0.45s** | 0.48s (+5.63%) |
| small module graph / vmThreads | 0.53s | **🏆 0.47s** (-10.23%) |
| medium module graph / forks | 1.90s | **🏆 1.70s** (-10.66%) |
| medium module graph / threads | 1.35s | **🏆 1.19s** (-11.85%) |
| medium module graph / vmForks | 0.71s | **🏆 0.64s** (-10.08%) |
| medium module graph / vmThreads | **🏆 0.58s** | 0.58s (+0.03%) |
| large module graph / forks | 5.07s | **🏆 4.55s** (-10.26%) |
| large module graph / threads | 3.63s | **🏆 3.05s** (-15.87%) |
| large module graph / vmForks | **🏆 1.17s** | 1.27s (+8.66%) |
| large module graph / vmThreads | **🏆 1.13s** | 1.24s (+10.00%) |

### Memory comparison (MiB, peak process-tree footprint)

| Case | baseline: 0.12.6 | candidate: 1.0.0-beta.0 |
| --- | --- | --- |
| small module graph / forks | **🏆 130.84** | 132.32 (+1.13%) |
| small module graph / threads | 117.51 | **🏆 115.16** (-2.00%) |
| small module graph / vmForks | **🏆 149.34** | 159.65 (+6.90%) |
| small module graph / vmThreads | 135.86 | **🏆 134.50** (-1.00%) |
| medium module graph / forks | 155.71 | **🏆 154.22** (-0.96%) |
| medium module graph / threads | **🏆 138.55** | 138.71 (+0.11%) |
| medium module graph / vmForks | 217.97 | **🏆 213.64** (-1.98%) |
| medium module graph / vmThreads | 192.30 | **🏆 188.10** (-2.19%) |
| large module graph / forks | 254.82 | **🏆 247.86** (-2.73%) |
| large module graph / threads | 232.79 | **🏆 218.76** (-6.03%) |
| large module graph / vmForks | **🏆 394.97** | 412.61 (+4.47%) |
| large module graph / vmThreads | **🏆 368.40** | 377.44 (+2.45%) |

## Variability

MAD is unscaled. CV uses sample standard deviation (n − 1). Evaluate CV together with absolute SD and range before deciding whether a fluctuation warrants a rerun. Small sample counts do not establish a regression. Failed or incomplete batches never receive a speedup percentage.

| Case | Column | Status | n | Median | Min–max | MAD | SD | CV | Files | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| small module graph / forks | baseline: 0.12.6 | passed | 6 | 0.76s | 0.62s–0.90s | 0.08s | 0.11s | 13.74% | 10 | 29 |
| small module graph / forks | candidate: 1.0.0-beta.0 | passed | 6 | 0.67s | 0.59s–0.83s | 0.06s | 0.10s | 14.87% | 10 | 29 |
| small module graph / threads | baseline: 0.12.6 | passed | 6 | 0.67s | 0.48s–0.80s | 0.11s | 0.14s | 21.21% | 10 | 29 |
| small module graph / threads | candidate: 1.0.0-beta.0 | passed | 6 | 0.58s | 0.44s–0.69s | 0.10s | 0.11s | 20.07% | 10 | 29 |
| small module graph / vmForks | baseline: 0.12.6 | passed | 6 | 0.45s | 0.38s–0.59s | 0.07s | 0.09s | 19.60% | 10 | 29 |
| small module graph / vmForks | candidate: 1.0.0-beta.0 | passed | 6 | 0.48s | 0.39s–0.63s | 0.07s | 0.10s | 19.99% | 10 | 29 |
| small module graph / vmThreads | baseline: 0.12.6 | passed | 6 | 0.53s | 0.37s–0.70s | 0.07s | 0.11s | 21.19% | 10 | 29 |
| small module graph / vmThreads | candidate: 1.0.0-beta.0 | passed | 6 | 0.47s | 0.36s–0.55s | 0.07s | 0.08s | 18.12% | 10 | 29 |
| medium module graph / forks | baseline: 0.12.6 | passed | 6 | 1.90s | 1.81s–2.38s | 0.07s | 0.21s | 10.86% | 40 | 122 |
| medium module graph / forks | candidate: 1.0.0-beta.0 | passed | 6 | 1.70s | 1.58s–1.95s | 0.12s | 0.16s | 9.13% | 40 | 122 |
| medium module graph / threads | baseline: 0.12.6 | passed | 6 | 1.35s | 1.29s–1.50s | 0.05s | 0.08s | 5.90% | 40 | 122 |
| medium module graph / threads | candidate: 1.0.0-beta.0 | passed | 6 | 1.19s | 1.13s–1.31s | 0.05s | 0.07s | 6.15% | 40 | 122 |
| medium module graph / vmForks | baseline: 0.12.6 | passed | 6 | 0.71s | 0.57s–0.86s | 0.07s | 0.10s | 14.77% | 40 | 122 |
| medium module graph / vmForks | candidate: 1.0.0-beta.0 | passed | 6 | 0.64s | 0.58s–0.85s | 0.05s | 0.11s | 16.22% | 40 | 122 |
| medium module graph / vmThreads | baseline: 0.12.6 | passed | 6 | 0.58s | 0.53s–0.78s | 0.04s | 0.09s | 15.36% | 40 | 122 |
| medium module graph / vmThreads | candidate: 1.0.0-beta.0 | passed | 6 | 0.58s | 0.54s–0.69s | 0.04s | 0.07s | 11.07% | 40 | 122 |
| large module graph / forks | baseline: 0.12.6 | passed | 6 | 5.07s | 4.98s–5.19s | 0.02s | 0.07s | 1.34% | 120 | 366 |
| large module graph / forks | candidate: 1.0.0-beta.0 | passed | 6 | 4.55s | 4.41s–4.75s | 0.07s | 0.12s | 2.63% | 120 | 366 |
| large module graph / threads | baseline: 0.12.6 | passed | 6 | 3.63s | 3.48s–3.92s | 0.08s | 0.15s | 4.24% | 120 | 366 |
| large module graph / threads | candidate: 1.0.0-beta.0 | passed | 6 | 3.05s | 2.90s–3.73s | 0.15s | 0.32s | 10.05% | 120 | 366 |
| large module graph / vmForks | baseline: 0.12.6 | passed | 6 | 1.17s | 1.13s–1.22s | 0.03s | 0.04s | 3.34% | 120 | 366 |
| large module graph / vmForks | candidate: 1.0.0-beta.0 | passed | 6 | 1.27s | 1.22s–1.31s | 0.03s | 0.04s | 2.86% | 120 | 366 |
| large module graph / vmThreads | baseline: 0.12.6 | passed | 6 | 1.13s | 1.08s–1.19s | 0.01s | 0.04s | 3.40% | 120 | 366 |
| large module graph / vmThreads | candidate: 1.0.0-beta.0 | passed | 6 | 1.24s | 1.18s–1.28s | 0.02s | 0.03s | 2.73% | 120 | 366 |

## Memory

Peak process-tree physical footprint in MiB (macOS `phys_footprint`, summed every ~50 ms).

| Case | Column | Status | n | Median MiB | Min–max MiB | CV |
| --- | --- | --- | --- | --- | --- | --- |
| small module graph / forks | baseline: 0.12.6 | passed | 6 | 130.84 | 127.89–134.79 | 1.99% |
| small module graph / forks | candidate: 1.0.0-beta.0 | passed | 6 | 132.32 | 128.71–135.50 | 1.76% |
| small module graph / threads | baseline: 0.12.6 | passed | 6 | 117.51 | 112.28–120.05 | 2.47% |
| small module graph / threads | candidate: 1.0.0-beta.0 | passed | 6 | 115.16 | 112.33–119.95 | 2.25% |
| small module graph / vmForks | baseline: 0.12.6 | passed | 6 | 149.34 | 145.55–160.64 | 4.43% |
| small module graph / vmForks | candidate: 1.0.0-beta.0 | passed | 6 | 159.65 | 154.21–162.87 | 2.05% |
| small module graph / vmThreads | baseline: 0.12.6 | passed | 6 | 135.86 | 126.16–138.04 | 3.64% |
| small module graph / vmThreads | candidate: 1.0.0-beta.0 | passed | 6 | 134.50 | 124.96–137.71 | 3.72% |
| medium module graph / forks | baseline: 0.12.6 | passed | 6 | 155.71 | 154.13–162.02 | 1.93% |
| medium module graph / forks | candidate: 1.0.0-beta.0 | passed | 6 | 154.22 | 150.10–155.38 | 1.22% |
| medium module graph / threads | baseline: 0.12.6 | passed | 6 | 138.55 | 136.07–141.48 | 1.60% |
| medium module graph / threads | candidate: 1.0.0-beta.0 | passed | 6 | 138.71 | 134.04–140.56 | 1.88% |
| medium module graph / vmForks | baseline: 0.12.6 | passed | 6 | 217.97 | 212.25–220.03 | 1.31% |
| medium module graph / vmForks | candidate: 1.0.0-beta.0 | passed | 6 | 213.64 | 209.13–218.01 | 1.68% |
| medium module graph / vmThreads | baseline: 0.12.6 | passed | 6 | 192.30 | 189.58–196.40 | 1.19% |
| medium module graph / vmThreads | candidate: 1.0.0-beta.0 | passed | 6 | 188.10 | 183.19–191.80 | 1.66% |
| large module graph / forks | baseline: 0.12.6 | passed | 6 | 254.82 | 248.72–261.43 | 1.91% |
| large module graph / forks | candidate: 1.0.0-beta.0 | passed | 6 | 247.86 | 236.28–251.10 | 2.37% |
| large module graph / threads | baseline: 0.12.6 | passed | 6 | 232.79 | 229.57–238.38 | 1.32% |
| large module graph / threads | candidate: 1.0.0-beta.0 | passed | 6 | 218.76 | 212.85–226.23 | 2.26% |
| large module graph / vmForks | baseline: 0.12.6 | passed | 6 | 394.97 | 390.10–399.95 | 0.99% |
| large module graph / vmForks | candidate: 1.0.0-beta.0 | passed | 6 | 412.61 | 398.70–415.43 | 1.68% |
| large module graph / vmThreads | baseline: 0.12.6 | passed | 6 | 368.40 | 360.09–415.92 | 6.03% |
| large module graph / vmThreads | candidate: 1.0.0-beta.0 | passed | 6 | 377.44 | 372.34–403.57 | 3.28% |

## Inputs and provenance

- `reports/data/ci-versions-2026-11-20T09-33-02-331Z-4d112db7-baseline-pools.json`: 2026-11-20T09:33:02.351Z; Node v26.13.0; Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64; lockfile SHA-256: 7123888d5cfe1ee770452ece3fca53bf0702544ea23a11b4dce7557cace858c1. Source: npm / 0.12.6; fingerprint: 7d901a930ef93f885c74f9d3e8ab22dbdaef06698b4f32a0611c98105e956bde.
- `reports/data/ci-versions-2026-11-20T09-33-02-723Z-e3921e12-candidate-pools.json`: 2026-11-20T09:33:02.744Z; Node v26.13.0; Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64; lockfile SHA-256: 3189e3bdf680f02ef94d8e8b29067aec01e6af202664c2dd6bec30d13e046561. Source: npm / 1.0.0-beta.0; fingerprint: 22c18089a7d8dc72e12a16256816f9dace6407187ca2d943a0df1e79ab08b28a.

Published inputs retain every sample, warmup, test count, timestamp and compatibility fingerprint. Full logs, commands and source snapshots are stored separately; meta.publication.sourceSha256 identifies the original result JSON.
Versions are measured in paired case/round order, alternating the first side each round and fixture. No benchmark processes overlap. Workload dependencies, fixtures, configurations, harness and host compatibility are checked before calculating changes.

# coverage: 0.12.6 vs 1.0.0-beta.0

Source: [GitHub Actions](https://github.com/rstackjs/rstest-benchmarks/actions/runs/44705244270), commit `ac4d313ba287853df47348ad44b1f1f2f6b11a5b`, attempt 1.

Sources: baseline: **0.12.6** (npm); candidate: **1.0.0-beta.0** (npm). Measured 2026-11-20 (UTC); Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64, Node v26.13.0.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 15 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

Generated from raw samples. Change = (candidate / baseline − 1) × 100%; negative means faster. The first value column is the baseline. Values display two decimal places; changes use unrounded medians. All repetitions are retained; combined batches use the median of pooled samples, not the median of batch medians.

🏆 marks the lowest comparable median in each row. Percentages show change from the baseline.

### Elapsed time (s)

| Case | baseline: 0.12.6 | candidate: 1.0.0-beta.0 |
| --- | --- | --- |
| barrel graph · medium / none | 1.04s | **🏆 0.92s** (-12.02%) |
| barrel graph · medium / v8 | 1.44s | **🏆 1.29s** (-10.10%) |
| barrel graph · medium / istanbul | 1.14s | **🏆 1.02s** (-10.08%) |
| barrel graph · large / none | 1.05s | **🏆 0.89s** (-15.31%) |
| barrel graph · large / v8 | 1.45s | **🏆 1.31s** (-9.46%) |
| barrel graph · large / istanbul | 1.14s | **🏆 1.03s** (-9.55%) |
| Node dependencies and service logic / none | 2.28s | **🏆 2.27s** (-0.25%) |
| Node dependencies and service logic / v8 | 3.39s | **🏆 3.12s** (-7.79%) |
| Node dependencies and service logic / istanbul | 2.68s | **🏆 2.40s** (-10.57%) |
| Node module graph / none | 2.93s | **🏆 2.63s** (-10.36%) |
| Node module graph / v8 | 4.73s | **🏆 3.97s** (-16.12%) |
| Node module graph / istanbul | 3.88s | **🏆 3.40s** (-12.52%) |
| React + jsdom / none | 11.58s | **🏆 10.47s** (-9.59%) |
| React + jsdom / v8 | 14.12s | **🏆 12.26s** (-13.15%) |
| React + jsdom / istanbul | 11.97s | **🏆 11.01s** (-8.02%) |

### Memory comparison (MiB, peak process-tree footprint)

| Case | baseline: 0.12.6 | candidate: 1.0.0-beta.0 |
| --- | --- | --- |
| barrel graph · medium / none | 138.28 | **🏆 136.69** (-1.15%) |
| barrel graph · medium / v8 | 147.39 | **🏆 146.35** (-0.71%) |
| barrel graph · medium / istanbul | 169.18 | **🏆 166.79** (-1.41%) |
| barrel graph · large / none | 145.53 | **🏆 144.82** (-0.49%) |
| barrel graph · large / v8 | 156.76 | **🏆 155.91** (-0.54%) |
| barrel graph · large / istanbul | **🏆 177.32** | 179.14 (+1.03%) |
| Node dependencies and service logic / none | **🏆 162.51** | 168.19 (+3.50%) |
| Node dependencies and service logic / v8 | 178.00 | **🏆 175.82** (-1.23%) |
| Node dependencies and service logic / istanbul | **🏆 191.72** | 197.90 (+3.22%) |
| Node module graph / none | 154.67 | **🏆 153.90** (-0.50%) |
| Node module graph / v8 | 216.58 | **🏆 215.14** (-0.67%) |
| Node module graph / istanbul | 240.72 | **🏆 223.84** (-7.01%) |
| React + jsdom / none | 606.32 | **🏆 421.81** (-30.43%) |
| React + jsdom / v8 | 604.84 | **🏆 424.55** (-29.81%) |
| React + jsdom / istanbul | 626.06 | **🏆 444.62** (-28.98%) |

## Variability

MAD is unscaled. CV uses sample standard deviation (n − 1). Evaluate CV together with absolute SD and range before deciding whether a fluctuation warrants a rerun. Small sample counts do not establish a regression. Failed or incomplete batches never receive a speedup percentage.

| Case | Column | Status | n | Median | Min–max | MAD | SD | CV | Files | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| barrel graph · medium / none | baseline: 0.12.6 | passed | 6 | 1.04s | 1.00s–1.09s | 0.03s | 0.04s | 3.59% | 20 | 40 |
| barrel graph · medium / none | candidate: 1.0.0-beta.0 | passed | 6 | 0.92s | 0.89s–0.96s | 0.02s | 0.03s | 2.74% | 20 | 40 |
| barrel graph · medium / v8 | baseline: 0.12.6 | passed | 6 | 1.44s | 1.37s–1.66s | 0.03s | 0.10s | 7.06% | 20 | 40 |
| barrel graph · medium / v8 | candidate: 1.0.0-beta.0 | passed | 6 | 1.29s | 1.26s–1.33s | 0.01s | 0.02s | 1.89% | 20 | 40 |
| barrel graph · medium / istanbul | baseline: 0.12.6 | passed | 6 | 1.14s | 1.06s–1.22s | 0.04s | 0.05s | 4.76% | 20 | 40 |
| barrel graph · medium / istanbul | candidate: 1.0.0-beta.0 | passed | 6 | 1.02s | 0.99s–1.05s | 0.03s | 0.03s | 2.68% | 20 | 40 |
| barrel graph · large / none | baseline: 0.12.6 | passed | 6 | 1.05s | 1.01s–1.07s | 0.01s | 0.02s | 2.19% | 20 | 40 |
| barrel graph · large / none | candidate: 1.0.0-beta.0 | passed | 6 | 0.89s | 0.87s–1.04s | 0.02s | 0.06s | 6.98% | 20 | 40 |
| barrel graph · large / v8 | baseline: 0.12.6 | passed | 6 | 1.45s | 1.40s–1.51s | 0.02s | 0.04s | 2.60% | 20 | 40 |
| barrel graph · large / v8 | candidate: 1.0.0-beta.0 | passed | 6 | 1.31s | 1.27s–1.45s | 0.03s | 0.07s | 5.49% | 20 | 40 |
| barrel graph · large / istanbul | baseline: 0.12.6 | passed | 6 | 1.14s | 1.12s–1.34s | 0.02s | 0.09s | 7.99% | 20 | 40 |
| barrel graph · large / istanbul | candidate: 1.0.0-beta.0 | passed | 6 | 1.03s | 1.00s–1.16s | 0.03s | 0.07s | 6.17% | 20 | 40 |
| Node dependencies and service logic / none | baseline: 0.12.6 | passed | 6 | 2.28s | 2.13s–3.31s | 0.11s | 0.47s | 18.88% | 16 | 45 |
| Node dependencies and service logic / none | candidate: 1.0.0-beta.0 | passed | 6 | 2.27s | 1.80s–2.87s | 0.44s | 0.45s | 19.78% | 16 | 45 |
| Node dependencies and service logic / v8 | baseline: 0.12.6 | passed | 6 | 3.39s | 2.89s–3.84s | 0.06s | 0.30s | 9.02% | 16 | 45 |
| Node dependencies and service logic / v8 | candidate: 1.0.0-beta.0 | passed | 6 | 3.12s | 2.80s–3.77s | 0.24s | 0.37s | 11.67% | 16 | 45 |
| Node dependencies and service logic / istanbul | baseline: 0.12.6 | passed | 6 | 2.68s | 2.36s–3.49s | 0.16s | 0.41s | 15.07% | 16 | 45 |
| Node dependencies and service logic / istanbul | candidate: 1.0.0-beta.0 | passed | 6 | 2.40s | 2.13s–3.01s | 0.20s | 0.38s | 14.96% | 16 | 45 |
| Node module graph / none | baseline: 0.12.6 | passed | 6 | 2.93s | 2.26s–4.25s | 0.47s | 0.74s | 24.60% | 40 | 122 |
| Node module graph / none | candidate: 1.0.0-beta.0 | passed | 6 | 2.63s | 2.32s–2.91s | 0.03s | 0.19s | 7.16% | 40 | 122 |
| Node module graph / v8 | baseline: 0.12.6 | passed | 6 | 4.73s | 3.74s–5.29s | 0.51s | 0.70s | 15.13% | 40 | 122 |
| Node module graph / v8 | candidate: 1.0.0-beta.0 | passed | 6 | 3.97s | 3.09s–4.71s | 0.50s | 0.61s | 15.87% | 40 | 122 |
| Node module graph / istanbul | baseline: 0.12.6 | passed | 6 | 3.88s | 3.40s–4.25s | 0.26s | 0.32s | 8.31% | 40 | 122 |
| Node module graph / istanbul | candidate: 1.0.0-beta.0 | passed | 6 | 3.40s | 2.47s–4.08s | 0.41s | 0.59s | 18.18% | 40 | 122 |
| React + jsdom / none | baseline: 0.12.6 | passed | 6 | 11.58s | 9.53s–12.81s | 0.81s | 1.21s | 10.74% | 30 | 54 |
| React + jsdom / none | candidate: 1.0.0-beta.0 | passed | 6 | 10.47s | 9.33s–13.79s | 1.07s | 1.75s | 16.03% | 30 | 54 |
| React + jsdom / v8 | baseline: 0.12.6 | passed | 6 | 14.12s | 12.06s–16.55s | 0.34s | 1.45s | 10.23% | 30 | 54 |
| React + jsdom / v8 | candidate: 1.0.0-beta.0 | passed | 6 | 12.26s | 10.98s–14.05s | 0.93s | 1.22s | 9.77% | 30 | 54 |
| React + jsdom / istanbul | baseline: 0.12.6 | passed | 6 | 11.97s | 9.94s–16.19s | 0.69s | 2.09s | 16.81% | 30 | 54 |
| React + jsdom / istanbul | candidate: 1.0.0-beta.0 | passed | 6 | 11.01s | 10.01s–11.43s | 0.32s | 0.53s | 4.86% | 30 | 54 |

## Memory

Peak process-tree physical footprint in MiB (macOS `phys_footprint`, summed every ~50 ms).

| Case | Column | Status | n | Median MiB | Min–max MiB | CV |
| --- | --- | --- | --- | --- | --- | --- |
| barrel graph · medium / none | baseline: 0.12.6 | passed | 6 | 138.28 | 135.57–139.62 | 1.07% |
| barrel graph · medium / none | candidate: 1.0.0-beta.0 | passed | 6 | 136.69 | 134.06–138.47 | 1.42% |
| barrel graph · medium / v8 | baseline: 0.12.6 | passed | 6 | 147.39 | 144.24–149.68 | 1.24% |
| barrel graph · medium / v8 | candidate: 1.0.0-beta.0 | passed | 6 | 146.35 | 143.62–148.52 | 1.28% |
| barrel graph · medium / istanbul | baseline: 0.12.6 | passed | 6 | 169.18 | 165.99–171.07 | 1.10% |
| barrel graph · medium / istanbul | candidate: 1.0.0-beta.0 | passed | 6 | 166.79 | 165.40–168.51 | 0.70% |
| barrel graph · large / none | baseline: 0.12.6 | passed | 6 | 145.53 | 141.87–147.93 | 1.43% |
| barrel graph · large / none | candidate: 1.0.0-beta.0 | passed | 6 | 144.82 | 140.52–148.28 | 1.93% |
| barrel graph · large / v8 | baseline: 0.12.6 | passed | 6 | 156.76 | 154.60–163.71 | 2.08% |
| barrel graph · large / v8 | candidate: 1.0.0-beta.0 | passed | 6 | 155.91 | 149.72–157.69 | 1.86% |
| barrel graph · large / istanbul | baseline: 0.12.6 | passed | 6 | 177.32 | 173.57–178.02 | 0.95% |
| barrel graph · large / istanbul | candidate: 1.0.0-beta.0 | passed | 6 | 179.14 | 174.10–183.71 | 1.84% |
| Node dependencies and service logic / none | baseline: 0.12.6 | passed | 6 | 162.51 | 160.78–170.91 | 2.30% |
| Node dependencies and service logic / none | candidate: 1.0.0-beta.0 | passed | 6 | 168.19 | 161.73–171.26 | 2.09% |
| Node dependencies and service logic / v8 | baseline: 0.12.6 | passed | 6 | 178.00 | 174.66–183.35 | 1.73% |
| Node dependencies and service logic / v8 | candidate: 1.0.0-beta.0 | passed | 6 | 175.82 | 171.66–180.36 | 1.76% |
| Node dependencies and service logic / istanbul | baseline: 0.12.6 | passed | 6 | 191.72 | 187.40–202.11 | 2.70% |
| Node dependencies and service logic / istanbul | candidate: 1.0.0-beta.0 | passed | 6 | 197.90 | 197.00–207.16 | 1.97% |
| Node module graph / none | baseline: 0.12.6 | passed | 6 | 154.67 | 153.86–156.55 | 0.66% |
| Node module graph / none | candidate: 1.0.0-beta.0 | passed | 6 | 153.90 | 150.97–156.40 | 1.30% |
| Node module graph / v8 | baseline: 0.12.6 | passed | 6 | 216.58 | 187.03–226.90 | 8.42% |
| Node module graph / v8 | candidate: 1.0.0-beta.0 | passed | 6 | 215.14 | 194.00–227.50 | 5.30% |
| Node module graph / istanbul | baseline: 0.12.6 | passed | 6 | 240.72 | 230.88–243.53 | 2.02% |
| Node module graph / istanbul | candidate: 1.0.0-beta.0 | passed | 6 | 223.84 | 212.75–229.20 | 2.80% |
| React + jsdom / none | baseline: 0.12.6 | passed | 6 | 606.32 | 590.02–614.71 | 1.48% |
| React + jsdom / none | candidate: 1.0.0-beta.0 | passed | 6 | 421.81 | 415.77–432.32 | 1.41% |
| React + jsdom / v8 | baseline: 0.12.6 | passed | 6 | 604.84 | 591.04–632.40 | 2.42% |
| React + jsdom / v8 | candidate: 1.0.0-beta.0 | passed | 6 | 424.55 | 412.37–429.47 | 1.48% |
| React + jsdom / istanbul | baseline: 0.12.6 | passed | 6 | 626.06 | 612.85–638.98 | 1.56% |
| React + jsdom / istanbul | candidate: 1.0.0-beta.0 | passed | 6 | 444.62 | 422.90–454.61 | 3.17% |

## Inputs and provenance

- `reports/data/ci-version-coverage-merged-2026-11-20T09-09-54-873Z-baseline-coverage.json`: 2026-11-20T08:52:55.148Z; Node v26.13.0; Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64; lockfile SHA-256: 7123888d5cfe1ee770452ece3fca53bf0702544ea23a11b4dce7557cace858c1. Source: npm / 0.12.6; fingerprint: 7d901a930ef93f885c74f9d3e8ab22dbdaef06698b4f32a0611c98105e956bde.
- `reports/data/ci-version-coverage-merged-2026-11-20T09-09-54-873Z-candidate-coverage.json`: 2026-11-20T08:52:55.542Z; Node v26.13.0; Apple M1 (Virtual) × 3; logical CPUs: 3; available parallelism: 3; darwin arm64; lockfile SHA-256: 3189e3bdf680f02ef94d8e8b29067aec01e6af202664c2dd6bec30d13e046561. Source: npm / 1.0.0-beta.0; fingerprint: 22c18089a7d8dc72e12a16256816f9dace6407187ca2d943a0df1e79ab08b28a.

Published inputs retain every sample, warmup, test count, timestamp and compatibility fingerprint. Full logs, commands and source snapshots are stored separately; meta.publication.sourceSha256 identifies the original result JSON.
Versions are measured in paired case/round order, alternating the first side each round and fixture. No benchmark processes overlap. Workload dependencies, fixtures, configurations, harness and host compatibility are checked before calculating changes.

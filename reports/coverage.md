# coverage: 0.11.0 vs 0.12.6

Sources: baseline: **0.11.0** (npm); candidate: **0.12.6** (npm). Measured 2026-11-06 (UTC); Apple M4 Max × 14, darwin arm64, Node v24.11.1.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 15 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

Generated from raw samples. Change = (candidate / baseline − 1) × 100%; negative means faster. The first column is the baseline. All repetitions are retained; combined batches use the median of pooled samples, not the median of batch medians.

| Case | baseline: 0.11.0 | candidate: 0.12.6 | Notes |
| --- | --- | --- | --- |
| Node module graph / none | 0.667s | 0.700s (+5.0%) | — |
| Node module graph / v8 | 1.322s | 1.082s (**-18.1%**) | — |
| Node module graph / istanbul | 0.991s | 0.864s (**-12.8%**) | — |
| Node dependencies and service logic / none | 0.576s | 0.616s (+7.0%) | — |
| Node dependencies and service logic / v8 | 0.824s | 0.789s (**-4.2%**) | — |
| Node dependencies and service logic / istanbul | 0.690s | 0.652s (**-5.6%**) | high variation (CV > 10%) |
| React + jsdom / none | 3.683s | 1.857s (**-49.6%**) | high variation (CV > 10%) |
| React + jsdom / v8 | 4.184s | 2.270s (**-45.8%**) | — |
| React + jsdom / istanbul | 4.041s | 1.991s (**-50.7%**) | high variation (CV > 10%) |
| barrel graph · medium / none | 0.407s | 0.435s (+7.0%) | — |
| barrel graph · medium / v8 | 0.631s | 0.620s (**-1.8%**) | high variation (CV > 10%) |
| barrel graph · medium / istanbul | 0.531s | 0.497s (**-6.4%**) | high variation (CV > 10%) |
| barrel graph · large / none | 0.439s | 0.446s (+1.6%) | — |
| barrel graph · large / v8 | 0.637s | 0.612s (**-4.0%**) | high variation (CV > 10%) |
| barrel graph · large / istanbul | 0.590s | 0.518s (**-12.3%**) | high variation (CV > 10%) |

## Variability

MAD is unscaled. CV uses sample standard deviation (n − 1). CV > 10% is flagged as high variation, not as a significance test; small sample counts do not establish a regression. Failed or incomplete batches never receive a speedup percentage.

| Case | Column | Status | n | Median | Min–max | MAD | CV | Files | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Node module graph / none | baseline: 0.11.0 | passed | 6 | 0.667s | 0.638s–0.679s | 0.006s | 2.2% | 40 | 122 |
| Node module graph / none | candidate: 0.12.6 | passed | 6 | 0.700s | 0.664s–0.736s | 0.031s | 4.3% | 40 | 122 |
| Node module graph / v8 | baseline: 0.11.0 | passed | 6 | 1.322s | 1.248s–1.364s | 0.026s | 3.2% | 40 | 122 |
| Node module graph / v8 | candidate: 0.12.6 | passed | 6 | 1.082s | 1.064s–1.246s | 0.017s | 6.7% | 40 | 122 |
| Node module graph / istanbul | baseline: 0.11.0 | passed | 6 | 0.991s | 0.965s–0.999s | 0.006s | 1.3% | 40 | 122 |
| Node module graph / istanbul | candidate: 0.12.6 | passed | 6 | 0.864s | 0.817s–0.940s | 0.041s | 5.5% | 40 | 122 |
| Node dependencies and service logic / none | baseline: 0.11.0 | passed | 6 | 0.576s | 0.562s–0.594s | 0.012s | 2.2% | 16 | 45 |
| Node dependencies and service logic / none | candidate: 0.12.6 | passed | 6 | 0.616s | 0.598s–0.737s | 0.010s | 8.2% | 16 | 45 |
| Node dependencies and service logic / v8 | baseline: 0.11.0 | passed | 6 | 0.824s | 0.805s–0.868s | 0.016s | 3.0% | 16 | 45 |
| Node dependencies and service logic / v8 | candidate: 0.12.6 | passed | 6 | 0.789s | 0.768s–0.801s | 0.012s | 2.0% | 16 | 45 |
| Node dependencies and service logic / istanbul | baseline: 0.11.0 | passed | 6 | 0.690s | 0.658s–1.012s | 0.022s | 17.9% | 16 | 45 |
| Node dependencies and service logic / istanbul | candidate: 0.12.6 | passed | 6 | 0.652s | 0.636s–0.738s | 0.016s | 5.9% | 16 | 45 |
| React + jsdom / none | baseline: 0.11.0 | passed | 6 | 3.683s | 3.678s–5.245s | 0.006s | 15.7% | 30 | 54 |
| React + jsdom / none | candidate: 0.12.6 | passed | 6 | 1.857s | 1.798s–1.971s | 0.042s | 3.4% | 30 | 54 |
| React + jsdom / v8 | baseline: 0.11.0 | passed | 6 | 4.184s | 4.014s–4.377s | 0.067s | 3.0% | 30 | 54 |
| React + jsdom / v8 | candidate: 0.12.6 | passed | 6 | 2.270s | 2.203s–2.428s | 0.039s | 3.7% | 30 | 54 |
| React + jsdom / istanbul | baseline: 0.11.0 | passed | 6 | 4.041s | 3.727s–5.712s | 0.242s | 17.3% | 30 | 54 |
| React + jsdom / istanbul | candidate: 0.12.6 | passed | 6 | 1.991s | 1.878s–2.156s | 0.067s | 5.0% | 30 | 54 |
| barrel graph · medium / none | baseline: 0.11.0 | passed | 6 | 0.407s | 0.392s–0.427s | 0.012s | 3.4% | 20 | 40 |
| barrel graph · medium / none | candidate: 0.12.6 | passed | 6 | 0.435s | 0.421s–0.472s | 0.008s | 4.1% | 20 | 40 |
| barrel graph · medium / v8 | baseline: 0.11.0 | passed | 6 | 0.631s | 0.597s–0.859s | 0.031s | 15.8% | 20 | 40 |
| barrel graph · medium / v8 | candidate: 0.12.6 | passed | 6 | 0.620s | 0.579s–0.760s | 0.034s | 10.5% | 20 | 40 |
| barrel graph · medium / istanbul | baseline: 0.11.0 | passed | 6 | 0.531s | 0.519s–0.884s | 0.012s | 24.3% | 20 | 40 |
| barrel graph · medium / istanbul | candidate: 0.12.6 | passed | 6 | 0.497s | 0.480s–0.507s | 0.005s | 1.9% | 20 | 40 |
| barrel graph · large / none | baseline: 0.11.0 | passed | 6 | 0.439s | 0.414s–0.451s | 0.004s | 2.9% | 20 | 40 |
| barrel graph · large / none | candidate: 0.12.6 | passed | 6 | 0.446s | 0.423s–0.519s | 0.017s | 7.7% | 20 | 40 |
| barrel graph · large / v8 | baseline: 0.11.0 | passed | 6 | 0.637s | 0.605s–0.656s | 0.014s | 3.1% | 20 | 40 |
| barrel graph · large / v8 | candidate: 0.12.6 | passed | 6 | 0.612s | 0.577s–0.750s | 0.029s | 12.1% | 20 | 40 |
| barrel graph · large / istanbul | baseline: 0.11.0 | passed | 6 | 0.590s | 0.537s–0.693s | 0.050s | 10.1% | 20 | 40 |
| barrel graph · large / istanbul | candidate: 0.12.6 | passed | 6 | 0.518s | 0.514s–0.528s | 0.004s | 1.2% | 20 | 40 |

## Memory

OS `/usr/bin/time` maxrss in MiB; not a simultaneous process-tree peak.

| Case | Column | Status | n | Median MiB | Min–max MiB | CV |
| --- | --- | --- | --- | --- | --- | --- |
| Node module graph / none | baseline: 0.11.0 | passed | 6 | 202.4 | 201.3–203.7 | 0.4% |
| Node module graph / none | candidate: 0.12.6 | passed | 6 | 211.6 | 210.4–215.2 | 0.9% |
| Node module graph / v8 | baseline: 0.11.0 | passed | 6 | 422.5 | 413.3–425.2 | 1.0% |
| Node module graph / v8 | candidate: 0.12.6 | passed | 6 | 345.4 | 338.1–353.5 | 1.7% |
| Node module graph / istanbul | baseline: 0.11.0 | passed | 6 | 304.6 | 297.5–306.4 | 1.1% |
| Node module graph / istanbul | candidate: 0.12.6 | passed | 6 | 336.7 | 332.3–341.5 | 1.1% |
| Node dependencies and service logic / none | baseline: 0.11.0 | passed | 6 | 169.9 | 165.2–173.8 | 1.7% |
| Node dependencies and service logic / none | candidate: 0.12.6 | passed | 6 | 179.9 | 174.2–181.5 | 1.6% |
| Node dependencies and service logic / v8 | baseline: 0.11.0 | passed | 6 | 213.0 | 210.8–214.7 | 0.6% |
| Node dependencies and service logic / v8 | candidate: 0.12.6 | passed | 6 | 215.5 | 206.6–220.0 | 2.4% |
| Node dependencies and service logic / istanbul | baseline: 0.11.0 | passed | 6 | 210.0 | 208.0–213.0 | 0.8% |
| Node dependencies and service logic / istanbul | candidate: 0.12.6 | passed | 6 | 218.6 | 215.8–221.5 | 1.0% |
| React + jsdom / none | baseline: 0.11.0 | passed | 6 | 538.5 | 460.3–590.6 | 9.1% |
| React + jsdom / none | candidate: 0.12.6 | passed | 6 | 535.9 | 520.6–546.6 | 2.0% |
| React + jsdom / v8 | baseline: 0.11.0 | passed | 6 | 751.0 | 722.2–797.3 | 3.8% |
| React + jsdom / v8 | candidate: 0.12.6 | passed | 6 | 744.1 | 698.6–758.0 | 3.5% |
| React + jsdom / istanbul | baseline: 0.11.0 | passed | 6 | 461.5 | 453.3–477.5 | 1.9% |
| React + jsdom / istanbul | candidate: 0.12.6 | passed | 6 | 575.4 | 557.7–580.0 | 1.6% |
| barrel graph · medium / none | baseline: 0.11.0 | passed | 6 | 173.4 | 169.8–175.1 | 1.2% |
| barrel graph · medium / none | candidate: 0.12.6 | passed | 6 | 181.2 | 179.6–185.5 | 1.2% |
| barrel graph · medium / v8 | baseline: 0.11.0 | passed | 6 | 202.5 | 196.6–203.2 | 1.3% |
| barrel graph · medium / v8 | candidate: 0.12.6 | passed | 6 | 203.3 | 200.8–206.1 | 1.1% |
| barrel graph · medium / istanbul | baseline: 0.11.0 | passed | 6 | 213.2 | 210.0–215.3 | 0.9% |
| barrel graph · medium / istanbul | candidate: 0.12.6 | passed | 6 | 219.6 | 214.9–222.5 | 1.4% |
| barrel graph · large / none | baseline: 0.11.0 | passed | 6 | 181.8 | 176.0–186.3 | 1.9% |
| barrel graph · large / none | candidate: 0.12.6 | passed | 6 | 188.9 | 185.8–193.8 | 1.5% |
| barrel graph · large / v8 | baseline: 0.11.0 | passed | 6 | 208.6 | 208.0–212.7 | 0.9% |
| barrel graph · large / v8 | candidate: 0.12.6 | passed | 6 | 220.0 | 214.0–226.8 | 1.9% |
| barrel graph · large / istanbul | baseline: 0.11.0 | passed | 6 | 220.1 | 217.5–223.3 | 0.9% |
| barrel graph · large / istanbul | candidate: 0.12.6 | passed | 6 | 231.3 | 224.9–234.0 | 1.6% |

## Inputs and provenance

- `reports/data/releases-0110-0126-2026-11-06T03-38-14-514Z-06dbc7cd-baseline-coverage.json`: 2026-11-06T03:38:14.532Z; Node v24.11.1; Apple M4 Max × 14; darwin arm64; lockfile SHA-256: 7f35af5876a5c68b2da3985e75cf92db3f4ae3891a513ba7c354e587e09b8421. Source: npm / 0.11.0; fingerprint: 27da13cc2b4ab0a6ce1f46eab28f7cf323a8fce1a7074ae84c2b26d151792f8c.
- `reports/data/releases-0110-0126-2026-11-06T03-38-16-748Z-631fde57-candidate-coverage.json`: 2026-11-06T03:38:16.765Z; Node v24.11.1; Apple M4 Max × 14; darwin arm64; lockfile SHA-256: 7123888d5cfe1ee770452ece3fca53bf0702544ea23a11b4dce7557cace858c1. Source: npm / 0.12.6; fingerprint: 7d901a930ef93f885c74f9d3e8ab22dbdaef06698b4f32a0611c98105e956bde.

Published inputs retain every sample, warmup, test count, timestamp and compatibility fingerprint. Full logs, commands and source snapshots are stored separately; meta.publication.sourceSha256 identifies the original result JSON.
Versions are measured in paired case/round order, alternating the first side each round and fixture. No benchmark processes overlap. Workload dependencies, fixtures, configurations, harness and host compatibility are checked before calculating changes.

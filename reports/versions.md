# main: 0.11.0 vs 0.12.6

Sources: baseline: **0.11.0** (npm); candidate: **0.12.6** (npm). Measured 2026-11-06 (UTC); Apple M4 Max × 14, darwin arm64, Node v24.11.1.

1 warmup(s) and **6 timed runs per supported case**; medians are reported. 10 selected cases. Every candidate percentage is relative to the baseline; negative means less elapsed time.

Sources run sequentially in rotating case/round order. For cases supported by all sources, each source occupies every order position equally often. Node compile cache is disabled. Rstest build and sequencing caches are cleared before each fixture's warmups and retained during measurement. Workload dependency graphs match. Background load and OS page cache are not controlled.

Generated from raw samples. Change = (candidate / baseline − 1) × 100%; negative means faster. The first column is the baseline. All repetitions are retained; combined batches use the median of pooled samples, not the median of batch medians.

| Case | baseline: 0.11.0 | candidate: 0.12.6 | Notes |
| --- | --- | --- | --- |
| Node startup and utilities | 0.252s | 0.273s (+8.4%) | — |
| Node module graph | 0.608s | 0.694s (+14.2%) | high variation (CV > 10%) |
| Node dependencies and service logic | 0.532s | 0.561s (+5.5%) | — |
| React + jsdom | 3.625s | 1.717s (**-52.6%**) | high variation (CV > 10%) |
| React + happy-dom | 1.955s | 1.020s (**-47.8%**) | high variation (CV > 10%) |
| React + browser mode | 1.382s | 1.422s (+2.9%) | high variation (CV > 10%) |
| Vue + jsdom | 2.631s | 1.480s (**-43.7%**) | high variation (CV > 10%) |
| Vue + happy-dom | 1.483s | 0.889s (**-40.1%**) | high variation (CV > 10%) |
| Vue + browser mode | SKIPPED | 1.310s | skipped / passed |
| barrel graph · medium | 0.439s | 0.475s (+8.0%) | — |

## Variability

MAD is unscaled. CV uses sample standard deviation (n − 1). CV > 10% is flagged as high variation, not as a significance test; small sample counts do not establish a regression. Failed or incomplete batches never receive a speedup percentage.

| Case | Column | Status | n | Median | Min–max | MAD | CV | Files | Tests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Node startup and utilities | baseline: 0.11.0 | passed | 6 | 0.252s | 0.242s–0.304s | 0.006s | 8.6% | 5 | 18 |
| Node startup and utilities | candidate: 0.12.6 | passed | 6 | 0.273s | 0.267s–0.285s | 0.006s | 2.9% | 5 | 18 |
| Node module graph | baseline: 0.11.0 | passed | 6 | 0.608s | 0.580s–0.797s | 0.019s | 12.9% | 40 | 122 |
| Node module graph | candidate: 0.12.6 | passed | 6 | 0.694s | 0.628s–0.772s | 0.053s | 8.7% | 40 | 122 |
| Node dependencies and service logic | baseline: 0.11.0 | passed | 6 | 0.532s | 0.528s–0.569s | 0.003s | 3.4% | 16 | 45 |
| Node dependencies and service logic | candidate: 0.12.6 | passed | 6 | 0.561s | 0.553s–0.612s | 0.006s | 3.8% | 16 | 45 |
| React + jsdom | baseline: 0.11.0 | passed | 6 | 3.625s | 3.480s–3.788s | 0.047s | 2.8% | 30 | 54 |
| React + jsdom | candidate: 0.12.6 | passed | 6 | 1.717s | 1.693s–2.811s | 0.024s | 23.0% | 30 | 54 |
| React + happy-dom | baseline: 0.11.0 | passed | 6 | 1.955s | 1.899s–2.397s | 0.054s | 9.8% | 30 | 54 |
| React + happy-dom | candidate: 0.12.6 | passed | 6 | 1.020s | 1.009s–6.014s | 0.007s | 110.1% | 30 | 54 |
| React + browser mode | baseline: 0.11.0 | passed | 6 | 1.382s | 1.344s–1.694s | 0.031s | 9.2% | 30 | 54 |
| React + browser mode | candidate: 0.12.6 | passed | 6 | 1.422s | 1.357s–1.919s | 0.063s | 14.4% | 30 | 54 |
| Vue + jsdom | baseline: 0.11.0 | passed | 6 | 2.631s | 2.519s–3.600s | 0.089s | 14.7% | 20 | 20 |
| Vue + jsdom | candidate: 0.12.6 | passed | 6 | 1.480s | 1.448s–2.251s | 0.031s | 19.4% | 20 | 20 |
| Vue + happy-dom | baseline: 0.11.0 | passed | 6 | 1.483s | 1.469s–4.226s | 0.012s | 56.1% | 20 | 20 |
| Vue + happy-dom | candidate: 0.12.6 | passed | 6 | 0.889s | 0.837s–3.049s | 0.034s | 68.9% | 20 | 20 |
| Vue + browser mode | baseline: 0.11.0 | skipped | 0 | — | —–— | — | — | 20 | unknown |
| Vue + browser mode | candidate: 0.12.6 | passed | 6 | 1.310s | 1.184s–2.023s | 0.100s | 22.5% | 20 | 20 |
| barrel graph · medium | baseline: 0.11.0 | passed | 6 | 0.439s | 0.416s–0.460s | 0.018s | 4.5% | 20 | 40 |
| barrel graph · medium | candidate: 0.12.6 | passed | 6 | 0.475s | 0.455s–0.507s | 0.014s | 4.2% | 20 | 40 |

## Inputs and provenance

- `reports/data/releases-0110-0126-2026-11-06T03-31-19-069Z-c8f4536f-baseline-main.json`: 2026-11-06T03:31:19.090Z; Node v24.11.1; Apple M4 Max × 14; darwin arm64; lockfile SHA-256: 7f35af5876a5c68b2da3985e75cf92db3f4ae3891a513ba7c354e587e09b8421. Source: npm / 0.11.0; fingerprint: 27da13cc2b4ab0a6ce1f46eab28f7cf323a8fce1a7074ae84c2b26d151792f8c.
- `reports/data/releases-0110-0126-2026-11-06T03-31-20-664Z-c3b4c790-candidate-main.json`: 2026-11-06T03:31:20.678Z; Node v24.11.1; Apple M4 Max × 14; darwin arm64; lockfile SHA-256: 7123888d5cfe1ee770452ece3fca53bf0702544ea23a11b4dce7557cace858c1. Source: npm / 0.12.6; fingerprint: 7d901a930ef93f885c74f9d3e8ab22dbdaef06698b4f32a0611c98105e956bde.

Published inputs retain every sample, warmup, test count, timestamp and compatibility fingerprint. Full logs, commands and source snapshots are stored separately; meta.publication.sourceSha256 identifies the original result JSON.
Versions are measured in paired case/round order, alternating the first side each round and fixture. No benchmark processes overlap. Workload dependencies, fixtures, configurations, harness and host compatibility are checked before calculating changes.

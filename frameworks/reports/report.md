# Frameworks benchmark

Status: **completed**. 2026-11-13T07:26:57.128Z. Node v26.13.0; Apple M4 Max; logical CPUs: 14; available parallelism: 14; darwin arm64.

Published packages: jest 30.5.2, vitest 5.1.0, vitest-vmForks 5.1.0, rstest 0.12.6, rstest-vmForks 0.12.6.

5 measured runs per framework/case/cache condition; medians. Each sample is a fresh process. Warm cache: one warmup after clearing caches; cold cache: cleared before every measured run. Node compile cache disabled; OS page cache and background load uncontrolled. Framework defaults, except explicitly named variants.

Memory is the peak of the summed macOS physical footprint (`phys_footprint`) over the benchmarked command's process tree, sampled every ~50 ms and excluding the benchmark driver; the table shows the median across runs in MiB. Elapsed time comes from a timing pass with no sampler running; memory comes from a separate pass that reruns the same command under the sampler with the same cache preparation. Installations and generation are outside timing. All samples retained.

🥇 and 🥈 mark the lowest and second-lowest distinct unrounded medians among complete results in each row; exact ties share the marker. They do not indicate statistical significance.

The repetition count does not evenly divide all framework counts; order rotates, but positions are not exactly balanced in those groups.

Jest transformer: @swc/jest 0.2.39; @swc/core 1.16.21. Shared React 19.2.7; jsdom 26.1.0.

| Workload | Test files | Tests |
| --- | --- | --- |
| minimal-node | 2 | 2 |
| minimal-react | 2 | 2 |
| startup | 5 | 18 |
| many-files | 400 | 800 |
| module-graph | 40 | 80 |
| backend | 16 | 45 |
| barrel | 20 | 40 |
| react | 30 | 54 |

## Unsupported combinations

- jest, vitest-vmForks, rstest-vmForks: No corresponding Chromium browser mode in this adapter. Affected: react (browser).

## Observed test workers

Distinct worker slots that executed test setup in each invocation, read from framework-assigned runtime IDs. Ranges span timed runs and cache conditions. These are observed slots, not configured limits or peak simultaneous workers; recycled processes do not add slots. In-process means tests ran in the Jest runner itself. Browser mode does not use Node test workers. Historical runs without observations show Not recorded.

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| minimal-node | 1–2 | 2 | 2 | 2 | 2 |
| minimal-react | 1–2 | 2 | 2 | 2 | 2 |
| startup | 1–5 | 5 | 5 | 5 | 5 |
| many-files | 13 | 13 | 13 | 13 | 13 |
| module-graph | 13 | 13 | 13 | 13 | 13 |
| backend | 1–13 | 13 | 13 | 13 | 13 |
| barrel | 13 | 13 | 13 | 13 | 13 |
| react | 13 | 13 | 13 | 13 | 13 |
| react (browser) | — | Browser mode | — | Browser mode | — |

## Cold framework cache

### Elapsed time

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| minimal-node | 0.33s | 0.27s | 0.29s | 🥇 0.21s | 🥈 0.22s |
| minimal-react | 0.62s | 0.51s | 0.50s | 🥈 0.47s | 🥇 0.46s |
| startup | 0.38s | 0.28s | 0.31s | 🥇 0.21s | 🥈 0.24s |
| many-files | 2.15s | 4.67s | 🥈 1.85s | 3.28s | 🥇 0.94s |
| module-graph | 4.02s | 3.15s | 2.68s | 🥈 0.80s | 🥇 0.59s |
| backend | 0.72s | 0.58s | 0.59s | 🥇 0.44s | 🥈 0.48s |
| barrel | 11.77s | 7.97s | 7.80s | 🥈 0.43s | 🥇 0.37s |
| react | 1.26s | 1.84s | 🥈 1.07s | 1.12s | 🥇 0.85s |
| react (browser) | — | 🥈 1.88s | — | 🥇 1.33s | — |

### Memory (MiB, process-tree footprint peak)

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| minimal-node | 277.49 | 🥇 100.82 | 128.45 | 🥈 107.48 | 139.47 |
| minimal-react | 395.36 | 🥇 253.42 | 🥈 275.20 | 423.07 | 426.56 |
| startup | 373.83 | 🥈 166.61 | 234.43 | 🥇 155.86 | 252.26 |
| many-files | 2199.37 | 🥈 613.07 | 2329.38 | 🥇 534.20 | 1349.10 |
| module-graph | 1993.77 | 1190.47 | 1828.53 | 🥇 806.43 | 🥈 1135.53 |
| backend | 1102.47 | 🥈 702.08 | 734.43 | 🥇 591.34 | 952.44 |
| barrel | 3522.33 | 2242.67 | 2376.27 | 🥇 285.76 | 🥈 557.81 |
| react | 1737.90 | 🥇 1394.42 | 1775.21 | 🥈 1599.71 | 1916.81 |
| react (browser) | — | 🥈 1888.79 | — | 🥇 743.86 | — |

## Warm framework cache

### Elapsed time

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| minimal-node | 🥇 0.19s | 0.21s | 0.23s | 🥈 0.21s | 0.23s |
| minimal-react | 🥈 0.42s | 0.47s | 0.48s | 🥇 0.41s | 0.45s |
| startup | 🥇 0.21s | 0.21s | 0.24s | 🥈 0.21s | 0.24s |
| many-files | 1.89s | 4.50s | 🥈 1.63s | 3.54s | 🥇 0.93s |
| module-graph | 1.29s | 1.89s | 1.47s | 🥈 0.69s | 🥇 0.53s |
| backend | 0.63s | 0.48s | 0.47s | 🥇 0.43s | 🥈 0.47s |
| barrel | 3.96s | 4.14s | 3.84s | 🥈 0.42s | 🥇 0.34s |
| react | 1.19s | 1.59s | 🥈 0.91s | 1.07s | 🥇 0.78s |
| react (browser) | — | 🥈 1.83s | — | 🥇 1.33s | — |

### Memory (MiB, process-tree footprint peak)

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| minimal-node | 🥇 52.29 | 🥈 101.42 | 128.81 | 102.01 | 137.84 |
| minimal-react | 🥇 126.34 | 🥈 249.54 | 283.30 | 408.09 | 416.54 |
| startup | 🥇 56.16 | 166.58 | 244.39 | 🥈 132.05 | 243.90 |
| many-files | 2200.93 | 🥈 577.02 | 2411.58 | 🥇 549.67 | 1371.60 |
| module-graph | 1825.50 | 1193.91 | 1822.79 | 🥇 781.96 | 🥈 1093.99 |
| backend | 🥇 221.73 | 621.27 | 728.31 | 🥈 594.15 | 967.85 |
| barrel | 2751.64 | 2267.95 | 2396.94 | 🥇 309.28 | 🥈 576.13 |
| react | 1644.10 | 🥇 1377.54 | 1664.50 | 🥈 1507.76 | 1874.34 |
| react (browser) | — | 🥈 1703.60 | — | 🥇 740.69 | — |

## Rstest phase timings

Medians in seconds from the reporter. Build includes run preparation and compilation; runtime includes worker scheduling, module loading, test execution and worker fixture cleanup. Process wall time also includes CLI startup and final teardown. Each column is an independent median and need not add up exactly.

| Cache / case | Pool | n | Build | Runtime | Process wall time |
| --- | --- | --- | --- | --- | --- |
| cold / minimal-node | Rstest | 5 | 0.02 | 0.06 | 0.21 |
| cold / minimal-node | Rstest vmForks | 5 | 0.02 | 0.08 | 0.22 |
| cold / minimal-react | Rstest | 5 | 0.00 | 0.24 | 0.47 |
| cold / minimal-react | Rstest vmForks | 5 | 0.00 | 0.24 | 0.46 |
| cold / startup | Rstest | 5 | 0.02 | 0.06 | 0.21 |
| cold / startup | Rstest vmForks | 5 | 0.02 | 0.09 | 0.24 |
| cold / many-files | Rstest | 5 | 0.22 | 2.85 | 3.28 |
| cold / many-files | Rstest vmForks | 5 | 0.16 | 0.52 | 0.94 |
| cold / module-graph | Rstest | 5 | 0.18 | 0.47 | 0.80 |
| cold / module-graph | Rstest vmForks | 5 | 0.14 | 0.30 | 0.59 |
| cold / backend | Rstest | 5 | 0.03 | 0.28 | 0.44 |
| cold / backend | Rstest vmForks | 5 | 0.03 | 0.31 | 0.48 |
| cold / barrel | Rstest | 5 | 0.10 | 0.17 | 0.43 |
| cold / barrel | Rstest vmForks | 5 | 0.04 | 0.16 | 0.37 |
| cold / react | Rstest | 5 | 0.00 | 0.87 | 1.12 |
| cold / react | Rstest vmForks | 5 | 0.00 | 0.53 | 0.85 |
| cold / react (browser) | Rstest | 5 | 0.26 | 0.86 | 1.33 |
| warm / minimal-node | Rstest | 5 | 0.02 | 0.06 | 0.21 |
| warm / minimal-node | Rstest vmForks | 5 | 0.02 | 0.09 | 0.23 |
| warm / minimal-react | Rstest | 5 | 0.00 | 0.20 | 0.41 |
| warm / minimal-react | Rstest vmForks | 5 | 0.00 | 0.23 | 0.45 |
| warm / startup | Rstest | 5 | 0.02 | 0.07 | 0.21 |
| warm / startup | Rstest vmForks | 5 | 0.02 | 0.09 | 0.24 |
| warm / many-files | Rstest | 5 | 0.21 | 2.95 | 3.54 |
| warm / many-files | Rstest vmForks | 5 | 0.18 | 0.50 | 0.93 |
| warm / module-graph | Rstest | 5 | 0.10 | 0.46 | 0.69 |
| warm / module-graph | Rstest vmForks | 5 | 0.10 | 0.28 | 0.53 |
| warm / backend | Rstest | 5 | 0.03 | 0.27 | 0.43 |
| warm / backend | Rstest vmForks | 5 | 0.03 | 0.30 | 0.47 |
| warm / barrel | Rstest | 5 | 0.09 | 0.15 | 0.42 |
| warm / barrel | Rstest vmForks | 5 | 0.04 | 0.15 | 0.34 |
| warm / react | Rstest | 5 | 0.00 | 0.82 | 1.07 |
| warm / react | Rstest vmForks | 5 | 0.00 | 0.51 | 0.78 |
| warm / react (browser) | Rstest | 5 | 0.28 | 0.86 | 1.33 |

## Samples and provenance

[Full variability](variability.md). See [result.json](result.json) for all samples, warmups, counts, cache actions, fixture/config hashes, resolved dependencies and coverage file inventories. Local commands, executable paths and log paths are omitted; cache paths are workspace-relative. publication.sourceSha256 identifies the original result. Full logs and source snapshots remain in the original run directory or CI artifact.

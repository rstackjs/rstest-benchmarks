# Frameworks benchmark

Status: **completed**. 2026-11-13T11:25:39.916Z. Node v26.13.0; Apple M1 (Virtual); logical CPUs: 3; available parallelism: 3; darwin arm64.

Source: [GitHub Actions](https://github.com/rstackjs/rstest-benchmarks/actions/runs/43416806164), commit `00b730456da32b416828f52cd18dffd17bbe9b70`, attempt 1; runner GitHub Actions 1000234580, GitHub Actions 1000234587, GitHub Actions 1000234584, GitHub Actions 1000234581, GitHub Actions 1000234591, GitHub Actions 1000234579, GitHub Actions 1000234590, GitHub Actions 1000234582, GitHub Actions 1000234585, image 20261104.0514.1.

Published packages: jest 30.5.2, vitest 5.1.0, vitest-vmForks 5.1.0, rstest 0.12.6, rstest-vmForks 0.12.6.

5 measured runs per framework/case/cache condition; medians. Each sample is a fresh process. Warm cache: one warmup after clearing caches; cold cache: cleared before every measured run. Node compile cache disabled; OS page cache and background load uncontrolled. Framework defaults, except explicitly named variants.

Memory is the peak of the summed macOS physical footprint (`phys_footprint`) over the benchmarked command's process tree, sampled every ~50 ms and excluding the benchmark driver; the table shows the median across runs in MiB. Elapsed time comes from a timing pass with no sampler running; memory comes from a separate pass that reruns the same command under the sampler with the same cache preparation. Installations and generation are outside timing. All samples retained.

🥇 and 🥈 mark the lowest and second-lowest distinct unrounded medians among complete results in each row; exact ties share the marker. They do not indicate statistical significance.

The repetition count does not evenly divide all framework counts; order rotates, but positions are not exactly balanced in those groups.

Jest transformer: @swc/jest 0.2.39; @swc/core 1.16.21. Shared React 19.2.7; jsdom 26.1.0.

| Workload | Test files | Tests |
| --- | --- | --- |
| backend | 16 | 45 |
| barrel | 20 | 40 |
| many-files | 400 | 800 |
| minimal-node | 2 | 2 |
| minimal-react | 2 | 2 |
| module-graph | 40 | 80 |
| react | 30 | 54 |
| startup | 5 | 18 |

## Unsupported combinations

- jest, vitest-vmForks, rstest-vmForks: No corresponding Chromium browser mode in this adapter. Affected: react (browser).

## Observed test workers

Distinct worker slots that executed test setup in each invocation, read from framework-assigned runtime IDs. Ranges span timed runs and cache conditions. These are observed slots, not configured limits or peak simultaneous workers; recycled processes do not add slots. In-process means tests ran in the Jest runner itself. Browser mode does not use Node test workers. Historical runs without observations show Not recorded.

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| backend | 1–2 | 2 | 2 | 2 | 2 |
| barrel | 2 | 2 | 2 | 2 | 2 |
| many-files | 2 | 2 | 2 | 2 | 2 |
| minimal-node | 1–2 | 2 | 2 | 2 | 2 |
| minimal-react | 1–2 | 2 | 2 | 2 | 2 |
| module-graph | 2 | 2 | 2 | 2 | 2 |
| react | 2 | 2 | 2 | 2 | 2 |
| react (browser) | — | Browser mode | — | Browser mode | — |
| startup | 1–2 | 2 | 2 | 2 | 2 |

## Cold framework cache

### Elapsed time

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| backend | 🥈 1.17s | 2.43s | 1.30s | 1.95s | 🥇 1.03s |
| barrel | 12.11s | 19.71s | 14.08s | 🥈 1.71s | 🥇 0.77s |
| many-files | 🥈 6.02s | 30.15s | 10.12s | 21.29s | 🥇 4.04s |
| minimal-node | 0.65s | 0.50s | 0.56s | 🥇 0.44s | 🥈 0.47s |
| minimal-react | 0.88s | 🥇 0.84s | 🥈 0.87s | 0.98s | 0.91s |
| module-graph | 5.32s | 11.02s | 6.74s | 🥈 4.05s | 🥇 2.58s |
| react | 🥈 1.80s | 6.79s | 1.91s | 5.76s | 🥇 1.77s |
| react (browser) | — | 🥇 4.36s | — | 🥈 5.79s | — |
| startup | 0.68s | 0.81s | 0.78s | 🥈 0.67s | 🥇 0.54s |

### Memory (MiB, process-tree footprint peak)

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| backend | 372.07 | 🥈 164.14 | 301.33 | 🥇 160.70 | 327.74 |
| barrel | 1094.01 | 567.95 | 1008.64 | 🥇 140.90 | 🥈 167.09 |
| many-files | 455.83 | 🥇 188.56 | 504.33 | 🥈 222.99 | 496.07 |
| minimal-node | 120.01 | 🥇 108.36 | 129.87 | 🥈 111.39 | 128.85 |
| minimal-react | 🥈 237.01 | 🥇 236.77 | 257.34 | 381.60 | 362.12 |
| module-graph | 570.64 | 🥈 300.20 | 628.19 | 🥇 275.06 | 457.91 |
| react | 481.96 | 🥇 267.51 | 476.24 | 🥈 412.78 | 597.65 |
| react (browser) | — | 🥈 916.64 | — | 🥇 360.63 | — |
| startup | 134.87 | 🥇 115.36 | 138.56 | 🥈 117.08 | 138.39 |

## Warm framework cache

### Elapsed time

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| backend | 🥈 1.03s | 1.94s | 1.06s | 1.73s | 🥇 0.93s |
| barrel | 4.92s | 9.43s | 5.60s | 🥈 1.31s | 🥇 0.59s |
| many-files | 🥈 5.35s | 26.92s | 8.72s | 24.28s | 🥇 4.01s |
| minimal-node | 🥇 0.35s | 0.46s | 0.45s | 🥈 0.39s | 0.46s |
| minimal-react | 🥇 0.63s | 🥈 0.81s | 0.89s | 0.85s | 0.91s |
| module-graph | 🥈 3.17s | 9.08s | 4.05s | 4.86s | 🥇 2.77s |
| react | 🥇 1.65s | 6.67s | 🥈 2.05s | 5.83s | 2.09s |
| react (browser) | — | 🥇 3.94s | — | 🥈 5.71s | — |
| startup | 🥇 0.52s | 0.73s | 0.73s | 0.74s | 🥈 0.54s |

### Memory (MiB, process-tree footprint peak)

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| backend | 207.73 | 🥇 155.34 | 294.88 | 🥈 163.31 | 327.05 |
| barrel | 845.15 | 494.29 | 990.74 | 🥇 142.49 | 🥈 166.67 |
| many-files | 449.71 | 🥇 156.43 | 477.19 | 🥈 220.77 | 500.15 |
| minimal-node | 🥇 48.13 | 🥈 106.94 | 126.41 | 112.28 | 128.38 |
| minimal-react | 🥇 128.28 | 🥈 234.86 | 258.74 | 358.21 | 355.37 |
| module-graph | 533.59 | 🥇 244.36 | 559.47 | 🥈 269.15 | 453.67 |
| react | 494.53 | 🥇 250.57 | 456.65 | 🥈 390.12 | 587.78 |
| react (browser) | — | 🥈 797.42 | — | 🥇 355.00 | — |
| startup | 🥇 62.72 | 🥈 111.58 | 134.48 | 118.24 | 140.53 |

## Rstest phase timings

Medians in seconds from the reporter. Build includes run preparation and compilation; runtime includes worker scheduling, module loading, test execution and worker fixture cleanup. Process wall time also includes CLI startup and final teardown. Each column is an independent median and need not add up exactly.

| Cache / case | Pool | n | Build | Runtime | Process wall time |
| --- | --- | --- | --- | --- | --- |
| cold / backend | Rstest | 5 | 0.09 | 1.66 | 1.95 |
| cold / backend | Rstest vmForks | 5 | 0.06 | 0.70 | 1.03 |
| cold / barrel | Rstest | 5 | 0.15 | 1.32 | 1.71 |
| cold / barrel | Rstest vmForks | 5 | 0.12 | 0.27 | 0.77 |
| cold / many-files | Rstest | 5 | 0.43 | 20.36 | 21.29 |
| cold / many-files | Rstest vmForks | 5 | 0.53 | 3.21 | 4.04 |
| cold / minimal-node | Rstest | 5 | 0.04 | 0.13 | 0.44 |
| cold / minimal-node | Rstest vmForks | 5 | 0.04 | 0.18 | 0.47 |
| cold / minimal-react | Rstest | 5 | 0.00 | 0.47 | 0.98 |
| cold / minimal-react | Rstest vmForks | 5 | 0.00 | 0.45 | 0.91 |
| cold / module-graph | Rstest | 5 | 0.39 | 3.62 | 4.05 |
| cold / module-graph | Rstest vmForks | 5 | 0.31 | 1.91 | 2.58 |
| cold / react | Rstest | 5 | 0.01 | 5.26 | 5.76 |
| cold / react | Rstest vmForks | 5 | 0.00 | 1.34 | 1.77 |
| cold / react (browser) | Rstest | 5 | 0.68 | 4.59 | 5.79 |
| cold / startup | Rstest | 5 | 0.05 | 0.35 | 0.67 |
| cold / startup | Rstest vmForks | 5 | 0.05 | 0.21 | 0.54 |
| warm / backend | Rstest | 5 | 0.06 | 1.48 | 1.73 |
| warm / backend | Rstest vmForks | 5 | 0.06 | 0.63 | 0.93 |
| warm / barrel | Rstest | 5 | 0.14 | 0.91 | 1.31 |
| warm / barrel | Rstest vmForks | 5 | 0.06 | 0.24 | 0.59 |
| warm / many-files | Rstest | 5 | 0.61 | 23.44 | 24.28 |
| warm / many-files | Rstest vmForks | 5 | 0.53 | 3.13 | 4.01 |
| warm / minimal-node | Rstest | 5 | 0.04 | 0.13 | 0.39 |
| warm / minimal-node | Rstest vmForks | 5 | 0.04 | 0.18 | 0.46 |
| warm / minimal-react | Rstest | 5 | 0.00 | 0.43 | 0.85 |
| warm / minimal-react | Rstest vmForks | 5 | 0.00 | 0.48 | 0.91 |
| warm / module-graph | Rstest | 5 | 0.52 | 4.16 | 4.86 |
| warm / module-graph | Rstest vmForks | 5 | 0.70 | 1.86 | 2.77 |
| warm / react | Rstest | 5 | 0.01 | 5.21 | 5.83 |
| warm / react | Rstest vmForks | 5 | 0.01 | 1.45 | 2.09 |
| warm / react (browser) | Rstest | 5 | 0.93 | 4.58 | 5.71 |
| warm / startup | Rstest | 5 | 0.05 | 0.38 | 0.74 |
| warm / startup | Rstest vmForks | 5 | 0.05 | 0.22 | 0.54 |

## Samples and provenance

[Full variability](variability.md). See [result.json](result.json) for all samples, warmups, counts, cache actions, fixture/config hashes, resolved dependencies and coverage file inventories. Local commands, executable paths and log paths are omitted; cache paths are workspace-relative. publication.sourceSha256 identifies the original result. Full logs and source snapshots remain in the original run directory or CI artifact.

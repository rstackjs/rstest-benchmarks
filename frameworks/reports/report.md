# Frameworks benchmark

Status: **completed**. 2026-11-16T06:27:03.724Z. Node v26.13.0; Apple M1 (Virtual); logical CPUs: 3; available parallelism: 3; darwin arm64.

Source: [GitHub Actions](https://github.com/rstackjs/rstest-benchmarks/actions/runs/43816713360), commit `8fa5cbf07ea8507371f84be42ddb4a9926562b08`, attempt 1; runner GitHub Actions 1000236301, GitHub Actions 1000236299, GitHub Actions 1000236300, GitHub Actions 1000236303, GitHub Actions 1000236295, GitHub Actions 1000236298, GitHub Actions 1000236302, GitHub Actions 1000236297, GitHub Actions 1000236296, image 20261112.0539.3, 20261104.0514.1.

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
| backend | 0.99s | 1.76s | 🥈 0.99s | 1.50s | 🥇 0.80s |
| barrel | 15.79s | 23.83s | 16.11s | 🥈 2.36s | 🥇 1.09s |
| many-files | 🥈 5.93s | 30.53s | 7.91s | 21.19s | 🥇 4.03s |
| minimal-node | 0.52s | 0.41s | 0.49s | 🥈 0.39s | 🥇 0.38s |
| minimal-react | 🥇 0.67s | 0.92s | 0.87s | 0.85s | 🥈 0.79s |
| module-graph | 5.11s | 11.33s | 5.12s | 🥈 3.37s | 🥇 1.76s |
| react | 🥇 2.17s | 9.69s | 2.29s | 6.94s | 🥈 2.20s |
| react (browser) | — | 🥇 4.15s | — | 🥈 5.89s | — |
| startup | 🥈 0.40s | 0.49s | 0.46s | 0.41s | 🥇 0.37s |

### Memory (MiB, process-tree footprint peak)

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| backend | 382.25 | 🥈 164.32 | 300.16 | 🥇 156.40 | 326.37 |
| barrel | 1090.76 | 584.18 | 1073.41 | 🥇 140.91 | 🥈 168.39 |
| many-files | 455.42 | 🥇 187.76 | 504.62 | 🥈 216.86 | 494.73 |
| minimal-node | 119.90 | 🥇 110.80 | 126.60 | 🥈 116.72 | 128.83 |
| minimal-react | 🥇 236.36 | 🥈 238.09 | 264.16 | 355.94 | 350.94 |
| module-graph | 563.20 | 🥈 302.25 | 622.13 | 🥇 281.37 | 453.97 |
| react | 515.02 | 🥇 266.48 | 475.95 | 🥈 416.44 | 578.88 |
| react (browser) | — | 🥈 914.90 | — | 🥇 363.46 | — |
| startup | 129.43 | 🥈 114.85 | 136.01 | 🥇 113.67 | 138.56 |

## Warm framework cache

### Elapsed time

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| backend | 🥈 0.79s | 1.72s | 0.82s | 1.35s | 🥇 0.74s |
| barrel | 8.37s | 15.53s | 9.57s | 🥈 2.13s | 🥇 0.90s |
| many-files | 🥈 4.05s | 25.38s | 7.64s | 22.08s | 🥇 3.72s |
| minimal-node | 🥇 0.29s | 0.36s | 0.44s | 🥈 0.30s | 0.38s |
| minimal-react | 🥇 0.58s | 🥈 0.76s | 0.98s | 0.84s | 0.77s |
| module-graph | 🥈 3.30s | 8.95s | 3.45s | 4.34s | 🥇 2.17s |
| react | 🥇 2.13s | 8.65s | 2.23s | 7.25s | 🥈 2.15s |
| react (browser) | — | 🥇 4.38s | — | 🥈 6.30s | — |
| startup | 🥇 0.26s | 0.44s | 0.38s | 0.43s | 🥈 0.33s |

### Memory (MiB, process-tree footprint peak)

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| backend | 193.08 | 🥇 155.25 | 294.21 | 🥈 155.67 | 324.68 |
| barrel | 841.72 | 491.29 | 925.09 | 🥇 140.54 | 🥈 168.64 |
| many-files | 449.38 | 🥇 157.02 | 482.24 | 🥈 214.70 | 439.56 |
| minimal-node | 🥇 50.27 | 🥈 108.38 | 121.69 | 111.70 | 126.69 |
| minimal-react | 🥇 125.87 | 🥈 233.08 | 258.54 | 373.84 | 367.66 |
| module-graph | 529.18 | 🥇 243.47 | 561.25 | 🥈 257.22 | 462.35 |
| react | 481.64 | 🥇 251.32 | 458.84 | 🥈 408.32 | 585.80 |
| react (browser) | — | 🥈 799.58 | — | 🥇 357.91 | — |
| startup | 🥇 52.49 | 🥈 108.55 | 127.40 | 115.96 | 138.27 |

## Rstest phase timings

Medians in seconds from the reporter. Build includes run preparation and compilation; runtime includes worker scheduling, module loading, test execution and worker fixture cleanup. Process wall time also includes CLI startup and final teardown. Each column is an independent median and need not add up exactly.

| Cache / case | Pool | n | Build | Runtime | Process wall time |
| --- | --- | --- | --- | --- | --- |
| cold / backend | Rstest | 5 | 0.04 | 1.28 | 1.50 |
| cold / backend | Rstest vmForks | 5 | 0.04 | 0.56 | 0.80 |
| cold / barrel | Rstest | 5 | 0.23 | 1.61 | 2.36 |
| cold / barrel | Rstest vmForks | 5 | 0.19 | 0.49 | 1.09 |
| cold / many-files | Rstest | 5 | 0.40 | 19.99 | 21.19 |
| cold / many-files | Rstest vmForks | 5 | 0.36 | 3.30 | 4.03 |
| cold / minimal-node | Rstest | 5 | 0.08 | 0.10 | 0.39 |
| cold / minimal-node | Rstest vmForks | 5 | 0.03 | 0.15 | 0.38 |
| cold / minimal-react | Rstest | 5 | 0.00 | 0.36 | 0.85 |
| cold / minimal-react | Rstest vmForks | 5 | 0.00 | 0.39 | 0.79 |
| cold / module-graph | Rstest | 5 | 0.28 | 2.90 | 3.37 |
| cold / module-graph | Rstest vmForks | 5 | 0.29 | 1.33 | 1.76 |
| cold / react | Rstest | 5 | 0.01 | 6.41 | 6.94 |
| cold / react | Rstest vmForks | 5 | 0.01 | 1.67 | 2.20 |
| cold / react (browser) | Rstest | 5 | 0.76 | 4.81 | 5.89 |
| cold / startup | Rstest | 5 | 0.02 | 0.21 | 0.41 |
| cold / startup | Rstest vmForks | 5 | 0.03 | 0.15 | 0.37 |
| warm / backend | Rstest | 5 | 0.04 | 1.14 | 1.35 |
| warm / backend | Rstest vmForks | 5 | 0.04 | 0.52 | 0.74 |
| warm / barrel | Rstest | 5 | 0.22 | 1.50 | 2.13 |
| warm / barrel | Rstest vmForks | 5 | 0.16 | 0.36 | 0.90 |
| warm / many-files | Rstest | 5 | 0.59 | 21.22 | 22.08 |
| warm / many-files | Rstest vmForks | 5 | 0.59 | 2.72 | 3.72 |
| warm / minimal-node | Rstest | 5 | 0.03 | 0.09 | 0.30 |
| warm / minimal-node | Rstest vmForks | 5 | 0.04 | 0.14 | 0.38 |
| warm / minimal-react | Rstest | 5 | 0.00 | 0.43 | 0.84 |
| warm / minimal-react | Rstest vmForks | 5 | 0.00 | 0.37 | 0.77 |
| warm / module-graph | Rstest | 5 | 0.41 | 3.60 | 4.34 |
| warm / module-graph | Rstest vmForks | 5 | 0.43 | 1.54 | 2.17 |
| warm / react | Rstest | 5 | 0.01 | 6.21 | 7.25 |
| warm / react | Rstest vmForks | 5 | 0.01 | 1.59 | 2.15 |
| warm / react (browser) | Rstest | 5 | 0.84 | 4.91 | 6.30 |
| warm / startup | Rstest | 5 | 0.03 | 0.23 | 0.43 |
| warm / startup | Rstest vmForks | 5 | 0.03 | 0.14 | 0.33 |

## Samples and provenance

[Full variability](variability.md). See [result.json](result.json) for all samples, warmups, counts, cache actions, fixture/config hashes, resolved dependencies and coverage file inventories. Local commands, executable paths and log paths are omitted; cache paths are workspace-relative. publication.sourceSha256 identifies the original result. Full logs and source snapshots remain in the original run directory or CI artifact.

# Frameworks benchmark

Status: **completed**. 2026-11-16T06:37:15.083Z. Node v26.13.0; Apple M1 (Virtual); logical CPUs: 3; available parallelism: 3; darwin arm64.

Rstest source: `https://pkg.pr.new/@rstest/core@fe5e00a`. Resolved versions are listed below; the dependency lockfile is recorded with the run.

Source: [GitHub Actions](https://github.com/rstackjs/rstest-benchmarks/actions/runs/43817845441), commit `8fa5cbf07ea8507371f84be42ddb4a9926562b08`, attempt 1; runner GitHub Actions 1000236305, GitHub Actions 1000236329, GitHub Actions 1000236306, GitHub Actions 1000236328, GitHub Actions 1000236307, GitHub Actions 1000236308, GitHub Actions 1000236309, GitHub Actions 1000236326, GitHub Actions 1000236327, image 20261104.0514.1, 20261112.0539.3.

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
| barrel | 1–2 | 2 | 2 | 2 | 2 |
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
| backend | 🥇 1.03s | 2.47s | 1.36s | 1.74s | 🥈 1.14s |
| barrel | 12.21s | 18.13s | 14.82s | 🥈 1.79s | 🥇 0.87s |
| many-files | 🥈 5.77s | 31.52s | 8.39s | 21.36s | 🥇 3.99s |
| minimal-node | 0.56s | 🥈 0.43s | 0.51s | 🥇 0.34s | 0.44s |
| minimal-react | 0.87s | 0.87s | 🥇 0.83s | 0.93s | 🥈 0.85s |
| module-graph | 5.33s | 11.47s | 6.15s | 🥈 4.48s | 🥇 2.25s |
| react | 2.49s | 9.20s | 🥈 2.27s | 6.70s | 🥇 2.08s |
| react (browser) | — | 🥇 6.22s | — | 🥈 7.01s | — |
| startup | 0.93s | 0.88s | 🥈 0.70s | 0.77s | 🥇 0.58s |

### Memory (MiB, process-tree footprint peak)

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| backend | 368.57 | 🥈 159.03 | 301.48 | 🥇 156.51 | 325.40 |
| barrel | 1097.44 | 586.41 | 1065.72 | 🥇 135.36 | 🥈 166.01 |
| many-files | 457.11 | 🥇 190.81 | 482.04 | 🥈 222.10 | 447.28 |
| minimal-node | 118.30 | 🥈 110.83 | 129.17 | 🥇 106.59 | 128.52 |
| minimal-react | 🥇 230.00 | 🥈 249.14 | 260.76 | 283.78 | 293.05 |
| module-graph | 560.56 | 🥈 289.23 | 622.11 | 🥇 269.45 | 513.34 |
| react | 525.73 | 🥇 269.42 | 477.10 | 🥈 337.85 | 531.41 |
| react (browser) | — | 🥈 919.54 | — | 🥇 363.44 | — |
| startup | 132.84 | 🥇 115.40 | 138.62 | 🥈 118.96 | 139.21 |

## Warm framework cache

### Elapsed time

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| backend | 1.00s | 1.64s | 🥈 0.86s | 1.58s | 🥇 0.80s |
| barrel | 4.73s | 8.78s | 4.97s | 🥈 1.44s | 🥇 0.55s |
| many-files | 🥈 5.69s | 33.40s | 7.38s | 23.70s | 🥇 4.19s |
| minimal-node | 🥇 0.31s | 0.40s | 0.45s | 🥈 0.37s | 0.45s |
| minimal-react | 🥈 0.62s | 0.79s | 0.86s | 🥇 0.60s | 0.66s |
| module-graph | 🥈 2.89s | 8.72s | 4.39s | 4.32s | 🥇 2.15s |
| react | 🥇 2.23s | 9.67s | 2.62s | 6.87s | 🥈 2.46s |
| react (browser) | — | 🥇 4.64s | — | 🥈 6.18s | — |
| startup | 🥇 0.42s | 0.81s | 0.61s | 0.69s | 🥈 0.50s |

### Memory (MiB, process-tree footprint peak)

| Case | Jest + SWC | Vitest | Vitest vmForks | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: | ---: |
| backend | 224.96 | 🥈 155.92 | 294.32 | 🥇 153.89 | 324.47 |
| barrel | 850.84 | 492.83 | 941.59 | 🥇 137.85 | 🥈 167.19 |
| many-files | 452.49 | 🥇 156.11 | 468.53 | 🥈 222.49 | 449.20 |
| minimal-node | 🥇 48.94 | 🥈 106.70 | 124.13 | 116.85 | 131.15 |
| minimal-react | 🥇 131.29 | 🥈 245.36 | 254.40 | 278.85 | 286.72 |
| module-graph | 531.51 | 🥇 235.44 | 557.13 | 🥈 262.30 | 516.08 |
| react | 512.99 | 🥇 253.68 | 455.20 | 🥈 340.90 | 527.04 |
| react (browser) | — | 🥈 796.67 | — | 🥇 357.22 | — |
| startup | 🥇 62.01 | 🥈 111.35 | 131.07 | 116.63 | 140.04 |

## Rstest phase timings

Medians in seconds from the reporter. Build includes run preparation and compilation; runtime includes worker scheduling, module loading, test execution and worker fixture cleanup. Process wall time also includes CLI startup and final teardown. Each column is an independent median and need not add up exactly.

| Cache / case | Pool | n | Build | Runtime | Process wall time |
| --- | --- | --- | --- | --- | --- |
| cold / backend | Rstest | 5 | 0.24 | 1.27 | 1.74 |
| cold / backend | Rstest vmForks | 5 | 0.32 | 0.59 | 1.14 |
| cold / barrel | Rstest | 5 | 0.18 | 1.26 | 1.79 |
| cold / barrel | Rstest vmForks | 5 | 0.17 | 0.38 | 0.87 |
| cold / many-files | Rstest | 5 | 0.47 | 20.51 | 21.36 |
| cold / many-files | Rstest vmForks | 5 | 0.41 | 3.26 | 3.99 |
| cold / minimal-node | Rstest | 5 | 0.03 | 0.11 | 0.34 |
| cold / minimal-node | Rstest vmForks | 5 | 0.04 | 0.17 | 0.44 |
| cold / minimal-react | Rstest | 5 | 0.00 | 0.34 | 0.93 |
| cold / minimal-react | Rstest vmForks | 5 | 0.00 | 0.38 | 0.85 |
| cold / module-graph | Rstest | 5 | 0.62 | 3.57 | 4.48 |
| cold / module-graph | Rstest vmForks | 5 | 0.31 | 1.58 | 2.25 |
| cold / react | Rstest | 5 | 0.01 | 5.93 | 6.70 |
| cold / react | Rstest vmForks | 5 | 0.00 | 1.52 | 2.08 |
| cold / react (browser) | Rstest | 5 | 0.79 | 5.44 | 7.01 |
| cold / startup | Rstest | 5 | 0.07 | 0.38 | 0.77 |
| cold / startup | Rstest vmForks | 5 | 0.05 | 0.25 | 0.58 |
| warm / backend | Rstest | 5 | 0.06 | 1.30 | 1.58 |
| warm / backend | Rstest vmForks | 5 | 0.06 | 0.54 | 0.80 |
| warm / barrel | Rstest | 5 | 0.07 | 1.01 | 1.44 |
| warm / barrel | Rstest vmForks | 5 | 0.08 | 0.27 | 0.55 |
| warm / many-files | Rstest | 5 | 0.54 | 22.64 | 23.70 |
| warm / many-files | Rstest vmForks | 5 | 0.61 | 3.32 | 4.19 |
| warm / minimal-node | Rstest | 5 | 0.04 | 0.12 | 0.37 |
| warm / minimal-node | Rstest vmForks | 5 | 0.04 | 0.18 | 0.45 |
| warm / minimal-react | Rstest | 5 | 0.06 | 0.32 | 0.60 |
| warm / minimal-react | Rstest vmForks | 5 | 0.06 | 0.39 | 0.66 |
| warm / module-graph | Rstest | 5 | 0.43 | 3.50 | 4.32 |
| warm / module-graph | Rstest vmForks | 5 | 0.63 | 1.34 | 2.15 |
| warm / react | Rstest | 5 | 0.31 | 6.25 | 6.87 |
| warm / react | Rstest vmForks | 5 | 0.38 | 1.80 | 2.46 |
| warm / react (browser) | Rstest | 5 | 0.95 | 5.03 | 6.18 |
| warm / startup | Rstest | 5 | 0.06 | 0.34 | 0.69 |
| warm / startup | Rstest vmForks | 5 | 0.04 | 0.20 | 0.50 |

## Samples and provenance

[Full variability](variability.md). See [result.json](result.json) for all samples, warmups, counts, cache actions, fixture/config hashes, resolved dependencies and coverage file inventories. Local commands, executable paths and log paths are omitted; cache paths are workspace-relative. publication.sourceSha256 identifies the original result. Full logs and source snapshots remain in the original run directory or CI artifact.

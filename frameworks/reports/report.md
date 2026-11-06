# Frameworks benchmark

Status: **completed**. 2026-11-06T06:08:56.291Z. Node v24.11.1; Apple M4 Max; logical CPUs: not recorded; available parallelism: 14; darwin arm64.

Published packages: jest 30.5.2, vitest 5.1.0, rstest 0.12.6, rstest-vmForks 0.12.6.

8 measured runs per framework/case/cache condition; medians. Each sample is a fresh process. Warm cache: one warmup after clearing caches; cold cache: cleared before every measured run. Node compile cache disabled; OS page cache and background load uncontrolled. Framework defaults, except explicitly named variants.

RSS is OS /usr/bin/time maxrss (MiB), not simultaneous aggregate process-tree memory. Installations and generation are outside timing. All samples retained.

🥇 and 🥈 mark the lowest and second-lowest distinct unrounded medians among complete results in each row; exact ties share the marker. They do not indicate statistical significance.

Jest transformer: @swc/jest 0.2.39; @swc/core 1.16.21. Shared React 19.2.7; jsdom 26.1.0.

| Workload | Test files | Tests |
| --- | --- | --- |
| minimal-node | 1 | 1 |
| minimal-react | 1 | 1 |
| startup | 5 | 18 |
| many-files | 400 | 800 |
| module-graph | 40 | 80 |
| backend | 16 | 45 |
| barrel | 20 | 40 |
| react | 30 | 54 |

## Unsupported combinations

- jest, rstest-vmForks: No corresponding Chromium browser mode in this adapter. Affected: react (browser).

## Observed test workers

Distinct worker slots that executed test setup in each invocation, read from framework-assigned runtime IDs. Ranges span timed runs and cache conditions. These are observed slots, not configured limits or peak simultaneous workers; recycled processes do not add slots. In-process means tests ran in the Jest runner itself. Browser mode does not use Node test workers. Historical runs without observations show Not recorded.

| Case | Jest + SWC | Vitest | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: |
| minimal-node | Not recorded | Not recorded | Not recorded | Not recorded |
| minimal-react | Not recorded | Not recorded | Not recorded | Not recorded |
| startup | Not recorded | Not recorded | Not recorded | Not recorded |
| many-files | Not recorded | Not recorded | Not recorded | Not recorded |
| module-graph | Not recorded | Not recorded | Not recorded | Not recorded |
| backend | Not recorded | Not recorded | Not recorded | Not recorded |
| barrel | Not recorded | Not recorded | Not recorded | Not recorded |
| react | Not recorded | Not recorded | Not recorded | Not recorded |
| backend (coverage off) | Not recorded | Not recorded | Not recorded | Not recorded |
| backend (v8) | Not recorded | Not recorded | Not recorded | Not recorded |
| backend (istanbul) | Not recorded | Not recorded | Not recorded | Not recorded |
| react (coverage off) | Not recorded | Not recorded | Not recorded | Not recorded |
| react (v8) | Not recorded | Not recorded | Not recorded | Not recorded |
| react (istanbul) | Not recorded | Not recorded | Not recorded | Not recorded |
| react (browser) | — | Not recorded | Not recorded | — |

## Cold framework cache

### Elapsed time

| Case | Jest + SWC | Vitest | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: |
| minimal-node | 0.44s | 0.30s | 🥇 0.24s | 🥈 0.26s |
| minimal-react | 0.76s | 0.64s | 🥇 0.51s | 🥈 0.54s |
| startup | 0.65s | 0.34s | 🥇 0.27s | 🥈 0.30s |
| many-files | 🥈 3.20s | 7.06s | 4.62s | 🥇 1.11s |
| module-graph | 7.17s | 4.69s | 🥈 1.01s | 🥇 0.78s |
| backend | 1.15s | 0.88s | 🥇 0.63s | 🥈 0.73s |
| barrel | 21.99s | 9.94s | 🥈 0.56s | 🥇 0.47s |
| react | 2.39s | 3.94s | 🥈 1.74s | 🥇 1.18s |
| backend (coverage off) | 1.26s | 0.90s | 🥇 0.69s | 🥈 0.76s |
| backend (v8) | 1.60s | 1.04s | 🥇 0.86s | 🥈 0.89s |
| backend (istanbul) | 2.70s | 1.26s | 🥇 1.07s | 🥈 1.23s |
| react (coverage off) | 2.39s | 3.92s | 🥈 1.66s | 🥇 1.08s |
| react (v8) | 3.25s | 4.22s | 🥈 2.08s | 🥇 1.49s |
| react (istanbul) | 3.82s | 4.17s | 🥈 1.93s | 🥇 1.43s |
| react (browser) | — | 🥈 2.39s | 🥇 1.64s | — |

### RSS (MiB)

| Case | Jest + SWC | Vitest | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: |
| minimal-node | 🥇 101.73 | 🥈 116.45 | 129.59 | 128.85 |
| minimal-react | 🥈 182.49 | 🥇 157.73 | 262.34 | 262.43 |
| startup | 🥇 93.20 | 🥈 122.80 | 140.07 | 139.54 |
| many-files | 🥇 202.16 | 🥈 217.23 | 385.74 | 286.70 |
| module-graph | 🥇 207.59 | 311.98 | 372.55 | 🥈 287.53 |
| backend | 🥈 151.85 | 🥇 137.45 | 154.85 | 155.45 |
| barrel | 363.26 | 429.61 | 🥇 163.47 | 🥈 163.73 |
| react | 🥈 182.54 | 🥇 176.92 | 444.17 | 357.92 |
| backend (coverage off) | 🥈 146.84 | 🥇 138.24 | 154.61 | 154.64 |
| backend (v8) | 🥈 170.59 | 🥇 170.52 | 193.79 | 196.46 |
| backend (istanbul) | 🥈 232.23 | 🥇 178.04 | 337.98 | 334.81 |
| react (coverage off) | 🥈 180.79 | 🥇 174.86 | 442.92 | 366.02 |
| react (v8) | 🥈 233.76 | 🥇 187.13 | 673.41 | 558.93 |
| react (istanbul) | 🥈 231.59 | 🥇 184.40 | 578.03 | 493.47 |
| react (browser) | — | 🥈 1126.05 | 🥇 458.66 | — |

## Warm framework cache

### Elapsed time

| Case | Jest + SWC | Vitest | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: |
| minimal-node | 🥇 0.21s | 0.27s | 🥈 0.23s | 0.27s |
| minimal-react | 🥈 0.52s | 0.58s | 🥇 0.50s | 0.53s |
| startup | 🥇 0.26s | 0.28s | 🥈 0.27s | 0.29s |
| many-files | 🥈 2.20s | 6.21s | 4.47s | 🥇 1.10s |
| module-graph | 2.38s | 3.10s | 🥈 0.97s | 🥇 0.75s |
| backend | 0.80s | 0.76s | 🥇 0.70s | 🥈 0.73s |
| barrel | 5.20s | 5.43s | 🥈 0.48s | 🥇 0.45s |
| react | 2.26s | 4.04s | 🥈 1.67s | 🥇 1.13s |
| backend (coverage off) | 0.76s | 0.78s | 🥇 0.64s | 🥈 0.68s |
| backend (v8) | 3.04s | 1.06s | 🥇 0.88s | 🥈 0.94s |
| backend (istanbul) | 1.42s | 1.05s | 🥇 0.83s | 🥈 0.85s |
| react (coverage off) | 2.13s | 3.95s | 🥈 2.00s | 🥇 1.33s |
| react (v8) | 3.01s | 4.03s | 🥈 2.04s | 🥇 1.48s |
| react (istanbul) | 2.88s | 4.12s | 🥈 1.79s | 🥇 1.19s |
| react (browser) | — | 🥈 2.31s | 🥇 1.65s | — |

### RSS (MiB)

| Case | Jest + SWC | Vitest | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: |
| minimal-node | 🥇 94.88 | 🥈 114.16 | 129.01 | 129.13 |
| minimal-react | 🥈 170.76 | 🥇 159.03 | 268.55 | 267.31 |
| startup | 🥇 107.67 | 🥈 116.68 | 139.25 | 138.64 |
| many-files | 🥇 195.02 | 🥈 200.84 | 387.97 | 288.22 |
| module-graph | 🥇 192.76 | 🥈 239.39 | 390.24 | 286.01 |
| backend | 284.42 | 🥇 126.57 | 🥈 154.72 | 155.31 |
| barrel | 277.62 | 398.31 | 🥇 163.08 | 🥈 164.14 |
| react | 🥇 174.19 | 🥈 178.22 | 436.37 | 364.05 |
| backend (coverage off) | 294.61 | 🥇 126.52 | 🥈 154.73 | 155.22 |
| backend (v8) | 391.67 | 🥇 165.45 | 🥈 192.93 | 198.71 |
| backend (istanbul) | 307.98 | 🥇 168.41 | 193.84 | 🥈 192.69 |
| react (coverage off) | 🥇 174.84 | 🥈 178.91 | 438.43 | 356.91 |
| react (v8) | 🥈 225.43 | 🥇 189.21 | 658.50 | 562.27 |
| react (istanbul) | 🥈 179.25 | 🥇 177.30 | 469.28 | 396.18 |
| react (browser) | — | 🥈 984.98 | 🥇 446.41 | — |

## Rstest phase timings

Medians in seconds from the reporter. Build includes run preparation and compilation; runtime includes worker scheduling, module loading, test execution and worker fixture cleanup. Process wall time also includes CLI startup and final teardown. Each column is an independent median and need not add up exactly.

| Cache / case | Pool | n | Build | Runtime | Process wall time |
| --- | --- | --- | --- | --- | --- |
| cold / minimal-node | Rstest | 8 | 0.02 | 0.06 | 0.24 |
| cold / minimal-node | Rstest vmForks | 8 | 0.02 | 0.09 | 0.26 |
| cold / minimal-react | Rstest | 8 | 0.00 | 0.24 | 0.51 |
| cold / minimal-react | Rstest vmForks | 8 | 0.00 | 0.26 | 0.54 |
| cold / startup | Rstest | 8 | 0.02 | 0.10 | 0.27 |
| cold / startup | Rstest vmForks | 8 | 0.02 | 0.11 | 0.30 |
| cold / many-files | Rstest | 8 | 0.19 | 4.17 | 4.62 |
| cold / many-files | Rstest vmForks | 8 | 0.18 | 0.68 | 1.11 |
| cold / module-graph | Rstest | 8 | 0.13 | 0.72 | 1.01 |
| cold / module-graph | Rstest vmForks | 8 | 0.12 | 0.47 | 0.78 |
| cold / backend | Rstest | 8 | 0.04 | 0.44 | 0.63 |
| cold / backend | Rstest vmForks | 8 | 0.03 | 0.53 | 0.73 |
| cold / barrel | Rstest | 8 | 0.07 | 0.30 | 0.56 |
| cold / barrel | Rstest vmForks | 8 | 0.04 | 0.23 | 0.47 |
| cold / react | Rstest | 8 | 0.00 | 1.43 | 1.74 |
| cold / react | Rstest vmForks | 8 | 0.00 | 0.84 | 1.18 |
| cold / backend (coverage off) | Rstest | 8 | 0.04 | 0.49 | 0.69 |
| cold / backend (coverage off) | Rstest vmForks | 8 | 0.04 | 0.52 | 0.76 |
| cold / backend (v8) | Rstest | 8 | 0.04 | 0.59 | 0.86 |
| cold / backend (v8) | Rstest vmForks | 8 | 0.04 | 0.60 | 0.89 |
| cold / backend (istanbul) | Rstest | 8 | 0.33 | 0.51 | 1.07 |
| cold / backend (istanbul) | Rstest vmForks | 8 | 0.36 | 0.56 | 1.23 |
| cold / react (coverage off) | Rstest | 8 | 0.00 | 1.32 | 1.66 |
| cold / react (coverage off) | Rstest vmForks | 8 | 0.00 | 0.75 | 1.08 |
| cold / react (v8) | Rstest | 8 | 0.00 | 1.65 | 2.08 |
| cold / react (v8) | Rstest vmForks | 8 | 0.00 | 1.05 | 1.49 |
| cold / react (istanbul) | Rstest | 8 | 0.01 | 1.35 | 1.93 |
| cold / react (istanbul) | Rstest vmForks | 8 | 0.00 | 0.80 | 1.43 |
| cold / react (browser) | Rstest | 8 | 0.33 | 1.06 | 1.64 |
| warm / minimal-node | Rstest | 8 | 0.02 | 0.06 | 0.23 |
| warm / minimal-node | Rstest vmForks | 8 | 0.02 | 0.09 | 0.27 |
| warm / minimal-react | Rstest | 8 | 0.00 | 0.24 | 0.50 |
| warm / minimal-react | Rstest vmForks | 8 | 0.00 | 0.27 | 0.53 |
| warm / startup | Rstest | 8 | 0.02 | 0.09 | 0.27 |
| warm / startup | Rstest vmForks | 8 | 0.02 | 0.11 | 0.29 |
| warm / many-files | Rstest | 8 | 0.18 | 4.00 | 4.47 |
| warm / many-files | Rstest vmForks | 8 | 0.18 | 0.67 | 1.10 |
| warm / module-graph | Rstest | 8 | 0.12 | 0.69 | 0.97 |
| warm / module-graph | Rstest vmForks | 8 | 0.12 | 0.46 | 0.75 |
| warm / backend | Rstest | 8 | 0.04 | 0.47 | 0.70 |
| warm / backend | Rstest vmForks | 8 | 0.04 | 0.52 | 0.73 |
| warm / barrel | Rstest | 8 | 0.04 | 0.29 | 0.48 |
| warm / barrel | Rstest vmForks | 8 | 0.04 | 0.25 | 0.45 |
| warm / react | Rstest | 8 | 0.00 | 1.36 | 1.67 |
| warm / react | Rstest vmForks | 8 | 0.00 | 0.78 | 1.13 |
| warm / backend (coverage off) | Rstest | 8 | 0.04 | 0.45 | 0.64 |
| warm / backend (coverage off) | Rstest vmForks | 8 | 0.03 | 0.48 | 0.68 |
| warm / backend (v8) | Rstest | 8 | 0.04 | 0.61 | 0.88 |
| warm / backend (v8) | Rstest vmForks | 8 | 0.04 | 0.62 | 0.94 |
| warm / backend (istanbul) | Rstest | 8 | 0.06 | 0.51 | 0.83 |
| warm / backend (istanbul) | Rstest vmForks | 8 | 0.06 | 0.58 | 0.85 |
| warm / react (coverage off) | Rstest | 8 | 0.00 | 1.42 | 2.00 |
| warm / react (coverage off) | Rstest vmForks | 8 | 0.00 | 0.89 | 1.33 |
| warm / react (v8) | Rstest | 8 | 0.00 | 1.63 | 2.04 |
| warm / react (v8) | Rstest vmForks | 8 | 0.00 | 1.03 | 1.48 |
| warm / react (istanbul) | Rstest | 8 | 0.01 | 1.42 | 1.79 |
| warm / react (istanbul) | Rstest vmForks | 8 | 0.00 | 0.78 | 1.19 |
| warm / react (browser) | Rstest | 8 | 0.32 | 1.07 | 1.65 |

## Samples and provenance

[Full variability](variability.md). See [result.json](result.json) for all samples, warmups, counts, cache actions, fixture/config hashes, resolved dependencies and coverage file inventories. Local commands, executable paths and log paths are omitted; cache paths are workspace-relative. publication.sourceSha256 identifies the original result. Full logs and source snapshots remain in the original run directory or CI artifact.

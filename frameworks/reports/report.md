# Jest + SWC / Vitest / Rstest / Rstest vmForks comparison

Status: **completed**. 2026-11-06T06:08:56.291Z. Node v24.11.1; Apple M4 Max; darwin arm64.

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

- jest, rstest-vmForks: No corresponding Chromium browser mode in this adapter. Affected: browser/react/none.

## cold framework cache

### Elapsed time

| Case | Jest + SWC | Vitest | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: |
| main/minimal-node/none | 0.44s | 0.30s | 🥇 0.24s | 🥈 0.26s |
| main/minimal-react/none | 0.76s | 0.64s | 🥇 0.51s | 🥈 0.54s |
| main/startup/none | 0.65s | 0.34s | 🥇 0.27s | 🥈 0.30s |
| main/many-files/none | 🥈 3.20s | 7.06s | 4.62s | 🥇 1.11s |
| main/module-graph/none | 7.17s | 4.69s | 🥈 1.01s | 🥇 0.78s |
| main/backend/none | 1.15s | 0.88s | 🥇 0.63s | 🥈 0.73s |
| main/barrel/none | 21.99s | 9.94s | 🥈 0.56s | 🥇 0.47s |
| main/react/none | 2.39s | 3.94s | 🥈 1.74s | 🥇 1.18s |
| coverage/backend/none | 1.26s | 0.90s | 🥇 0.69s | 🥈 0.76s |
| coverage/backend/v8 | 1.60s | 1.04s | 🥇 0.86s | 🥈 0.89s |
| coverage/backend/istanbul | 2.70s | 1.26s | 🥇 1.07s | 🥈 1.23s |
| coverage/react/none | 2.39s | 3.92s | 🥈 1.66s | 🥇 1.08s |
| coverage/react/v8 | 3.25s | 4.22s | 🥈 2.08s | 🥇 1.49s |
| coverage/react/istanbul | 3.82s | 4.17s | 🥈 1.93s | 🥇 1.43s |
| browser/react/none | — | 🥈 2.39s | 🥇 1.64s | — |

### RSS (MiB)

| Case | Jest + SWC | Vitest | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: |
| main/minimal-node/none | 🥇 101.73 | 🥈 116.45 | 129.59 | 128.85 |
| main/minimal-react/none | 🥈 182.49 | 🥇 157.73 | 262.34 | 262.43 |
| main/startup/none | 🥇 93.20 | 🥈 122.80 | 140.07 | 139.54 |
| main/many-files/none | 🥇 202.16 | 🥈 217.23 | 385.74 | 286.70 |
| main/module-graph/none | 🥇 207.59 | 311.98 | 372.55 | 🥈 287.53 |
| main/backend/none | 🥈 151.85 | 🥇 137.45 | 154.85 | 155.45 |
| main/barrel/none | 363.26 | 429.61 | 🥇 163.47 | 🥈 163.73 |
| main/react/none | 🥈 182.54 | 🥇 176.92 | 444.17 | 357.92 |
| coverage/backend/none | 🥈 146.84 | 🥇 138.24 | 154.61 | 154.64 |
| coverage/backend/v8 | 🥈 170.59 | 🥇 170.52 | 193.79 | 196.46 |
| coverage/backend/istanbul | 🥈 232.23 | 🥇 178.04 | 337.98 | 334.81 |
| coverage/react/none | 🥈 180.79 | 🥇 174.86 | 442.92 | 366.02 |
| coverage/react/v8 | 🥈 233.76 | 🥇 187.13 | 673.41 | 558.93 |
| coverage/react/istanbul | 🥈 231.59 | 🥇 184.40 | 578.03 | 493.47 |
| browser/react/none | — | 🥈 1126.05 | 🥇 458.66 | — |

## warm framework cache

### Elapsed time

| Case | Jest + SWC | Vitest | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: |
| main/minimal-node/none | 🥇 0.21s | 0.27s | 🥈 0.23s | 0.27s |
| main/minimal-react/none | 🥈 0.52s | 0.58s | 🥇 0.50s | 0.53s |
| main/startup/none | 🥇 0.26s | 0.28s | 🥈 0.27s | 0.29s |
| main/many-files/none | 🥈 2.20s | 6.21s | 4.47s | 🥇 1.10s |
| main/module-graph/none | 2.38s | 3.10s | 🥈 0.97s | 🥇 0.75s |
| main/backend/none | 0.80s | 0.76s | 🥇 0.70s | 🥈 0.73s |
| main/barrel/none | 5.20s | 5.43s | 🥈 0.48s | 🥇 0.45s |
| main/react/none | 2.26s | 4.04s | 🥈 1.67s | 🥇 1.13s |
| coverage/backend/none | 0.76s | 0.78s | 🥇 0.64s | 🥈 0.68s |
| coverage/backend/v8 | 3.04s | 1.06s | 🥇 0.88s | 🥈 0.94s |
| coverage/backend/istanbul | 1.42s | 1.05s | 🥇 0.83s | 🥈 0.85s |
| coverage/react/none | 2.13s | 3.95s | 🥈 2.00s | 🥇 1.33s |
| coverage/react/v8 | 3.01s | 4.03s | 🥈 2.04s | 🥇 1.48s |
| coverage/react/istanbul | 2.88s | 4.12s | 🥈 1.79s | 🥇 1.19s |
| browser/react/none | — | 🥈 2.31s | 🥇 1.65s | — |

### RSS (MiB)

| Case | Jest + SWC | Vitest | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: |
| main/minimal-node/none | 🥇 94.88 | 🥈 114.16 | 129.01 | 129.13 |
| main/minimal-react/none | 🥈 170.76 | 🥇 159.03 | 268.55 | 267.31 |
| main/startup/none | 🥇 107.67 | 🥈 116.68 | 139.25 | 138.64 |
| main/many-files/none | 🥇 195.02 | 🥈 200.84 | 387.97 | 288.22 |
| main/module-graph/none | 🥇 192.76 | 🥈 239.39 | 390.24 | 286.01 |
| main/backend/none | 284.42 | 🥇 126.57 | 🥈 154.72 | 155.31 |
| main/barrel/none | 277.62 | 398.31 | 🥇 163.08 | 🥈 164.14 |
| main/react/none | 🥇 174.19 | 🥈 178.22 | 436.37 | 364.05 |
| coverage/backend/none | 294.61 | 🥇 126.52 | 🥈 154.73 | 155.22 |
| coverage/backend/v8 | 391.67 | 🥇 165.45 | 🥈 192.93 | 198.71 |
| coverage/backend/istanbul | 307.98 | 🥇 168.41 | 193.84 | 🥈 192.69 |
| coverage/react/none | 🥇 174.84 | 🥈 178.91 | 438.43 | 356.91 |
| coverage/react/v8 | 🥈 225.43 | 🥇 189.21 | 658.50 | 562.27 |
| coverage/react/istanbul | 🥈 179.25 | 🥇 177.30 | 469.28 | 396.18 |
| browser/react/none | — | 🥈 984.98 | 🥇 446.41 | — |

## Rstest phase timings

Medians in seconds from the reporter. Build includes run preparation and compilation; runtime includes worker scheduling, module loading, test execution and worker fixture cleanup. Process wall time also includes CLI startup and final teardown. Each column is an independent median and need not add up exactly.

| Cache / case | Pool | n | Build | Runtime | Process wall time |
| --- | --- | --- | --- | --- | --- |
| cold / main/minimal-node/none | Rstest | 8 | 0.02 | 0.06 | 0.24 |
| cold / main/minimal-node/none | Rstest vmForks | 8 | 0.02 | 0.09 | 0.26 |
| cold / main/minimal-react/none | Rstest | 8 | 0.00 | 0.24 | 0.51 |
| cold / main/minimal-react/none | Rstest vmForks | 8 | 0.00 | 0.26 | 0.54 |
| cold / main/startup/none | Rstest | 8 | 0.02 | 0.10 | 0.27 |
| cold / main/startup/none | Rstest vmForks | 8 | 0.02 | 0.11 | 0.30 |
| cold / main/many-files/none | Rstest | 8 | 0.19 | 4.17 | 4.62 |
| cold / main/many-files/none | Rstest vmForks | 8 | 0.18 | 0.68 | 1.11 |
| cold / main/module-graph/none | Rstest | 8 | 0.13 | 0.72 | 1.01 |
| cold / main/module-graph/none | Rstest vmForks | 8 | 0.12 | 0.47 | 0.78 |
| cold / main/backend/none | Rstest | 8 | 0.04 | 0.44 | 0.63 |
| cold / main/backend/none | Rstest vmForks | 8 | 0.03 | 0.53 | 0.73 |
| cold / main/barrel/none | Rstest | 8 | 0.07 | 0.30 | 0.56 |
| cold / main/barrel/none | Rstest vmForks | 8 | 0.04 | 0.23 | 0.47 |
| cold / main/react/none | Rstest | 8 | 0.00 | 1.43 | 1.74 |
| cold / main/react/none | Rstest vmForks | 8 | 0.00 | 0.84 | 1.18 |
| cold / coverage/backend/none | Rstest | 8 | 0.04 | 0.49 | 0.69 |
| cold / coverage/backend/none | Rstest vmForks | 8 | 0.04 | 0.52 | 0.76 |
| cold / coverage/backend/v8 | Rstest | 8 | 0.04 | 0.59 | 0.86 |
| cold / coverage/backend/v8 | Rstest vmForks | 8 | 0.04 | 0.60 | 0.89 |
| cold / coverage/backend/istanbul | Rstest | 8 | 0.33 | 0.51 | 1.07 |
| cold / coverage/backend/istanbul | Rstest vmForks | 8 | 0.36 | 0.56 | 1.23 |
| cold / coverage/react/none | Rstest | 8 | 0.00 | 1.32 | 1.66 |
| cold / coverage/react/none | Rstest vmForks | 8 | 0.00 | 0.75 | 1.08 |
| cold / coverage/react/v8 | Rstest | 8 | 0.00 | 1.65 | 2.08 |
| cold / coverage/react/v8 | Rstest vmForks | 8 | 0.00 | 1.05 | 1.49 |
| cold / coverage/react/istanbul | Rstest | 8 | 0.01 | 1.35 | 1.93 |
| cold / coverage/react/istanbul | Rstest vmForks | 8 | 0.00 | 0.80 | 1.43 |
| cold / browser/react/none | Rstest | 8 | 0.33 | 1.06 | 1.64 |
| warm / main/minimal-node/none | Rstest | 8 | 0.02 | 0.06 | 0.23 |
| warm / main/minimal-node/none | Rstest vmForks | 8 | 0.02 | 0.09 | 0.27 |
| warm / main/minimal-react/none | Rstest | 8 | 0.00 | 0.24 | 0.50 |
| warm / main/minimal-react/none | Rstest vmForks | 8 | 0.00 | 0.27 | 0.53 |
| warm / main/startup/none | Rstest | 8 | 0.02 | 0.09 | 0.27 |
| warm / main/startup/none | Rstest vmForks | 8 | 0.02 | 0.11 | 0.29 |
| warm / main/many-files/none | Rstest | 8 | 0.18 | 4.00 | 4.47 |
| warm / main/many-files/none | Rstest vmForks | 8 | 0.18 | 0.67 | 1.10 |
| warm / main/module-graph/none | Rstest | 8 | 0.12 | 0.69 | 0.97 |
| warm / main/module-graph/none | Rstest vmForks | 8 | 0.12 | 0.46 | 0.75 |
| warm / main/backend/none | Rstest | 8 | 0.04 | 0.47 | 0.70 |
| warm / main/backend/none | Rstest vmForks | 8 | 0.04 | 0.52 | 0.73 |
| warm / main/barrel/none | Rstest | 8 | 0.04 | 0.29 | 0.48 |
| warm / main/barrel/none | Rstest vmForks | 8 | 0.04 | 0.25 | 0.45 |
| warm / main/react/none | Rstest | 8 | 0.00 | 1.36 | 1.67 |
| warm / main/react/none | Rstest vmForks | 8 | 0.00 | 0.78 | 1.13 |
| warm / coverage/backend/none | Rstest | 8 | 0.04 | 0.45 | 0.64 |
| warm / coverage/backend/none | Rstest vmForks | 8 | 0.03 | 0.48 | 0.68 |
| warm / coverage/backend/v8 | Rstest | 8 | 0.04 | 0.61 | 0.88 |
| warm / coverage/backend/v8 | Rstest vmForks | 8 | 0.04 | 0.62 | 0.94 |
| warm / coverage/backend/istanbul | Rstest | 8 | 0.06 | 0.51 | 0.83 |
| warm / coverage/backend/istanbul | Rstest vmForks | 8 | 0.06 | 0.58 | 0.85 |
| warm / coverage/react/none | Rstest | 8 | 0.00 | 1.42 | 2.00 |
| warm / coverage/react/none | Rstest vmForks | 8 | 0.00 | 0.89 | 1.33 |
| warm / coverage/react/v8 | Rstest | 8 | 0.00 | 1.63 | 2.04 |
| warm / coverage/react/v8 | Rstest vmForks | 8 | 0.00 | 1.03 | 1.48 |
| warm / coverage/react/istanbul | Rstest | 8 | 0.01 | 1.42 | 1.79 |
| warm / coverage/react/istanbul | Rstest vmForks | 8 | 0.00 | 0.78 | 1.19 |
| warm / browser/react/none | Rstest | 8 | 0.32 | 1.07 | 1.65 |

## Samples and provenance

[Full variability](variability.md). See [result.json](result.json) for all samples, warmups, counts, cache actions, fixture/config hashes, resolved dependencies and coverage file inventories. Local commands, executable paths and log paths are omitted; cache paths are workspace-relative. publication.sourceSha256 identifies the original result. Full logs and source snapshots remain in the local run directory.

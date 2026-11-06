# Jest + SWC / Vitest / Rstest / Rstest vmForks comparison

Status: **completed**. 2026-11-06T06:08:56.291Z. Node v24.11.1; Apple M4 Max; darwin arm64.

Published packages: jest 30.5.2, vitest 5.1.0, rstest 0.12.6, rstest-vmForks 0.12.6.

8 measured runs per framework/case/cache condition; medians. Each sample is a fresh process. Warm cache: one warmup after clearing caches; cold cache: cleared before every measured run. Node compile cache disabled; OS page cache and background load uncontrolled. Framework defaults, except explicitly named variants.

RSS is OS /usr/bin/time maxrss (MiB), not simultaneous aggregate process-tree memory. Percentages use Jest when present, Vitest for browser mode, otherwise the first listed framework as baseline. Negative means less time or memory. Installations and generation are outside timing. All samples retained.

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

| Case | Jest + SWC | Vitest | Rstest | Rstest vmForks | Notes |
| --- | --- | --- | --- | --- | --- |
| main/minimal-node/none | 0.442s | 0.304s (-31.2%) | 🥇 0.241s (-45.6%) | 🥈 0.256s (-42.1%) | — |
| main/minimal-react/none | 0.765s | 0.641s (-16.1%) | 🥇 0.506s (-33.8%) | 🥈 0.539s (-29.5%) | — |
| main/startup/none | 0.651s | 0.344s (-47.2%) | 🥇 0.272s (-58.3%) | 🥈 0.297s (-54.3%) | — |
| main/many-files/none | 🥈 3.204s | 7.062s (+120.4%) | 4.621s (+44.2%) | 🥇 1.110s (-65.3%) | Vitest CV > 10% |
| main/module-graph/none | 7.169s | 4.695s (-34.5%) | 🥈 1.010s (-85.9%) | 🥇 0.780s (-89.1%) | Rstest vmForks CV > 10% |
| main/backend/none | 1.151s | 0.880s (-23.5%) | 🥇 0.628s (-45.4%) | 🥈 0.729s (-36.6%) | Vitest CV > 10%; Rstest CV > 10%; Rstest vmForks CV > 10% |
| main/barrel/none | 21.992s | 9.939s (-54.8%) | 🥈 0.561s (-97.4%) | 🥇 0.468s (-97.9%) | Vitest CV > 10%; Rstest CV > 10%; Rstest vmForks CV > 10% |
| main/react/none | 2.388s | 3.942s (+65.1%) | 🥈 1.742s (-27.1%) | 🥇 1.175s (-50.8%) | — |
| coverage/backend/none | 1.261s | 0.902s (-28.5%) | 🥇 0.690s (-45.3%) | 🥈 0.755s (-40.1%) | Rstest CV > 10% |
| coverage/backend/v8 | 1.596s | 1.036s (-35.1%) | 🥇 0.858s (-46.2%) | 🥈 0.885s (-44.5%) | — |
| coverage/backend/istanbul | 2.701s | 1.262s (-53.3%) | 🥇 1.074s (-60.2%) | 🥈 1.227s (-54.6%) | Jest + SWC CV > 10%; Vitest CV > 10%; Rstest CV > 10%; Rstest vmForks CV > 10% |
| coverage/react/none | 2.391s | 3.919s (+63.9%) | 🥈 1.658s (-30.6%) | 🥇 1.080s (-54.8%) | Jest + SWC CV > 10%; Rstest CV > 10%; Rstest vmForks CV > 10% |
| coverage/react/v8 | 3.248s | 4.219s (+29.9%) | 🥈 2.079s (-36.0%) | 🥇 1.493s (-54.0%) | — |
| coverage/react/istanbul | 3.822s | 4.165s (+9.0%) | 🥈 1.932s (-49.4%) | 🥇 1.429s (-62.6%) | Rstest CV > 10% |
| browser/react/none | — | 🥈 2.387s | 🥇 1.640s (-31.3%) | — | — |

### RSS (MiB)

| Case | Jest + SWC | Vitest | Rstest | Rstest vmForks | Notes |
| --- | --- | --- | --- | --- | --- |
| main/minimal-node/none | 🥇 101.7 | 🥈 116.5 (+14.5%) | 129.6 (+27.4%) | 128.9 (+26.7%) | — |
| main/minimal-react/none | 🥈 182.5 | 🥇 157.7 (-13.6%) | 262.3 (+43.8%) | 262.4 (+43.8%) | — |
| main/startup/none | 🥇 93.2 | 🥈 122.8 (+31.8%) | 140.1 (+50.3%) | 139.5 (+49.7%) | — |
| main/many-files/none | 🥇 202.2 | 🥈 217.2 (+7.5%) | 385.7 (+90.8%) | 286.7 (+41.8%) | — |
| main/module-graph/none | 🥇 207.6 | 312.0 (+50.3%) | 372.6 (+79.5%) | 🥈 287.5 (+38.5%) | — |
| main/backend/none | 🥈 151.9 | 🥇 137.4 (-9.5%) | 154.9 (+2.0%) | 155.4 (+2.4%) | — |
| main/barrel/none | 363.3 | 429.6 (+18.3%) | 🥇 163.5 (-55.0%) | 🥈 163.7 (-54.9%) | — |
| main/react/none | 🥈 182.5 | 🥇 176.9 (-3.1%) | 444.2 (+143.3%) | 357.9 (+96.1%) | — |
| coverage/backend/none | 🥈 146.8 | 🥇 138.2 (-5.9%) | 154.6 (+5.3%) | 154.6 (+5.3%) | — |
| coverage/backend/v8 | 🥈 170.6 | 🥇 170.5 (-0.0%) | 193.8 (+13.6%) | 196.5 (+15.2%) | — |
| coverage/backend/istanbul | 🥈 232.2 | 🥇 178.0 (-23.3%) | 338.0 (+45.5%) | 334.8 (+44.2%) | — |
| coverage/react/none | 🥈 180.8 | 🥇 174.9 (-3.3%) | 442.9 (+145.0%) | 366.0 (+102.5%) | — |
| coverage/react/v8 | 🥈 233.8 | 🥇 187.1 (-19.9%) | 673.4 (+188.1%) | 558.9 (+139.1%) | — |
| coverage/react/istanbul | 🥈 231.6 | 🥇 184.4 (-20.4%) | 578.0 (+149.6%) | 493.5 (+113.1%) | — |
| browser/react/none | — | 🥈 1126.0 | 🥇 458.7 (-59.3%) | — | — |

## warm framework cache

### Elapsed time

| Case | Jest + SWC | Vitest | Rstest | Rstest vmForks | Notes |
| --- | --- | --- | --- | --- | --- |
| main/minimal-node/none | 🥇 0.206s | 0.270s (+31.0%) | 🥈 0.234s (+13.2%) | 0.268s (+30.0%) | Vitest CV > 10%; Rstest vmForks CV > 10% |
| main/minimal-react/none | 🥈 0.524s | 0.576s (+10.0%) | 🥇 0.499s (-4.7%) | 0.528s (+0.8%) | — |
| main/startup/none | 🥇 0.257s | 0.280s (+8.8%) | 🥈 0.266s (+3.4%) | 0.291s (+13.3%) | — |
| main/many-files/none | 🥈 2.198s | 6.212s (+182.6%) | 4.470s (+103.4%) | 🥇 1.104s (-49.8%) | Rstest vmForks CV > 10% |
| main/module-graph/none | 2.377s | 3.095s (+30.2%) | 🥈 0.966s (-59.4%) | 🥇 0.750s (-68.4%) | Jest + SWC CV > 10%; Rstest vmForks CV > 10% |
| main/backend/none | 0.796s | 0.760s (-4.5%) | 🥇 0.703s (-11.6%) | 🥈 0.729s (-8.4%) | Jest + SWC CV > 10%; Vitest CV > 10%; Rstest CV > 10%; Rstest vmForks CV > 10% |
| main/barrel/none | 5.204s | 5.428s (+4.3%) | 🥈 0.480s (-90.8%) | 🥇 0.455s (-91.3%) | Jest + SWC CV > 10%; Vitest CV > 10%; Rstest CV > 10% |
| main/react/none | 2.258s | 4.040s (+78.9%) | 🥈 1.669s (-26.1%) | 🥇 1.126s (-50.1%) | Vitest CV > 10%; Rstest CV > 10% |
| coverage/backend/none | 0.757s | 0.784s (+3.6%) | 🥇 0.638s (-15.6%) | 🥈 0.684s (-9.7%) | Jest + SWC CV > 10%; Rstest CV > 10% |
| coverage/backend/v8 | 3.044s | 1.063s (-65.1%) | 🥇 0.881s (-71.0%) | 🥈 0.935s (-69.3%) | Rstest vmForks CV > 10% |
| coverage/backend/istanbul | 1.415s | 1.055s (-25.5%) | 🥇 0.832s (-41.2%) | 🥈 0.853s (-39.7%) | Jest + SWC CV > 10%; Vitest CV > 10%; Rstest CV > 10%; Rstest vmForks CV > 10% |
| coverage/react/none | 2.126s | 3.949s (+85.7%) | 🥈 1.998s (-6.1%) | 🥇 1.332s (-37.3%) | Vitest CV > 10%; Rstest CV > 10%; Rstest vmForks CV > 10% |
| coverage/react/v8 | 3.015s | 4.029s (+33.6%) | 🥈 2.036s (-32.5%) | 🥇 1.478s (-51.0%) | — |
| coverage/react/istanbul | 2.876s | 4.121s (+43.3%) | 🥈 1.791s (-37.7%) | 🥇 1.192s (-58.5%) | Rstest vmForks CV > 10% |
| browser/react/none | — | 🥈 2.308s | 🥇 1.652s (-28.4%) | — | — |

### RSS (MiB)

| Case | Jest + SWC | Vitest | Rstest | Rstest vmForks | Notes |
| --- | --- | --- | --- | --- | --- |
| main/minimal-node/none | 🥇 94.9 | 🥈 114.2 (+20.3%) | 129.0 (+36.0%) | 129.1 (+36.1%) | — |
| main/minimal-react/none | 🥈 170.8 | 🥇 159.0 (-6.9%) | 268.6 (+57.3%) | 267.3 (+56.5%) | — |
| main/startup/none | 🥇 107.7 | 🥈 116.7 (+8.4%) | 139.3 (+29.3%) | 138.6 (+28.8%) | — |
| main/many-files/none | 🥇 195.0 | 🥈 200.8 (+3.0%) | 388.0 (+98.9%) | 288.2 (+47.8%) | — |
| main/module-graph/none | 🥇 192.8 | 🥈 239.4 (+24.2%) | 390.2 (+102.5%) | 286.0 (+48.4%) | — |
| main/backend/none | 284.4 | 🥇 126.6 (-55.5%) | 🥈 154.7 (-45.6%) | 155.3 (-45.4%) | — |
| main/barrel/none | 277.6 | 398.3 (+43.5%) | 🥇 163.1 (-41.3%) | 🥈 164.1 (-40.9%) | — |
| main/react/none | 🥇 174.2 | 🥈 178.2 (+2.3%) | 436.4 (+150.5%) | 364.0 (+109.0%) | — |
| coverage/backend/none | 294.6 | 🥇 126.5 (-57.1%) | 🥈 154.7 (-47.5%) | 155.2 (-47.3%) | — |
| coverage/backend/v8 | 391.7 | 🥇 165.4 (-57.8%) | 🥈 192.9 (-50.7%) | 198.7 (-49.3%) | — |
| coverage/backend/istanbul | 308.0 | 🥇 168.4 (-45.3%) | 193.8 (-37.1%) | 🥈 192.7 (-37.4%) | — |
| coverage/react/none | 🥇 174.8 | 🥈 178.9 (+2.3%) | 438.4 (+150.8%) | 356.9 (+104.1%) | — |
| coverage/react/v8 | 🥈 225.4 | 🥇 189.2 (-16.1%) | 658.5 (+192.1%) | 562.3 (+149.4%) | — |
| coverage/react/istanbul | 🥈 179.3 | 🥇 177.3 (-1.1%) | 469.3 (+161.8%) | 396.2 (+121.0%) | — |
| browser/react/none | — | 🥈 985.0 | 🥇 446.4 (-54.7%) | — | — |

## Rstest phase timings

Medians in seconds from the reporter. Build includes run preparation and compilation; runtime includes worker scheduling, module loading, test execution and worker fixture cleanup. Process wall time also includes CLI startup and final teardown. Each column is an independent median and need not add up exactly.

| Cache / case | Pool | n | Build | Runtime | Process wall time |
| --- | --- | --- | --- | --- | --- |
| cold / main/minimal-node/none | Rstest | 8 | 0.018 | 0.064 | 0.241 |
| cold / main/minimal-node/none | Rstest vmForks | 8 | 0.018 | 0.087 | 0.256 |
| cold / main/minimal-react/none | Rstest | 8 | 0.001 | 0.243 | 0.506 |
| cold / main/minimal-react/none | Rstest vmForks | 8 | 0.001 | 0.263 | 0.539 |
| cold / main/startup/none | Rstest | 8 | 0.023 | 0.101 | 0.272 |
| cold / main/startup/none | Rstest vmForks | 8 | 0.024 | 0.110 | 0.297 |
| cold / main/many-files/none | Rstest | 8 | 0.188 | 4.170 | 4.621 |
| cold / main/many-files/none | Rstest vmForks | 8 | 0.179 | 0.681 | 1.110 |
| cold / main/module-graph/none | Rstest | 8 | 0.128 | 0.717 | 1.010 |
| cold / main/module-graph/none | Rstest vmForks | 8 | 0.118 | 0.472 | 0.780 |
| cold / main/backend/none | Rstest | 8 | 0.035 | 0.435 | 0.628 |
| cold / main/backend/none | Rstest vmForks | 8 | 0.034 | 0.532 | 0.729 |
| cold / main/barrel/none | Rstest | 8 | 0.074 | 0.299 | 0.561 |
| cold / main/barrel/none | Rstest vmForks | 8 | 0.043 | 0.235 | 0.468 |
| cold / main/react/none | Rstest | 8 | 0.003 | 1.429 | 1.742 |
| cold / main/react/none | Rstest vmForks | 8 | 0.003 | 0.841 | 1.175 |
| cold / coverage/backend/none | Rstest | 8 | 0.040 | 0.490 | 0.690 |
| cold / coverage/backend/none | Rstest vmForks | 8 | 0.035 | 0.524 | 0.755 |
| cold / coverage/backend/v8 | Rstest | 8 | 0.036 | 0.587 | 0.858 |
| cold / coverage/backend/v8 | Rstest vmForks | 8 | 0.037 | 0.602 | 0.885 |
| cold / coverage/backend/istanbul | Rstest | 8 | 0.334 | 0.505 | 1.074 |
| cold / coverage/backend/istanbul | Rstest vmForks | 8 | 0.359 | 0.562 | 1.227 |
| cold / coverage/react/none | Rstest | 8 | 0.003 | 1.325 | 1.658 |
| cold / coverage/react/none | Rstest vmForks | 8 | 0.003 | 0.748 | 1.080 |
| cold / coverage/react/v8 | Rstest | 8 | 0.003 | 1.646 | 2.079 |
| cold / coverage/react/v8 | Rstest vmForks | 8 | 0.003 | 1.048 | 1.493 |
| cold / coverage/react/istanbul | Rstest | 8 | 0.006 | 1.355 | 1.932 |
| cold / coverage/react/istanbul | Rstest vmForks | 8 | 0.004 | 0.801 | 1.429 |
| cold / browser/react/none | Rstest | 8 | 0.327 | 1.059 | 1.640 |
| warm / main/minimal-node/none | Rstest | 8 | 0.019 | 0.063 | 0.234 |
| warm / main/minimal-node/none | Rstest vmForks | 8 | 0.019 | 0.087 | 0.268 |
| warm / main/minimal-react/none | Rstest | 8 | 0.002 | 0.245 | 0.499 |
| warm / main/minimal-react/none | Rstest vmForks | 8 | 0.002 | 0.265 | 0.528 |
| warm / main/startup/none | Rstest | 8 | 0.023 | 0.092 | 0.266 |
| warm / main/startup/none | Rstest vmForks | 8 | 0.023 | 0.114 | 0.291 |
| warm / main/many-files/none | Rstest | 8 | 0.180 | 4.003 | 4.470 |
| warm / main/many-files/none | Rstest vmForks | 8 | 0.177 | 0.668 | 1.104 |
| warm / main/module-graph/none | Rstest | 8 | 0.115 | 0.685 | 0.966 |
| warm / main/module-graph/none | Rstest vmForks | 8 | 0.116 | 0.457 | 0.750 |
| warm / main/backend/none | Rstest | 8 | 0.036 | 0.471 | 0.703 |
| warm / main/backend/none | Rstest vmForks | 8 | 0.036 | 0.515 | 0.729 |
| warm / main/barrel/none | Rstest | 8 | 0.042 | 0.286 | 0.480 |
| warm / main/barrel/none | Rstest vmForks | 8 | 0.041 | 0.247 | 0.455 |
| warm / main/react/none | Rstest | 8 | 0.003 | 1.357 | 1.669 |
| warm / main/react/none | Rstest vmForks | 8 | 0.003 | 0.781 | 1.126 |
| warm / coverage/backend/none | Rstest | 8 | 0.036 | 0.448 | 0.638 |
| warm / coverage/backend/none | Rstest vmForks | 8 | 0.034 | 0.476 | 0.684 |
| warm / coverage/backend/v8 | Rstest | 8 | 0.038 | 0.613 | 0.881 |
| warm / coverage/backend/v8 | Rstest vmForks | 8 | 0.037 | 0.618 | 0.935 |
| warm / coverage/backend/istanbul | Rstest | 8 | 0.063 | 0.512 | 0.832 |
| warm / coverage/backend/istanbul | Rstest vmForks | 8 | 0.059 | 0.582 | 0.853 |
| warm / coverage/react/none | Rstest | 8 | 0.004 | 1.415 | 1.998 |
| warm / coverage/react/none | Rstest vmForks | 8 | 0.004 | 0.885 | 1.332 |
| warm / coverage/react/v8 | Rstest | 8 | 0.003 | 1.633 | 2.036 |
| warm / coverage/react/v8 | Rstest vmForks | 8 | 0.003 | 1.030 | 1.478 |
| warm / coverage/react/istanbul | Rstest | 8 | 0.010 | 1.422 | 1.791 |
| warm / coverage/react/istanbul | Rstest vmForks | 8 | 0.004 | 0.782 | 1.192 |
| warm / browser/react/none | Rstest | 8 | 0.324 | 1.074 | 1.652 |

## Samples and provenance

[Full variability](variability.md). See [result.json](result.json) for all samples, warmups, counts, cache actions, fixture/config hashes, resolved dependencies and coverage file inventories. The full local run directory retains logs, generated workspaces and source snapshots; this bundle preserves the report, variability data and all samples in result.json. Local commands, executable paths and log paths are omitted; cache paths are workspace-relative. publication.sourceSha256 identifies the original result.

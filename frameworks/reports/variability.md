# Variability

CV is shown with absolute standard deviation and range; CV alone does not establish a meaningful fluctuation or regression.

| Cache / case | Framework | n | Time median | Time min–max | Time SD | Time CV | RSS median | RSS CV |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| cold / minimal-node | Jest + SWC | 8 | 0.44s | 0.42–0.51s | 0.03s | 6.24% | 101.73 MiB | 0.66% |
| cold / minimal-node | Vitest | 8 | 0.30s | 0.30–0.33s | 0.01s | 3.63% | 116.45 MiB | 0.88% |
| cold / minimal-node | Rstest | 8 | 0.24s | 0.23–0.29s | 0.02s | 8.22% | 129.59 MiB | 0.70% |
| cold / minimal-node | Rstest vmForks | 8 | 0.26s | 0.24–0.27s | 0.01s | 3.47% | 128.85 MiB | 0.65% |
| cold / minimal-react | Jest + SWC | 8 | 0.76s | 0.74–0.90s | 0.05s | 6.58% | 182.49 MiB | 2.65% |
| cold / minimal-react | Vitest | 8 | 0.64s | 0.59–0.70s | 0.04s | 6.90% | 157.73 MiB | 1.18% |
| cold / minimal-react | Rstest | 8 | 0.51s | 0.48–0.60s | 0.04s | 7.16% | 262.34 MiB | 1.97% |
| cold / minimal-react | Rstest vmForks | 8 | 0.54s | 0.51–0.56s | 0.02s | 4.08% | 262.43 MiB | 1.25% |
| cold / startup | Jest + SWC | 8 | 0.65s | 0.63–0.68s | 0.01s | 1.95% | 93.20 MiB | 0.42% |
| cold / startup | Vitest | 8 | 0.34s | 0.33–0.36s | 0.01s | 3.53% | 122.80 MiB | 1.12% |
| cold / startup | Rstest | 8 | 0.27s | 0.25–0.29s | 0.01s | 3.79% | 140.07 MiB | 0.70% |
| cold / startup | Rstest vmForks | 8 | 0.30s | 0.27–0.34s | 0.02s | 7.06% | 139.54 MiB | 1.30% |
| cold / many-files | Jest + SWC | 8 | 3.20s | 2.86–3.50s | 0.21s | 6.47% | 202.16 MiB | 1.64% |
| cold / many-files | Vitest | 8 | 7.06s | 6.52–9.06s | 0.77s | 10.63% | 217.23 MiB | 0.67% |
| cold / many-files | Rstest | 8 | 4.62s | 4.27–5.06s | 0.31s | 6.63% | 385.74 MiB | 1.31% |
| cold / many-files | Rstest vmForks | 8 | 1.11s | 1.06–1.30s | 0.08s | 6.72% | 286.70 MiB | 0.56% |
| cold / module-graph | Jest + SWC | 8 | 7.17s | 6.86–7.76s | 0.32s | 4.40% | 207.59 MiB | 2.99% |
| cold / module-graph | Vitest | 8 | 4.69s | 4.17–5.31s | 0.44s | 9.30% | 311.98 MiB | 3.19% |
| cold / module-graph | Rstest | 8 | 1.01s | 0.97–1.18s | 0.07s | 6.77% | 372.55 MiB | 3.87% |
| cold / module-graph | Rstest vmForks | 8 | 0.78s | 0.74–1.25s | 0.17s | 20.27% | 287.53 MiB | 2.68% |
| cold / backend | Jest + SWC | 8 | 1.15s | 1.11–1.35s | 0.09s | 7.37% | 151.85 MiB | 3.62% |
| cold / backend | Vitest | 8 | 0.88s | 0.83–1.25s | 0.14s | 14.96% | 137.45 MiB | 1.98% |
| cold / backend | Rstest | 8 | 0.63s | 0.59–0.93s | 0.11s | 16.75% | 154.85 MiB | 0.58% |
| cold / backend | Rstest vmForks | 8 | 0.73s | 0.62–1.02s | 0.12s | 15.99% | 155.45 MiB | 0.65% |
| cold / barrel | Jest + SWC | 8 | 21.99s | 20.32–24.61s | 1.44s | 6.54% | 363.26 MiB | 6.74% |
| cold / barrel | Vitest | 8 | 9.94s | 9.20–12.47s | 1.09s | 10.58% | 429.61 MiB | 5.61% |
| cold / barrel | Rstest | 8 | 0.56s | 0.47–0.69s | 0.07s | 13.32% | 163.47 MiB | 0.88% |
| cold / barrel | Rstest vmForks | 8 | 0.47s | 0.42–0.55s | 0.06s | 11.84% | 163.73 MiB | 0.96% |
| cold / react | Jest + SWC | 8 | 2.39s | 2.29–2.72s | 0.16s | 6.46% | 182.54 MiB | 1.45% |
| cold / react | Vitest | 8 | 3.94s | 3.82–4.28s | 0.16s | 3.91% | 176.92 MiB | 1.93% |
| cold / react | Rstest | 8 | 1.74s | 1.66–1.80s | 0.04s | 2.34% | 444.17 MiB | 1.84% |
| cold / react | Rstest vmForks | 8 | 1.18s | 1.09–1.25s | 0.06s | 5.01% | 357.92 MiB | 1.34% |
| cold / backend (coverage off) | Jest + SWC | 8 | 1.26s | 1.13–1.43s | 0.10s | 7.62% | 146.84 MiB | 5.96% |
| cold / backend (coverage off) | Vitest | 8 | 0.90s | 0.87–0.96s | 0.03s | 3.66% | 138.24 MiB | 1.13% |
| cold / backend (coverage off) | Rstest | 8 | 0.69s | 0.63–0.86s | 0.08s | 10.63% | 154.61 MiB | 1.06% |
| cold / backend (coverage off) | Rstest vmForks | 8 | 0.76s | 0.66–0.85s | 0.07s | 8.81% | 154.64 MiB | 0.72% |
| cold / backend (v8) | Jest + SWC | 8 | 1.60s | 1.46–1.87s | 0.16s | 9.75% | 170.59 MiB | 0.96% |
| cold / backend (v8) | Vitest | 8 | 1.04s | 0.97–1.28s | 0.10s | 9.42% | 170.52 MiB | 1.70% |
| cold / backend (v8) | Rstest | 8 | 0.86s | 0.80–0.98s | 0.06s | 6.74% | 193.79 MiB | 1.83% |
| cold / backend (v8) | Rstest vmForks | 8 | 0.89s | 0.82–0.97s | 0.05s | 6.05% | 196.46 MiB | 1.86% |
| cold / backend (istanbul) | Jest + SWC | 8 | 2.70s | 2.19–3.84s | 0.50s | 18.29% | 232.23 MiB | 1.58% |
| cold / backend (istanbul) | Vitest | 8 | 1.26s | 1.00–1.88s | 0.30s | 22.86% | 178.04 MiB | 1.78% |
| cold / backend (istanbul) | Rstest | 8 | 1.07s | 0.91–1.74s | 0.33s | 26.61% | 337.98 MiB | 2.60% |
| cold / backend (istanbul) | Rstest vmForks | 8 | 1.23s | 0.96–1.56s | 0.23s | 18.41% | 334.81 MiB | 1.57% |
| cold / react (coverage off) | Jest + SWC | 8 | 2.39s | 2.23–3.21s | 0.33s | 13.32% | 180.79 MiB | 1.94% |
| cold / react (coverage off) | Vitest | 8 | 3.92s | 3.77–4.74s | 0.40s | 9.90% | 174.86 MiB | 2.88% |
| cold / react (coverage off) | Rstest | 8 | 1.66s | 1.56–2.33s | 0.30s | 16.75% | 442.92 MiB | 3.74% |
| cold / react (coverage off) | Rstest vmForks | 8 | 1.08s | 1.04–2.02s | 0.34s | 27.63% | 366.02 MiB | 2.12% |
| cold / react (v8) | Jest + SWC | 8 | 3.25s | 3.19–4.15s | 0.32s | 9.64% | 233.76 MiB | 3.59% |
| cold / react (v8) | Vitest | 8 | 4.22s | 3.94–4.62s | 0.19s | 4.58% | 187.13 MiB | 3.11% |
| cold / react (v8) | Rstest | 8 | 2.08s | 1.98–2.19s | 0.07s | 3.54% | 673.41 MiB | 4.60% |
| cold / react (v8) | Rstest vmForks | 8 | 1.49s | 1.43–1.67s | 0.08s | 5.04% | 558.93 MiB | 4.55% |
| cold / react (istanbul) | Jest + SWC | 8 | 3.82s | 3.68–4.26s | 0.20s | 5.04% | 231.59 MiB | 2.44% |
| cold / react (istanbul) | Vitest | 8 | 4.17s | 3.87–4.75s | 0.29s | 6.93% | 184.40 MiB | 1.85% |
| cold / react (istanbul) | Rstest | 8 | 1.93s | 1.82–2.78s | 0.31s | 15.34% | 578.03 MiB | 1.51% |
| cold / react (istanbul) | Rstest vmForks | 8 | 1.43s | 1.33–1.73s | 0.12s | 8.29% | 493.47 MiB | 1.61% |
| cold / react (browser) | Vitest | 8 | 2.39s | 2.30–2.79s | 0.16s | 6.58% | 1126.05 MiB | 3.47% |
| cold / react (browser) | Rstest | 8 | 1.64s | 1.56–1.86s | 0.10s | 6.02% | 458.66 MiB | 1.43% |
| warm / minimal-node | Jest + SWC | 8 | 0.21s | 0.20–0.24s | 0.01s | 5.96% | 94.88 MiB | 0.51% |
| warm / minimal-node | Vitest | 8 | 0.27s | 0.22–0.30s | 0.03s | 10.99% | 114.16 MiB | 1.13% |
| warm / minimal-node | Rstest | 8 | 0.23s | 0.22–0.26s | 0.01s | 6.19% | 129.01 MiB | 1.11% |
| warm / minimal-node | Rstest vmForks | 8 | 0.27s | 0.25–0.32s | 0.03s | 10.08% | 129.13 MiB | 1.17% |
| warm / minimal-react | Jest + SWC | 8 | 0.52s | 0.50–0.56s | 0.02s | 4.25% | 170.76 MiB | 0.69% |
| warm / minimal-react | Vitest | 8 | 0.58s | 0.57–0.61s | 0.02s | 2.75% | 159.03 MiB | 0.75% |
| warm / minimal-react | Rstest | 8 | 0.50s | 0.49–0.51s | 0.01s | 1.16% | 268.55 MiB | 1.70% |
| warm / minimal-react | Rstest vmForks | 8 | 0.53s | 0.52–0.59s | 0.03s | 4.70% | 267.31 MiB | 1.24% |
| warm / startup | Jest + SWC | 8 | 0.26s | 0.25–0.30s | 0.01s | 5.67% | 107.67 MiB | 1.15% |
| warm / startup | Vitest | 8 | 0.28s | 0.26–0.30s | 0.01s | 5.28% | 116.68 MiB | 0.60% |
| warm / startup | Rstest | 8 | 0.27s | 0.25–0.27s | 0.01s | 2.82% | 139.25 MiB | 0.85% |
| warm / startup | Rstest vmForks | 8 | 0.29s | 0.27–0.33s | 0.02s | 6.56% | 138.64 MiB | 0.94% |
| warm / many-files | Jest + SWC | 8 | 2.20s | 2.02–2.47s | 0.15s | 6.60% | 195.02 MiB | 3.10% |
| warm / many-files | Vitest | 8 | 6.21s | 6.09–6.63s | 0.17s | 2.66% | 200.84 MiB | 2.93% |
| warm / many-files | Rstest | 8 | 4.47s | 4.30–4.84s | 0.21s | 4.54% | 387.97 MiB | 1.14% |
| warm / many-files | Rstest vmForks | 8 | 1.10s | 1.07–1.42s | 0.13s | 11.36% | 288.22 MiB | 0.75% |
| warm / module-graph | Jest + SWC | 8 | 2.38s | 2.31–3.26s | 0.37s | 14.37% | 192.76 MiB | 3.76% |
| warm / module-graph | Vitest | 8 | 3.10s | 3.03–3.74s | 0.24s | 7.43% | 239.39 MiB | 1.90% |
| warm / module-graph | Rstest | 8 | 0.97s | 0.94–1.15s | 0.07s | 6.93% | 390.24 MiB | 3.30% |
| warm / module-graph | Rstest vmForks | 8 | 0.75s | 0.73–1.10s | 0.13s | 15.95% | 286.01 MiB | 1.30% |
| warm / backend | Jest + SWC | 8 | 0.80s | 0.73–1.17s | 0.16s | 18.25% | 284.42 MiB | 2.93% |
| warm / backend | Vitest | 8 | 0.76s | 0.73–1.03s | 0.10s | 12.38% | 126.57 MiB | 1.08% |
| warm / backend | Rstest | 8 | 0.70s | 0.62–0.88s | 0.08s | 11.54% | 154.72 MiB | 1.41% |
| warm / backend | Rstest vmForks | 8 | 0.73s | 0.64–1.09s | 0.14s | 18.66% | 155.31 MiB | 0.61% |
| warm / barrel | Jest + SWC | 8 | 5.20s | 4.81–10.04s | 1.75s | 29.62% | 277.62 MiB | 5.46% |
| warm / barrel | Vitest | 8 | 5.43s | 5.19–8.09s | 0.99s | 16.83% | 398.31 MiB | 4.95% |
| warm / barrel | Rstest | 8 | 0.48s | 0.46–0.76s | 0.10s | 19.89% | 163.08 MiB | 0.67% |
| warm / barrel | Rstest vmForks | 8 | 0.45s | 0.43–0.53s | 0.04s | 8.90% | 164.14 MiB | 0.82% |
| warm / react | Jest + SWC | 8 | 2.26s | 2.09–2.71s | 0.21s | 9.21% | 174.19 MiB | 1.89% |
| warm / react | Vitest | 8 | 4.04s | 3.65–5.59s | 0.60s | 14.40% | 178.22 MiB | 2.42% |
| warm / react | Rstest | 8 | 1.67s | 1.58–2.78s | 0.46s | 24.10% | 436.37 MiB | 4.49% |
| warm / react | Rstest vmForks | 8 | 1.13s | 1.07–1.26s | 0.06s | 5.61% | 364.05 MiB | 1.51% |
| warm / backend (coverage off) | Jest + SWC | 8 | 0.76s | 0.73–1.55s | 0.28s | 33.08% | 294.61 MiB | 3.54% |
| warm / backend (coverage off) | Vitest | 8 | 0.78s | 0.73–0.90s | 0.05s | 6.54% | 126.52 MiB | 0.81% |
| warm / backend (coverage off) | Rstest | 8 | 0.64s | 0.61–1.22s | 0.21s | 28.43% | 154.73 MiB | 0.95% |
| warm / backend (coverage off) | Rstest vmForks | 8 | 0.68s | 0.66–0.74s | 0.03s | 4.01% | 155.22 MiB | 0.78% |
| warm / backend (v8) | Jest + SWC | 8 | 3.04s | 2.94–3.40s | 0.16s | 5.15% | 391.67 MiB | 4.18% |
| warm / backend (v8) | Vitest | 8 | 1.06s | 0.97–1.25s | 0.08s | 7.69% | 165.45 MiB | 2.51% |
| warm / backend (v8) | Rstest | 8 | 0.88s | 0.84–1.02s | 0.07s | 7.93% | 192.93 MiB | 1.70% |
| warm / backend (v8) | Rstest vmForks | 8 | 0.94s | 0.87–1.18s | 0.10s | 10.35% | 198.71 MiB | 1.61% |
| warm / backend (istanbul) | Jest + SWC | 8 | 1.42s | 1.17–1.84s | 0.23s | 15.99% | 307.98 MiB | 1.38% |
| warm / backend (istanbul) | Vitest | 8 | 1.05s | 0.91–1.42s | 0.17s | 15.77% | 168.41 MiB | 2.39% |
| warm / backend (istanbul) | Rstest | 8 | 0.83s | 0.68–1.21s | 0.17s | 20.09% | 193.84 MiB | 0.88% |
| warm / backend (istanbul) | Rstest vmForks | 8 | 0.85s | 0.73–1.34s | 0.21s | 22.47% | 192.69 MiB | 0.71% |
| warm / react (coverage off) | Jest + SWC | 8 | 2.13s | 2.08–2.63s | 0.19s | 8.58% | 174.84 MiB | 1.14% |
| warm / react (coverage off) | Vitest | 8 | 3.95s | 3.69–5.69s | 0.66s | 15.57% | 178.91 MiB | 1.87% |
| warm / react (coverage off) | Rstest | 8 | 2.00s | 1.61–2.99s | 0.48s | 23.08% | 438.43 MiB | 2.56% |
| warm / react (coverage off) | Rstest vmForks | 8 | 1.33s | 1.05–1.50s | 0.17s | 13.03% | 356.91 MiB | 2.53% |
| warm / react (v8) | Jest + SWC | 8 | 3.01s | 2.84–3.11s | 0.10s | 3.22% | 225.43 MiB | 1.41% |
| warm / react (v8) | Vitest | 8 | 4.03s | 3.91–4.28s | 0.12s | 2.87% | 189.21 MiB | 2.30% |
| warm / react (v8) | Rstest | 8 | 2.04s | 2.01–2.39s | 0.13s | 6.19% | 658.50 MiB | 3.48% |
| warm / react (v8) | Rstest vmForks | 8 | 1.48s | 1.40–1.55s | 0.06s | 4.17% | 562.27 MiB | 6.28% |
| warm / react (istanbul) | Jest + SWC | 8 | 2.88s | 2.81–3.14s | 0.13s | 4.35% | 179.25 MiB | 4.10% |
| warm / react (istanbul) | Vitest | 8 | 4.12s | 3.75–4.90s | 0.40s | 9.37% | 177.30 MiB | 2.96% |
| warm / react (istanbul) | Rstest | 8 | 1.79s | 1.67–2.17s | 0.17s | 9.47% | 469.28 MiB | 2.79% |
| warm / react (istanbul) | Rstest vmForks | 8 | 1.19s | 1.15–1.92s | 0.26s | 20.05% | 396.18 MiB | 2.00% |
| warm / react (browser) | Vitest | 8 | 2.31s | 2.24–2.79s | 0.18s | 7.63% | 984.98 MiB | 2.97% |
| warm / react (browser) | Rstest | 8 | 1.65s | 1.56–1.89s | 0.11s | 6.35% | 446.41 MiB | 2.75% |

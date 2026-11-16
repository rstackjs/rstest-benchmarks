# Variability

CV is shown with absolute standard deviation and range; CV alone does not establish a meaningful fluctuation or regression.

| Cache / case | Framework | n | Time median | Time min–max | Time SD | Time CV | Memory median (MiB) | Memory CV |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| cold / backend | Jest + SWC | 5 | 1.03s | 0.86–1.45s | 0.23s | 21.72% | 368.57 MiB | 2.43% |
| cold / backend | Vitest | 5 | 2.47s | 1.95–2.52s | 0.26s | 11.29% | 159.03 MiB | 4.03% |
| cold / backend | Vitest vmForks | 5 | 1.36s | 1.15–1.37s | 0.12s | 9.04% | 301.48 MiB | 2.36% |
| cold / backend | Rstest | 5 | 1.74s | 1.70–2.13s | 0.18s | 9.81% | 156.51 MiB | 4.10% |
| cold / backend | Rstest vmForks | 5 | 1.14s | 1.03–1.46s | 0.18s | 15.40% | 325.40 MiB | 2.00% |
| cold / barrel | Jest + SWC | 5 | 12.21s | 8.85–17.28s | 3.47s | 25.96% | 1097.44 MiB | 2.83% |
| cold / barrel | Vitest | 5 | 18.13s | 13.46–25.64s | 4.61s | 24.34% | 586.41 MiB | 1.65% |
| cold / barrel | Vitest vmForks | 5 | 14.82s | 11.91–20.37s | 3.22s | 20.42% | 1065.72 MiB | 3.07% |
| cold / barrel | Rstest | 5 | 1.79s | 1.51–2.48s | 0.39s | 20.01% | 135.36 MiB | 2.57% |
| cold / barrel | Rstest vmForks | 5 | 0.87s | 0.67–0.98s | 0.12s | 13.57% | 166.01 MiB | 1.03% |
| cold / many-files | Jest + SWC | 5 | 5.77s | 5.45–5.98s | 0.23s | 3.94% | 457.11 MiB | 0.75% |
| cold / many-files | Vitest | 5 | 31.52s | 29.91–33.33s | 1.36s | 4.34% | 190.81 MiB | 2.41% |
| cold / many-files | Vitest vmForks | 5 | 8.39s | 7.47–12.54s | 2.00s | 22.08% | 482.04 MiB | 2.05% |
| cold / many-files | Rstest | 5 | 21.36s | 20.28–22.09s | 0.85s | 4.01% | 222.10 MiB | 3.12% |
| cold / many-files | Rstest vmForks | 5 | 3.99s | 3.49–4.34s | 0.31s | 7.81% | 447.28 MiB | 10.94% |
| cold / minimal-node | Jest + SWC | 5 | 0.56s | 0.48–0.80s | 0.13s | 21.93% | 118.30 MiB | 1.47% |
| cold / minimal-node | Vitest | 5 | 0.43s | 0.39–0.68s | 0.13s | 25.89% | 110.83 MiB | 1.78% |
| cold / minimal-node | Vitest vmForks | 5 | 0.51s | 0.49–0.53s | 0.02s | 3.23% | 129.17 MiB | 2.00% |
| cold / minimal-node | Rstest | 5 | 0.34s | 0.32–0.71s | 0.17s | 40.34% | 106.59 MiB | 3.66% |
| cold / minimal-node | Rstest vmForks | 5 | 0.44s | 0.41–0.44s | 0.02s | 3.83% | 128.52 MiB | 1.60% |
| cold / minimal-react | Jest + SWC | 5 | 0.87s | 0.71–0.91s | 0.09s | 10.25% | 230.00 MiB | 2.28% |
| cold / minimal-react | Vitest | 5 | 0.87s | 0.68–0.98s | 0.13s | 16.01% | 249.14 MiB | 1.88% |
| cold / minimal-react | Vitest vmForks | 5 | 0.83s | 0.82–0.84s | 0.01s | 1.06% | 260.76 MiB | 1.81% |
| cold / minimal-react | Rstest | 5 | 0.93s | 0.84–1.06s | 0.08s | 8.48% | 283.78 MiB | 2.62% |
| cold / minimal-react | Rstest vmForks | 5 | 0.85s | 0.73–1.18s | 0.17s | 19.03% | 293.05 MiB | 2.37% |
| cold / module-graph | Jest + SWC | 5 | 5.33s | 4.95–5.72s | 0.30s | 5.75% | 560.56 MiB | 3.98% |
| cold / module-graph | Vitest | 5 | 11.47s | 10.54–14.01s | 1.32s | 11.14% | 289.23 MiB | 0.84% |
| cold / module-graph | Vitest vmForks | 5 | 6.15s | 5.93–9.01s | 1.32s | 19.10% | 622.11 MiB | 1.47% |
| cold / module-graph | Rstest | 5 | 4.48s | 3.92–5.14s | 0.49s | 10.97% | 269.45 MiB | 3.82% |
| cold / module-graph | Rstest vmForks | 5 | 2.25s | 1.94–2.77s | 0.32s | 14.06% | 513.34 MiB | 5.85% |
| cold / react | Jest + SWC | 5 | 2.49s | 1.88–2.84s | 0.38s | 15.15% | 525.73 MiB | 1.75% |
| cold / react | Vitest | 5 | 9.20s | 7.62–11.93s | 1.84s | 19.04% | 269.42 MiB | 1.39% |
| cold / react | Vitest vmForks | 5 | 2.27s | 1.81–3.09s | 0.48s | 20.40% | 477.10 MiB | 2.88% |
| cold / react | Rstest | 5 | 6.70s | 5.04–7.61s | 1.08s | 16.95% | 337.85 MiB | 1.53% |
| cold / react | Rstest vmForks | 5 | 2.08s | 1.93–2.56s | 0.24s | 11.19% | 531.41 MiB | 1.40% |
| cold / react (browser) | Vitest | 5 | 6.22s | 5.69–6.66s | 0.39s | 6.44% | 919.54 MiB | 1.13% |
| cold / react (browser) | Rstest | 5 | 7.01s | 6.32–8.35s | 0.78s | 10.96% | 363.44 MiB | 0.92% |
| cold / startup | Jest + SWC | 5 | 0.93s | 0.81–0.98s | 0.07s | 7.18% | 132.84 MiB | 3.19% |
| cold / startup | Vitest | 5 | 0.88s | 0.75–1.16s | 0.16s | 18.06% | 115.40 MiB | 1.31% |
| cold / startup | Vitest vmForks | 5 | 0.70s | 0.65–0.83s | 0.09s | 12.28% | 138.62 MiB | 1.89% |
| cold / startup | Rstest | 5 | 0.77s | 0.66–1.26s | 0.28s | 29.80% | 118.96 MiB | 1.16% |
| cold / startup | Rstest vmForks | 5 | 0.58s | 0.49–1.00s | 0.20s | 29.90% | 139.21 MiB | 0.80% |
| warm / backend | Jest + SWC | 5 | 1.00s | 0.98–1.08s | 0.04s | 4.21% | 224.96 MiB | 1.58% |
| warm / backend | Vitest | 5 | 1.64s | 1.50–1.85s | 0.13s | 7.95% | 155.92 MiB | 2.09% |
| warm / backend | Vitest vmForks | 5 | 0.86s | 0.83–1.07s | 0.10s | 11.10% | 294.32 MiB | 2.78% |
| warm / backend | Rstest | 5 | 1.58s | 1.51–2.17s | 0.28s | 16.36% | 153.89 MiB | 1.85% |
| warm / backend | Rstest vmForks | 5 | 0.80s | 0.74–0.92s | 0.07s | 8.10% | 324.47 MiB | 3.28% |
| warm / barrel | Jest + SWC | 5 | 4.73s | 3.48–6.04s | 1.09s | 22.65% | 850.84 MiB | 2.06% |
| warm / barrel | Vitest | 5 | 8.78s | 7.88–9.77s | 0.73s | 8.48% | 492.83 MiB | 1.06% |
| warm / barrel | Vitest vmForks | 5 | 4.97s | 4.66–5.87s | 0.57s | 10.92% | 941.59 MiB | 2.90% |
| warm / barrel | Rstest | 5 | 1.44s | 1.11–1.63s | 0.25s | 17.77% | 137.85 MiB | 0.69% |
| warm / barrel | Rstest vmForks | 5 | 0.55s | 0.44–0.81s | 0.16s | 27.70% | 167.19 MiB | 1.31% |
| warm / many-files | Jest + SWC | 5 | 5.69s | 4.26–7.17s | 1.07s | 18.96% | 452.49 MiB | 0.65% |
| warm / many-files | Vitest | 5 | 33.40s | 27.60–39.08s | 4.28s | 13.00% | 156.11 MiB | 0.68% |
| warm / many-files | Vitest vmForks | 5 | 7.38s | 6.32–8.88s | 1.11s | 14.65% | 468.53 MiB | 1.71% |
| warm / many-files | Rstest | 5 | 23.70s | 20.08–27.87s | 3.24s | 13.99% | 222.49 MiB | 4.51% |
| warm / many-files | Rstest vmForks | 5 | 4.19s | 4.06–4.79s | 0.31s | 7.18% | 449.20 MiB | 11.68% |
| warm / minimal-node | Jest + SWC | 5 | 0.31s | 0.27–0.32s | 0.02s | 7.06% | 48.94 MiB | 6.46% |
| warm / minimal-node | Vitest | 5 | 0.40s | 0.34–0.44s | 0.04s | 10.10% | 106.70 MiB | 3.19% |
| warm / minimal-node | Vitest vmForks | 5 | 0.45s | 0.41–0.49s | 0.03s | 7.47% | 124.13 MiB | 3.70% |
| warm / minimal-node | Rstest | 5 | 0.37s | 0.34–0.63s | 0.12s | 29.24% | 116.85 MiB | 5.40% |
| warm / minimal-node | Rstest vmForks | 5 | 0.45s | 0.40–0.56s | 0.06s | 13.05% | 131.15 MiB | 2.97% |
| warm / minimal-react | Jest + SWC | 5 | 0.62s | 0.56–0.72s | 0.06s | 10.28% | 131.29 MiB | 3.16% |
| warm / minimal-react | Vitest | 5 | 0.79s | 0.77–0.88s | 0.05s | 5.61% | 245.36 MiB | 2.43% |
| warm / minimal-react | Vitest vmForks | 5 | 0.86s | 0.79–0.92s | 0.05s | 6.19% | 254.40 MiB | 2.32% |
| warm / minimal-react | Rstest | 5 | 0.60s | 0.56–0.94s | 0.16s | 23.95% | 278.85 MiB | 2.75% |
| warm / minimal-react | Rstest vmForks | 5 | 0.66s | 0.65–1.00s | 0.16s | 20.70% | 286.72 MiB | 1.04% |
| warm / module-graph | Jest + SWC | 5 | 2.89s | 2.39–3.83s | 0.52s | 17.49% | 531.51 MiB | 2.16% |
| warm / module-graph | Vitest | 5 | 8.72s | 7.25–11.85s | 1.79s | 19.79% | 235.44 MiB | 0.84% |
| warm / module-graph | Vitest vmForks | 5 | 4.39s | 3.92–5.05s | 0.42s | 9.30% | 557.13 MiB | 1.65% |
| warm / module-graph | Rstest | 5 | 4.32s | 3.58–4.44s | 0.35s | 8.48% | 262.30 MiB | 2.67% |
| warm / module-graph | Rstest vmForks | 5 | 2.15s | 1.81–2.84s | 0.45s | 19.33% | 516.08 MiB | 8.43% |
| warm / react | Jest + SWC | 5 | 2.23s | 2.04–2.51s | 0.20s | 8.96% | 512.99 MiB | 1.49% |
| warm / react | Vitest | 5 | 9.67s | 7.38–9.90s | 1.05s | 11.35% | 253.68 MiB | 1.77% |
| warm / react | Vitest vmForks | 5 | 2.62s | 2.03–2.81s | 0.33s | 13.13% | 455.20 MiB | 0.54% |
| warm / react | Rstest | 5 | 6.87s | 6.43–7.69s | 0.47s | 6.67% | 340.90 MiB | 4.77% |
| warm / react | Rstest vmForks | 5 | 2.46s | 2.23–3.05s | 0.33s | 13.25% | 527.04 MiB | 1.17% |
| warm / react (browser) | Vitest | 5 | 4.64s | 3.09–4.92s | 0.76s | 17.14% | 796.67 MiB | 1.26% |
| warm / react (browser) | Rstest | 5 | 6.18s | 5.97–9.21s | 1.38s | 19.68% | 357.22 MiB | 0.63% |
| warm / startup | Jest + SWC | 5 | 0.42s | 0.36–0.52s | 0.07s | 14.98% | 62.01 MiB | 1.22% |
| warm / startup | Vitest | 5 | 0.81s | 0.62–1.04s | 0.15s | 18.49% | 111.35 MiB | 1.81% |
| warm / startup | Vitest vmForks | 5 | 0.61s | 0.57–0.65s | 0.03s | 5.42% | 131.07 MiB | 2.99% |
| warm / startup | Rstest | 5 | 0.69s | 0.56–0.78s | 0.09s | 13.20% | 116.63 MiB | 2.89% |
| warm / startup | Rstest vmForks | 5 | 0.50s | 0.49–0.62s | 0.06s | 11.58% | 140.04 MiB | 2.77% |

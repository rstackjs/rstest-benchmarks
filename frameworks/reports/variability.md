# Variability

CV is shown with absolute standard deviation and range; CV alone does not establish a meaningful fluctuation or regression.

| Cache / case | Framework | n | Time median | Time min–max | Time SD | Time CV | Memory median (MiB) | Memory CV |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| cold / minimal-node | Jest + SWC | 5 | 0.33s | 0.31–0.43s | 0.05s | 14.61% | 277.49 MiB | 2.82% |
| cold / minimal-node | Vitest | 5 | 0.27s | 0.25–0.39s | 0.06s | 19.82% | 100.82 MiB | 10.17% |
| cold / minimal-node | Vitest vmForks | 5 | 0.29s | 0.28–0.31s | 0.01s | 4.52% | 128.45 MiB | 4.68% |
| cold / minimal-node | Rstest | 5 | 0.21s | 0.20–0.32s | 0.05s | 21.90% | 107.48 MiB | 4.98% |
| cold / minimal-node | Rstest vmForks | 5 | 0.22s | 0.22–0.24s | 0.01s | 4.01% | 139.47 MiB | 9.49% |
| cold / minimal-react | Jest + SWC | 5 | 0.62s | 0.58–0.76s | 0.08s | 12.05% | 395.36 MiB | 2.99% |
| cold / minimal-react | Vitest | 5 | 0.51s | 0.49–0.63s | 0.06s | 10.63% | 253.42 MiB | 2.57% |
| cold / minimal-react | Vitest vmForks | 5 | 0.50s | 0.49–0.60s | 0.04s | 8.55% | 275.20 MiB | 1.06% |
| cold / minimal-react | Rstest | 5 | 0.47s | 0.42–0.57s | 0.06s | 11.78% | 423.07 MiB | 4.73% |
| cold / minimal-react | Rstest vmForks | 5 | 0.46s | 0.44–0.60s | 0.06s | 13.13% | 426.56 MiB | 2.19% |
| cold / startup | Jest + SWC | 5 | 0.38s | 0.38–0.39s | 0.01s | 1.36% | 373.83 MiB | 3.03% |
| cold / startup | Vitest | 5 | 0.28s | 0.26–0.30s | 0.02s | 5.53% | 166.61 MiB | 13.07% |
| cold / startup | Vitest vmForks | 5 | 0.31s | 0.30–0.33s | 0.01s | 3.39% | 234.43 MiB | 4.01% |
| cold / startup | Rstest | 5 | 0.21s | 0.21–0.23s | 0.01s | 3.27% | 155.86 MiB | 5.06% |
| cold / startup | Rstest vmForks | 5 | 0.24s | 0.23–0.25s | 0.01s | 3.44% | 252.26 MiB | 1.84% |
| cold / many-files | Jest + SWC | 5 | 2.15s | 1.91–2.29s | 0.15s | 7.03% | 2199.37 MiB | 0.36% |
| cold / many-files | Vitest | 5 | 4.67s | 4.30–4.98s | 0.24s | 5.19% | 613.07 MiB | 3.07% |
| cold / many-files | Vitest vmForks | 5 | 1.85s | 1.68–2.55s | 0.42s | 20.19% | 2329.38 MiB | 3.22% |
| cold / many-files | Rstest | 5 | 3.28s | 3.12–4.69s | 0.65s | 18.36% | 534.20 MiB | 3.36% |
| cold / many-files | Rstest vmForks | 5 | 0.94s | 0.84–1.06s | 0.09s | 9.42% | 1349.10 MiB | 1.97% |
| cold / module-graph | Jest + SWC | 5 | 4.02s | 4.00–4.57s | 0.24s | 5.85% | 1993.77 MiB | 1.17% |
| cold / module-graph | Vitest | 5 | 3.15s | 2.93–4.60s | 0.69s | 20.19% | 1190.47 MiB | 2.42% |
| cold / module-graph | Vitest vmForks | 5 | 2.68s | 2.50–3.18s | 0.26s | 9.43% | 1828.53 MiB | 1.24% |
| cold / module-graph | Rstest | 5 | 0.80s | 0.71–1.00s | 0.12s | 14.60% | 806.43 MiB | 8.57% |
| cold / module-graph | Rstest vmForks | 5 | 0.59s | 0.56–0.83s | 0.11s | 17.53% | 1135.53 MiB | 3.03% |
| cold / backend | Jest + SWC | 5 | 0.72s | 0.66–1.10s | 0.18s | 22.03% | 1102.47 MiB | 0.95% |
| cold / backend | Vitest | 5 | 0.58s | 0.58–0.61s | 0.01s | 1.67% | 702.08 MiB | 3.67% |
| cold / backend | Vitest vmForks | 5 | 0.59s | 0.56–0.77s | 0.09s | 14.25% | 734.43 MiB | 7.69% |
| cold / backend | Rstest | 5 | 0.44s | 0.42–0.65s | 0.10s | 20.29% | 591.34 MiB | 6.13% |
| cold / backend | Rstest vmForks | 5 | 0.48s | 0.47–0.65s | 0.08s | 16.10% | 952.44 MiB | 1.06% |
| cold / barrel | Jest + SWC | 5 | 11.77s | 10.83–13.12s | 0.95s | 7.89% | 3522.33 MiB | 2.52% |
| cold / barrel | Vitest | 5 | 7.97s | 5.91–8.41s | 1.24s | 16.83% | 2242.67 MiB | 2.22% |
| cold / barrel | Vitest vmForks | 5 | 7.80s | 5.78–11.22s | 2.03s | 25.54% | 2376.27 MiB | 1.45% |
| cold / barrel | Rstest | 5 | 0.43s | 0.42–0.48s | 0.03s | 5.85% | 285.76 MiB | 18.46% |
| cold / barrel | Rstest vmForks | 5 | 0.37s | 0.30–0.48s | 0.06s | 17.04% | 557.81 MiB | 3.81% |
| cold / react | Jest + SWC | 5 | 1.26s | 1.12–2.22s | 0.45s | 30.10% | 1737.90 MiB | 2.99% |
| cold / react | Vitest | 5 | 1.84s | 1.58–1.98s | 0.19s | 10.54% | 1394.42 MiB | 0.56% |
| cold / react | Vitest vmForks | 5 | 1.07s | 0.90–1.14s | 0.11s | 10.13% | 1775.21 MiB | 3.73% |
| cold / react | Rstest | 5 | 1.12s | 1.04–1.17s | 0.06s | 5.41% | 1599.71 MiB | 3.76% |
| cold / react | Rstest vmForks | 5 | 0.85s | 0.72–1.03s | 0.13s | 15.19% | 1916.81 MiB | 1.33% |
| cold / react (browser) | Vitest | 5 | 1.88s | 1.74–2.24s | 0.19s | 9.68% | 1888.79 MiB | 3.03% |
| cold / react (browser) | Rstest | 5 | 1.33s | 1.21–1.36s | 0.06s | 4.96% | 743.86 MiB | 2.52% |
| warm / minimal-node | Jest + SWC | 5 | 0.19s | 0.18–0.23s | 0.02s | 11.36% | 52.29 MiB | 19.48% |
| warm / minimal-node | Vitest | 5 | 0.21s | 0.20–0.27s | 0.03s | 13.76% | 101.42 MiB | 9.29% |
| warm / minimal-node | Vitest vmForks | 5 | 0.23s | 0.23–0.27s | 0.02s | 7.53% | 128.81 MiB | 2.23% |
| warm / minimal-node | Rstest | 5 | 0.21s | 0.20–0.22s | 0.01s | 3.08% | 102.01 MiB | 10.80% |
| warm / minimal-node | Rstest vmForks | 5 | 0.23s | 0.22–0.24s | 0.01s | 4.79% | 137.84 MiB | 3.84% |
| warm / minimal-react | Jest + SWC | 5 | 0.42s | 0.41–0.51s | 0.04s | 9.33% | 126.34 MiB | 5.08% |
| warm / minimal-react | Vitest | 5 | 0.47s | 0.46–0.66s | 0.09s | 17.01% | 249.54 MiB | 3.50% |
| warm / minimal-react | Vitest vmForks | 5 | 0.48s | 0.48–0.60s | 0.05s | 10.17% | 283.30 MiB | 3.93% |
| warm / minimal-react | Rstest | 5 | 0.41s | 0.41–0.44s | 0.01s | 3.30% | 408.09 MiB | 3.10% |
| warm / minimal-react | Rstest vmForks | 5 | 0.45s | 0.43–0.55s | 0.05s | 9.94% | 416.54 MiB | 2.69% |
| warm / startup | Jest + SWC | 5 | 0.21s | 0.21–0.22s | 0.01s | 3.74% | 56.16 MiB | 5.02% |
| warm / startup | Vitest | 5 | 0.21s | 0.21–0.22s | 0.00s | 1.46% | 166.58 MiB | 5.04% |
| warm / startup | Vitest vmForks | 5 | 0.24s | 0.24–0.25s | 0.01s | 2.50% | 244.39 MiB | 2.51% |
| warm / startup | Rstest | 5 | 0.21s | 0.21–0.22s | 0.00s | 1.30% | 132.05 MiB | 9.89% |
| warm / startup | Rstest vmForks | 5 | 0.24s | 0.23–0.24s | 0.00s | 1.38% | 243.90 MiB | 1.20% |
| warm / many-files | Jest + SWC | 5 | 1.89s | 1.63–2.02s | 0.19s | 10.13% | 2200.93 MiB | 1.76% |
| warm / many-files | Vitest | 5 | 4.50s | 4.17–5.94s | 0.71s | 14.90% | 577.02 MiB | 3.38% |
| warm / many-files | Vitest vmForks | 5 | 1.63s | 1.51–2.13s | 0.24s | 14.06% | 2411.58 MiB | 2.17% |
| warm / many-files | Rstest | 5 | 3.54s | 3.18–3.56s | 0.19s | 5.46% | 549.67 MiB | 5.62% |
| warm / many-files | Rstest vmForks | 5 | 0.93s | 0.82–1.04s | 0.08s | 8.78% | 1371.60 MiB | 0.97% |
| warm / module-graph | Jest + SWC | 5 | 1.29s | 1.25–1.62s | 0.16s | 11.61% | 1825.50 MiB | 1.72% |
| warm / module-graph | Vitest | 5 | 1.89s | 1.83–2.08s | 0.12s | 5.99% | 1193.91 MiB | 3.77% |
| warm / module-graph | Vitest vmForks | 5 | 1.47s | 1.40–3.78s | 1.04s | 53.95% | 1822.79 MiB | 0.88% |
| warm / module-graph | Rstest | 5 | 0.69s | 0.66–0.95s | 0.12s | 16.35% | 781.96 MiB | 4.79% |
| warm / module-graph | Rstest vmForks | 5 | 0.53s | 0.52–0.58s | 0.02s | 4.49% | 1093.99 MiB | 3.22% |
| warm / backend | Jest + SWC | 5 | 0.63s | 0.61–0.68s | 0.03s | 4.88% | 221.73 MiB | 3.58% |
| warm / backend | Vitest | 5 | 0.48s | 0.48–0.55s | 0.04s | 7.23% | 621.27 MiB | 5.77% |
| warm / backend | Vitest vmForks | 5 | 0.47s | 0.46–0.51s | 0.02s | 3.98% | 728.31 MiB | 4.58% |
| warm / backend | Rstest | 5 | 0.43s | 0.42–0.45s | 0.01s | 2.83% | 594.15 MiB | 5.20% |
| warm / backend | Rstest vmForks | 5 | 0.47s | 0.46–0.47s | 0.01s | 1.13% | 967.85 MiB | 0.70% |
| warm / barrel | Jest + SWC | 5 | 3.96s | 2.61–4.34s | 0.81s | 22.89% | 2751.64 MiB | 1.10% |
| warm / barrel | Vitest | 5 | 4.14s | 3.75–9.27s | 2.34s | 45.78% | 2267.95 MiB | 1.56% |
| warm / barrel | Vitest vmForks | 5 | 3.84s | 2.82–7.79s | 2.00s | 44.23% | 2396.94 MiB | 0.87% |
| warm / barrel | Rstest | 5 | 0.42s | 0.31–0.51s | 0.08s | 20.86% | 309.28 MiB | 17.32% |
| warm / barrel | Rstest vmForks | 5 | 0.34s | 0.32–0.48s | 0.06s | 17.53% | 576.13 MiB | 1.14% |
| warm / react | Jest + SWC | 5 | 1.19s | 1.08–2.24s | 0.49s | 35.38% | 1644.10 MiB | 3.63% |
| warm / react | Vitest | 5 | 1.59s | 1.55–1.83s | 0.12s | 7.20% | 1377.54 MiB | 1.39% |
| warm / react | Vitest vmForks | 5 | 0.91s | 0.85–1.03s | 0.08s | 8.52% | 1664.50 MiB | 2.94% |
| warm / react | Rstest | 5 | 1.07s | 1.06–1.15s | 0.05s | 4.20% | 1507.76 MiB | 3.84% |
| warm / react | Rstest vmForks | 5 | 0.78s | 0.69–0.91s | 0.09s | 10.93% | 1874.34 MiB | 1.43% |
| warm / react (browser) | Vitest | 5 | 1.83s | 1.70–2.29s | 0.24s | 12.56% | 1703.60 MiB | 2.07% |
| warm / react (browser) | Rstest | 5 | 1.33s | 1.24–1.49s | 0.10s | 7.59% | 740.69 MiB | 3.12% |

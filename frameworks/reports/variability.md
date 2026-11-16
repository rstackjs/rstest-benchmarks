# Variability

CV is shown with absolute standard deviation and range; CV alone does not establish a meaningful fluctuation or regression.

| Cache / case | Framework | n | Time median | Time min–max | Time SD | Time CV | Memory median (MiB) | Memory CV |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| cold / backend | Jest + SWC | 5 | 1.17s | 1.03–1.71s | 0.26s | 20.66% | 372.07 MiB | 2.65% |
| cold / backend | Vitest | 5 | 2.43s | 2.14–2.53s | 0.15s | 6.28% | 164.14 MiB | 1.75% |
| cold / backend | Vitest vmForks | 5 | 1.30s | 1.20–1.96s | 0.31s | 21.54% | 301.33 MiB | 1.91% |
| cold / backend | Rstest | 5 | 1.95s | 1.78–2.19s | 0.16s | 7.88% | 160.70 MiB | 0.93% |
| cold / backend | Rstest vmForks | 5 | 1.03s | 0.91–1.13s | 0.10s | 9.58% | 327.74 MiB | 1.72% |
| cold / barrel | Jest + SWC | 5 | 12.11s | 9.50–14.54s | 1.93s | 15.89% | 1094.01 MiB | 2.28% |
| cold / barrel | Vitest | 5 | 19.71s | 13.93–20.54s | 2.71s | 14.65% | 567.95 MiB | 1.27% |
| cold / barrel | Vitest vmForks | 5 | 14.08s | 11.01–23.39s | 4.91s | 30.98% | 1008.64 MiB | 8.40% |
| cold / barrel | Rstest | 5 | 1.71s | 1.36–2.03s | 0.24s | 14.11% | 140.90 MiB | 1.79% |
| cold / barrel | Rstest vmForks | 5 | 0.77s | 0.54–0.85s | 0.12s | 15.90% | 167.09 MiB | 1.62% |
| cold / many-files | Jest + SWC | 5 | 6.02s | 5.73–6.86s | 0.43s | 7.06% | 455.83 MiB | 1.00% |
| cold / many-files | Vitest | 5 | 30.15s | 28.06–32.46s | 1.66s | 5.46% | 188.56 MiB | 2.56% |
| cold / many-files | Vitest vmForks | 5 | 10.12s | 6.95–11.69s | 1.89s | 18.98% | 504.33 MiB | 1.86% |
| cold / many-files | Rstest | 5 | 21.29s | 19.77–22.44s | 1.03s | 4.86% | 222.99 MiB | 1.20% |
| cold / many-files | Rstest vmForks | 5 | 4.04s | 3.67–4.57s | 0.36s | 8.81% | 496.07 MiB | 6.16% |
| cold / minimal-node | Jest + SWC | 5 | 0.65s | 0.52–0.96s | 0.16s | 23.68% | 120.01 MiB | 2.81% |
| cold / minimal-node | Vitest | 5 | 0.50s | 0.46–0.68s | 0.10s | 17.49% | 108.36 MiB | 0.74% |
| cold / minimal-node | Vitest vmForks | 5 | 0.56s | 0.53–0.80s | 0.11s | 17.80% | 129.87 MiB | 2.64% |
| cold / minimal-node | Rstest | 5 | 0.44s | 0.39–0.69s | 0.12s | 25.34% | 111.39 MiB | 3.98% |
| cold / minimal-node | Rstest vmForks | 5 | 0.47s | 0.42–0.58s | 0.06s | 12.52% | 128.85 MiB | 1.25% |
| cold / minimal-react | Jest + SWC | 5 | 0.88s | 0.83–1.74s | 0.39s | 37.92% | 237.01 MiB | 1.96% |
| cold / minimal-react | Vitest | 5 | 0.84s | 0.78–1.22s | 0.17s | 18.78% | 236.77 MiB | 2.02% |
| cold / minimal-react | Vitest vmForks | 5 | 0.87s | 0.83–1.14s | 0.13s | 13.61% | 257.34 MiB | 1.65% |
| cold / minimal-react | Rstest | 5 | 0.98s | 0.85–1.32s | 0.19s | 18.45% | 381.60 MiB | 4.01% |
| cold / minimal-react | Rstest vmForks | 5 | 0.91s | 0.85–0.99s | 0.05s | 5.77% | 362.12 MiB | 2.75% |
| cold / module-graph | Jest + SWC | 5 | 5.32s | 4.22–6.52s | 0.84s | 15.95% | 570.64 MiB | 6.87% |
| cold / module-graph | Vitest | 5 | 11.02s | 10.03–13.19s | 1.28s | 11.07% | 300.20 MiB | 2.52% |
| cold / module-graph | Vitest vmForks | 5 | 6.74s | 6.25–7.79s | 0.64s | 9.32% | 628.19 MiB | 1.37% |
| cold / module-graph | Rstest | 5 | 4.05s | 3.83–4.77s | 0.40s | 9.47% | 275.06 MiB | 7.31% |
| cold / module-graph | Rstest vmForks | 5 | 2.58s | 1.92–2.93s | 0.43s | 17.42% | 457.91 MiB | 1.86% |
| cold / react | Jest + SWC | 5 | 1.80s | 1.61–2.51s | 0.35s | 18.47% | 481.96 MiB | 2.22% |
| cold / react | Vitest | 5 | 6.79s | 6.46–7.82s | 0.66s | 9.38% | 267.51 MiB | 1.14% |
| cold / react | Vitest vmForks | 5 | 1.91s | 1.75–2.17s | 0.18s | 9.26% | 476.24 MiB | 1.25% |
| cold / react | Rstest | 5 | 5.76s | 5.19–6.19s | 0.47s | 8.21% | 412.78 MiB | 4.00% |
| cold / react | Rstest vmForks | 5 | 1.77s | 1.59–2.10s | 0.19s | 10.50% | 597.65 MiB | 1.38% |
| cold / react (browser) | Vitest | 5 | 4.36s | 3.98–5.70s | 0.71s | 15.77% | 916.64 MiB | 1.08% |
| cold / react (browser) | Rstest | 5 | 5.79s | 5.26–8.24s | 1.17s | 18.78% | 360.63 MiB | 1.76% |
| cold / startup | Jest + SWC | 5 | 0.68s | 0.63–1.10s | 0.20s | 26.08% | 134.87 MiB | 3.30% |
| cold / startup | Vitest | 5 | 0.81s | 0.74–0.95s | 0.09s | 10.89% | 115.36 MiB | 1.34% |
| cold / startup | Vitest vmForks | 5 | 0.78s | 0.68–0.84s | 0.07s | 9.45% | 138.56 MiB | 1.78% |
| cold / startup | Rstest | 5 | 0.67s | 0.58–1.19s | 0.24s | 31.92% | 117.08 MiB | 2.17% |
| cold / startup | Rstest vmForks | 5 | 0.54s | 0.52–0.60s | 0.03s | 5.99% | 138.39 MiB | 2.41% |
| warm / backend | Jest + SWC | 5 | 1.03s | 0.93–1.33s | 0.16s | 14.98% | 207.73 MiB | 8.84% |
| warm / backend | Vitest | 5 | 1.94s | 1.88–2.03s | 0.07s | 3.60% | 155.34 MiB | 2.87% |
| warm / backend | Vitest vmForks | 5 | 1.06s | 0.99–1.08s | 0.04s | 4.13% | 294.88 MiB | 3.93% |
| warm / backend | Rstest | 5 | 1.73s | 1.69–1.88s | 0.08s | 4.27% | 163.31 MiB | 3.07% |
| warm / backend | Rstest vmForks | 5 | 0.93s | 0.86–0.95s | 0.04s | 4.75% | 327.05 MiB | 0.84% |
| warm / barrel | Jest + SWC | 5 | 4.92s | 4.29–6.10s | 0.67s | 13.48% | 845.15 MiB | 2.90% |
| warm / barrel | Vitest | 5 | 9.43s | 8.09–9.99s | 0.76s | 8.22% | 494.29 MiB | 2.05% |
| warm / barrel | Vitest vmForks | 5 | 5.60s | 5.56–12.80s | 3.21s | 45.63% | 990.74 MiB | 4.29% |
| warm / barrel | Rstest | 5 | 1.31s | 1.26–1.53s | 0.11s | 7.98% | 142.49 MiB | 0.83% |
| warm / barrel | Rstest vmForks | 5 | 0.59s | 0.48–0.68s | 0.08s | 13.58% | 166.67 MiB | 0.83% |
| warm / many-files | Jest + SWC | 5 | 5.35s | 5.02–5.89s | 0.32s | 5.86% | 449.71 MiB | 0.29% |
| warm / many-files | Vitest | 5 | 26.92s | 25.29–33.01s | 3.13s | 11.18% | 156.43 MiB | 0.58% |
| warm / many-files | Vitest vmForks | 5 | 8.72s | 7.19–10.45s | 1.19s | 13.74% | 477.19 MiB | 2.39% |
| warm / many-files | Rstest | 5 | 24.28s | 21.36–26.09s | 2.09s | 8.80% | 220.77 MiB | 5.37% |
| warm / many-files | Rstest vmForks | 5 | 4.01s | 3.33–4.46s | 0.42s | 10.58% | 500.15 MiB | 12.19% |
| warm / minimal-node | Jest + SWC | 5 | 0.35s | 0.31–0.52s | 0.08s | 22.32% | 48.13 MiB | 4.40% |
| warm / minimal-node | Vitest | 5 | 0.46s | 0.36–0.57s | 0.10s | 21.08% | 106.94 MiB | 5.61% |
| warm / minimal-node | Vitest vmForks | 5 | 0.45s | 0.40–0.56s | 0.07s | 15.01% | 126.41 MiB | 4.30% |
| warm / minimal-node | Rstest | 5 | 0.39s | 0.38–0.50s | 0.06s | 13.19% | 112.28 MiB | 7.32% |
| warm / minimal-node | Rstest vmForks | 5 | 0.46s | 0.41–0.66s | 0.11s | 21.67% | 128.38 MiB | 1.37% |
| warm / minimal-react | Jest + SWC | 5 | 0.63s | 0.58–0.75s | 0.07s | 10.36% | 128.28 MiB | 3.41% |
| warm / minimal-react | Vitest | 5 | 0.81s | 0.70–0.95s | 0.10s | 11.64% | 234.86 MiB | 2.63% |
| warm / minimal-react | Vitest vmForks | 5 | 0.89s | 0.85–1.16s | 0.13s | 13.90% | 258.74 MiB | 1.18% |
| warm / minimal-react | Rstest | 5 | 0.85s | 0.83–0.93s | 0.05s | 5.69% | 358.21 MiB | 3.34% |
| warm / minimal-react | Rstest vmForks | 5 | 0.91s | 0.87–1.18s | 0.13s | 12.99% | 355.37 MiB | 2.29% |
| warm / module-graph | Jest + SWC | 5 | 3.17s | 2.67–3.66s | 0.37s | 11.63% | 533.59 MiB | 3.54% |
| warm / module-graph | Vitest | 5 | 9.08s | 7.95–9.79s | 0.85s | 9.61% | 244.36 MiB | 1.12% |
| warm / module-graph | Vitest vmForks | 5 | 4.05s | 3.72–5.73s | 0.81s | 18.81% | 559.47 MiB | 1.43% |
| warm / module-graph | Rstest | 5 | 4.86s | 4.55–5.85s | 0.58s | 11.25% | 269.15 MiB | 5.92% |
| warm / module-graph | Rstest vmForks | 5 | 2.77s | 2.71–3.48s | 0.33s | 11.20% | 453.67 MiB | 1.14% |
| warm / react | Jest + SWC | 5 | 1.65s | 1.45–1.84s | 0.15s | 9.31% | 494.53 MiB | 2.35% |
| warm / react | Vitest | 5 | 6.67s | 6.53–10.25s | 1.61s | 21.82% | 250.57 MiB | 1.00% |
| warm / react | Vitest vmForks | 5 | 2.05s | 1.83–2.90s | 0.44s | 20.59% | 456.65 MiB | 0.54% |
| warm / react | Rstest | 5 | 5.83s | 5.39–7.21s | 0.74s | 12.41% | 390.12 MiB | 2.72% |
| warm / react | Rstest vmForks | 5 | 2.09s | 1.91–2.24s | 0.12s | 5.64% | 587.78 MiB | 1.17% |
| warm / react (browser) | Vitest | 5 | 3.94s | 3.72–4.20s | 0.20s | 4.98% | 797.42 MiB | 0.92% |
| warm / react (browser) | Rstest | 5 | 5.71s | 5.27–6.05s | 0.33s | 5.79% | 355.00 MiB | 1.58% |
| warm / startup | Jest + SWC | 5 | 0.52s | 0.35–0.67s | 0.13s | 25.26% | 62.72 MiB | 3.23% |
| warm / startup | Vitest | 5 | 0.73s | 0.70–0.83s | 0.05s | 7.15% | 111.58 MiB | 1.92% |
| warm / startup | Vitest vmForks | 5 | 0.73s | 0.57–0.94s | 0.15s | 20.63% | 134.48 MiB | 1.58% |
| warm / startup | Rstest | 5 | 0.74s | 0.61–0.77s | 0.06s | 8.72% | 118.24 MiB | 1.84% |
| warm / startup | Rstest vmForks | 5 | 0.54s | 0.47–0.64s | 0.08s | 14.88% | 140.53 MiB | 1.71% |

# Variability

CV is shown with absolute standard deviation and range; CV alone does not establish a meaningful fluctuation or regression.

| Cache / case | Framework | n | Time median | Time min–max | Time SD | Time CV | Memory median (MiB) | Memory CV |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| cold / backend | Jest + SWC | 5 | 0.99s | 0.83–1.32s | 0.24s | 22.20% | 382.25 MiB | 1.73% |
| cold / backend | Vitest | 5 | 1.76s | 1.74–1.94s | 0.08s | 4.72% | 164.32 MiB | 3.55% |
| cold / backend | Vitest vmForks | 5 | 0.99s | 0.95–1.31s | 0.15s | 14.63% | 300.16 MiB | 1.20% |
| cold / backend | Rstest | 5 | 1.50s | 1.35–2.07s | 0.29s | 18.37% | 156.40 MiB | 3.73% |
| cold / backend | Rstest vmForks | 5 | 0.80s | 0.69–0.87s | 0.07s | 9.14% | 326.37 MiB | 1.66% |
| cold / barrel | Jest + SWC | 5 | 15.79s | 10.22–19.01s | 3.25s | 20.94% | 1090.76 MiB | 0.48% |
| cold / barrel | Vitest | 5 | 23.83s | 20.18–28.09s | 2.87s | 11.86% | 584.18 MiB | 1.63% |
| cold / barrel | Vitest vmForks | 5 | 16.11s | 13.09–18.43s | 1.91s | 11.96% | 1073.41 MiB | 4.94% |
| cold / barrel | Rstest | 5 | 2.36s | 2.08–2.94s | 0.32s | 13.40% | 140.91 MiB | 1.72% |
| cold / barrel | Rstest vmForks | 5 | 1.09s | 0.93–1.31s | 0.14s | 13.11% | 168.39 MiB | 0.99% |
| cold / many-files | Jest + SWC | 5 | 5.93s | 5.17–8.07s | 1.34s | 20.56% | 455.42 MiB | 0.84% |
| cold / many-files | Vitest | 5 | 30.53s | 26.09–38.29s | 4.51s | 14.52% | 187.76 MiB | 1.77% |
| cold / many-files | Vitest vmForks | 5 | 7.91s | 6.38–8.57s | 0.91s | 12.01% | 504.62 MiB | 1.85% |
| cold / many-files | Rstest | 5 | 21.19s | 19.78–23.89s | 1.55s | 7.23% | 216.86 MiB | 0.61% |
| cold / many-files | Rstest vmForks | 5 | 4.03s | 3.35–5.66s | 0.91s | 21.85% | 494.73 MiB | 13.87% |
| cold / minimal-node | Jest + SWC | 5 | 0.52s | 0.50–0.69s | 0.08s | 14.53% | 119.90 MiB | 2.88% |
| cold / minimal-node | Vitest | 5 | 0.41s | 0.40–0.54s | 0.06s | 13.29% | 110.80 MiB | 1.17% |
| cold / minimal-node | Vitest vmForks | 5 | 0.49s | 0.42–0.60s | 0.07s | 13.91% | 126.60 MiB | 2.08% |
| cold / minimal-node | Rstest | 5 | 0.39s | 0.35–0.49s | 0.06s | 13.57% | 116.72 MiB | 4.83% |
| cold / minimal-node | Rstest vmForks | 5 | 0.38s | 0.33–0.53s | 0.07s | 18.69% | 128.83 MiB | 4.32% |
| cold / minimal-react | Jest + SWC | 5 | 0.67s | 0.64–1.13s | 0.26s | 30.70% | 236.36 MiB | 1.40% |
| cold / minimal-react | Vitest | 5 | 0.92s | 0.59–1.03s | 0.18s | 19.78% | 238.09 MiB | 1.51% |
| cold / minimal-react | Vitest vmForks | 5 | 0.87s | 0.69–1.35s | 0.25s | 27.40% | 264.16 MiB | 2.80% |
| cold / minimal-react | Rstest | 5 | 0.85s | 0.65–1.13s | 0.21s | 23.89% | 355.94 MiB | 5.09% |
| cold / minimal-react | Rstest vmForks | 5 | 0.79s | 0.73–1.62s | 0.38s | 37.78% | 350.94 MiB | 2.63% |
| cold / module-graph | Jest + SWC | 5 | 5.11s | 3.74–7.24s | 1.60s | 29.39% | 563.20 MiB | 4.98% |
| cold / module-graph | Vitest | 5 | 11.33s | 7.78–15.66s | 2.80s | 24.26% | 302.25 MiB | 4.11% |
| cold / module-graph | Vitest vmForks | 5 | 5.12s | 4.25–8.61s | 1.78s | 31.42% | 622.13 MiB | 1.80% |
| cold / module-graph | Rstest | 5 | 3.37s | 2.90–4.07s | 0.47s | 13.78% | 281.37 MiB | 2.05% |
| cold / module-graph | Rstest vmForks | 5 | 1.76s | 1.67–2.61s | 0.41s | 20.52% | 453.97 MiB | 2.27% |
| cold / react | Jest + SWC | 5 | 2.17s | 1.93–2.51s | 0.24s | 10.82% | 515.02 MiB | 1.12% |
| cold / react | Vitest | 5 | 9.69s | 8.13–10.12s | 0.83s | 8.91% | 266.48 MiB | 1.29% |
| cold / react | Vitest vmForks | 5 | 2.29s | 1.99–3.15s | 0.47s | 18.66% | 475.95 MiB | 0.56% |
| cold / react | Rstest | 5 | 6.94s | 6.24–7.34s | 0.47s | 6.79% | 416.44 MiB | 2.14% |
| cold / react | Rstest vmForks | 5 | 2.20s | 1.99–2.62s | 0.25s | 11.09% | 578.88 MiB | 2.82% |
| cold / react (browser) | Vitest | 5 | 4.15s | 3.83–5.68s | 0.75s | 16.97% | 914.90 MiB | 0.71% |
| cold / react (browser) | Rstest | 5 | 5.89s | 5.42–6.84s | 0.66s | 10.86% | 363.46 MiB | 1.38% |
| cold / startup | Jest + SWC | 5 | 0.40s | 0.40–0.79s | 0.17s | 35.72% | 129.43 MiB | 6.71% |
| cold / startup | Vitest | 5 | 0.49s | 0.48–0.70s | 0.10s | 17.35% | 114.85 MiB | 1.33% |
| cold / startup | Vitest vmForks | 5 | 0.46s | 0.42–0.51s | 0.04s | 8.15% | 136.01 MiB | 2.37% |
| cold / startup | Rstest | 5 | 0.41s | 0.39–0.61s | 0.09s | 20.78% | 113.67 MiB | 6.11% |
| cold / startup | Rstest vmForks | 5 | 0.37s | 0.34–0.39s | 0.02s | 5.04% | 138.56 MiB | 1.43% |
| warm / backend | Jest + SWC | 5 | 0.79s | 0.78–0.90s | 0.05s | 6.67% | 193.08 MiB | 5.52% |
| warm / backend | Vitest | 5 | 1.72s | 1.48–1.82s | 0.13s | 7.93% | 155.25 MiB | 4.27% |
| warm / backend | Vitest vmForks | 5 | 0.82s | 0.76–1.02s | 0.10s | 11.55% | 294.21 MiB | 2.61% |
| warm / backend | Rstest | 5 | 1.35s | 1.30–1.58s | 0.12s | 8.23% | 155.67 MiB | 3.05% |
| warm / backend | Rstest vmForks | 5 | 0.74s | 0.71–0.87s | 0.07s | 9.48% | 324.68 MiB | 1.93% |
| warm / barrel | Jest + SWC | 5 | 8.37s | 6.76–10.24s | 1.35s | 15.87% | 841.72 MiB | 3.51% |
| warm / barrel | Vitest | 5 | 15.53s | 13.27–17.65s | 1.94s | 12.72% | 491.29 MiB | 2.21% |
| warm / barrel | Vitest vmForks | 5 | 9.57s | 9.02–11.08s | 0.78s | 7.91% | 925.09 MiB | 3.86% |
| warm / barrel | Rstest | 5 | 2.13s | 1.97–2.64s | 0.27s | 12.39% | 140.54 MiB | 1.75% |
| warm / barrel | Rstest vmForks | 5 | 0.90s | 0.82–1.18s | 0.15s | 16.03% | 168.64 MiB | 1.33% |
| warm / many-files | Jest + SWC | 5 | 4.05s | 3.46–4.77s | 0.53s | 12.67% | 449.38 MiB | 0.56% |
| warm / many-files | Vitest | 5 | 25.38s | 23.96–29.36s | 2.67s | 10.10% | 157.02 MiB | 0.77% |
| warm / many-files | Vitest vmForks | 5 | 7.64s | 6.04–8.80s | 1.02s | 13.74% | 482.24 MiB | 0.63% |
| warm / many-files | Rstest | 5 | 22.08s | 17.16–22.99s | 2.50s | 12.06% | 214.70 MiB | 1.90% |
| warm / many-files | Rstest vmForks | 5 | 3.72s | 3.00–4.17s | 0.46s | 12.69% | 439.56 MiB | 6.09% |
| warm / minimal-node | Jest + SWC | 5 | 0.29s | 0.25–0.41s | 0.07s | 22.04% | 50.27 MiB | 8.76% |
| warm / minimal-node | Vitest | 5 | 0.36s | 0.29–0.55s | 0.10s | 27.31% | 108.38 MiB | 5.68% |
| warm / minimal-node | Vitest vmForks | 5 | 0.44s | 0.39–0.56s | 0.07s | 15.35% | 121.69 MiB | 3.00% |
| warm / minimal-node | Rstest | 5 | 0.30s | 0.28–0.50s | 0.09s | 27.95% | 111.70 MiB | 6.95% |
| warm / minimal-node | Rstest vmForks | 5 | 0.38s | 0.33–0.76s | 0.17s | 38.33% | 126.69 MiB | 1.96% |
| warm / minimal-react | Jest + SWC | 5 | 0.58s | 0.51–0.70s | 0.08s | 12.85% | 125.87 MiB | 4.63% |
| warm / minimal-react | Vitest | 5 | 0.76s | 0.61–1.15s | 0.21s | 25.13% | 233.08 MiB | 1.29% |
| warm / minimal-react | Vitest vmForks | 5 | 0.98s | 0.81–1.88s | 0.43s | 36.97% | 258.54 MiB | 0.58% |
| warm / minimal-react | Rstest | 5 | 0.84s | 0.73–2.25s | 0.65s | 59.26% | 373.84 MiB | 1.88% |
| warm / minimal-react | Rstest vmForks | 5 | 0.77s | 0.72–0.88s | 0.06s | 7.84% | 367.66 MiB | 1.23% |
| warm / module-graph | Jest + SWC | 5 | 3.30s | 2.55–3.75s | 0.47s | 14.94% | 529.18 MiB | 2.11% |
| warm / module-graph | Vitest | 5 | 8.95s | 7.73–9.65s | 0.89s | 10.19% | 243.47 MiB | 1.09% |
| warm / module-graph | Vitest vmForks | 5 | 3.45s | 2.84–4.47s | 0.67s | 18.39% | 561.25 MiB | 0.78% |
| warm / module-graph | Rstest | 5 | 4.34s | 4.11–5.02s | 0.43s | 9.50% | 257.22 MiB | 8.30% |
| warm / module-graph | Rstest vmForks | 5 | 2.17s | 1.78–2.67s | 0.37s | 17.06% | 462.35 MiB | 1.57% |
| warm / react | Jest + SWC | 5 | 2.13s | 1.88–2.48s | 0.22s | 10.11% | 481.64 MiB | 2.65% |
| warm / react | Vitest | 5 | 8.65s | 7.13–9.05s | 0.89s | 10.78% | 251.32 MiB | 0.82% |
| warm / react | Vitest vmForks | 5 | 2.23s | 1.77–2.66s | 0.34s | 14.85% | 458.84 MiB | 0.73% |
| warm / react | Rstest | 5 | 7.25s | 6.46–7.51s | 0.43s | 6.08% | 408.32 MiB | 4.73% |
| warm / react | Rstest vmForks | 5 | 2.15s | 2.11–2.82s | 0.30s | 13.32% | 585.80 MiB | 2.18% |
| warm / react (browser) | Vitest | 5 | 4.38s | 2.76–6.40s | 1.56s | 33.27% | 799.58 MiB | 0.88% |
| warm / react (browser) | Rstest | 5 | 6.30s | 4.43–8.62s | 1.53s | 24.24% | 357.91 MiB | 2.59% |
| warm / startup | Jest + SWC | 5 | 0.26s | 0.24–0.31s | 0.03s | 12.42% | 52.49 MiB | 12.91% |
| warm / startup | Vitest | 5 | 0.44s | 0.43–0.53s | 0.04s | 9.23% | 108.55 MiB | 3.08% |
| warm / startup | Vitest vmForks | 5 | 0.38s | 0.36–0.45s | 0.04s | 9.09% | 127.40 MiB | 1.65% |
| warm / startup | Rstest | 5 | 0.43s | 0.41–0.50s | 0.03s | 7.81% | 115.96 MiB | 3.54% |
| warm / startup | Rstest vmForks | 5 | 0.33s | 0.32–0.58s | 0.11s | 29.72% | 138.27 MiB | 1.77% |

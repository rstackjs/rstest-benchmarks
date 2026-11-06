# Variability

| Cache / case | Framework | n | Time median | Time min–max | Time CV | RSS median | RSS CV |
| --- | --- | --- | --- | --- | --- | --- | --- |
| cold / main/minimal-node/none | Jest + SWC | 8 | 0.442s | 0.419–0.506s | 6.2% | 101.7 MiB | 0.7% |
| cold / main/minimal-node/none | Vitest | 8 | 0.304s | 0.297–0.333s | 3.6% | 116.5 MiB | 0.9% |
| cold / main/minimal-node/none | Rstest | 8 | 0.241s | 0.227–0.292s | 8.2% | 129.6 MiB | 0.7% |
| cold / main/minimal-node/none | Rstest vmForks | 8 | 0.256s | 0.245–0.273s | 3.5% | 128.9 MiB | 0.7% |
| cold / main/minimal-react/none | Jest + SWC | 8 | 0.765s | 0.740–0.897s | 6.6% | 182.5 MiB | 2.6% |
| cold / main/minimal-react/none | Vitest | 8 | 0.641s | 0.587–0.698s | 6.9% | 157.7 MiB | 1.2% |
| cold / main/minimal-react/none | Rstest | 8 | 0.506s | 0.484–0.601s | 7.2% | 262.3 MiB | 2.0% |
| cold / main/minimal-react/none | Rstest vmForks | 8 | 0.539s | 0.512–0.562s | 4.1% | 262.4 MiB | 1.3% |
| cold / main/startup/none | Jest + SWC | 8 | 0.651s | 0.633–0.679s | 2.0% | 93.2 MiB | 0.4% |
| cold / main/startup/none | Vitest | 8 | 0.344s | 0.330–0.361s | 3.5% | 122.8 MiB | 1.1% |
| cold / main/startup/none | Rstest | 8 | 0.272s | 0.254–0.286s | 3.8% | 140.1 MiB | 0.7% |
| cold / main/startup/none | Rstest vmForks | 8 | 0.297s | 0.271–0.342s | 7.1% | 139.5 MiB | 1.3% |
| cold / main/many-files/none | Jest + SWC | 8 | 3.204s | 2.860–3.502s | 6.5% | 202.2 MiB | 1.6% |
| cold / main/many-files/none | Vitest | 8 | 7.062s | 6.518–9.062s | 10.6% | 217.2 MiB | 0.7% |
| cold / main/many-files/none | Rstest | 8 | 4.621s | 4.273–5.060s | 6.6% | 385.7 MiB | 1.3% |
| cold / main/many-files/none | Rstest vmForks | 8 | 1.110s | 1.063–1.297s | 6.7% | 286.7 MiB | 0.6% |
| cold / main/module-graph/none | Jest + SWC | 8 | 7.169s | 6.858–7.757s | 4.4% | 207.6 MiB | 3.0% |
| cold / main/module-graph/none | Vitest | 8 | 4.695s | 4.165–5.314s | 9.3% | 312.0 MiB | 3.2% |
| cold / main/module-graph/none | Rstest | 8 | 1.010s | 0.967–1.181s | 6.8% | 372.6 MiB | 3.9% |
| cold / main/module-graph/none | Rstest vmForks | 8 | 0.780s | 0.740–1.250s | 20.3% | 287.5 MiB | 2.7% |
| cold / main/backend/none | Jest + SWC | 8 | 1.151s | 1.108–1.349s | 7.4% | 151.9 MiB | 3.6% |
| cold / main/backend/none | Vitest | 8 | 0.880s | 0.831–1.251s | 15.0% | 137.4 MiB | 2.0% |
| cold / main/backend/none | Rstest | 8 | 0.628s | 0.593–0.934s | 16.7% | 154.9 MiB | 0.6% |
| cold / main/backend/none | Rstest vmForks | 8 | 0.729s | 0.616–1.019s | 16.0% | 155.4 MiB | 0.6% |
| cold / main/barrel/none | Jest + SWC | 8 | 21.992s | 20.321–24.611s | 6.5% | 363.3 MiB | 6.7% |
| cold / main/barrel/none | Vitest | 8 | 9.939s | 9.196–12.472s | 10.6% | 429.6 MiB | 5.6% |
| cold / main/barrel/none | Rstest | 8 | 0.561s | 0.471–0.692s | 13.3% | 163.5 MiB | 0.9% |
| cold / main/barrel/none | Rstest vmForks | 8 | 0.468s | 0.423–0.551s | 11.8% | 163.7 MiB | 1.0% |
| cold / main/react/none | Jest + SWC | 8 | 2.388s | 2.286–2.725s | 6.5% | 182.5 MiB | 1.5% |
| cold / main/react/none | Vitest | 8 | 3.942s | 3.820–4.279s | 3.9% | 176.9 MiB | 1.9% |
| cold / main/react/none | Rstest | 8 | 1.742s | 1.663–1.796s | 2.3% | 444.2 MiB | 1.8% |
| cold / main/react/none | Rstest vmForks | 8 | 1.175s | 1.087–1.248s | 5.0% | 357.9 MiB | 1.3% |
| cold / coverage/backend/none | Jest + SWC | 8 | 1.261s | 1.128–1.430s | 7.6% | 146.8 MiB | 6.0% |
| cold / coverage/backend/none | Vitest | 8 | 0.902s | 0.870–0.956s | 3.7% | 138.2 MiB | 1.1% |
| cold / coverage/backend/none | Rstest | 8 | 0.690s | 0.630–0.862s | 10.6% | 154.6 MiB | 1.1% |
| cold / coverage/backend/none | Rstest vmForks | 8 | 0.755s | 0.663–0.846s | 8.8% | 154.6 MiB | 0.7% |
| cold / coverage/backend/v8 | Jest + SWC | 8 | 1.596s | 1.464–1.874s | 9.7% | 170.6 MiB | 1.0% |
| cold / coverage/backend/v8 | Vitest | 8 | 1.036s | 0.967–1.283s | 9.4% | 170.5 MiB | 1.7% |
| cold / coverage/backend/v8 | Rstest | 8 | 0.858s | 0.800–0.980s | 6.7% | 193.8 MiB | 1.8% |
| cold / coverage/backend/v8 | Rstest vmForks | 8 | 0.885s | 0.823–0.969s | 6.1% | 196.5 MiB | 1.9% |
| cold / coverage/backend/istanbul | Jest + SWC | 8 | 2.701s | 2.193–3.836s | 18.3% | 232.2 MiB | 1.6% |
| cold / coverage/backend/istanbul | Vitest | 8 | 1.262s | 1.005–1.881s | 22.9% | 178.0 MiB | 1.8% |
| cold / coverage/backend/istanbul | Rstest | 8 | 1.074s | 0.911–1.742s | 26.6% | 338.0 MiB | 2.6% |
| cold / coverage/backend/istanbul | Rstest vmForks | 8 | 1.227s | 0.960–1.560s | 18.4% | 334.8 MiB | 1.6% |
| cold / coverage/react/none | Jest + SWC | 8 | 2.391s | 2.230–3.208s | 13.3% | 180.8 MiB | 1.9% |
| cold / coverage/react/none | Vitest | 8 | 3.919s | 3.769–4.743s | 9.9% | 174.9 MiB | 2.9% |
| cold / coverage/react/none | Rstest | 8 | 1.658s | 1.555–2.329s | 16.7% | 442.9 MiB | 3.7% |
| cold / coverage/react/none | Rstest vmForks | 8 | 1.080s | 1.038–2.018s | 27.6% | 366.0 MiB | 2.1% |
| cold / coverage/react/v8 | Jest + SWC | 8 | 3.248s | 3.192–4.145s | 9.6% | 233.8 MiB | 3.6% |
| cold / coverage/react/v8 | Vitest | 8 | 4.219s | 3.940–4.620s | 4.6% | 187.1 MiB | 3.1% |
| cold / coverage/react/v8 | Rstest | 8 | 2.079s | 1.980–2.186s | 3.5% | 673.4 MiB | 4.6% |
| cold / coverage/react/v8 | Rstest vmForks | 8 | 1.493s | 1.428–1.671s | 5.0% | 558.9 MiB | 4.6% |
| cold / coverage/react/istanbul | Jest + SWC | 8 | 3.822s | 3.681–4.259s | 5.0% | 231.6 MiB | 2.4% |
| cold / coverage/react/istanbul | Vitest | 8 | 4.165s | 3.865–4.750s | 6.9% | 184.4 MiB | 1.8% |
| cold / coverage/react/istanbul | Rstest | 8 | 1.932s | 1.822–2.783s | 15.3% | 578.0 MiB | 1.5% |
| cold / coverage/react/istanbul | Rstest vmForks | 8 | 1.429s | 1.332–1.733s | 8.3% | 493.5 MiB | 1.6% |
| cold / browser/react/none | Vitest | 8 | 2.387s | 2.300–2.789s | 6.6% | 1126.0 MiB | 3.5% |
| cold / browser/react/none | Rstest | 8 | 1.640s | 1.560–1.860s | 6.0% | 458.7 MiB | 1.4% |
| warm / main/minimal-node/none | Jest + SWC | 8 | 0.206s | 0.202–0.237s | 6.0% | 94.9 MiB | 0.5% |
| warm / main/minimal-node/none | Vitest | 8 | 0.270s | 0.224–0.304s | 11.0% | 114.2 MiB | 1.1% |
| warm / main/minimal-node/none | Rstest | 8 | 0.234s | 0.218–0.257s | 6.2% | 129.0 MiB | 1.1% |
| warm / main/minimal-node/none | Rstest vmForks | 8 | 0.268s | 0.246–0.318s | 10.1% | 129.1 MiB | 1.2% |
| warm / main/minimal-react/none | Jest + SWC | 8 | 0.524s | 0.499–0.557s | 4.3% | 170.8 MiB | 0.7% |
| warm / main/minimal-react/none | Vitest | 8 | 0.576s | 0.566–0.612s | 2.7% | 159.0 MiB | 0.7% |
| warm / main/minimal-react/none | Rstest | 8 | 0.499s | 0.493–0.509s | 1.2% | 268.6 MiB | 1.7% |
| warm / main/minimal-react/none | Rstest vmForks | 8 | 0.528s | 0.520–0.595s | 4.7% | 267.3 MiB | 1.2% |
| warm / main/startup/none | Jest + SWC | 8 | 0.257s | 0.252–0.296s | 5.7% | 107.7 MiB | 1.2% |
| warm / main/startup/none | Vitest | 8 | 0.280s | 0.259–0.304s | 5.3% | 116.7 MiB | 0.6% |
| warm / main/startup/none | Rstest | 8 | 0.266s | 0.250–0.271s | 2.8% | 139.3 MiB | 0.9% |
| warm / main/startup/none | Rstest vmForks | 8 | 0.291s | 0.272–0.331s | 6.6% | 138.6 MiB | 0.9% |
| warm / main/many-files/none | Jest + SWC | 8 | 2.198s | 2.023–2.470s | 6.6% | 195.0 MiB | 3.1% |
| warm / main/many-files/none | Vitest | 8 | 6.212s | 6.093–6.628s | 2.7% | 200.8 MiB | 2.9% |
| warm / main/many-files/none | Rstest | 8 | 4.470s | 4.301–4.839s | 4.5% | 388.0 MiB | 1.1% |
| warm / main/many-files/none | Rstest vmForks | 8 | 1.104s | 1.069–1.420s | 11.4% | 288.2 MiB | 0.7% |
| warm / main/module-graph/none | Jest + SWC | 8 | 2.377s | 2.310–3.260s | 14.4% | 192.8 MiB | 3.8% |
| warm / main/module-graph/none | Vitest | 8 | 3.095s | 3.029–3.742s | 7.4% | 239.4 MiB | 1.9% |
| warm / main/module-graph/none | Rstest | 8 | 0.966s | 0.940–1.150s | 6.9% | 390.2 MiB | 3.3% |
| warm / main/module-graph/none | Rstest vmForks | 8 | 0.750s | 0.729–1.103s | 15.9% | 286.0 MiB | 1.3% |
| warm / main/backend/none | Jest + SWC | 8 | 0.796s | 0.725–1.173s | 18.3% | 284.4 MiB | 2.9% |
| warm / main/backend/none | Vitest | 8 | 0.760s | 0.730–1.026s | 12.4% | 126.6 MiB | 1.1% |
| warm / main/backend/none | Rstest | 8 | 0.703s | 0.624–0.883s | 11.5% | 154.7 MiB | 1.4% |
| warm / main/backend/none | Rstest vmForks | 8 | 0.729s | 0.642–1.085s | 18.7% | 155.3 MiB | 0.6% |
| warm / main/barrel/none | Jest + SWC | 8 | 5.204s | 4.812–10.038s | 29.6% | 277.6 MiB | 5.5% |
| warm / main/barrel/none | Vitest | 8 | 5.428s | 5.187–8.091s | 16.8% | 398.3 MiB | 4.9% |
| warm / main/barrel/none | Rstest | 8 | 0.480s | 0.455–0.764s | 19.9% | 163.1 MiB | 0.7% |
| warm / main/barrel/none | Rstest vmForks | 8 | 0.455s | 0.432–0.532s | 8.9% | 164.1 MiB | 0.8% |
| warm / main/react/none | Jest + SWC | 8 | 2.258s | 2.089–2.707s | 9.2% | 174.2 MiB | 1.9% |
| warm / main/react/none | Vitest | 8 | 4.040s | 3.647–5.591s | 14.4% | 178.2 MiB | 2.4% |
| warm / main/react/none | Rstest | 8 | 1.669s | 1.576–2.784s | 24.1% | 436.4 MiB | 4.5% |
| warm / main/react/none | Rstest vmForks | 8 | 1.126s | 1.067–1.256s | 5.6% | 364.0 MiB | 1.5% |
| warm / coverage/backend/none | Jest + SWC | 8 | 0.757s | 0.732–1.549s | 33.1% | 294.6 MiB | 3.5% |
| warm / coverage/backend/none | Vitest | 8 | 0.784s | 0.729–0.898s | 6.5% | 126.5 MiB | 0.8% |
| warm / coverage/backend/none | Rstest | 8 | 0.638s | 0.607–1.224s | 28.4% | 154.7 MiB | 1.0% |
| warm / coverage/backend/none | Rstest vmForks | 8 | 0.684s | 0.657–0.742s | 4.0% | 155.2 MiB | 0.8% |
| warm / coverage/backend/v8 | Jest + SWC | 8 | 3.044s | 2.943–3.401s | 5.2% | 391.7 MiB | 4.2% |
| warm / coverage/backend/v8 | Vitest | 8 | 1.063s | 0.968–1.250s | 7.7% | 165.4 MiB | 2.5% |
| warm / coverage/backend/v8 | Rstest | 8 | 0.881s | 0.838–1.021s | 7.9% | 192.9 MiB | 1.7% |
| warm / coverage/backend/v8 | Rstest vmForks | 8 | 0.935s | 0.873–1.182s | 10.4% | 198.7 MiB | 1.6% |
| warm / coverage/backend/istanbul | Jest + SWC | 8 | 1.415s | 1.171–1.836s | 16.0% | 308.0 MiB | 1.4% |
| warm / coverage/backend/istanbul | Vitest | 8 | 1.055s | 0.908–1.419s | 15.8% | 168.4 MiB | 2.4% |
| warm / coverage/backend/istanbul | Rstest | 8 | 0.832s | 0.680–1.208s | 20.1% | 193.8 MiB | 0.9% |
| warm / coverage/backend/istanbul | Rstest vmForks | 8 | 0.853s | 0.734–1.344s | 22.5% | 192.7 MiB | 0.7% |
| warm / coverage/react/none | Jest + SWC | 8 | 2.126s | 2.076–2.631s | 8.6% | 174.8 MiB | 1.1% |
| warm / coverage/react/none | Vitest | 8 | 3.949s | 3.694–5.691s | 15.6% | 178.9 MiB | 1.9% |
| warm / coverage/react/none | Rstest | 8 | 1.998s | 1.608–2.987s | 23.1% | 438.4 MiB | 2.6% |
| warm / coverage/react/none | Rstest vmForks | 8 | 1.332s | 1.049–1.499s | 13.0% | 356.9 MiB | 2.5% |
| warm / coverage/react/v8 | Jest + SWC | 8 | 3.015s | 2.837–3.115s | 3.2% | 225.4 MiB | 1.4% |
| warm / coverage/react/v8 | Vitest | 8 | 4.029s | 3.910–4.277s | 2.9% | 189.2 MiB | 2.3% |
| warm / coverage/react/v8 | Rstest | 8 | 2.036s | 2.008–2.392s | 6.2% | 658.5 MiB | 3.5% |
| warm / coverage/react/v8 | Rstest vmForks | 8 | 1.478s | 1.402–1.546s | 4.2% | 562.3 MiB | 6.3% |
| warm / coverage/react/istanbul | Jest + SWC | 8 | 2.876s | 2.814–3.145s | 4.4% | 179.3 MiB | 4.1% |
| warm / coverage/react/istanbul | Vitest | 8 | 4.121s | 3.752–4.898s | 9.4% | 177.3 MiB | 3.0% |
| warm / coverage/react/istanbul | Rstest | 8 | 1.791s | 1.669–2.170s | 9.5% | 469.3 MiB | 2.8% |
| warm / coverage/react/istanbul | Rstest vmForks | 8 | 1.192s | 1.150–1.924s | 20.0% | 396.2 MiB | 2.0% |
| warm / browser/react/none | Vitest | 8 | 2.308s | 2.239–2.786s | 7.6% | 985.0 MiB | 3.0% |
| warm / browser/react/none | Rstest | 8 | 1.652s | 1.558–1.891s | 6.4% | 446.4 MiB | 2.8% |

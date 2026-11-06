# Jest / Vitest / Rstest benchmarks

Compare Jest + SWC, Vitest, and Rstest on shared Node and React workloads. The optional `rstest-vmForks` runner adds Rstest's VM forks pool to the comparison. Each run reports whole-process elapsed time and RSS for cold and warm framework caches.

## Quick start

Use Node.js 24, the pnpm version pinned in this repository, and macOS or Linux for RSS collection. Run from the repository root:

```sh
pnpm --dir frameworks install --frozen-lockfile
pnpm --dir frameworks exec playwright install chromium
pnpm compare:frameworks --runs 6
```

Dependencies are pinned in [package.json](package.json) and [pnpm-lock.yaml](pnpm-lock.yaml): Jest **30.5.2** + `@swc/jest` **0.2.39**, Vitest **5.1.0**, and Rstest **0.12.6**. The runner installs missing dependencies automatically; Chromium must be installed before browser measurements.

The default run includes main, coverage and browser suites: **456 timed invocations and 38 warmups**. It writes reports, samples, logs and source snapshots to `results/frameworks-*/`. It does not update the repository README or Rstest release reports.

```sh
# One workload, all three frameworks
pnpm compare:frameworks --suites main --cases many-files --runs 6

# Warm framework caches only
pnpm compare:frameworks --suites main --conditions warm --runs 6
```

## Workloads

| Case | Test files / tests | Workload |
| --- | ---: | --- |
| `startup` | 5 / 18 | Small Node utility package with 8 source modules |
| `minimal-node` | 1 / 1 | Tiny Node project: one source module and one test |
| `minimal-react` | 1 / 1 | Tiny React project: one component test using jsdom and Testing Library |
| `many-files` | 400 / 800 | Many isolated test files sharing 127 source modules |
| `module-graph` | 40 / 80 | Eager loading of a 1,000-module graph |
| `backend` | 16 / 45 | Dependency loading and in-memory service operations |
| `barrel` | 20 / 40 | Sparse imports from a barrel exporting 3,200 leaf modules |
| `react` | 30 / 54 | React component tests using jsdom and Testing Library |

Coverage compares none/V8/Istanbul on selected workloads, including no-coverage controls. Browser mode runs the React workload in Chromium with Vitest and the default Rstest runner. The two tiny-project workloads are opt-in and measure startup overhead; they are excluded from the default matrix. Run them with:

```sh
pnpm compare:frameworks --suites main --cases minimal-node,minimal-react --frameworks jest,vitest,rstest,rstest-vmForks --runs 8
```

Each has one source file, one test file and one test. [Node](fixtures/minimal-node/tests/add.test.ts) exercises an addition function; [React](fixtures/minimal-react/tests/Counter.test.tsx) renders a counter in jsdom and clicks it once. They measure tiny-project startup overhead, not throughput on larger projects.

#### Results

Reproduce the complete matrix, including both tiny projects, coverage and browser mode:

```sh
pnpm compare:frameworks --suites main,coverage,browser --cases minimal-node,minimal-react,startup,many-files,module-graph,backend,barrel,react --frameworks jest,vitest,rstest,rstest-vmForks --runs 8
```

Measured 2026-11-06 on Apple M4 Max with Node 24.11.1. Jest **30.5.2** + SWC **0.2.39**, Vitest **5.1.0**, Rstest **0.12.6**. Default concurrency; `rstest-vmForks` changes only the Rstest pool. Eight timed runs per supported case and cache condition; all **928 timed samples and 58 warmups passed**. Node compile cache is disabled. Cold and warm framework caches are reported separately; OS page cache and background load are uncontrolled. Percentages are relative to Jest; negative means less time or RSS. Browser mode compares Vitest against default Rstest only.

🥇 and 🥈 mark the lowest and second-lowest distinct unrounded medians in each row; exact ties share the marker. They do not indicate statistical significance.

**Main suite · cold cache · elapsed time**

| Case | Jest + SWC | Vitest | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: |
| Node · single-file | 0.442s | 0.304s (-31.2%) | 🥇 0.241s (-45.6%) | 🥈 0.256s (-42.1%) |
| React · single-file | 0.765s | 0.641s (-16.1%) | 🥇 0.506s (-33.8%) | 🥈 0.539s (-29.5%) |
| Node startup | 0.651s | 0.344s (-47.2%) | 🥇 0.272s (-58.3%) | 🥈 0.297s (-54.3%) |
| Many files | 🥈 3.204s | 7.062s (+120.4%) | 4.621s (+44.2%) | 🥇 1.110s (-65.3%) |
| Module graph | 7.169s | 4.695s (-34.5%) | 🥈 1.010s (-85.9%) | 🥇 0.780s (-89.1%) |
| Backend | 1.151s | 0.880s (-23.5%) | 🥇 0.628s (-45.4%) | 🥈 0.729s (-36.6%) |
| Barrel | 21.992s | 9.939s (-54.8%) | 🥈 0.561s (-97.4%) | 🥇 0.468s (-97.9%) |
| React + jsdom | 2.388s | 3.942s (+65.1%) | 🥈 1.742s (-27.1%) | 🥇 1.175s (-50.8%) |

**Main suite · warm cache · elapsed time**

| Case | Jest + SWC | Vitest | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: |
| Node · single-file | 🥇 0.206s | 0.270s (+31.0%) | 🥈 0.234s (+13.2%) | 0.268s (+30.0%) |
| React · single-file | 🥈 0.524s | 0.576s (+10.0%) | 🥇 0.499s (-4.7%) | 0.528s (+0.8%) |
| Node startup | 🥇 0.257s | 0.280s (+8.8%) | 🥈 0.266s (+3.4%) | 0.291s (+13.3%) |
| Many files | 🥈 2.198s | 6.212s (+182.6%) | 4.470s (+103.4%) | 🥇 1.104s (-49.8%) |
| Module graph | 2.377s | 3.095s (+30.2%) | 🥈 0.966s (-59.4%) | 🥇 0.750s (-68.4%) |
| Backend | 0.796s | 0.760s (-4.5%) | 🥇 0.703s (-11.6%) | 🥈 0.729s (-8.4%) |
| Barrel | 5.204s | 5.428s (+4.3%) | 🥈 0.480s (-90.8%) | 🥇 0.455s (-91.3%) |
| React + jsdom | 2.258s | 4.040s (+78.9%) | 🥈 1.669s (-26.1%) | 🥇 1.126s (-50.1%) |

**Main suite · cold cache · RSS (MiB)**

| Case | Jest + SWC | Vitest | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: |
| Node · single-file | 🥇 101.7 | 🥈 116.5 (+14.5%) | 129.6 (+27.4%) | 128.9 (+26.7%) |
| React · single-file | 🥈 182.5 | 🥇 157.7 (-13.6%) | 262.3 (+43.8%) | 262.4 (+43.8%) |
| Node startup | 🥇 93.2 | 🥈 122.8 (+31.8%) | 140.1 (+50.3%) | 139.5 (+49.7%) |
| Many files | 🥇 202.2 | 🥈 217.2 (+7.5%) | 385.7 (+90.8%) | 286.7 (+41.8%) |
| Module graph | 🥇 207.6 | 312.0 (+50.3%) | 372.6 (+79.5%) | 🥈 287.5 (+38.5%) |
| Backend | 🥈 151.9 | 🥇 137.4 (-9.5%) | 154.9 (+2.0%) | 155.4 (+2.4%) |
| Barrel | 363.3 | 429.6 (+18.3%) | 🥇 163.5 (-55.0%) | 🥈 163.7 (-54.9%) |
| React + jsdom | 🥈 182.5 | 🥇 176.9 (-3.1%) | 444.2 (+143.3%) | 357.9 (+96.1%) |

**Main suite · warm cache · RSS (MiB)**

| Case | Jest + SWC | Vitest | Rstest | Rstest vmForks |
| --- | ---: | ---: | ---: | ---: |
| Node · single-file | 🥇 94.9 | 🥈 114.2 (+20.3%) | 129.0 (+36.0%) | 129.1 (+36.1%) |
| React · single-file | 🥈 170.8 | 🥇 159.0 (-6.9%) | 268.6 (+57.3%) | 267.3 (+56.5%) |
| Node startup | 🥇 107.7 | 🥈 116.7 (+8.4%) | 139.3 (+29.3%) | 138.6 (+28.8%) |
| Many files | 🥇 195.0 | 🥈 200.8 (+3.0%) | 388.0 (+98.9%) | 288.2 (+47.8%) |
| Module graph | 🥇 192.8 | 🥈 239.4 (+24.2%) | 390.2 (+102.5%) | 286.0 (+48.4%) |
| Backend | 284.4 | 🥇 126.6 (-55.5%) | 🥈 154.7 (-45.6%) | 155.3 (-45.4%) |
| Barrel | 277.6 | 398.3 (+43.5%) | 🥇 163.1 (-41.3%) | 🥈 164.1 (-40.9%) |
| React + jsdom | 🥇 174.2 | 🥈 178.2 (+2.3%) | 436.4 (+150.5%) | 364.0 (+109.0%) |

RSS is OS maxrss, not total concurrent worker memory. CV flags and full coverage/browser comparisons are in the [complete report](reports/report.md), with [variability](reports/variability.md) and [all samples and provenance](reports/result.json). The tiny-project rows above are part of the same run and result set. Published reports use fixed paths in `reports/`; each update replaces the current report and samples. Previous results remain available in Git history.

See [workload design](../docs/framework-comparison.md) for performance questions and fixture details. The proposed scaling extensions are not part of the implemented default matrix.

## Options

| Option | Default | Meaning |
| --- | --- | --- |
| `--runs` | `6` | Timed repetitions per framework/case/cache condition |
| `--conditions` | `cold,warm` | Cache conditions, reported separately |
| `--suites` | `main,coverage,browser` | Comma-separated suites |
| `--cases` | six main cases | Comma-separated case IDs from the table; also accepts `minimal-node,minimal-react` |
| `--frameworks` | `jest,vitest,rstest` | Select frameworks; optional entries: `rstest-vmForks`, `jest-babel` |
| `--install` | off | Reinstall pinned dependencies before measuring |
| `--label` | `frameworks` | Result directory prefix |

With three frameworks, use a multiple of six runs to balance order. For four-framework comparisons including `rstest-vmForks`, use a multiple of eight. Browser mode compares Vitest and the default Rstest runner.

## Measurement and limitations

- **Elapsed time:** process start through exit, including configuration, transformation, workers, tests, reporting and shutdown. Installations, fixture generation and cache cleanup happen outside the timed interval.
- **Cold / warm:** cold clears framework caches before every invocation; warm retains them after one warmup. Every invocation starts a new process. Node compile cache is disabled; OS page caches and background load are uncontrolled.
- **Concurrency:** each framework retains its default scheduling and isolation. Jest may choose in-band execution for small suites using cached test timings, so warm results include scheduling decisions as well as transform-cache reuse.
- **RSS:** median OS maxrss from `/usr/bin/time`, not the simultaneous total of worker or browser memory. Thread and fork pools have different process layouts; their maxrss ratios are not total-memory ratios.
- **Statistics:** report medians alongside variability and retain all samples. A lower median does not establish statistical significance, especially when differences are small or variation is high.

Test bodies and application sources are shared. Jest uses SWC with CommonJS output; Vitest and Rstest use their built-in pipelines. Vitest's filesystem module cache remains enabled and is scoped to each generated case. React uses the same jsdom 26.1.0 and one cleanup per test. Jest maps CSS to a minimal object because assertions do not inspect styling; browser/bundler configurations process CSS normally.

Coverage verifies matching executable source-file sets. Type declarations and React barrels containing only re-exports are excluded. Matching files do not prove identical statement or branch instrumentation. These are comparisons of runnable test stacks, including their module-loading strategies.

Each result retains installed versions, the lockfile, generated sources, adapted tests, config fingerprints and a measurement-harness snapshot. Unsupported combinations remain explicit in the report.

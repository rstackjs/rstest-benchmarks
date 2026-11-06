# CI benchmarks and report publication

The workflows follow the run-summary and artifact approach used by [build-tools-performance](https://github.com/rstackjs/build-tools-performance/blob/main/.github/workflows/benchmark.yml). Its [README sync skill](https://github.com/rstackjs/build-tools-performance/blob/main/.agents/skills/benchmark-readme-sync/SKILL.md) also informed the provenance and completeness checks implemented here.

## Run benchmarks

The comparisons have separate workflows, inputs and concurrency groups:

| Workflow | Trigger | Default workload |
| --- | --- | --- |
| [Framework benchmarks](../.github/workflows/benchmark-frameworks.yml) | Pull requests, pushes to `main`, merge queue, or manual dispatch | Jest + SWC, Vitest, Vitest vmForks, Rstest and Rstest vmForks; all eight main cases and browser mode; 5 timed runs per runner/case/cache condition, cold and warm caches |
| [Coverage benchmarks](../.github/workflows/benchmark-coverage.yml) | Manual dispatch | The same five runners; backend and React; none/V8/Istanbul; 5 timed runs per runner/case/provider/cache condition, cold and warm caches |
| [Rstest version benchmarks](../.github/workflows/benchmark-versions.yml) | Manual dispatch | Rstest 0.11.0 vs 0.12.6; all five suites; 1 warmup and 6 timed runs per supported case |

Markdown and published-result-only changes do not trigger push/PR framework benchmarks. Choose the workflow under **Actions**, then **Run workflow**:

| Input | Framework workflow | Version workflow |
| --- | --- | --- |
| `runner` | `ubuntu-24.04` or `macos-15`; defaults to Linux | Same |
| `runs` | Defaults to `5`; `10` is optional for forward/reverse and browser order balancing | Defaults to `6`; use a multiple of the number of versions |
| `cases` | Optional comma-separated IDs; empty selects all eight | — |
| `suites` | Defaults to `main,browser`; choose `main,coverage,browser` for combined README/report publication | — |
| `baseline` | — | Exact npm release, default `0.11.0` |
| `candidate` | — | Exact npm release(s), comma-separated, default `0.12.6` |

The separate coverage workflow accepts `runner`, `runs` (default `5`) and `cases` (`backend,react`, `backend` or `react`). It runs only the coverage suite and does not install Chromium. It measures one `none` control series per workload/runner/cache condition, with the selected repetition count, on the same host as the instrumented runs. Controls are not reused across workflows, which can land on different machines.

With the five default runners and five repetitions, the automatic framework job now has 420 timed invocations and 42 warmups, down from 720 and 72 when it also included coverage. The coverage workflow is optional and has 300 timed invocations and 30 warmups for both workloads. These counts describe the selected work, not a wall-time guarantee.

Five rounds let each of the five Node/DOM runners occupy each order position once. Browser mode has two runners, so an odd repetition count gives one runner one extra first position; reports disclose this imbalance. Ten rounds balance both directions and browser order, but are optional. Each repetition is a separate invocation of every supported runner, not a shared repetition across runners.

Local checkout comparison remains available through the local CLI; the version workflow inputs are for npm releases.

Node is pinned to 24.11.1 and pnpm comes from `package.json`. The framework workflow installs its frozen lockfile and Chromium before measurement. The version workflow installs Chromium's Linux system dependencies, then lets `compare` install each Rstest version and Chromium in its isolated workspace; it does not install the framework-comparison dependency set.

Node compile cache is disabled. All compared tools/versions run sequentially in one job on one host, with their default concurrency. CI does not restore framework transformation, build or sequencing caches. Cache resets, warmups and rotating order remain controlled by the existing runners.

Hosted runners can vary in CPU model, load and available parallelism. Use each run's host information and variability report when interpreting differences; do not pool local and CI samples or different workflow runs. There is no automatic performance regression threshold.

## Inspect results

The job summary shows the generated comparison reports. The artifact is named `benchmark-frameworks-<OS>-<run ID>-<attempt>`, `benchmark-coverage-<OS>-<run ID>-<attempt>` or `benchmark-versions-<OS>-<run ID>-<attempt>` and is retained for 30 days. It includes result JSON, reports, logs, generated source/configs, dependency lockfiles and harness snapshots. Installed `node_modules` and framework caches are excluded. Hidden configuration files are included.

Artifacts are uploaded even after failure when a result directory exists. Failed or partial runs are diagnostic evidence, not publishable benchmark results. Full raw samples retain the run URL, commit, attempt and runner information. Download artifacts you need before retention expires.

The workflows do not write to Git or open PRs. They only need read access to repository contents.

## Update the framework homepage

For combined README/report publication, manually run **Framework benchmarks** with `suites: main,coverage,browser`, all eight cases and both cache conditions. Download the artifact from that successful **complete framework run**. The default main/browser job and the separate coverage job provide independent reports; do not merge their samples into a single published run. Extract its contents into the repository's ignored `results/` directory. The expected layout is `results/ci-frameworks-<timestamp>/result.json`, with its reports and logs alongside it.

```sh
pnpm report:frameworks --input results/ci-frameworks-<timestamp>/result.json
pnpm report:frameworks:check
```

This verifies every planned sample, repetition, test count and RSS value; it requires the complete main/coverage/browser matrix, both cache conditions and Jest/Vitest/Rstest. Partial case selections remain useful CI diagnostics but cannot replace the full homepage. Different batches cannot be combined for publication.

The updater regenerates the result block in the root README, including the measurement date, machine, actual versions, sample counts and GitHub Actions source link. It replaces the fixed files under `frameworks/reports/`. The published JSON retains samples and comparison evidence while removing local executable, command and log paths. Its SHA-256 identifies the original artifact input. No benchmark rerun is needed, and the Rstest version page is not changed.

To regenerate from already-published samples, use `pnpm report:frameworks` without `--input`. `--check` performs no writes and fails if either the README or detailed reports are stale. Review the diff before committing; the command does not commit or push.

## Update Rstest version results

Extract a successful version artifact under `results/` without renaming its comparison directory: the generated manifest contains repository-relative paths into that directory.

```sh
pnpm report:versions --input results/ci-versions-<timestamp>-<id>/comparison.json
pnpm report:check
```

This reuses the version publisher's sample and compatibility checks, backups and rollback behavior. It updates `versions/README.md`, `reports.config.json`, the selected version reports and their compact inputs. The main framework README stays unchanged. Existing publication input names cannot be reused; regenerate an already-published comparison with `pnpm report --readme` instead of importing it again.

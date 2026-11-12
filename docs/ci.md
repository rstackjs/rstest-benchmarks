# CI benchmarks and report publication

The workflows follow the run-summary and artifact approach used by [build-tools-performance](https://github.com/rstackjs/build-tools-performance/blob/main/.github/workflows/benchmark.yml). Its [README sync skill](https://github.com/rstackjs/build-tools-performance/blob/main/.agents/skills/benchmark-readme-sync/SKILL.md) also informed the provenance and completeness checks implemented here.

## Run benchmarks

The comparisons have separate workflows, inputs and concurrency groups:

| Workflow | Trigger | Default workload |
| --- | --- | --- |
| [Frameworks benchmark](../.github/workflows/benchmark-frameworks.yml) | Pull requests, pushes to `main`, merge queue, or manual dispatch | Jest + SWC, Vitest, Vitest vmForks, Rstest and Rstest vmForks; all eight main cases and browser mode; 5 timed runs per runner/case/cache condition, cold and warm caches |
| [Rstest version benchmark](../.github/workflows/benchmark-versions.yml) | Manual dispatch | Rstest 0.11.0 vs 0.12.6; main (the README comparison); 1 warmup and 6 timed runs per supported case |
| [Rstest coverage benchmark](../.github/workflows/benchmark-version-coverage.yml) | Manual dispatch | Rstest 0.11.0 vs 0.12.6; coverage only, with none/V8/Istanbul controls and process-tree memory; 1 warmup and 6 timed runs per case |

The framework and coverage workflows are matrix workflows: a `Plan matrix` job turns the `cases` and `exclude_cases` inputs into one job per case, every `Benchmark (<case>)` job runs on its own runner (`macos-15` by default, or the `runner` dispatch input), and a final `Merge results` job combines the per-case results (see [Matrix jobs and merging](#matrix-jobs-and-merging)). The Rstest version performance workflow stays a single job.

Markdown and published-result-only changes do not trigger push/PR framework benchmarks. Pull request, push and default dispatch runs use `macos-15`. The framework and coverage workflows also accept a `runner` dispatch input (`macos-15` or `ubuntu-24.04`); `Plan matrix` and `Merge results` always run on `ubuntu-latest`. Memory is measured with the macOS physical-footprint sampler on macOS and the cgroup v2 `anon + shmem` sampler on Linux; the two metrics are not comparable, so each record, report heading and summary names its kind, and merge and report generation refuse to mix kinds (see [Memory methodology](../README.md#memory-methodology)). Linux runs are not publishable: they stay in job summaries and artifacts, and the publish commands refuse non-macOS input. To start one: `gh workflow run benchmark-frameworks.yml --ref <branch> -f runner=ubuntu-24.04` (same for `benchmark-version-coverage.yml`). Choose the workflow under **Actions**, then **Run workflow**:

| Input | Framework workflow | Both Rstest version workflows |
| --- | --- | --- |
| `runs` | Defaults to `5`; `10` is optional for forward/reverse and browser order balancing | Defaults to `6`; use a multiple of the number of versions |
| `suites` | Fixed main/browser | Performance defaults to `main`; optionally select `scaling,barrel,pools`. Coverage stays separate |
| `cases` | Optional comma-separated case IDs; empty selects all eight | App names or full case IDs; empty selects all cases in the workflow |
| `exclude_cases` | Comma-separated case IDs to skip | App names or full case IDs to skip |
| `baseline` | — | Exact npm release, default `0.11.0` |
| `candidate` | — | Exact npm release(s), comma-separated, default `0.12.6` |

Selection is applied before exclusion (in matrix workflows, by the planning job); exclusions win if both match. Whitespace around commas is ignored. Unknown IDs, duplicate entries and an empty final selection fail before benchmark preparation. Empty suites are skipped and progress totals reflect the remaining cases. Both versions and all selected frameworks use the same filtered workload.

Examples in **Run workflow**:

- Frameworks: leave `cases` empty and set `exclude_cases` to `many-files,module-graph` to skip those workloads. Set `cases` to `backend,react` for a focused comparison. Excluding `react` removes both jsdom and browser cases; use `browser/react/none` to exclude only browser mode.
- Rstest versions: set `cases` to `node-backend` to compare only the backend workload, or leave it empty and set `exclude_cases` to `vue-spa` to skip all Vue environments.
- Rstest coverage: set `cases` to `node-backend` to retain its none/V8/Istanbul comparison. To exclude one provider, use its full case ID, for example `coverage:node-backend:default:default:node:forks:istanbul:default`.

The local CLIs accept `--cases` and `--exclude-cases` with the same values. Preview the final selection without installing or running tests:

```sh
pnpm compare:frameworks --cases backend,react --exclude-cases browser/react/none --dry-run
pnpm compare --baseline 0.11.0 --candidate 0.12.6 --suites all --exclude-cases vue-spa --dry-run
```

The version performance workflow defaults to the README’s `main` suite (10 cases; Vue browser mode is unsupported in 0.11.0). Scaling, barrel optimization and pool sweeps run only when requested through `suites`; coverage remains in its own workflow. Version dry-run output includes full case IDs. Framework full IDs use `suite/case/provider`, such as `main/react/none`. Partial framework runs cannot replace the full published homepage.

Cross-framework coverage is available through the local CLI with `--suites coverage`, but is not run in CI. The Rstest coverage workflow compares releases using the coverage suite: Node module graph, backend, React + jsdom, and medium/large barrel graphs. It does not install Chromium. Each version gets its own no-coverage, V8 and Istanbul measurements on the same host; controls are not reused from the performance workflow.

With the default selections, the framework workflow has 420 timed invocations and 42 warmups across its nine matrix jobs. Rstest version performance has 114 timed invocations and 19 warmups in one job; version coverage has 180 timed invocations and 30 warmups across its four matrix jobs. Unsupported 0.11.0 VM pools and Vue browser mode are excluded. Counts change with selected versions, cases and repetitions; they are not wall-time estimates.

Five rounds let each of the five Node/DOM runners occupy each order position once. Browser mode has two runners, so an odd repetition count gives one runner one extra first position; reports disclose this imbalance. Ten rounds balance both directions and browser order, but are optional. Each repetition is a separate invocation of every supported runner, not a shared repetition across runners.

Local checkout comparison remains available through the local CLI; the version workflow inputs are for npm releases.

Node is pinned to 24.11.1 and pnpm comes from `package.json`. The framework workflow installs its frozen lockfile and Chromium before measurement. The version performance workflow lets `compare` install each Rstest version and Chromium in its isolated workspace. The coverage workflow installs only the selected Rstest versions and workload dependencies. Neither version workflow installs the framework-comparison dependency set.

Node compile cache is disabled. Within each job, all compared tools/versions run sequentially on one host, with their default concurrency; different matrix jobs run in parallel on different hosted runners. CI does not restore framework transformation, build or sequencing caches. Cache resets, warmups and rotating order remain controlled by the existing runners.

Both runners print a `[host]` line before measurement and include the CPU information in result JSON and generated reports (also shown in the CI job summary). It distinguishes the CPU model, logical CPUs reported by `os.cpus().length`, and available parallelism reported by `os.availableParallelism()`. Available parallelism is what the frameworks use to calculate their default worker limits; it is not the resolved worker count. A processor model containing “80-Core” does not mean the runner has 80 CPUs. Historical results without an explicit count show `not recorded` rather than inferring it from the model.

Framework summaries also show observed test workers per case. A shared test setup probe records `JEST_WORKER_ID`, `VITEST_POOL_ID` or `RSTEST_WORKER_ID` from the executing worker, alongside its process and thread IDs. Counts represent distinct slots that executed setup, not configured limits or peak simultaneous concurrency. Recycled processes do not inflate the count. Ranges span timed repetitions and cache conditions; Jest execution in the runner process is labeled `in-process`. Browser mode is marked separately. Missing observations fail new Node runs; historical data shows `Not recorded` without estimating from CPU counts. The probe's filesystem overhead is included in the measurement.

Hosted runners can vary in CPU model, load and available parallelism. Use each run's host information and variability report when interpreting differences; do not pool local and CI samples or different workflow runs. There is no automatic performance regression threshold.

Before measurement, runners print the planned execution count, split into timed runs and warmups. Each execution logs `[current/total]` when it starts and finishes, including the case, framework or version, and phase. The counter spans all selected suites and versions; dependency installation, fixture generation, and unsupported combinations are excluded. The number counts executions, not individual tests or elapsed-time percentage. An interrupted or failed run may stop short of the total.

## Matrix jobs and merging

Hosted runners (Apple M1, 3 CPUs, 7 GiB) can be lost during very long jobs, and a single 80-minute job loses every case when that happens. As in [build-tools-performance](https://github.com/rstackjs/build-tools-performance/blob/main/.github/workflows/benchmark.yml), each case therefore runs in its own job with `fail-fast: false`: a failure loses one case and the others still upload their data.

| Workflow | Matrix unit | Jobs with default inputs | Job timeout |
| --- | --- | --- | --- |
| Frameworks benchmark | One case: `minimal-node`, `minimal-react`, `startup`, `many-files`, `module-graph`, `backend`, `barrel`, `react` (main suite), plus `react-browser` (browser suite, only job that installs Chromium) | 9 | 60 min: the slowest case (`barrel`) is estimated at about 35 minutes with 5 runs and five runners |
| Rstest coverage benchmark | One app: `node-library`, `node-backend`, `react-spa`, `barrel-clean` (each with its none/V8/Istanbul controls and both versions on the same host) | 4 | 45 min: the whole suite took 34 minutes in one job |
| Rstest version benchmark | Not split: successful default runs took 2 to 27 minutes | 1 | 90 min |

`node scripts/ci-matrix.mjs frameworks|coverage --cases ... --exclude-cases ...` builds the matrix with the same selection rules as the local CLIs (`--cases react` gives `react` and `react-browser`; excluding `react` removes both; `browser/react/none` targets only browser mode). It writes the `matrix` output that the jobs consume through `fromJSON`. Unknown IDs or an empty selection fail in the planning job.

Every matrix job uploads its own artifact, `benchmark-frameworks-case-<case>-<runner OS>-<run ID>-<attempt>` or `benchmark-version-coverage-case-<app>-<runner OS>-<run ID>-<attempt>`. The `Merge results` job runs even when a case job failed, downloads these artifacts and merges them:

- `frameworks/merge-results.mjs` builds one `result.json` and runs the repository's verification on it, then renders the reports. `scripts/merge-comparisons.mjs` builds one `comparison.json` with one baseline and one candidate result document for the coverage workflow, which `pnpm report:versions` publishes like a single run.
- Merging refuses inputs that are not `completed`, whose lockfile, harness, dependencies, installed versions, host (CPU, Node, platform) or options differ, or that contain the same case twice. A failed case job therefore fails the merge instead of producing a partial result; the other cases remain available in their own artifacts.
- The merged record keeps every sample unchanged and adds `mergedFrom` (artifact name, cases, runner and timestamps of each input). Samples of the framework result carry a `mergeSource` tag, because jobs run in parallel and `verify.mjs` checks that benchmark processes do not overlap only within one source. Nothing else in verification changes.
- The merge job summary, the merged artifact (`benchmark-frameworks-merged-<runner>-<run ID>-<attempt>`, `benchmark-version-coverage-merged-...`) and the final `Check published reports` step (`if: always()`, so it reports even when the merge failed) follow the merge.

## Inspect results

The framework summary (per case job, and the merged one) shows environment information and elapsed-time/memory comparisons. Rstest phase timings remain in the artifact’s full `report.md`; `summary.md` omits those diagnostic tables. Version jobs use the same compact elapsed-time and memory tables as the README, with environment information and repetition counts. Their `summary.md` excludes Variability and detailed Memory tables; complete reports remain under `reports/` in the artifact. Each matrix job's artifact is named as described in [Matrix jobs and merging](#matrix-jobs-and-merging); the merged artifacts are `benchmark-frameworks-merged-<runner>-<run ID>-<attempt>` and `benchmark-version-coverage-merged-<OS>-<run ID>-<attempt>`, and the single-job version workflow produces `benchmark-versions-<OS>-<run ID>-<attempt>`. Artifacts are retained for 30 days. It includes result JSON, reports, logs, generated source/configs, dependency lockfiles and harness snapshots. Installed `node_modules` and framework caches are excluded. Hidden configuration files are included.

Artifacts are uploaded even after failure when a result directory exists. Failed or partial runs are diagnostic evidence, not publishable benchmark results. Full raw samples retain the run URL, commit, attempt and runner information. Download artifacts you need before retention expires.

The workflows do not write to Git or open PRs. They only need read access to repository contents.

## Update the framework homepage

Download the merged artifact (`benchmark-frameworks-merged-...`) from a successful **Frameworks benchmark** run with all eight cases and browser mode. The default CI selection is sufficient; coverage is not required. Extract its contents into the repository's ignored `results/` directory. The expected layout is `results/ci-frameworks-merged-<run ID>/result.json`, with its reports alongside it.

```sh
pnpm report:frameworks --input results/ci-frameworks-merged-<run ID>/result.json
pnpm report:frameworks:check
```

This verifies every planned sample, repetition, test count and memory value; it requires the complete main/browser matrix, both cache conditions and Jest/Vitest/Rstest. Historical full runs that also contain coverage remain supported; any selected coverage matrix must be complete. Partial case selections remain useful CI diagnostics but cannot replace the full homepage. Different batches cannot be combined for publication; the per-case jobs of one workflow run are one batch and are combined by the merge job.

The updater regenerates the result block in the root README, including the measurement date, machine, actual versions, sample counts and GitHub Actions source link. It replaces the fixed files under `frameworks/reports/`. The published JSON retains samples and comparison evidence while removing local executable, command and log paths. Its SHA-256 identifies the original artifact input. No benchmark rerun is needed, and the Rstest version page is not changed.

To regenerate from already-published samples, use `pnpm report:frameworks` without `--input`. `--check` performs no writes and fails if either the README or detailed reports are stale. Review the diff before committing; the command does not commit or push.

## Update Rstest version results

Extract a successful version performance artifact, or the merged version coverage artifact (`benchmark-version-coverage-merged-...`), under `results/` without renaming its comparison directory: the generated manifest contains repository-relative paths into that directory.

```sh
pnpm report:versions --input results/ci-versions-<timestamp>-<id>/comparison.json
pnpm report:versions --input results/ci-version-coverage-merged-<run ID>/comparison.json
pnpm report:check
```

Import performance and coverage artifacts separately with the same command, pointing `--input` at each `comparison.json`. Only the selected suites are updated; other results remain intact. Each report retains its own host and run provenance, without merging samples across workflows.

This reuses the version publisher's sample and compatibility checks, backups and rollback behavior. It updates `versions/README.md`, `reports.config.json`, the selected version reports and their compact inputs. The main framework README stays unchanged. Existing publication input names cannot be reused; regenerate an already-published comparison with `pnpm report --readme` instead of importing it again.

# CI benchmarks and report publication

The workflows follow the run-summary and artifact approach used by [build-tools-performance](https://github.com/rstackjs/build-tools-performance/blob/main/.github/workflows/benchmark.yml). Its [README sync skill](https://github.com/rstackjs/build-tools-performance/blob/main/.agents/skills/benchmark-readme-sync/SKILL.md) also informed the provenance and completeness checks implemented here.

## Run benchmarks

The comparisons have separate workflows, inputs and concurrency groups:

| Workflow | Trigger | Default workload |
| --- | --- | --- |
| [Frameworks benchmark](../.github/workflows/benchmark-frameworks.yml) | Pull requests, pushes to `main`, merge queue, or manual dispatch | Jest + SWC, Vitest, Vitest vmForks, Rstest and Rstest vmForks; all eight main cases and browser mode; 5 timed runs per runner/case/cache condition, cold and warm caches |
| [Rstest version benchmark](../.github/workflows/benchmark-versions.yml) | Manual dispatch | Rstest 0.11.0 vs 0.12.6; main (the README comparison); 1 warmup and 6 timed runs per supported case |
| [Rstest coverage benchmark](../.github/workflows/benchmark-version-coverage.yml) | Manual dispatch | Rstest 0.11.0 vs 0.12.6; coverage only, with none/V8/Istanbul controls and RSS; 1 warmup and 6 timed runs per case |

Markdown and published-result-only changes do not trigger push/PR framework benchmarks. Choose the workflow under **Actions**, then **Run workflow**:

| Input | Framework workflow | Both Rstest version workflows |
| --- | --- | --- |
| `runner` | `ubuntu-24.04` or `macos-15`; defaults to Linux | Same |
| `runs` | Defaults to `5`; `10` is optional for forward/reverse and browser order balancing | Defaults to `6`; use a multiple of the number of versions |
| `suites` | Fixed main/browser | Performance defaults to `main`; optionally select `scaling,barrel,pools`. Coverage stays separate |
| `cases` | Optional comma-separated case IDs; empty selects all eight | App names or full case IDs; empty selects all cases in the workflow |
| `exclude_cases` | Comma-separated case IDs to skip | App names or full case IDs to skip |
| `baseline` | — | Exact npm release, default `0.11.0` |
| `candidate` | — | Exact npm release(s), comma-separated, default `0.12.6` |

Selection is applied before exclusion; exclusions win if both match. Whitespace around commas is ignored. Unknown IDs, duplicate entries and an empty final selection fail before benchmark preparation. Empty suites are skipped and progress totals reflect the remaining cases. Both versions and all selected frameworks use the same filtered workload.

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

With the default selections, the framework job has 420 timed invocations and 42 warmups. Rstest version performance has 114 timed invocations and 19 warmups; version coverage has 180 timed invocations and 30 warmups. Unsupported 0.11.0 VM pools and Vue browser mode are excluded. Counts change with selected versions, cases and repetitions; they are not wall-time estimates.

Five rounds let each of the five Node/DOM runners occupy each order position once. Browser mode has two runners, so an odd repetition count gives one runner one extra first position; reports disclose this imbalance. Ten rounds balance both directions and browser order, but are optional. Each repetition is a separate invocation of every supported runner, not a shared repetition across runners.

Local checkout comparison remains available through the local CLI; the version workflow inputs are for npm releases.

Node is pinned to 24.11.1 and pnpm comes from `package.json`. The framework workflow installs its frozen lockfile and Chromium before measurement. The version performance workflow installs Chromium’s Linux system dependencies, then lets `compare` install each Rstest version and Chromium in its isolated workspace. The coverage workflow installs only the selected Rstest versions and workload dependencies. Neither version workflow installs the framework-comparison dependency set.

Node compile cache is disabled. All compared tools/versions run sequentially in one job on one host, with their default concurrency. CI does not restore framework transformation, build or sequencing caches. Cache resets, warmups and rotating order remain controlled by the existing runners.

Both runners print a `[host]` line before measurement and include the CPU information in result JSON and generated reports (also shown in the CI job summary). It distinguishes the CPU model, logical CPUs reported by `os.cpus().length`, and available parallelism reported by `os.availableParallelism()`. Available parallelism is what the frameworks use to calculate their default worker limits; it is not the resolved worker count. A processor model containing “80-Core” does not mean the runner has 80 CPUs. Historical results without an explicit count show `not recorded` rather than inferring it from the model.

Framework summaries also show observed test workers per case. A shared test setup probe records `JEST_WORKER_ID`, `VITEST_POOL_ID` or `RSTEST_WORKER_ID` from the executing worker, alongside its process and thread IDs. Counts represent distinct slots that executed setup, not configured limits or peak simultaneous concurrency. Recycled processes do not inflate the count. Ranges span timed repetitions and cache conditions; Jest execution in the runner process is labeled `in-process`. Browser mode is marked separately. Missing observations fail new Node runs; historical data shows `Not recorded` without estimating from CPU counts. The probe's filesystem overhead is included in the measurement.

Hosted runners can vary in CPU model, load and available parallelism. Use each run's host information and variability report when interpreting differences; do not pool local and CI samples or different workflow runs. There is no automatic performance regression threshold.

Before measurement, runners print the planned execution count, split into timed runs and warmups. Each execution logs `[current/total]` when it starts and finishes, including the case, framework or version, and phase. The counter spans all selected suites and versions; dependency installation, fixture generation, and unsupported combinations are excluded. The number counts executions, not individual tests or elapsed-time percentage. An interrupted or failed run may stop short of the total.

## Inspect results

The framework job summary shows environment information and elapsed-time/RSS comparisons. Rstest phase timings remain in the artifact’s full `report.md`; `summary.md` omits those diagnostic tables. Version jobs use the same compact elapsed-time and RSS tables as the README, with environment information and repetition counts. Their `summary.md` excludes Variability and detailed Memory tables; complete reports remain under `reports/` in the artifact. The artifact is named `benchmark-frameworks-<OS>-<run ID>-<attempt>`, `benchmark-version-coverage-<OS>-<run ID>-<attempt>` or `benchmark-versions-<OS>-<run ID>-<attempt>` and is retained for 30 days. It includes result JSON, reports, logs, generated source/configs, dependency lockfiles and harness snapshots. Installed `node_modules` and framework caches are excluded. Hidden configuration files are included.

Artifacts are uploaded even after failure when a result directory exists. Failed or partial runs are diagnostic evidence, not publishable benchmark results. Full raw samples retain the run URL, commit, attempt and runner information. Download artifacts you need before retention expires.

The workflows do not write to Git or open PRs. They only need read access to repository contents.

## Update the framework homepage

Download the artifact from a successful **Frameworks benchmark** run with all eight cases and browser mode. The default CI selection is sufficient; coverage is not required. Extract its contents into the repository's ignored `results/` directory. The expected layout is `results/ci-frameworks-<timestamp>/result.json`, with its reports and logs alongside it.

```sh
pnpm report:frameworks --input results/ci-frameworks-<timestamp>/result.json
pnpm report:frameworks:check
```

This verifies every planned sample, repetition, test count and RSS value; it requires the complete main/browser matrix, both cache conditions and Jest/Vitest/Rstest. Historical full runs that also contain coverage remain supported; any selected coverage matrix must be complete. Partial case selections remain useful CI diagnostics but cannot replace the full homepage. Different batches cannot be combined for publication.

The updater regenerates the result block in the root README, including the measurement date, machine, actual versions, sample counts and GitHub Actions source link. It replaces the fixed files under `frameworks/reports/`. The published JSON retains samples and comparison evidence while removing local executable, command and log paths. Its SHA-256 identifies the original artifact input. No benchmark rerun is needed, and the Rstest version page is not changed.

To regenerate from already-published samples, use `pnpm report:frameworks` without `--input`. `--check` performs no writes and fails if either the README or detailed reports are stale. Review the diff before committing; the command does not commit or push.

## Update Rstest version results

Extract a successful version performance or version coverage artifact under `results/` without renaming its comparison directory: the generated manifest contains repository-relative paths into that directory.

```sh
pnpm report:versions --input results/ci-versions-<timestamp>-<id>/comparison.json
pnpm report:check
```

Import performance and coverage artifacts separately with the same command, pointing `--input` at each `comparison.json` (`ci-versions-*` or `ci-version-coverage-*`). Only the selected suites are updated; other results remain intact. Each report retains its own host and run provenance, without merging samples across workflows.

This reuses the version publisher's sample and compatibility checks, backups and rollback behavior. It updates `versions/README.md`, `reports.config.json`, the selected version reports and their compact inputs. The main framework README stays unchanged. Existing publication input names cannot be reused; regenerate an already-published comparison with `pnpm report --readme` instead of importing it again.

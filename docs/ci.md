# CI benchmarks and report publication

The [Benchmark workflow](../.github/workflows/benchmark.yml) follows the run-summary and artifact approach used by [build-tools-performance](https://github.com/rstackjs/build-tools-performance/blob/main/.github/workflows/benchmark.yml). Its [README sync skill](https://github.com/rstackjs/build-tools-performance/blob/main/.agents/skills/benchmark-readme-sync/SKILL.md) also informed the provenance and completeness checks implemented here.

## Run benchmarks

Pull requests, pushes to `main` and merge-queue events run the complete framework comparison. Markdown and published-result-only changes do not trigger push/PR benchmarks. In GitHub Actions, **Benchmark → Run workflow** also accepts:

| Input | Default | Purpose |
| --- | --- | --- |
| `mode` | `frameworks` | Framework comparison, or Rstest `versions` comparison |
| `runner` | `ubuntu-24.04` | Linux or `macos-15`; keep results from different hosts separate |
| `runs` | `8` | Timed runs per supported case and cache condition |
| `cases` | all eight | Optional comma-separated framework cases; ignored in versions mode |
| `baseline` | `0.11.0` | Baseline npm release for versions mode |
| `candidate` | `0.12.6` | Candidate npm release(s), comma-separated, for versions mode |

Framework mode includes Jest + SWC, Vitest, Rstest and Rstest vmForks; all eight main cases, coverage and browser mode; cold and warm caches. Eight runs balance the four-way comparisons and the two-way browser comparison. Version mode runs all five Rstest suites, with one warmup per case and rotating source order. With N versions, use a multiple of N repetitions. Local checkout comparison remains available through the local CLI; the workflow inputs are for npm releases.

Node is pinned to 24.11.1 and pnpm comes from `package.json`. Framework dependencies use the frozen lockfile. Browser dependencies and Chromium are installed before measurement. Node compile cache is disabled. All compared tools/versions run sequentially in one job on one host, with their default concurrency. CI does not restore framework transformation, build or sequencing caches. Cache resets and warmups remain controlled by the existing runners.

Hosted runners can vary in CPU model, load and available parallelism. Use each run's host information and variability report when interpreting differences; do not pool local and CI samples or different workflow runs. There is no automatic performance regression threshold.

## Inspect results

The job summary shows the generated comparison reports. The artifact is named `benchmark-<mode>-<OS>-<run ID>-<attempt>` and is retained for 30 days. It includes result JSON, reports, logs, generated source/configs, dependency lockfiles and harness snapshots. Installed `node_modules` and framework caches are excluded. Hidden configuration files are included.

Artifacts are uploaded even after failure when a result directory exists. Failed or partial runs are diagnostic evidence, not publishable benchmark results. Full raw samples retain the run URL, commit, attempt and runner information. Download artifacts you need before retention expires.

Nothing in the workflow writes to Git or opens a PR. The workflow only needs read access to repository contents.

## Update the framework homepage

Download the artifact from one successful **complete framework run**. Extract its contents into the repository's ignored `results/` directory. The expected layout is `results/ci-frameworks-<timestamp>/result.json`, with its reports and logs alongside it.

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

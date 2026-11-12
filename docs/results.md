# Benchmark results

## Measurement policy

All suites measure the complete `rstest run` process, including CLI startup, build, worker or browser startup, test execution, reporting, and exit. They do not isolate assertion or rendering time.

The runner generates each fixture once per size and scaling dimension. Every supported variant receives one warmup by default, followed by five timed rounds. Variant order rotates within a fixture. `pnpm compare` runs all sources for each case/round and rotates their positions, using separate installations without overlapping test processes. Standalone `pnpm bench` runs remain independent batches. Warmups are recorded but excluded from statistics.

Node compile cache is disabled with `NODE_DISABLE_COMPILE_CACHE=1` for the CLI and workers. Separately, the runner removes `dist/.rstest-temp`, `node_modules/.cache/rstest`, and the sequencing cache `node_modules/.cache/.rstest-results` before each fixture group's warmups. It retains caches across variants and timed rounds; config changes may invalidate build output. Thus the standard suite measures warm application runs, not first-run CI without restored cache.

The Node and DOM defaults are `forks + isolate:true` with worker concurrency unset. Only the explicit pool suite changes the pool. Coverage runs use the same OS timing wrapper for both the no-coverage control and the enabled providers.

Watch/re-run latency, multi-project coordination, browser navigation, and long-lived memory growth need dedicated experiments with different timing boundaries. The default suites make no claims about them. See [workload design](workloads.md) and [running benchmarks](running.md).

## Stored results

The runner writes full local artifacts under the ignored `results/` directory. Published reports use compact JSON exports under `reports/data/`, retaining every sample and the metadata needed to check comparability. Exported inputs also record the original result's SHA-256. Full logs, execution commands, source inventories, and snapshots are stored separately. See [publishing inputs](../reports/data/README.md).

The schema below describes full runner output. Published exports omit execution artifacts and mark their format with `meta.publication`; report generation recomputes statistics from the retained samples in both formats.

## Source comparisons

`pnpm compare` records source preparation and package identities in its comparison directory. The baseline is measured once per round; each candidate column compares against that same baseline. Each child run also records `meta.source`: an npm version or a local build identity, including Git state and package fingerprints. A local package version alone does not identify the build. Pooling batches checks the source fingerprint when both inputs provide one; different local builds with the same version cannot be pooled as one result. Existing runs without this field retain their original metadata. New comparisons also record per-app workload dependency hashes in `meta.source.workloadDependencies`; the full resolved graphs and paired execution schedule are in `comparison.json`. Non-Rstest workload dependency mismatches stop the comparison before timing and suppress percentages in reports. Framework-owned dependencies may differ with the version under test.

README publication is opt-in with `--update-readme`; it exports the selected run inputs and updates their reports, tables and measurement context after successful completion. Other suites are retained. See [publication behavior](running.md#update-readme-data).

## Schema v2

All suites use `scripts/runner.mjs`. The public entry points are `bench`, `bench:coverage`, `bench:pools`, `bench:barrel` and `bench:scaling`. New results use `schemaVersion: 2`; reports can also read the older unversioned files without changing them. The optional `dimension` field distinguishes file-count scaling from graph-size scaling; it is null for older results and other suites.

| Field                                                                                    | Meaning                                                                                                                        |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `runId`, `suite`, `status`                                                               | Unique invocation, matrix and completion state                                                                                 |
| `meta.startedAt`, `meta.endedAt`                                                         | ISO timestamps for the invocation                                                                                              |
| `meta.options`, `meta.invocation`, `meta.cwd`                                            | Requested options and runner invocation                                                                                        |
| `meta.node*`, `cpu`, `platform`, `osRelease`, `totalMemoryBytes`, `availableParallelism` | Runtime and host identity                                                                                                      |
| `meta.packageManager`, `lockfileSha256`, `git`                                           | Installed pnpm version, lockfile fingerprint, Git commit/status if available                                                   |
| `meta.runner`                                                                            | Source inventory and SHA-256 fingerprint of the harness                                                                        |
| `meta.measurement`                                                                       | Clock scope, cache, reporter, concurrency, ordering and memory policies                                                           |
| `generations`                                                                            | Fixture generator invocations, environment controls, timestamps, exits and logs                                                |
| `results[]`                                                                              | Explicit case dimensions, status, raw samples and statistics                                                                   |
| `results[].fixture`, `configs`                                                           | Relative file inventories with individual and aggregate SHA-256 fingerprints                                                   |
| `results[].dependencies`                                                                 | Requested and installed direct dependency versions, resolved manifest paths and hashes                                         |
| `results[].browser`, `environment`                                                       | Chromium executable/version where applicable and allowlisted inherited controls                                                |
| `results[].samples[]`                                                                    | Warmup/timed phase, round, global order, command, environment controls, timestamps, exit code/signal, timeout, counts and logs |
| `results[].samples`, `memorySamples` | Timing samples (elapsed time, no sampler) and memory samples (`memoryBytes`, from the separate memory pass) per case; framework results keep the same two arrays at the top level |
| `results[].stats`, `memoryStats`                                                            | Statistics computed from successful timed samples only                                                                         |

Wall-clock values are milliseconds; memory is bytes of the peak metric named in `meta.measurement.memory` (macOS process-tree physical footprint, or Linux cgroup v2 anon+shmem; Linux samples also carry `cgroupPeakBytes`). Output tables display seconds and MiB. Log paths in completed samples are relative to the run directory. Original working directories and resolved package paths are retained for diagnosis, even when an artifact is moved. Snapshot paths mirror the harness or app/size layout.

The runner records every warmup and timed execution, including failed attempts. A case is `passed` only after all requested timed repetitions succeed. Failed or incomplete cases may retain descriptive statistics for their successful samples, but comparison reports withhold the percentage. Cases not supported by the selected version are `skipped` with a reason. Ordinary failures do not stop unrelated cases. SIGINT/SIGTERM and per-command timeouts terminate the child process group on macOS/Linux and preserve partial results; SIGKILL and machine failure cannot execute final cleanup.

Every successful test process must also produce a structured Markdown reporter summary. Its test-file count must equal the generated test-file inventory, failed files/tests must be zero, and the positive passing-test count must remain stable within the case. Exit code zero alone is not sufficient. The full summary is retained with each sample.

## Statistics

- `n`: successful timed sample count, excluding warmups.
- `median`: middle value, or the arithmetic mean of the middle two values for even `n`.
- `min`, `max`, `mean`: computed over all successful timed samples.
- `sd`: sample standard deviation, with denominator `n - 1`; unknown for `n < 2`.
- `cv`: `100 × sd / mean`; unknown for `n < 2` or zero mean.
- `mad`: unscaled median absolute deviation from the median.

No sample or outlier is discarded. Empty series have null statistics. Combining batches pools their raw samples; it does not average medians. Reports flag fewer than three samples. Detailed reports retain SD, range and CV; a high CV alone does not warrant a warning for a small absolute fluctuation. For substantial variation, wait for background load to settle, then rerun all compared versions with the same cache policy and balanced order. Retain the original batch and all rerun samples. Five runs are the default.

Times, memory and percentages display two decimal places. Percentage changes appear in separate Δ columns and use unrounded medians: `100 × (candidate median / baseline median - 1)`. Negative means less elapsed time. Missing, failed, incomplete or known-incompatible cells do not receive a percentage. Version comparisons allow lockfiles to differ intentionally; they do not prove that all transitive dependency changes are irrelevant.

## Comparability and provenance

The case identity includes suite, app, scaling dimension, scale, environment, pool, coverage provider, config and isolation. Report configs can omit exactly one explicit comparison axis (`pool`, `provider` or `config`) from the identity; each column must then filter that axis. This prevents browser and happy-dom results, different suite sizes, or file-count and graph-size series from being silently paired. The barrel suite uses `config` as its comparison axis.

Known differences in Node, CPU, platform, OS release, available parallelism, fixture/config hashes, test counts, harness fingerprint or measurement policy suppress comparisons. Pooling repeated batches also requires matching known Rstest versions and lockfile hashes. Initial forward/reverse order is allowed to differ by design. Paired comparisons and standalone batches have different recorded ordering policies and cannot be mixed. Historical reports retain the cache and ordering policies recorded when they were measured.

Rstest concurrency is left unset and recorded as its version-specific default, not inferred as an exact worker count. The process environment is inherited, with benchmark/scale and Node compile-cache overrides cleared, then `NODE_DISABLE_COMPILE_CACHE=1` enforced for every subprocess. This disables Node compile cache in the CLI and workers for every measured release, including warmups. Both compile-cache environment variables are recorded. Rstest build-cache handling is separate and recorded in `meta.measurement.cache`. Only an allowlist of performance-relevant controls is serialized; credentials and the entire shell environment are not dumped. Source snapshots and the lockfile allow the fixture/toolchain to be reconstructed, but do not capture OS page-cache state, thermal state or other applications running on the host. They are not a hermetic execution image.

Memory uses a separate pass from timing. The timing pass runs with no sampler. The memory pass reruns the same command with the same cold/warm preparation, sampling its process tree every 50 ms and summing macOS `phys_footprint` (excluding the benchmark driver); the per-run value is the peak of that sum. Elapsed time comes only from the timing pass and memory only from the memory pass; a memory run whose exit code or test counts differ from its timing run fails. There is one memory run per timed run, and warmups have none. Very short runs (about 0.3 s, such as `minimal-*`) can miss brief worker peaks at the 50 ms interval. Memory measurement requires macOS and fails elsewhere. Timing includes coverage `text` report generation. The non-coverage control in the coverage suite is measured the same way. See [Memory methodology](../README.md#memory-methodology).

Legacy imports preserve their samples and recorded metadata. Missing hashes, timestamps, warmup measurements, commands, counts and logs remain unknown. Historical percentages are explicitly marked as having incomplete provenance. Never copy current machine or source metadata onto old measurements.

## Report configuration

README blocks automatically include a compact memory comparison when the selected inputs contain memory samples: one row per case, with median MiB and candidate changes relative to the baseline. Missing or incomplete memory samples do not receive a percentage. Full variability and memory statistics remain in the linked reports.

`reports.config.json` contains a `reports` array. Each report has a title, output path, optional README marker and at least two columns. The first column is the baseline. A column contains a label, input JSON paths and optional case-field filters under `where`. Paths are relative to the repository root. Duplicate input paths and empty columns are rejected. For README-only display, a report may set `readme: { "columns": [0, 2], "context": "..." }`: indices are zero-based and must retain column 0 as the baseline. The full report keeps every column; README statistics and variability notes are recalculated for the selected inputs. This view applies to report regeneration; a new `compare --update-readme` replaces the selected report definition.

```json
{
  "reports": [
    {
      "title": "Pool comparison",
      "output": "reports/pools-new.md",
      "axis": "pool",
      "columns": [
        {
          "label": "forks",
          "files": ["results/<run>/result.json"],
          "where": { "pool": "forks" }
        },
        {
          "label": "vmThreads",
          "files": ["results/<run>/result.json"],
          "where": { "pool": "vmThreads" }
        }
      ]
    }
  ]
}
```

Use `pnpm report --config <path>` to generate reports. `--readme` replaces only the corresponding `<!-- benchmark:<marker>:start -->` / `end` blocks. `--check` verifies generated content without writing files. Report generation recomputes statistics from samples rather than trusting stored medians.

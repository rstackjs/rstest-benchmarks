# Running benchmarks

Use Node.js 26 and the pnpm version pinned in `package.json`. With nvm, run `nvm use` to select the recorded runtime.

## Compare versions

```sh
# Published releases
pnpm compare --baseline 0.12.5 --candidate 0.12.6

# Published release vs a local checkout; paths are relative to this directory
pnpm compare --baseline 0.12.6 --candidate local:../rstest

# Multiple npm versions; each candidate is compared with the baseline
pnpm compare --baseline 0.12.4 --candidate 0.12.5,0.12.6 --runs 6

# Mix published and local candidates
pnpm compare --baseline 0.12.5 --candidate 0.12.6 --candidate local:../rstest --runs 6

# Opt in to updating selected published reports and README tables
pnpm compare --baseline 0.12.5 --candidate 0.12.6 --suites all --runs 6 --update-readme

# Node workload plus coverage/memory
pnpm compare --baseline 0.12.6 --candidate local:../rstest \
  --suites main,coverage --apps node-backend --runs 5

# Inspect sources and cases without installing, building, or measuring
pnpm compare --baseline 0.12.5 --candidate 0.12.6 --dry-run
```

One `--baseline` and one or more `--candidate` sources are required. Repeat `--candidate`, or separate npm versions with commas. Use repeated flags for local paths (a local path may contain commas). Duplicate candidates are rejected; a candidate may match the baseline for an A/A control. Both options accept an exact npm version (including prereleases) or `local:<path>` pointing to a Git checkout of the Rstest monorepo. `latest`, Git URLs, and package-directory paths are not accepted. The command requires Node.js 26 and pnpm on PATH; the local checkout must also support that runtime.

The command prepares all installations before starting measurements; no root `pnpm install` is needed for `compare`. Each side uses an independent benchmark workspace with the same fixtures and runner. Rstest core, browser, and coverage dependencies are overridden together, including transitive imports, and installed versions are checked before timing. The top-level benchmark installation and manifests are preserved.

For each local source, it runs `pnpm install --frozen-lockfile` and `pnpm build` in that checkout, then packs core, browser, coverage-v8, and coverage-istanbul. Thus it measures the current working tree, including uncommitted changes, with freshly built output. Build scripts may update generated files in that checkout. The isolated benchmark installs the resulting archives, and verifies their runtime files against the local build. Its dependencies resolve inside that benchmark installation. Git revision/status, source diff hash, package hashes, and resolved dependencies are recorded. The workload's non-Rstest dependency graph (including transitive dependencies and resolved peers) must match across all sources, or the comparison stops before timing. Framework-owned dependency branches may differ between releases and local builds; this is an end-to-end comparison of those installations, not a core-code-only comparison.

Chromium is installed through the pinned Playwright when selected cases use browser mode. Each fixture starts with empty Rstest build and sequencing caches for every source, followed by the same number of warmups. Caches are retained across that fixture's variants and timed rounds; Node compile cache stays disabled.

The runner executes the same case/round across all sources before moving on. Order rotates each round: A/B then B/A for two sources; A/B/C, B/C/A, C/A/B for three. The starting position also rotates across fixtures and suites. The baseline is measured once per round and shared by all candidate comparisons. Fixture preparation and test processes run sequentially, so neither side's setup overlaps the other's measurement. `--reverse` flips the starting side and initial variant order. The actual schedule is saved in `comparison.json`. Use a `--runs` count divisible by the total number of sources (baseline plus candidates) for equal position counts. Otherwise, positions differ by at most one per case. This balances scheduled positions, not OS cache state or every possible predecessor pair. Known unsupported source/case slots are skipped; equal measured position counts apply to cases supported by all sources. Installation and local build time are excluded; the `rstest run` build remains part of each measurement.

### Comparison options

| Option | Description | Default |
| --- | --- | --- |
| `--baseline` | One exact npm version or `local:<path>` | required |
| `--candidate` | Repeatable source; comma-separated npm versions also accepted | at least one |
| `--update-readme` | Publish selected reports, samples, README tables and measurement context | off |
| `--suites` | Comma-separated `main,scaling,barrel,pools,coverage`, or `all` | `main` |
| `--apps` | Comma-separated app names; each must be valid in every selected suite | all |
| `--scales` | Sizes for scaling, barrel, or pool suites; use only with those suites | all |
| `--runs`, `--warmup` | Timed repetitions and untimed warmups per case | `5`, `1` |
| `--label` | Prefix for the comparison directory | `compare` |
| `--timeout-ms` | Timeout per generator or test process | `120000` |
| `--reverse` | Reverse the initial source and variant order | off |
| `--dry-run` | Print sources and selected cases without executing | off |

### Update README data

By default, `compare` only writes its own `results/<comparison>/` directory. `pnpm bench` and `pnpm test` do not update README data either.

`--update-readme` publishes after all selected suites finish successfully and pass compatibility checks. It exports compact inputs into `reports/data/`, updates the selected entries in `reports.config.json`, regenerates their reports and the report index, and updates the main/coverage blocks in [Rstest version benchmarks](../versions/README.md) with source labels, sample counts, machine information and cache policy. Other suites remain unchanged. Explicit `--no-update-readme` also disables publication.

Filters apply to publication too: `--apps node-backend --update-readme` replaces the main table with that selected workload. Use `--suites all` without filters to replace the full published comparison. Pool, scaling and barrel-only runs update their reports and index, without replacing the main/coverage tables.

Former files and retired inputs are backed up under `results/<comparison>/publication-backup/`. The publisher prepares and validates all output before writing and rolls back ordinary write failures. Failed, interrupted or incompatible comparisons leave published data unchanged; known unsupported cases remain marked as skipped. `--dry-run --update-readme` only previews the plan and never writes anything.

### Comparison outputs

The command prints `results/<comparison>/README.md`, an index of its reports. The directory also contains:

- `reports/<suite>.md` and `reports.config.json`: generated comparisons and exact inputs.
- `comparison.json`: source identities, setup status, selected options, and each run's location/status, the execution schedule, and workload dependency graphs.
- `logs/`: install, local build, and package output. Test output is retained in each run’s `logs/` directory.
- `packages/`: local package archives, when a local source was selected.
- `workspaces/<side>/results/`: the existing schema v2 samples, logs, and snapshots for each measured suite.

Failed setup or measurement stops the comparison with a non-zero exit status; completed reports and partial artifacts remain available. Unsupported cases retain their skipped status. SIGINT/SIGTERM terminates the active test process and preserves partial results. The root runner lock prevents another top-level benchmark from overlapping this comparison. Local checkouts should not be edited or rebuilt while preparation is running.

To regenerate or check these reports:

```sh
pnpm report --config results/<comparison>/reports.config.json
pnpm report --config results/<comparison>/reports.config.json --check
```

These config paths are relative to the benchmark repository root. Keep the comparison directory at its original location when using that config, or update paths after moving it. To publish a result, export its `result.json` as described below. Reclaim generated workspaces and installed dependencies after retaining the reports, raw runs, source records, and package archives you need.

## Run the installed version

```sh
pnpm install
# Optional: generate fixtures without running benchmarks
pnpm generate
pnpm --dir apps/react-spa exec playwright install chromium

# Run the main benchmark matrix
pnpm bench --label rstest-0.12.6 --runs 5

# Inspect the selected matrix without generating fixtures or running tests
pnpm bench --list

# Run a subset of projects
pnpm bench --apps micro-utils,react-spa --runs 5 --label partial

# Run coverage overhead measurements
pnpm bench:coverage --label rstest-0.12.6-coverage --runs 5

# Compare worker pools across three Node suite sizes
pnpm bench:pools --runs 5 --label rstest-0.12.6-pools
pnpm bench:pools --runs 5 --reverse --label rstest-0.12.6-pools-reverse

# Compare default / side-effectful barrel control at each graph size
pnpm bench:barrel --runs 5

# Vary file count and source graph size independently
pnpm bench:scaling --runs 5
```

## Switch Rstest versions

For a manual run against one published version, use the version switcher:

```sh
pnpm use-version 0.12.5
pnpm install
pnpm bench --label rstest-0.12.5 --runs 5

pnpm use-version 0.12.6
pnpm install
pnpm bench --label rstest-0.12.6 --runs 5
```

`use-version` changes dependency declarations and requires a subsequent install. For automated A/B measurements and local builds, use `pnpm compare`, which verifies the resolved packages in fresh workspaces.

## Options

| Option | Description | Default |
| --- | --- | --- |
| `--apps` | Comma-separated app names | all apps |
| `--list` | Print selected cases as JSON without running them | off |
| `--runs` | Timed repetitions per case; the median is reported | `5` |
| `--label` | Prefix for a unique run directory | `rstest-<suite>` |
| `--warmup` | Warmup repetitions per variant, excluded from statistics | `1` |
| `--timeout-ms` | Timeout for each generator or test process | `120000` |
| `--reverse` | Reverse the initial variant order before rotating each round | off |
| `--scales` | Pool, barrel and scaling suites: comma-separated sizes | `small,medium,large` |

Generated sources under `apps/*/src` and `apps/*/tests`, benchmark output under `results`, and coverage reports are ignored by Git. The benchmark commands generate their selected fixtures automatically. Use `pnpm generate` to regenerate fixtures without measuring them.

## Artifacts

Every invocation creates `results/<label>-<timestamp>-<id>/`, containing:

- `result.json`: schema v2 metadata, warmups, individual samples, test counts, status and statistics.
- `report.md`: a generated summary with median, min/max, MAD, CV and coverage memory.
- `logs/`: complete stdout and stderr for generators, warmups and timed runs.
- `snapshot/`: runner sources, generated fixtures, configs, package manifests and the lockfile.

Results are checkpointed after each sample. Failed, timed-out, interrupted and skipped cases stay in the result; an incomplete batch is never presented as a successful comparison. A repository-wide lock prevents concurrent runs from changing shared fixtures and caches. After an uncatchable process termination, inspect the PID in `results/.runner.lock` and remove that file only after confirming the owner has stopped.

## Compare results

Compare two new runs without editing a table:

```sh
pnpm report --baseline results/<baseline-run>/result.json \
  --candidate results/<candidate-run>/result.json --output reports/comparison.md
```

To pool repeat batches, pass comma-separated input paths. To publish a result, export a compact input first:

```sh
pnpm report:export results/<run>/result.json reports/data/<run>.json
```

Select the exported paths for published reports. For pool/provider/config columns, edit [`reports.config.json`](../reports.config.json). A report with a `marker` also updates its matching README block; the main and coverage comparisons are embedded in [Rstest version benchmarks](../versions/README.md). The manifest’s `readmePath` selects that page; paths in report specs remain relative to the repository root. Then run:

```sh
pnpm report --readme
pnpm report:check
pnpm test
```

`report:check` fails if generated reports or README tables are stale. It does not execute benchmarks. The report manifest selects explicit run files; it never automatically selects the newest smoke run. See the [report index](../reports/README.md) for the selected published-release runs. Their report inputs are included under `reports/data/`, so this check works without local `results/`.

Reports match suite, app, scaling dimension, size, environment, pool, provider, config and isolation. A pool/provider/config comparison must explicitly select that axis and filter each column. Known machine, fixture, config, harness or measurement-policy differences suppress percentages. Release lockfiles may differ, but incompatible batches cannot be pooled within a column. Legacy files remain readable without inventing missing provenance.

See [the result format](results.md) for units, statistics and metadata limitations, and [published inputs](../reports/data/README.md) for the export format. Keep complete run directories outside Git for follow-up analysis. External artifact archives may be linked from the report index when available.

## Cache conditions

The standard runner measures warm runs and requires at least one warmup. It removes `dist/.rstest-temp`, `node_modules/.cache/rstest`, and `node_modules/.cache/.rstest-results` once per fixture group before warmups, then retains caches across variants and timed rounds. Disabling Node compile cache alone does not make a run equivalent to a fresh CI job.

Cold-run experiments need explicit per-sample cache removal and separate reporting. Record the exact cache paths and distinguish application caches from installed dependencies and OS page cache.

## Repository layout

| Directory | Contents |
| --- | --- |
| `apps/` | Benchmark projects, configs, and deterministic fixture generators |
| `scripts/` | Source comparison, suite entry points, shared runner, report generation, and harness tests |
| `tools/` | Shared configuration and fixture helpers |
| `docs/` | Usage, workload design, and measurement policy |
| `reports/` | Selected comparisons, their index, and published sample data |
| `results/` | Local benchmark output; ignored by Git |

Keep repeatable suite behavior in the shared runner. Store one-off investigations, patches, traces, and retired execution artifacts outside the repository. A published comparison needs its sample inputs, measurement conditions, and source fingerprints; local build directories and debugging scripts are not part of the formal suites.

Generated fixtures, dependencies, caches, and local output are ignored. Published inputs in `reports/data/` are retained alongside their reports. When replacing a comparison, update the manifest and report index together and check the generated README table.

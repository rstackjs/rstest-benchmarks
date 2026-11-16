# Published report inputs

These JSON files contain the measurements used by [`reports.config.json`](../../reports.config.json). They are included in the repository so reports can be regenerated and checked without running benchmarks or downloading execution artifacts.

Each input retains all warmup and timed samples, including unsuccessful attempts; test counts; separate coverage memory samples measured as macOS process-tree physical footprint; timestamps; dependency versions; host and measurement settings; and fixture, config, runner, and lockfile fingerprints. Statistics are recomputed from samples when generating reports.

The export omits generator logs, process command paths, stdout/stderr paths, per-file source inventories, resolved local installation paths, and Git working-tree file lists. Git revisions, fingerprints, and a dirty flag are retained. Full logs, source snapshots, and original result files are kept separately. `meta.publication.sourceSha256` identifies the original result JSON; it is not the checksum of the exported file. These inputs support report verification, not a self-contained reconstruction of the execution environment.

## Publish a run

```sh
pnpm report:export results/<run>/result.json reports/data/<run>.json
```

The exporter requires schema v2, preserves sample values and fingerprints, and refuses an existing destination. Inspect the exported metadata before publication. Select the new file in `reports.config.json`, update the report index and README measurement context, then run:

```sh
pnpm report --readme
pnpm report:check
```

Keep complete run artifacts outside Git for follow-up analysis. If making them publicly available, attach an archive to the corresponding release or benchmark run and link it from the report index. No external artifact download is currently published for the checked-in results.

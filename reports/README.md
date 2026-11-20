# Benchmark reports

Selected comparisons are listed below. Each report records its sources, measurement conditions, samples and variability. Updating a subset of suites preserves the others.

- [main: 0.12.6 vs 1.0.0-beta.0](versions.md): [baseline: 0.12.6 samples](data/ci-versions-2026-11-20T08-47-46-373Z-b2279e99-baseline-main.json); [candidate: 1.0.0-beta.0 samples](data/ci-versions-2026-11-20T08-47-47-100Z-f9c20a97-candidate-main.json).
- [scaling: 0.11.0 vs 0.12.6](scaling.md): [baseline: 0.11.0 samples](data/releases-0110-0126-2026-11-06T03-34-24-999Z-c32b180d-baseline-scaling.json); [candidate: 0.12.6 samples](data/releases-0110-0126-2026-11-06T03-34-27-040Z-27fe0e8d-candidate-scaling.json).
- [barrel: 0.11.0 vs 0.12.6](barrel.md): [baseline: 0.11.0 samples](data/releases-0110-0126-2026-11-06T03-35-39-993Z-0458303c-baseline-barrel.json); [candidate: 0.12.6 samples](data/releases-0110-0126-2026-11-06T03-35-42-602Z-85140dec-candidate-barrel.json).
- [pools: 0.11.0 vs 0.12.6](pools.md): [baseline: 0.11.0 samples](data/releases-0110-0126-2026-11-06T03-36-40-100Z-8f8715f5-baseline-pools.json); [candidate: 0.12.6 samples](data/releases-0110-0126-2026-11-06T03-36-42-128Z-6045e160-candidate-pools.json).
- [coverage: 0.12.6 vs 1.0.0-beta.0](coverage.md): [baseline: 0.12.6 samples](data/ci-version-coverage-merged-2026-11-20T09-09-54-873Z-baseline-coverage.json); [candidate: 1.0.0-beta.0 samples](data/ci-version-coverage-merged-2026-11-20T09-09-54-873Z-candidate-coverage.json).

Percentages compare each candidate with the first column. Skipped cases remain visible; detailed reports include absolute spread and CV. Coverage memory is the peak process-tree physical footprint on macOS, median across runs.

Regenerate with `pnpm report --readme`; verify with `pnpm report:check`. Published inputs are included under [data/](data/README.md); full logs and snapshots remain with the original comparison. See [measurement policy](../docs/results.md#measurement-policy).

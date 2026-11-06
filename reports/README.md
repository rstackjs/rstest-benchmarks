# Benchmark reports

Selected comparisons are listed below. Each report records its sources, measurement conditions, samples and variability. Updating a subset of suites preserves the others.

- [main: 0.11.0 vs 0.12.6](versions.md): [baseline: 0.11.0 samples](data/releases-0110-0126-2026-11-06T03-31-19-069Z-c8f4536f-baseline-main.json); [candidate: 0.12.6 samples](data/releases-0110-0126-2026-11-06T03-31-20-664Z-c3b4c790-candidate-main.json).
- [scaling: 0.11.0 vs 0.12.6](scaling.md): [baseline: 0.11.0 samples](data/releases-0110-0126-2026-11-06T03-34-24-999Z-c32b180d-baseline-scaling.json); [candidate: 0.12.6 samples](data/releases-0110-0126-2026-11-06T03-34-27-040Z-27fe0e8d-candidate-scaling.json).
- [barrel: 0.11.0 vs 0.12.6](barrel.md): [baseline: 0.11.0 samples](data/releases-0110-0126-2026-11-06T03-35-39-993Z-0458303c-baseline-barrel.json); [candidate: 0.12.6 samples](data/releases-0110-0126-2026-11-06T03-35-42-602Z-85140dec-candidate-barrel.json).
- [pools: 0.11.0 vs 0.12.6](pools.md): [baseline: 0.11.0 samples](data/releases-0110-0126-2026-11-06T03-36-40-100Z-8f8715f5-baseline-pools.json); [candidate: 0.12.6 samples](data/releases-0110-0126-2026-11-06T03-36-42-128Z-6045e160-candidate-pools.json).
- [coverage: 0.11.0 vs 0.12.6](coverage.md): [baseline: 0.11.0 samples](data/releases-0110-0126-2026-11-06T03-38-14-514Z-06dbc7cd-baseline-coverage.json); [candidate: 0.12.6 samples](data/releases-0110-0126-2026-11-06T03-38-16-748Z-631fde57-candidate-coverage.json).

Percentages compare each candidate with the first column. Skipped cases remain visible; detailed reports include absolute spread and CV. Coverage RSS is OS maxrss, not a simultaneous process-tree peak.

Regenerate with `pnpm report --readme`; verify with `pnpm report:check`. Published inputs are included under [data/](data/README.md); full logs and snapshots remain with the original comparison. See [measurement policy](../docs/results.md#measurement-policy).

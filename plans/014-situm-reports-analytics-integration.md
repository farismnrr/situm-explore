# Plan 014 — Situm Reports & Analytics Integration

Status: planned-later
Branch: `plan/014-situm-reports-analytics-integration`
Depends on: Plan 013 complete, reviewed, and integrated into `main`

## Goal

Replace dummy analytics datasets one report at a time with real Situm report data while preserving the accepted Analytics UI.

Reuse the same single POC Situm API key. The key may have Read & Write permission, but this plan only reads report/analytics data.

## Required reading

- `AGENTS.md`
- `ARCHITECTURE.md`
- `DESIGN.md`
- `design/IMPLEMENTATION.md`
- `design/data-source-matrix.md`
- current canonical Analytics/report reference areas
- accepted Nuxt Analytics implementation
- Plan 010 mapping notes and completed Plans 011–013
- this plan

## UI-preservation rule

Before each report, read the corresponding current canonical HTML report state and accepted Nuxt implementation.

The accepted tab structure, chart/heatmap/table density, date-range controls, and metric hierarchy remain stable. Real API payloads are adapted to that contract; extra fields do not automatically become UI.

## Credential/data-path rules

- Reuse `NUXT_PUBLIC_SITUM_API_KEY`.
- Do not create a second credential/env variable.
- Never log/render/commit the key.
- Use the report access path selected by Plan 010.
- No report persistence in PostgreSQL for the POC.

## Integration order

Integrate only report states present in the accepted UI, normally one phase at a time:

1. Visitors.
2. Geofence stay time.
3. Positioning time.
4. User positions.
5. Map Viewer usage.
6. Heatmap only if the current API/data volume makes it practical.

If Plan 010 marked a report unsupported/not valuable, leave that report dummy/local rather than blocking the whole plan.

## Per-report workflow

For each report:

1. [ ] Re-open the current canonical HTML report state.
2. [ ] Inspect accepted Nuxt component/type/fixture.
3. [ ] Revalidate the official report endpoint/SDK identified by Plan 010.
4. [ ] Document minimal response -> existing UI type mapping.
5. [ ] Replace only that report's dummy data source.
6. [ ] Add truthful loading/empty/error behavior inside existing composition.
7. [ ] Never silently mix dummy and real values in the same metric group.
8. [ ] Compare the resulting real-data state against the accepted reference.
9. [ ] Validate before moving to the next report.

## Complexity rules

- no chart library unless accepted UI cannot reasonably be produced with current approach;
- no background jobs/queues unless actual API behavior proves them necessary and the user approves expanded scope;
- no generic reports repository/service merely because multiple endpoints exist;
- reuse a small integration helper only when actual repeated behavior is proven.

## Validation

- [ ] Plan 013 is integrated in main before branch creation.
- [ ] accepted Analytics composition remains stable.
- [ ] real failures do not fall back silently to fake success values.
- [ ] date ranges behave truthfully.
- [ ] no remote mutation is performed.
- [ ] no credentials logged/rendered/committed.
- [ ] `git diff --check`.
- [ ] `npm run lint`.
- [ ] `npm run typecheck`.
- [ ] `npm run build`.
- [ ] manual report smoke for each integrated report.
- [ ] update plan + `.agents/`, commit/push phases.
- [ ] no PR until authorized.

## Non-goals

- UI redesign;
- report writes;
- report persistence/background processing;
- new credential architecture.

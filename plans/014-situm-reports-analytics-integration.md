# Plan 014 — Situm Reports & Analytics Integration

Status: planned-later
Branch: `plan/014-situm-reports-analytics-integration`
Depends on: UI accepted; Plan 010 feasibility decisions

## Goal

Replace dummy analytics datasets one report at a time with real Situm report data while keeping the accepted UI stable.

## Mandatory HTML-first UI reference

Canonical visual/interaction reference:

`design/reference/situm-explore-interactive-prototype.html`

Before integrating any report, read `#app-analytics` and the exact `.report-pane` for that report.

The accepted tab structure, chart/heatmap/table density, date-range control and report hierarchy must remain stable. Real API data should be adapted into the accepted UI, not the other way around.

## Integration order

1. Visitors.
2. Geofence stay time.
3. Positioning time.
4. User positions.
5. Map Viewer usage.
6. Heatmap only if current API/support and data volume make it practical.

## Rules

- Re-read the relevant canonical HTML report pane immediately before each report phase.
- Verify current official report endpoints/SDK first.
- One report per phase; do not integrate everything in one diff.
- Map server/API responses into existing typed UI contracts.
- Preserve date-range/loading/empty/error states.
- Never silently mix dummy and real values inside the same metric group.
- No chart library unless the accepted UI truly requires capabilities impossible with current CSS/SVG approach.
- No background-job/queue infrastructure unless report API behavior proves it necessary.
- No report persistence in PostgreSQL during POC.
- Do not add new report cards/metrics simply because the API returns them.

## Per-report workflow

For each report in the integration order:

1. [ ] Open `design/reference/situm-explore-interactive-prototype.html`.
2. [ ] Inspect `#app-analytics` and that report's `.report-pane`.
3. [ ] Inspect the current accepted Nuxt implementation.
4. [ ] Document the minimal API-response -> existing-UI-type mapping.
5. [ ] Replace only the relevant dummy fixture/data source.
6. [ ] Add truthful loading/empty/error handling within the existing composition.
7. [ ] Compare the real-data state against the canonical HTML after integration.
8. [ ] Validate before moving to the next report.

## Validation

- [ ] permission remains read-only;
- [ ] API failures are visible and do not fall back to fake success data;
- [ ] date ranges behave truthfully;
- [ ] accepted `#app-analytics` composition is unchanged;
- [ ] each integrated report still matches its canonical HTML pane;
- [ ] no credentials logged;
- [ ] lint/typecheck/build + manual report smoke;
- [ ] phase commits/pushes; no PR until authorized.

# Plan 014 — Situm Reports & Analytics Integration

Status: planned-later
Branch: `plan/014-situm-reports-analytics-integration`
Depends on: UI accepted; Plan 010 feasibility decisions

## Goal

Replace dummy analytics datasets one report at a time with real Situm report data while keeping the accepted UI stable.

## Integration order

1. Visitors.
2. Geofence stay time.
3. Positioning time.
4. User positions.
5. Map Viewer usage.
6. Heatmap only if current API/support and data volume make it practical.

## Rules

- Verify current official report endpoints/SDK first.
- One report per phase; do not integrate everything in one diff.
- Map server/API responses into existing typed UI contracts.
- Preserve date-range/loading/empty/error states.
- Never silently mix dummy and real values inside the same metric group.
- No chart library unless the accepted UI truly requires capabilities impossible with current CSS/SVG approach.
- No background-job/queue infrastructure unless report API behavior proves it necessary.
- No report persistence in PostgreSQL during POC.

## Validation

- [ ] permission remains read-only;
- [ ] API failures are visible and do not fall back to fake success data;
- [ ] date ranges behave truthfully;
- [ ] accepted UI composition is unchanged;
- [ ] no credentials logged;
- [ ] lint/typecheck/build + manual report smoke;
- [ ] phase commits/pushes; no PR until authorized.

# Plan 011 — Situm Buildings, Floors & POIs Read Integration

Status: planned-later
Branch: `plan/011-situm-buildings-pois-read-integration`
Depends on: UI accepted through Plan 009; Plan 010 feasibility decisions

## Goal

Replace only the approved Buildings/Floors and POI dummy fixtures with real read-only Situm data while preserving the accepted UI contracts.

## Scope

- buildings;
- floors;
- POIs;
- POI categories if useful to current filters;
- mapping selected building/floor/POI into existing Map Viewer navigation where supported.

## Rules

- `Only Read` permission only.
- Verify current official Situm SDK/REST API before implementation.
- Prefer one simple data access path; do not duplicate browser SDK + Nitro proxy for the same dataset without reason.
- Preserve existing UI types and map API responses into them.
- No page redesign.
- No database persistence/cache unless a real need appears.
- No POI/building/floor writes.

## Phases

1. [ ] Document current official endpoints/SDK calls and response fields required by the UI.
2. [ ] Choose browser SDK or Nitro read route based on official credential/security guidance.
3. [ ] Integrate buildings/floors with loading/empty/error states.
4. [ ] Integrate POIs/categories and preserve local search/filter behavior.
5. [ ] Connect safe `View on map` selection only if current Viewer API supports it reliably.
6. [ ] Remove only dummy fixtures actually replaced by real data.
7. [ ] Smoke test with current POC key without printing/logging the key.
8. [ ] diff-check/lint/typecheck/build + phase commits/pushes.

## Non-goals

- geofences/paths;
- realtime;
- analytics/reports;
- writes;
- new app DB tables.

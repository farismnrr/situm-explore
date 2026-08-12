# Plan 011 — Situm Buildings, Floors & POIs Read Integration

Status: planned-later
Branch: `plan/011-situm-buildings-pois-read-integration`
Depends on: UI accepted through Plan 009; Plan 010 feasibility decisions

## Goal

Replace only the approved Buildings/Floors and POI dummy fixtures with real read-only Situm data while preserving the accepted UI contracts.

## Mandatory HTML-first UI reference

Canonical visual/interaction reference:

`design/reference/situm-explore-interactive-prototype.html`

Before implementation, read these exact sections:

- `#app-buildings` for building/floor inventory, table density, statuses and lower resource panels;
- `#app-pois` for POI search/filter/table/favorite presentation;
- `#detailDrawer` for details behavior;
- `#app-map` for building/floor/POI selection context.

This plan swaps dummy data for real reads. **Do not redesign these screens.** Map Situm responses into the already accepted Nuxt UI contracts from Plans 004–009.

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

1. [ ] Re-read `#app-buildings`, `#app-pois`, `#detailDrawer`, and relevant `#app-map` controls before defining API mappings.
2. [ ] Document current official endpoints/SDK calls and response fields required by the existing UI.
3. [ ] Choose browser SDK or Nitro read route based on official credential/security guidance.
4. [ ] Integrate buildings/floors with loading/empty/error states without changing accepted table/panel composition.
5. [ ] Integrate POIs/categories and preserve accepted local search/filter/favorite presentation.
6. [ ] Connect safe `View on map` selection only if current Viewer API supports it reliably.
7. [ ] Remove only dummy fixtures actually replaced by real data.
8. [ ] Compare real-data pages against the same HTML sections after integration.
9. [ ] Smoke test with current POC key without printing/logging the key.
10. [ ] diff-check/lint/typecheck/build + phase commits/pushes.

## Non-goals

- geofences/paths;
- realtime;
- analytics/reports;
- writes;
- new app DB tables.

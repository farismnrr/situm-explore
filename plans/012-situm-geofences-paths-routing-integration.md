# Plan 012 — Situm Geofences, Paths & Routing Integration

Status: planned-later
Branch: `plan/012-situm-geofences-paths-routing-integration`
Depends on: Plan 011

## Goal

Replace selected dummy geofence/path/route surfaces with real read-only Situm data and viewer-supported routing without changing the accepted UI.

## Phases

1. [ ] Verify current official geofence/path/directions APIs and viewer navigation methods.
2. [ ] Map real geofence/path data into existing typed UI contracts.
3. [ ] Replace geofence list/map overlays only where real data is available.
4. [ ] Replace path summaries with real path metadata where useful.
5. [ ] Wire real directions/navigation in `/app/map` only if the current viewer API supports the required start/destination flow cleanly.
6. [ ] Preserve dummy-only behavior for unsupported route details rather than inventing server complexity.
7. [ ] Keep accessible-route behavior truthful to actual API capability.
8. [ ] Validate read-only permission boundary, loading/error states, lint/typecheck/build, phase commits/pushes.

## Non-goals

- editing geofences/paths/POIs;
- Cartography Edition key;
- custom routing engine;
- route persistence;
- realtime/reports.

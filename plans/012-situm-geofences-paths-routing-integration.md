# Plan 012 — Situm Geofences, Paths & Routing Integration

Status: planned-later
Branch: `plan/012-situm-geofences-paths-routing-integration`
Depends on: Plan 011

## Goal

Replace selected dummy geofence/path/route surfaces with real read-only Situm data and viewer-supported routing without changing the accepted UI.

## Mandatory HTML-first UI reference

Canonical visual/interaction reference:

`design/reference/situm-explore-interactive-prototype.html`

Before implementation, read:

- `#app-geofences` for geofence metrics/table composition;
- `#app-paths` for path-network preview and route form/result composition;
- `#app-map` with `#mapTab-route` and `#mapTab-layers` for real routing/geofence behavior inside the viewer workspace.

This plan changes data/capability wiring only. Keep the accepted layout, spacing, control hierarchy and interaction states unless a real Situm capability requires a documented deviation.

## Phases

1. [ ] Re-read `#app-geofences`, `#app-paths`, and relevant `#app-map` Route/Layers states before changing integration code.
2. [ ] Verify current official geofence/path/directions APIs and viewer navigation methods.
3. [ ] Map real geofence/path data into existing typed UI contracts.
4. [ ] Replace geofence list/map overlays only where real data is available, preserving accepted UI states.
5. [ ] Replace path summaries with real path metadata where useful without redesigning `/app/paths`.
6. [ ] Wire real directions/navigation in `/app/map` only if the current viewer API supports the required start/destination flow cleanly.
7. [ ] Preserve dummy-only behavior for unsupported route details rather than inventing server complexity.
8. [ ] Keep accessible-route behavior truthful to actual API capability.
9. [ ] Compare resulting Geofences, Paths and Map Route/Layers states against the canonical HTML after integration.
10. [ ] Validate read-only permission boundary, loading/error states, lint/typecheck/build, phase commits/pushes.

## Non-goals

- editing geofences/paths/POIs;
- Cartography Edition key;
- custom routing engine;
- route persistence;
- realtime/reports.

# Plan 012 — Situm Geofences, Paths & Routing Integration

Status: planned-later
Branch: `plan/012-situm-geofences-paths-routing-integration`
Depends on: Plan 011 complete, reviewed, and integrated into `main`

## Goal

Replace selected Geofence/Path dummy data and wire real supported routing behavior where useful, while preserving the accepted UI and using the same single POC Situm credential.

The POC key may have Read & Write permission, but this plan does not perform cartography mutations.

## Required reading

- `AGENTS.md`
- `ARCHITECTURE.md`
- `DESIGN.md`
- `design/IMPLEMENTATION.md`
- `design/data-source-matrix.md`
- current canonical HTML reference areas for Geofences, Paths, and Map Route/Layers
- accepted Nuxt implementation
- Plan 010 mapping notes and completed Plan 011 integration
- this plan

## UI-preservation rule

Real capability wiring must fit the accepted Geofences, Paths, and Map workspace composition. Extra Situm fields/capabilities do not automatically become product UI.

If old prototype IDs such as `#app-geofences`, `#app-paths`, or `#mapTab-route` no longer exist, locate the corresponding current HTML area semantically.

## Credential/data-path rules

- Reuse `NUXT_PUBLIC_SITUM_API_KEY`; no second credential/env variable.
- Never log/render/commit its value.
- Use the data/access paths chosen in Plan 010.
- Keep server integration under `server/integrations/situm/` only when a Nitro REST path is actually needed.
- No DB persistence/cache for POC routing/cartography data.

## Phases

### Phase 1 — Revalidate capability mapping

- [ ] Re-read accepted UI/reference areas.
- [ ] Verify current official geofence/path/directions/viewer contracts from Plan 010.
- [ ] Confirm required fields and actual accessible-route capability.
- [ ] Use safe read probes only for feasibility confirmation.

### Phase 2 — Geofences

- [ ] Replace only geofence records supported by real data.
- [ ] Map payloads to existing UI types.
- [ ] Preserve accepted list/table/detail/loading/empty/error states.
- [ ] Keep report-derived stay/session metrics dummy unless Plan 014 later replaces them with real report data.
- [ ] Connect map overlay/context only where supported cleanly.

### Phase 3 — Paths

- [ ] Replace useful path metadata/summaries where the API provides them.
- [ ] Keep unsupported visual path-preview details dummy rather than building a custom routing model.
- [ ] Do not mutate paths/cartography.

### Phase 4 — Routing/Viewer behavior

- [ ] Wire real directions/navigation only when official Viewer/API support cleanly matches the accepted Start/Destination flow.
- [ ] Keep accessibility option truthful to actual supported route constraints.
- [ ] If a route detail shown by the UI cannot come from real capability, clearly keep that specific detail dummy/local in source rather than fabricating API data.
- [ ] No custom routing engine/server algorithm.

### Phase 5 — Validation

- [ ] Plan 011 is integrated in main before this branch starts.
- [ ] accepted Geofence/Paths/Map composition is preserved.
- [ ] loading/empty/error states are truthful.
- [ ] no cartography mutation request.
- [ ] no credential leakage.
- [ ] `git diff --check`.
- [ ] `npm run lint`.
- [ ] `npm run typecheck`.
- [ ] `npm run build`.
- [ ] manual API/viewer smoke.
- [ ] update plan + `.agents/`, commit/push phases.
- [ ] no PR until authorized.

## Non-goals

- editing POIs/geofences/paths;
- new credential architecture;
- custom routing engine;
- route persistence;
- realtime;
- reports integration.

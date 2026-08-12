# Plan 011 — Situm Buildings, Floors & POIs Read Integration

Status: planned-later
Branch: `plan/011-situm-buildings-pois-read-integration`
Depends on: Plan 010 complete, reviewed, and integrated into `main`

## Goal

Replace only the accepted Buildings/Floors and POI dummy fixtures with real Situm **read data** while preserving the UI contract produced by Plans 004–009.

The single POC API key may have Read & Write permission, but this plan intentionally performs read behavior only.

## Required reading

- `AGENTS.md`
- `ARCHITECTURE.md`
- `DESIGN.md`
- `design/IMPLEMENTATION.md`
- `design/data-source-matrix.md`
- populated canonical HTML reference
- accepted Nuxt Buildings/POIs/Map implementation
- completed Plan 010 capability/mapping notes
- this plan

## Mandatory UI-preservation reference

Before implementation, inspect the current canonical HTML areas corresponding to:

- Buildings/Floors inventory;
- POI search/filter/table/favorite presentation;
- shared details drawer;
- Map building/floor/POI selection context.

Map Situm responses into accepted Nuxt types/components. Do not redesign screens around external payload shape.

## Credential/data-path rules

- Reuse `NUXT_PUBLIC_SITUM_API_KEY`; do not create a second key/env variable.
- Never print/log/render/commit the key value.
- Use the access path chosen by Plan 010.
- If Nitro REST access is chosen, add only the smallest Situm integration helper needed by this plan under the `server/integrations/situm/` boundary from `ARCHITECTURE.md`.
- Do not create a generic repository/service layer unless actual orchestration requires it.
- No DB cache/persistence unless a new explicit requirement appears.

## Phases

### Phase 1 — Revalidate API mapping

- [ ] Re-read relevant HTML and accepted Nuxt implementation.
- [ ] Re-check current official endpoints/SDK contracts identified by Plan 010.
- [ ] Confirm the exact response fields needed by existing UI types.
- [ ] Safe local GET smoke uses the current POC key without printing it.

### Phase 2 — Buildings & Floors

- [ ] Load real buildings/floors using the single chosen data path.
- [ ] Adapt payloads to existing UI types.
- [ ] Preserve accepted loading/empty/error/table/detail composition.
- [ ] Keep configured Map Viewer building behavior working.
- [ ] Remove only building/floor dummy records actually replaced.

### Phase 3 — POIs & Categories

- [ ] Load real POIs/categories required by existing filters.
- [ ] Adapt to existing POI type rather than redesigning the type/page around the API.
- [ ] Keep search/filter client-side unless real dataset size proves that inadequate.
- [ ] Preserve accepted details/favorite presentation; favorites may remain local unless a later explicit write plan makes them remote.
- [ ] Remove only POI/category dummy records actually replaced.

### Phase 4 — Map context

- [ ] Connect `View on map` / building-floor-POI selection only where the chosen official Viewer/API capability is reliable.
- [ ] If a specific interaction cannot be wired cleanly, leave that interaction local/dummy and document it rather than expanding architecture.
- [ ] Do not add remote writes.

### Phase 5 — Validation

- [ ] Plan 010 is integrated in main before this branch starts.
- [ ] Buildings/POIs still match accepted canonical reference composition.
- [ ] loading/empty/error states are truthful.
- [ ] no duplicate real + dummy records for a replaced logical resource.
- [ ] no credential leakage.
- [ ] no remote write request.
- [ ] `git diff --check`.
- [ ] `npm run lint`.
- [ ] `npm run typecheck`.
- [ ] `npm run build`.
- [ ] manual API/viewer smoke.
- [ ] update plan + `.agents/`, commit/push phases.
- [ ] no PR until authorized.

## Non-goals

- geofences/paths;
- realtime;
- reports;
- POI/building/floor mutations;
- new application DB tables;
- credential redesign.

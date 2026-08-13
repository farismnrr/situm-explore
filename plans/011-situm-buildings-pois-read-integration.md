# Plan 011 — Situm Buildings, Floors & POIs Read Integration

Status: planned-later
Branch: `plan/011-situm-buildings-pois-read-integration`
Depends on: Plan 010 complete, reviewed, and integrated into `main`

## Goal

Replace retained Buildings/Floors/POI/Categories fixtures with real Situm read data after Plan 010 has pruned unsupported UI and frozen the data/auth contract.

Do not restore controls or fields removed by Plan 010.

## Required reading

- `AGENTS.md`
- `ARCHITECTURE.md`
- `DESIGN.md`
- `design/IMPLEMENTATION.md`
- `design/data-source-matrix.md`
- completed Plan 010 capability mapping
- current Nuxt Buildings/POIs/Map implementation
- this plan

## UI contract

Preserve the retained web composition and shared components, but truthfulness outranks old prototype fidelity. Only fields/actions retained by Plan 010 are implementation requirements.

Expected retained scope:

- buildings and floors inventory/detail;
- POIs and categories;
- search/filter presentation;
- View on Map / building-floor-POI selection context;
- favorites only if Plan 010 assigns an exact web-safe owner.

## Credential/data path

- Never use a public Read-Write Situm credential for REST data.
- Use the private authenticated Nitro/server path frozen by Plan 010 for cartography REST reads.
- Every new `/api/situm/*` route requires the existing Situm Explore session.
- Browser Viewer calls remain inside the Viewer integration and use only the browser auth mechanism accepted by Plan 010.
- No generic Situm proxy, repository base class, DB cache, or persistence.

## Phase 1 — Revalidate mapping

- [ ] Confirm Plan 010 is integrated.
- [ ] Re-check exact building/floor/POI/category endpoint/SDK contracts against current official docs.
- [ ] Confirm minimal fields required by retained UI.
- [ ] Confirm private server credential path works without logging secrets.

## Phase 2 — Buildings & Floors

- [ ] Add the smallest authenticated Nitro read path.
- [ ] Normalize external payload only as needed by current UI.
- [ ] Add truthful loading/empty/error states.
- [ ] Remove building/floor fixtures only after real source is working.
- [ ] Do not expose unused Situm fields merely because they exist.

## Phase 3 — POIs & Categories

- [ ] Replace POI/category fixtures with real reads.
- [ ] Keep client-side search/filter unless dataset size proves otherwise.
- [ ] Preserve detail drawer and map-selection behavior.
- [ ] Handle favorite behavior exactly as assigned by Plan 010; do not invent a write.

## Phase 4 — Map context

- [ ] Wire retained building/floor/POI selection to the single `SitumViewer` owner.
- [ ] Prefer a small typed Viewer command surface over creating extra SDK instances in pages.
- [ ] Remove stale synthetic selectors once real options are available.

## Validation

- [ ] no cartography mutation;
- [ ] no public REST credential;
- [ ] no duplicate real + fixture records for replaced resources;
- [ ] retained UI remains usable and truthful;
- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] manual API + Viewer smoke;
- [ ] update plan + `.agents/`, commit/push;
- [ ] no PR until user authorization.

## Non-goals

- geofences/paths;
- realtime;
- reports;
- cartography mutation;
- native positioning;
- new application DB tables.

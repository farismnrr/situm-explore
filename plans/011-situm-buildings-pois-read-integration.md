# Plan 011 — Situm Buildings, Floors & POIs Read Integration

Status: **complete**
Branch: `plan/011-situm-buildings-pois-read-integration`
Base: Plan 010 final HEAD `657fb0f` (explicit stacked execution; not integrated into `main`)
Depends on: Plan 010 complete, reviewed, and available as the stacked parent branch

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

- [x] Confirm Plan 010 is complete and available as the stacked parent branch.
- [x] Re-check exact building/floor/POI/category endpoint/SDK contracts against current official docs and `@situm/sdk-js@0.25.0`.
- [x] Confirm minimal fields required by retained UI.
- [x] Confirm private server credential path works without logging secrets.

## Phase 2 — Buildings & Floors

- [x] Add the smallest authenticated Nitro read path.
- [x] Normalize external payload only as needed by current UI.
- [x] Add truthful loading/empty/error states.
- [x] Remove building/floor fixtures from replaced inventory/map selectors.
- [x] Do not expose unused Situm fields merely because they exist.

## Phase 3 — POIs & Categories

- [x] Replace POI/category fixtures with real reads.
- [x] Keep client-side search/filter unless dataset size proves otherwise.
- [x] Preserve detail drawer and map-selection behavior.
- [x] Keep favorites local/product-owned; no Situm write was invented.

## Phase 4 — Map context

- [x] Wire retained building/floor/POI selection to the single `SitumViewer` owner.
- [x] Prefer a small typed Viewer command surface over creating extra SDK instances in pages.
- [x] Remove stale synthetic selectors once real options are available.

## Validation

- [x] no cartography mutation;
- [x] no public REST credential;
- [x] no duplicate real + fixture records in retained inventory/map/search surfaces;
- [x] retained UI remains usable and truthful;
- [x] `git diff --check`;
- [x] `npm run lint`;
- [x] `npm run typecheck`;
- [x] `npm run build`;
- [ ] manual API + Viewer smoke (requires configured Situm credentials and authenticated browser session; unavailable in this environment);
- [x] update plan + `.agents/`, commit/push;
- [x] no PR until user authorization.

## Non-goals

- geofences/paths;
- realtime;
- reports;
- cartography mutation;
- native positioning;
- new application DB tables.

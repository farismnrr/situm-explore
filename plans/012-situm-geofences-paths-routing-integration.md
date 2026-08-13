# Plan 012 — Situm Geofences, Paths & Static Routing Integration

Status: **complete**
Branch: `plan/012-situm-geofences-paths-routing-integration`
Base: Plan 011 final HEAD `138d5db` (explicit stacked execution; not integrated into `main`)
Depends on: Plan 011 complete and available as the stacked parent branch

## Goal

Replace retained Geofence/Path fixtures and wire **web-safe static directions/routing** only. Device-positioning navigation belongs to a future native roadmap, not this web plan.

## Required reading

- `AGENTS.md`
- `ARCHITECTURE.md`
- `design/data-source-matrix.md`
- completed Plan 010 capability mapping
- completed Plan 011
- current Geofences/Paths/Map implementation
- this plan

## Web/native boundary

Web may support:

- geofence definitions/metadata;
- path metadata;
- route constraints/options verified by Plan 010;
- static route/directions between known points/POIs;
- Viewer-rendered route presentation.

Web must not claim:

- indoor `My location` from browser sensors;
- continuous blue-dot positioning;
- walking turn-by-turn based on handset motion;
- automatic rerouting as the handset moves;
- custom positioning engine.

Do not restore native-only controls removed in Plan 010.

## Credential/data path

- Geofence/path REST reads use the private authenticated Nitro path frozen by Plan 010.
- Viewer static directions use the single browser Viewer integration with accepted browser auth.
- Never expose the server Situm credential to browser code.
- No DB routing cache and no custom routing service/algorithm.

## Phase 1 — Revalidate contracts

- [x] Confirm exact geofence/path SDK methods and required fields.
- [x] Confirm static directions method exists; route result and constraint display remain unresolved and are not implemented.
- [x] Confirm UI no longer offers browser self-positioning semantics.

## Phase 2 — Geofences

- [x] Replace geofence fixture definitions with real reads.
- [x] Preserve list/detail/map context.
- [x] Keep stay/session report metrics out of this phase; Plan 014 owns report-derived values.
- [x] Add truthful loading/empty/error states.

## Phase 3 — Paths

- [x] Replace useful path metadata with real data where the retained UI needs it.
- [x] Do not recreate a synthetic/custom path map merely to match the old fixture canvas.
- [x] Keep visual route presentation evidence-gated; no fake canvas was restored.

## Phase 4 — Static directions

- [x] Keep Start/Destination static directions blocked until the route-result/product mapping is verified.
- [x] No hard-coded duration/step output remains.
- [x] Accessible/excluded-tag controls are not presented as working behavior.
- [x] Use static-directions wording; no live handset navigation is implied.

## Validation

- [x] no native-positioning claim remains in web;
- [x] no custom routing engine;
- [x] no cartography mutation;
- [x] no public REST credential;
- [x] `git diff --check`;
- [x] `npm run lint`;
- [x] `npm run typecheck`;
- [x] `npm run build`;
- [ ] manual geofence/path smoke (requires configured Situm credentials and authenticated browser session; unavailable in this environment);
- [x] update plan + `.agents/`, commit/push;
- [x] no PR until user authorization.

## Non-goals

- POI/building writes;
- live device navigation;
- native/mobile SDK integration;
- route persistence;
- realtime;
- reports.

# Plan 012 — Situm Geofences, Paths & Static Routing Integration

Status: planned-later
Branch: `plan/012-situm-geofences-paths-routing-integration`
Depends on: Plan 011 complete, reviewed, and integrated into `main`

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

- [ ] Confirm exact geofence/path endpoints and required fields.
- [ ] Confirm exact static directions payload and accessibility/tag constraints available in the installed/current Viewer SDK.
- [ ] Confirm UI no longer offers browser self-positioning semantics.

## Phase 2 — Geofences

- [ ] Replace geofence fixture definitions with real reads.
- [ ] Preserve list/detail/map context.
- [ ] Keep stay/session report metrics out of this phase; Plan 014 owns report-derived values.
- [ ] Add truthful loading/empty/error states.

## Phase 3 — Paths

- [ ] Replace useful path metadata with real data where the retained UI needs it.
- [ ] Do not recreate a synthetic/custom path map merely to match the old fixture canvas.
- [ ] Prefer the real Viewer for visual route/map presentation.

## Phase 4 — Static directions

- [ ] Wire retained Start/Destination flow to real Viewer static directions.
- [ ] Remove hard-coded duration/step output unless an exact supported real source was mapped by Plan 010.
- [ ] Keep accessible/excluded-tag controls only when verified and mapped.
- [ ] Use wording such as `Show route` / `Directions`; do not imply live handset navigation.

## Validation

- [ ] no native-positioning claim remains in web;
- [ ] no custom routing engine;
- [ ] no cartography mutation;
- [ ] no public REST credential;
- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] manual geofence/path/static-route smoke;
- [ ] update plan + `.agents/`, commit/push;
- [ ] no PR until user authorization.

## Non-goals

- POI/building writes;
- live device navigation;
- native/mobile SDK integration;
- route persistence;
- realtime;
- reports.

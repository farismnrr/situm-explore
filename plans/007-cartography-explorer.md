# Plan 007 — Cartography Explorer UI

Status: planned
Branch: `plan/007-cartography-explorer`
Depends on: Plan 006

## Goal

Implement the approved Buildings/Floors, POIs, Geofences, and Paths surfaces as polished read-only product UI using typed dummy data first.

## Data rule

Do **not** add new Situm server discovery/API routes in this plan. These pages are UI-first and dummy-backed so the product can be reviewed without expanding backend scope.

## Phase 1 — Shared cartography fixture shapes

- [ ] Create small typed fixtures for buildings, floors, POIs, categories, geofences and path summaries.
- [ ] Keep synthetic IDs/names; do not persist private real metadata from local resources.
- [ ] Keep fixture shape easy to replace with real GET results later.
- [ ] No repository/service abstraction layer.

## Phase 2 — Buildings & Floors `/app/buildings`

- [ ] Match reference page header, toolbar, compact table and details drawer.
- [ ] Search/filter client-side.
- [ ] Show floor coverage/resource status.
- [ ] `View on map` routes to `/app/map`; it need not deep-link a real building yet.

## Phase 3 — POIs `/app/pois`

- [ ] Search, category filter, building/floor columns and favorite visual state.
- [ ] Details drawer uses dummy record data.
- [ ] `View on map` navigates to map workspace.
- [ ] Favorite changes remain local-only.

## Phase 4 — Geofences `/app/geofences`

- [ ] Metric summary cards and table from reference.
- [ ] Dummy stay-time/session values.
- [ ] No real geofence report query.
- [ ] Map action navigates to map workspace; overlay integration may remain dummy.

## Phase 5 — Paths & Routing `/app/paths`

- [ ] Path-network visual preview.
- [ ] Start/end form and accessible-route checkbox.
- [ ] Dummy route preview/results.
- [ ] Link to `/app/map` route planner.
- [ ] No server directions endpoint.

## Validation

- [ ] pages use authenticated app layout;
- [ ] responsive tables/filters work;
- [ ] no real write controls;
- [ ] no secret/private building resources added;
- [ ] compare visually to approved reference;
- [ ] diff-check/lint/typecheck/build;
- [ ] phase commits + pushes;
- [ ] no PR until authorized.

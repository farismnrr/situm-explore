# Plan 007 — Cartography Explorer UI

Status: planned
Branch: `plan/007-cartography-explorer`
Depends on: Plan 006

## Goal

Implement the approved Buildings/Floors, POIs, Geofences, and Paths surfaces as polished read-only product UI using typed dummy data first.

## Mandatory HTML-first implementation protocol

Canonical visual/interaction reference:

`design/reference/situm-explore-interactive-prototype.html`

**Each cartography page must be read from the canonical HTML before implementation begins.**

For every phase:

1. Open the canonical HTML reference.
2. Locate the exact `#app-*` page listed below.
3. Inspect page header, toolbar, table/card density, responsive behavior, drawer interactions and local prototype JavaScript.
4. Translate it into Nuxt/Vue using typed dummy fixtures.
5. Do not add Situm server APIs merely to populate the page.
6. Compare the implemented route against the same HTML page before completion.

### Prototype sections required for this plan

- Buildings/Floors: `#app-buildings`, toolbar/search, building table, floor coverage and resource panels.
- POIs: `#app-pois`, search, category filter, POI table and details interactions.
- Geofences: `#app-geofences`, metric summary cards and geofence table.
- Paths/Routing: `#app-paths`, path-network preview, route form and dummy route-result interaction.
- Shared details: `#detailDrawer`, `[data-detail]` interactions, close behavior and `View on map` action.
- Shared tables/toolbars: `.toolbar`, `.table-wrap`, `.table`, `.filter-input`, `.filter-select`.

Do not implement these pages from a generic admin-template mental model. The exact HTML pages above are the required composition reference.

## Required reading

- `AGENTS.md`
- `DESIGN.md`
- `design/reference/situm-explore-interactive-prototype.html`
- `design/IMPLEMENTATION.md`
- completed Plans 004–006 implementation.

## Data rule

Do **not** add new Situm server discovery/API routes in this plan. These pages are UI-first and dummy-backed so the product can be reviewed without expanding backend scope.

## Phase 1 — Shared cartography fixture shapes

Before defining data shapes, inspect the columns, labels, badges and detail fields actually rendered by `#app-buildings`, `#app-pois`, `#app-geofences`, `#app-paths` and `#detailDrawer`.

- [ ] Create small typed fixtures for buildings, floors, POIs, categories, geofences and path summaries containing only fields required by the approved UI.
- [ ] Keep synthetic IDs/names; do not persist private real metadata from local resources.
- [ ] Keep fixture shape easy to replace with real GET results later.
- [ ] Avoid speculative fields that are not used by the reference.
- [ ] No repository/service abstraction layer.

## Phase 2 — Buildings & Floors `/app/buildings`

**Before implementation, read `#app-buildings` from page header through both lower detail panels.**

Match deliberately:

- page-title/eyebrow hierarchy;
- single-line search toolbar;
- compact table density;
- status pill treatment;
- floor coverage list;
- cartography resource summary;
- details-drawer behavior when a building name is selected.

Tasks:

- [ ] Match reference page header, toolbar, compact table and details drawer.
- [ ] Search/filter client-side.
- [ ] Show floor coverage/resource status using typed dummy data.
- [ ] `View on map` routes to `/app/map`; it need not deep-link a real building yet.
- [ ] Compare desktop/mobile result against `#app-buildings` before completion.

## Phase 3 — POIs `/app/pois`

**Before implementation, read `#app-pois` plus the shared `#detailDrawer` interaction.**

- [ ] Match search input, category filter, count pill, table columns and density.
- [ ] Search, category filter, building/floor columns and favorite visual state use local typed data.
- [ ] Details drawer uses dummy record data while matching reference layout.
- [ ] `View on map` navigates to map workspace.
- [ ] Favorite changes remain local-only.
- [ ] Compare against the HTML POI page before completion.

## Phase 4 — Geofences `/app/geofences`

**Before implementation, read the complete `#app-geofences` page.**

- [ ] Match three metric-summary cards and their density.
- [ ] Match geofence table columns, status pills and spacing.
- [ ] Dummy stay-time/session values only.
- [ ] No real geofence report query.
- [ ] Map action navigates to map workspace; overlay integration may remain dummy.
- [ ] Compare against `#app-geofences` before completion.

## Phase 5 — Paths & Routing `/app/paths`

**Before implementation, read `#app-paths`, including `.building-mini`, route form, `#pathPreviewBtn`, `#pathPreviewResult` and related JavaScript.**

- [ ] Match path-network visual preview from the prototype using lightweight local CSS/SVG; do not instantiate a second Situm viewer.
- [ ] Match Start/To form and accessible-route checkbox.
- [ ] Dummy route preview/results only.
- [ ] Link to `/app/map` route planner.
- [ ] No server directions endpoint.
- [ ] Compare interaction and responsive composition against the HTML before completion.

## Phase 6 — Shared details drawer

**Before implementation, inspect `#detailDrawer`, `.drawer.open`, drawer mobile rules, `#closeDrawer`, `[data-detail]` JavaScript and `#drawerMapBtn`.**

- [ ] Implement one small reusable drawer only if it materially serves Buildings/POIs/Geofences/users later.
- [ ] Match width, header, detail-row rhythm and mobile full-width behavior.
- [ ] Close button works; Escape support is preferred if straightforward.
- [ ] `View on map` uses Nuxt navigation.
- [ ] Do not reproduce the prototype's random generated identifier behavior; use stable fixture IDs.

## Validation

- [ ] pages use authenticated app layout;
- [ ] responsive tables/filters work;
- [ ] no real write controls;
- [ ] no secret/private building resources added;
- [ ] Buildings matches `#app-buildings`;
- [ ] POIs matches `#app-pois`;
- [ ] Geofences matches `#app-geofences`;
- [ ] Paths matches `#app-paths`;
- [ ] drawer behavior matches `#detailDrawer`;
- [ ] deliberate deviations are documented;
- [ ] diff-check/lint/typecheck/build;
- [ ] phase commits + pushes;
- [ ] no PR until authorized.

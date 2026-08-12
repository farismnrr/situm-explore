# Plan 007 — Cartography Explorer UI

Status: planned
Branch: `plan/007-cartography-explorer`
Depends on: Plan 006 complete, reviewed, and integrated into `main`

## Goal

Implement the approved Buildings/Floors, POIs, Geofences, and Paths surfaces as polished dummy-first product UI. Do not add new Situm backend/REST/SDK feature integration in this plan.

## Mandatory HTML-first implementation protocol

Canonical visual/interaction reference:

`design/reference/situm-explore-interactive-prototype.html`

Each cartography page must be read from the **current canonical HTML** before implementation begins.

For every phase:

1. Open the canonical HTML.
2. Locate the corresponding Buildings, POIs, Geofences, Paths, table/toolbar, and shared-detail-drawer areas semantically. Old IDs such as `#app-buildings`, `#app-pois`, `#app-geofences`, `#app-paths`, and `#detailDrawer` are locator hints if they still exist.
3. Inspect hierarchy, density, responsive behavior, drawer interactions, and local prototype behavior.
4. Translate into Nuxt/Vue/Nuxt UI using typed local fixtures.
5. Do not add Situm server/API/SDK feature calls merely to populate the page.
6. Compare the implemented route against the same current HTML area before completion.

Do not implement these pages from a generic admin-template mental model.

## Required reading

- `AGENTS.md`
- `ARCHITECTURE.md`
- `DESIGN.md`
- `design/IMPLEMENTATION.md`
- `design/data-source-matrix.md`
- `design/reference/situm-explore-interactive-prototype.html`
- completed Plans 004–006 implementation/state
- this plan

## Data rule

These pages are UI-first and dummy-backed.

- no new Situm proxy/discovery endpoints;
- no new Situm SDK feature wiring;
- no DB tables/migrations for fixture data;
- no fake API routes serving fixture JSON.

## Phase 1 — Canonical cartography fixture ownership

Before defining data, inspect the fields actually rendered by the current HTML.

- [x] Inspect `app/data/prototype/` created by Plans 005–006 first.
- [x] Reuse and extend existing synthetic building/POI records instead of creating a second set for cartography pages.
- [x] Add only fields actually required by Buildings/Floors, POIs, Geofences, Paths, and shared details UI.
- [x] Keep synthetic IDs/names; do not persist private building resources or real credential-bearing metadata.
- [x] Keep fixture shapes straightforward to replace later.
- [x] Avoid speculative fields.
- [x] No repository/service abstraction around fixtures.

Acceptance: global search, map UI, and cartography pages share one canonical synthetic record per logical dummy resource.

## Phase 2 — Buildings & Floors `/app/buildings`

Before implementation, inspect the complete Buildings/Floors reference area.

Match deliberately:

- page header hierarchy;
- search/filter toolbar;
- compact table/card density;
- status treatment;
- floor coverage/resource summaries;
- details-drawer behavior;
- responsive treatment.

Tasks:

- [ ] Search/filter client-side against canonical typed fixtures.
- [ ] Show floor coverage/resource status from dummy data.
- [ ] `View on map` routes to `/app/map`; no real building deep-link is required yet.
- [ ] Do not call the Situm buildings API from the app in this UI plan.
- [ ] Compare desktop/mobile result against the current HTML.

## Phase 3 — POIs `/app/pois`

Before implementation, inspect the complete POI reference area and shared details drawer.

- [ ] Match search, category filter, count/status treatment, table columns/density, and responsive behavior.
- [ ] Use the same canonical POI fixtures already used by Map/global search where applicable.
- [ ] Search/filter/favorite state stays local.
- [ ] Details drawer uses stable fixture IDs/data.
- [ ] `View on map` navigates to `/app/map` without pretending a real Situm POI was selected.
- [ ] Compare against the current HTML.

## Phase 4 — Geofences `/app/geofences`

Before implementation, inspect the complete Geofences reference area.

- [ ] Match metric-summary/table composition.
- [ ] All session/stay-time/geofence rows are typed dummy data.
- [ ] No real geofence/report query.
- [ ] Map action navigates to `/app/map`; any overlay remains local/dummy.
- [ ] Compare against the current HTML.

## Phase 5 — Paths & Routing `/app/paths`

Before implementation, inspect the complete Paths/route-preview reference area.

- [ ] Match local path-network visual using lightweight CSS/SVG if needed; do not instantiate another Situm Viewer.
- [ ] Match Start/To and accessibility controls.
- [ ] Route preview/results are local dummy state only.
- [ ] Link to `/app/map` route UI.
- [ ] No server directions endpoint or new viewer directions SDK call.
- [ ] Compare behavior/responsive composition against the current HTML.

## Phase 6 — Shared details drawer

Before implementation, inspect the current shared drawer states and mobile behavior.

- [ ] Reuse one small drawer for the cartography resource details when that improves DRY/readability.
- [ ] Prefer the relevant Nuxt UI overlay primitive instead of recreating prototype drawer infrastructure.
- [ ] Match width/header/detail-row rhythm/mobile full-width behavior.
- [ ] Close action and Escape work when supported naturally by the primitive.
- [ ] `View on map` uses Nuxt navigation.
- [ ] Use stable fixture IDs; do not reproduce random prototype identifiers.

## Validation

- [ ] Plan 006 is already integrated in main before this branch was created;
- [ ] pages use authenticated app layout/middleware;
- [ ] responsive tables/filters work;
- [ ] no remote write controls or new Situm product-domain calls;
- [ ] no secret/private building resources added;
- [ ] no duplicate building/POI fixture sets;
- [ ] Buildings/POIs/Geofences/Paths/drawer compare against current HTML reference areas;
- [ ] deliberate deviations are documented;
- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] update plan + `.agents/`, commit, and push phases;
- [ ] no PR until authorized.

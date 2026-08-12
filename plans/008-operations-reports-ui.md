# Plan 008 — Operations & Reports UI

Status: planned
Branch: `plan/008-operations-reports-ui`
Depends on: Plan 007

## Goal

Implement Realtime, Analytics & Reports, Alarms, Users & Groups, Organization, and Viewer Settings as polished dummy-first surfaces matching the approved product reference.

## Mandatory HTML-first implementation protocol

Canonical visual/interaction reference:

`design/reference/situm-explore-interactive-prototype.html`

**Every operations/report page in this plan must be read from the canonical HTML before implementation.**

For each phase:

1. Open the canonical HTML reference.
2. Locate the exact `#app-*` section listed below.
3. Inspect layout, card/table density, tabs, control grouping, responsive behavior and local JS interactions.
4. Implement the same product composition in Nuxt/Vue.
5. Keep missing backend domains typed-dummy/local only.
6. Reuse real existing data only when the current backend already exposes exactly what the UI needs.
7. Compare the implemented page against that exact HTML section before completion.

### Prototype sections required for this plan

- Realtime: `#app-realtime`, realtime stat cards, live-map preview, device list, refresh/follow interactions.
- Analytics/Reports: `#app-analytics`, `.analytics-tabs`, every `.report-pane`, chart/heatmap/table styles and export action.
- Alarms: `#app-alarms`, filters, alarm table and status/type pills.
- Users & Groups: `#app-users`, user table, group summary and shared details drawer behavior.
- Organization: `#app-organization`, organization summary and POC credential-boundary panel.
- Viewer Settings: `#app-settings`, `.settings-layout`, settings nav, each `.setting-pane`, switches/selects/reset behavior.

Do not build these screens from generic SaaS/admin assumptions. The sections above are the required UI reference.

## Required reading

- `AGENTS.md`
- `DESIGN.md`
- `design/reference/situm-explore-interactive-prototype.html`
- `design/IMPLEMENTATION.md`
- completed Plans 004–007 implementation.

## Data mode

Dummy/local only unless an existing backend response already provides the exact information. Do not add Situm proxy endpoints, polling infrastructure, report jobs, or account-management models in this plan.

## Phase 1 — Realtime `/app/realtime`

**Before implementation, read the full `#app-realtime` section and its `moveRealtime()` / refresh / follow interactions.**

Match:

- four compact stat cards;
- live-map preview proportions;
- user/device list density;
- online/offline status treatment;
- refresh action;
- Follow action leading into map context.

Tasks:

- [ ] Stats for online/active/floor distribution use typed dummy fixture data.
- [ ] Live-map preview uses local visual markers; do not instantiate a second Situm viewer just for decoration.
- [ ] Refresh animates/repositions dummy markers locally like the prototype.
- [ ] Follow action routes to `/app/map` and may set local query/state only.
- [ ] Clearly keep source code dummy; user-facing UI stays production-like.
- [ ] Compare desktop/mobile result against `#app-realtime` before completion.

## Phase 2 — Analytics & Reports `/app/analytics`

**Before implementation, read `#app-analytics` in full, including all report tabs/panes and the report-switching JavaScript.**

Implement tabs represented in approved prototype:

- [ ] Visitors;
- [ ] Heatmap;
- [ ] Geofence stay time;
- [ ] Positioning time;
- [ ] User positions;
- [ ] Map Viewer usage.

Rules:

- typed fixture data;
- match the prototype tab density and selected state;
- lightweight CSS/SVG visuals that resemble the HTML chart/heatmap language;
- no chart library solely for dummy charts;
- date-range selector is local;
- CSV export may generate a local dummy CSV or show a local prototype action; no server report job;
- each report pane should preserve the prototype's information hierarchy rather than inventing new KPIs;
- compare every report state against the matching `.report-pane` before phase completion.

## Phase 3 — Alarms `/app/alarms`

**Before implementation, read `#app-alarms` from header through filters/table.**

- [ ] Match filter positioning and compact table density.
- [ ] Match assistance/danger/deadman/geofence-style examples represented by reference data.
- [ ] Match warning/error/resolved pill hierarchy.
- [ ] Read-only states only.
- [ ] No acknowledge/resolve remote actions.
- [ ] Compare against `#app-alarms` before completion.

## Phase 4 — Users & Groups `/app/users`

**Before implementation, read `#app-users` plus the canonical shared `#detailDrawer`.**

- [ ] Match two-column users/groups composition on desktop and responsive stacking.
- [ ] Match compact user table and group activity-list treatment.
- [ ] Read-only directory UI and group summary.
- [ ] Use synthetic fixtures.
- [ ] Keep Situm organization users conceptually separate from Situm Explore app authentication.
- [ ] Do not create user/account CRUD.
- [ ] Reuse the details-drawer pattern from Plan 007 when appropriate rather than inventing a second drawer.

## Phase 5 — Organization `/app/organization`

**Before implementation, read the complete `#app-organization` section.**

- [ ] Match two-panel organization/credential-boundary composition.
- [ ] Organization summary uses synthetic data unless safe real context already exists.
- [ ] Show current POC permission boundary as `Only Read`.
- [ ] Never render or log the API key itself.
- [ ] Explain browser POC boundary briefly without exposing security details as primary UI.
- [ ] Match the reference's restrained read-only context rather than turning this into an admin screen.

## Phase 6 — Viewer Settings `/app/settings`

**Before implementation, read `#app-settings`, `.settings-layout`, every `[data-setting-tab]`, all `.setting-pane` sections and switch/reset JavaScript.**

Tabs:

- general;
- navigation;
- map configuration;
- styles;
- images.

Tasks:

- [ ] Match left settings navigation, setting-row density and responsive horizontal settings nav.
- [ ] Controls are local UI state only unless already supported directly by the viewer with no persistence/write requirement.
- [ ] Switches/selects/reset interactions reproduce the prototype behavior at UI level.
- [ ] Light mode remains locked.
- [ ] Reset restores local defaults.
- [ ] No map-style upload/update because POC key is read-only.
- [ ] Compare every settings tab against the HTML before phase completion.

## Validation

- [ ] every surface reachable from app sidebar;
- [ ] dummy interactions work without backend calls;
- [ ] no fake remote-success wording;
- [ ] no credentials/private resources;
- [ ] Realtime matches `#app-realtime`;
- [ ] Analytics/report states match `#app-analytics`;
- [ ] Alarms matches `#app-alarms`;
- [ ] Users/Groups matches `#app-users`;
- [ ] Organization matches `#app-organization`;
- [ ] Viewer Settings matches `#app-settings`;
- [ ] responsive/accessibility pass uses prototype media-query behavior as baseline;
- [ ] deliberate deviations are documented;
- [ ] diff-check/lint/typecheck/build;
- [ ] phase commits + pushes;
- [ ] no PR until authorized.

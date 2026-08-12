# Plan 008 — Operations & Reports UI

Status: planned
Branch: `plan/008-operations-reports-ui`
Depends on: Plan 007

## Goal

Implement Realtime, Analytics & Reports, Alarms, Users & Groups, Organization, and Viewer Settings as polished dummy-first surfaces matching the approved product reference.

## Data mode

Dummy/local only unless an existing backend response already provides the exact information. Do not add Situm proxy endpoints, polling infrastructure, report jobs, or account-management models in this plan.

## Phase 1 — Realtime `/app/realtime`

- [ ] Stats for online/active/floor distribution use typed dummy fixture data.
- [ ] Live-map preview uses local visual markers; do not instantiate a second Situm viewer just for decoration.
- [ ] Refresh animates/repositions dummy markers locally.
- [ ] Follow action routes to `/app/map` and may set local query/state only.
- [ ] Clearly keep source code dummy; user-facing UI stays production-like.

## Phase 2 — Analytics & Reports `/app/analytics`

Implement tabs represented in approved prototype:

- [ ] Visitors;
- [ ] Heatmap;
- [ ] Geofence stay time;
- [ ] Positioning time;
- [ ] User positions;
- [ ] Map Viewer usage.

Rules:

- typed fixture data;
- lightweight CSS/SVG visuals;
- no chart library solely for dummy charts;
- date-range selector is local;
- CSV export may generate a local dummy CSV or show a local prototype action; no server report job.

## Phase 3 — Alarms `/app/alarms`

- [ ] Table/filter UI for assistance, danger/deadman/geofence-style examples.
- [ ] Read-only states only.
- [ ] No acknowledge/resolve remote actions.

## Phase 4 — Users & Groups `/app/users`

- [ ] Read-only directory UI and group summary.
- [ ] Use synthetic fixtures.
- [ ] Keep Situm organization users conceptually separate from Situm Explore app authentication.
- [ ] Do not create user/account CRUD.

## Phase 5 — Organization `/app/organization`

- [ ] Organization summary uses synthetic data unless safe real context already exists.
- [ ] Show current POC permission boundary as `Only Read`.
- [ ] Never render or log the API key itself.
- [ ] Explain browser POC boundary briefly without exposing security details as primary UI.

## Phase 6 — Viewer Settings `/app/settings`

Tabs:

- general;
- navigation;
- map configuration;
- styles;
- images.

- [ ] Controls are local UI state only unless already supported directly by the viewer with no persistence/write requirement.
- [ ] Light mode remains locked.
- [ ] Reset restores local defaults.
- [ ] No map-style upload/update because POC key is read-only.

## Validation

- [ ] every surface reachable from app sidebar;
- [ ] dummy interactions work without backend calls;
- [ ] no fake remote-success wording;
- [ ] no credentials/private resources;
- [ ] responsive/accessibility pass;
- [ ] visual comparison to `design/ui-reference.html`;
- [ ] diff-check/lint/typecheck/build;
- [ ] phase commits + pushes;
- [ ] no PR until authorized.

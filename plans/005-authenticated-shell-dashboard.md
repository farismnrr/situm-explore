# Plan 005 — Authenticated App Shell & Dashboard

Status: planned
Branch: `plan/005-authenticated-shell-dashboard`
Depends on: Plan 004

## Goal

Implement the approved authenticated application chrome and dashboard while reusing real session/database state and keeping non-existent product metrics dummy.

## Required reference

Read `design/ui-reference.html` and `design/IMPLEMENTATION.md` before editing.

## Phase 1 — Authenticated layout

Target layout: `layouts/app.vue` or equivalent concrete Nuxt layout.

- [ ] Replace Plan 003 topbar-only `AppShell` direction with approved desktop sidebar + topbar.
- [ ] Keep sidebar about 220–230px, grouped navigation, neutral active state, compact account block.
- [ ] Mobile sidebar becomes drawer/sheet; topbar gets menu action.
- [ ] Use real Nuxt routes, not client-only tab switching.
- [ ] Preserve auth middleware for every `/app/**` route.
- [ ] Account email comes from `useUserSession()`.
- [ ] Logout uses existing `clear()` and returns to `/` or `/login`.
- [ ] Add approved navigation-arrow brand mark.

## Phase 2 — Route skeleton

Create route destinations represented by the reference:

- [ ] `/app`
- [ ] `/app/dashboard`
- [ ] `/app/map`
- [ ] `/app/buildings`
- [ ] `/app/pois`
- [ ] `/app/geofences`
- [ ] `/app/paths`
- [ ] `/app/realtime`
- [ ] `/app/analytics`
- [ ] `/app/alarms`
- [ ] `/app/users`
- [ ] `/app/organization`
- [ ] `/app/settings`

Only Home and Dashboard need full content in this plan. Other routes may contain a small intentional placeholder pointing to their dedicated later plan. Do not build their feature UI early.

## Phase 3 — Authenticated Home

Match approved Home page:

- [ ] welcome block using real session identity;
- [ ] real `Open map` route;
- [ ] four compact metric cards using typed dummy fixture values;
- [ ] main-building preview may be a restrained visual placeholder, not duplicated Situm SDK instance;
- [ ] recent activity uses dummy fixture data;
- [ ] quick-explore cards route to actual app pages.

Keep dummy fixtures centralized and typed.

## Phase 4 — Dashboard

Real data:

- [ ] session identity from `useUserSession()`;
- [ ] database/application state from existing `/api/me`;
- [ ] Situm configuration/readiness truth remains represented accurately; if real viewer readiness is unavailable outside map route, label it accordingly instead of faking `Ready`.

Dummy data:

- [ ] visitors today;
- [ ] active-device count unless real source already exists;
- [ ] average stay;
- [ ] viewer sessions;
- [ ] chart series;
- [ ] occupancy breakdown;
- [ ] alarm summary.

- [ ] Make dummy metrics visually production-like but keep source clearly prototype-local in code.
- [ ] Do not add backend endpoints for these metrics.
- [ ] Avoid chart dependency; simple CSS/SVG is enough.

## Phase 5 — Search shell

- [ ] Add visual command/search trigger from reference.
- [ ] Implement client-side navigation search only.
- [ ] Search known app destinations and local dummy POIs/buildings.
- [ ] `Cmd/Ctrl + K` optional if straightforward.
- [ ] No backend/global indexing.

## Validation

- [ ] existing auth still protects all `/app/**` pages;
- [ ] login -> `/app` works;
- [ ] logout works;
- [ ] `/api/me` still reaches current DB behavior;
- [ ] mobile sidebar works;
- [ ] `git diff --check`;
- [ ] lint/typecheck/build;
- [ ] phase commits + pushes;
- [ ] no PR until explicit authorization.

## Non-goals

- real Situm cartography discovery;
- realtime API integration;
- reports API integration;
- registration backend;
- new DB tables.

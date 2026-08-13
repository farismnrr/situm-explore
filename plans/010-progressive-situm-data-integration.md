# Plan 010 — Web Capability Pruning & Situm Integration Contract

Status: **planned-ready**
Branch: `plan/010-progressive-situm-data-integration`
Depends on: accepted cumulative UI integrated into `main`

The branch/file slug is retained for continuity from the earlier Plan 010 draft; the title and scope in this file are the current authority.

## Goal

Before real backend/data integration, turn the accepted UI prototype into a truthful **web product contract**.

Plan 010 owns four things:

1. classify every current UI capability as web-supported, product-owned, native-only, remove, or unresolved;
2. remove misleading native-only/fake/unsupported Situm-domain UI before backend work;
3. freeze browser Viewer vs private Nitro credential/data boundaries;
4. produce exact evidence + one later owner for every retained Situm-domain capability.

This replaces the older rule that every manually accepted UI control must be preserved. Visual fidelity remains valuable, but capability truthfulness wins when they conflict.

## Mandatory authority/read order

Before touching code:

1. `AGENTS.md`;
2. `.agents/README.md`;
3. `.agents/state.md`;
4. `.agents/memory/decisions.md`;
5. `.agents/protocols/git-workflow.md`;
6. `ARCHITECTURE.md`;
7. `plans/README.md`;
8. `DESIGN.md`;
9. `design/IMPLEMENTATION.md`;
10. `design/data-source-matrix.md`;
11. this plan;
12. current source for the route/component being changed.

Historical Plans 001–009 are evidence only. They must not override the current contracts above.

## Core classification

Every current field/control must end Plan 010 in exactly one class:

- **WEB / SITUM** — useful real Situm web capability with exact verified evidence;
- **WEB / PRODUCT** — app-owned behavior such as login/navigation/search/theme/session UI;
- **NATIVE-ONLY** — requires device positioning/sensors/mobile runtime semantics and must be absent from web;
- **REMOVE** — unsupported, fake, redundant, misleading, or low-value for the POC;
- **UNRESOLVED** — product decision cannot safely be implemented until exact evidence exists.

For Situm-domain behavior, `remain dummy forever` is not a valid final state.

## No-hallucination evidence gate

**No evidence, no implementation.**

Model memory, historical plans, prototype labels, dummy fixture shapes, and similar APIs do not count as exact Situm evidence.

Before a capability can be classified final `WEB / SITUM`, record:

- capability/screen/control;
- exact official REST endpoint **or** Viewer/SDK method;
- official documentation/source reference used for verification;
- installed SDK version compatibility where relevant;
- web vs native availability;
- browser Viewer vs authenticated Nitro owner;
- read vs write;
- auth/permission requirement;
- request parameters actually needed;
- response/event fields actually consumed;
- relevant error/empty/stale semantics;
- later plan owner.

If any material item is unknown:

1. mark capability `UNRESOLVED`;
2. do not invent an endpoint, method, field, or permission;
3. do not hide uncertainty behind fixture success;
4. do not create custom infrastructure to mimic the missing capability;
5. either verify it or remove it if it is not worth the POC.

Plan 010 cannot close with an `UNRESOLVED` capability still visible as a working Situm feature.

## Product matrix vs evidence ledger

`design/data-source-matrix.md` is the product/capability disposition authority.

It is **not by itself an endpoint specification**.

During Phase 3, enrich the matrix or this plan's execution notes with the exact evidence ledger described above. Plans 011–016 may implement only rows that have both:

1. final retained product disposition;
2. exact verified implementation evidence.

## Current high-confidence web product direction

Keep as web surfaces subject to exact evidence for Situm-backed fields/actions:

- Landing and Login;
- Home and Dashboard using real aggregate sources only;
- Map Viewer;
- Buildings & Floors;
- POIs/Categories;
- Geofences;
- Paths metadata and static directions between known points;
- Realtime monitoring;
- Analytics & Reports;
- Alarms read-only;
- Users & Groups read-only;
- Organization read-only;
- Viewer Settings only for exact verified web-safe capabilities.

## Current prune candidates

Unless exact evidence/product value proves otherwise, remove:

- dummy `/register` flow;
- global fake `Sync` action;
- route origin `My location` when it claims browser indoor positioning;
- self-position-dependent live turn-by-turn/rerouting;
- end-user `Set user location` developer control;
- save-car / navigate-to-car POC controls;
- current remote-person `Follow user` semantics unless exact supported semantics are verified;
- flight selection;
- hard-coded route duration/steps when no real source backs them;
- custom fake path-network canvas when no real product need justifies a second renderer;
- generic Images inventory without a real product-worthy list/read owner;
- invented Map Style cards without a useful real read/use contract;
- organization credential/key-detail card;
- unsourced Recent Activity feed;
- unsourced capacity percentages;
- any other Situm-domain metric/control with no exact source/method.

## Native boundary

Do not build a native app in Plan 010.

Future-native concerns only:

- indoor positioning/bluedot generated from device sensors;
- positioning permission/runtime handling;
- motion-aware turn-by-turn navigation and rerouting;
- current-location wayfinding that depends on the handset's actual indoor position;
- mobile-specific positioning/alarm behavior.

Web may consume realtime positions produced by devices; it must not pretend the browser itself is performing Situm indoor positioning.

## Credential and security contract

Current code still contains the historical browser Viewer POC credential path. Treat it as **legacy to be constrained/migrated**, not the backend architecture.

Target rules:

- Situm REST/data calls from the product go through authenticated Nitro routes when server-side data is required;
- Nitro Situm credentials live only in private runtime config;
- every product `/api/situm/*` route requires the existing Situm Explore session;
- never build a generic unauthenticated Situm proxy;
- never expose a broad server credential to browser code;
- `NUXT_PUBLIC_SITUM_BUILDING_ID` may remain public;
- browser Viewer authentication is a separate boundary and must be verified against current official docs + installed SDK before implementation;
- until migrated, the existing Viewer may remain operational, but its public credential must not be reused for new REST/domain integration.

Do not invent the final private env-variable name/token flow. Freeze it only after exact verification.

## Architecture rule

Follow `ARCHITECTURE.md`:

```text
Vue page/component
  -> authenticated /api/situm/* for server data
      -> smallest server/integrations/situm/* owner
          -> Situm REST

SitumViewer.vue
  -> verified browser Viewer SDK behavior only
```

No generic repository, generic `SitumService`, Pinia requirement, DB cache, worker, or background sync without concrete need.

Keep `SitumViewer.vue` as the single real Viewer instance/lifecycle owner. Expose only a small typed command surface for exact retained Viewer commands.

## Phase 0 — Consistency + source inventory gate

Before implementation edits:

- [ ] record current `main` SHA used as branch base;
- [ ] confirm current docs do not describe obsolete pre-Nuxt4 migration paths as active work;
- [ ] confirm `.agents/state.md`, durable decisions, architecture, design contracts, data matrix, Plans 010–016, README, and `.env.example` agree on the current roadmap/credential boundary;
- [ ] inventory every public/authenticated route, sidebar entry, major metric, Map action, and Settings control from current source;
- [ ] record contradictions as plan blockers and fix docs before code;
- [ ] do not use historical plan text to fill a missing current contract.

Phase 0 is complete only when there is one unambiguous current authority chain.

## Phase 1 — Prune web-invalid UI

- [ ] remove confirmed native-only controls from web;
- [ ] remove fake flows/actions with no real product owner;
- [ ] remove unsupported/low-value Situm-domain panels/metrics;
- [ ] preserve visual composition where practical, but truthfulness outranks fidelity;
- [ ] do not replace surviving fixtures with real Situm data yet;
- [ ] do not add native implementation;
- [ ] for any disputed control, verify evidence first rather than guessing.

## Phase 2 — Freeze credential boundary

- [ ] verify current official Situm REST auth contract;
- [ ] verify current official JS Viewer auth contract against installed `@situm/sdk-js` version;
- [ ] define private Nitro credential/runtimeConfig naming;
- [ ] define safe browser Viewer auth path;
- [ ] document legacy `NUXT_PUBLIC_SITUM_API_KEY` retirement/compatibility path;
- [ ] confirm Plans 011–016 never require browser exposure of server REST credential;
- [ ] update README / `.env.example` / runtime docs in the same phase if naming changes.

## Phase 3 — Exact capability evidence ledger

For **every surviving Situm-domain UI field/action**, record all required evidence fields from the no-hallucination gate.

At minimum cover:

- Buildings/Floors/POIs/Categories;
- Geofences/Paths/static directions;
- realtime positions/device context;
- reports/analytics/CSV;
- organization/users/groups/alarms;
- every retained Map Viewer control;
- every retained Settings control;
- aggregate Home/Dashboard metrics and their exact upstream owner.

Rules:

- one capability = one primary implementation owner/access path;
- no endpoint/method names from memory;
- no UI metric composed from fields the official payload does not actually provide;
- if a dashboard metric needs multiple real sources, record the orchestration explicitly;
- if evidence is not worth resolving, remove the capability rather than leaving it fake.

## Phase 4 — Later plan ownership

- Plan 011 — Buildings/Floors/POIs/Categories and Map selection context.
- Plan 012 — Geofences/Paths/static routing and route constraints.
- Plan 013 — Realtime positions/device context and realtime Viewer overlay.
- Plan 014 — Reports/Analytics and real CSV/report output.
- Plan 015 — Organization/Users/Groups/Alarms read-only.
- Plan 016 — only remaining verified web-safe Viewer/config/settings actions not already owned above; use `plans/016-situm-viewer-settings-integration.md`.

If a retained capability has no exact owner, Plan 010 is not complete.

## Phase 5 — Dead fixture/type cleanup

- [ ] remove fixtures/types used only by UI removed in Phase 1;
- [ ] keep fixtures required by Plans 011–016 until their real owner replaces them;
- [ ] do not introduce fixture API routes or persistence;
- [ ] confirm no deleted capability survives through global search/navigation/quick links.

## Phase 6 — Validation and closeout

- [ ] no web UI claims browser indoor positioning;
- [ ] no retained Situm-domain control is permanently fake/ownerless;
- [ ] no visible retained capability is `UNRESOLVED`;
- [ ] every retained Situm capability has exact evidence + one later owner;
- [ ] no fake Register/Sync/unsourced business metric remains unless explicitly reclassified with a real product source;
- [ ] future plans use the frozen credential boundary;
- [ ] native-only features are documented but absent from web;
- [ ] all current authority docs agree;
- [ ] `git diff --check`;
- [ ] `npm run lint` for code-changing pruning;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] update `.agents/state.md`, durable decisions, and current session;
- [ ] commit/push branch;
- [ ] no PR/merge until user authorization.

## Stop conditions

Stop the affected capability/phase instead of guessing if:

- official docs/source cannot verify the needed behavior;
- installed SDK contract conflicts with current docs;
- current product UI requires data the real contract does not expose;
- credential/auth path is ambiguous;
- web/native ownership is unclear;
- two current authority docs disagree materially.

Resolve the contradiction/evidence first. Partial truthful completion is preferred to hallucinated integration.

## Non-goals

- replacing retained domain fixtures with real Situm data;
- native/mobile implementation;
- new application DB tables;
- background sync/workers;
- broad admin/write console;
- UI redesign unrelated to capability truthfulness.
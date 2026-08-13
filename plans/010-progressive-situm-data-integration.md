# Plan 010 — Web Capability Pruning & Situm Integration Contract

Status: **in-progress-planning**
Branch: `plan/010-progressive-situm-data-integration`
Depends on: accepted cumulative UI integrated into `main`

## Goal

Before real backend/data integration, turn the accepted UI prototype into a truthful **web product contract**.

Plan 010 now owns three things:

1. classify every current UI capability as web-supported, native-only, product-owned, or unsupported/low-value;
2. remove misleading native-only/fake/unsupported Situm-domain UI before backend work;
3. freeze the credential, data-path, and later-plan ownership contract for every surviving capability.

This replaces the older rule that every manually accepted UI control must be preserved. The visual baseline remains valuable, but unsupported or misleading product behavior must not survive merely for fidelity.

## Core classification

Every current screen/control must end Plan 010 in exactly one class:

- **WEB / SITUM** — real Situm REST or JS Viewer capability exists and is useful to this product;
- **WEB / PRODUCT** — app-owned behavior such as login, navigation, search, theme, session UI;
- **NATIVE-ONLY** — requires device positioning/sensors or mobile runtime semantics; remove from web and record for a possible future native roadmap;
- **REMOVE** — no credible Situm backing, fake demo behavior, redundant custom visualization, or low-value capability outside the POC.

For a Situm-domain control, `remain dummy forever` is no longer a valid default. It must either get a real later owner or be removed.

## Current high-confidence web contract

Keep as web surfaces, subject to exact field/action verification:

- Landing and Login;
- Home and Dashboard using real aggregate data only;
- Map Viewer;
- Buildings & Floors;
- POIs/Categories;
- Geofences;
- Paths metadata and static routing/directions;
- Realtime monitoring;
- Analytics & Reports;
- Alarms read-only;
- Users & Groups read-only;
- Organization read-only;
- Viewer Settings only for verified web-safe Viewer/config capabilities.

## Current prune candidates

Unless Phase 1 finds a concrete verified web/product reason to retain them, remove:

- dummy `/register` flow;
- global fake `Sync` action;
- route origin `My location` when it implies browser indoor positioning;
- dynamic/self-position turn-by-turn navigation or rerouting;
- end-user `Set user location` developer control;
- save-car / navigate-to-car UI for this POC;
- current remote-person `Follow user` semantics unless an exact supported mapping is verified;
- `Select flight` because this product has no flight domain;
- hard-coded route duration/steps when Situm Viewer should own the real route presentation;
- custom fake path-network canvas when no real product need justifies a second map renderer;
- generic Images inventory tab without a real list/read contract;
- invented Map Style cards if no useful real read/list contract is verified;
- organization credential/key-detail card;
- unsourced Recent Activity feed;
- unsourced capacity percentages;
- any other Situm-domain metric/control with no exact source or method.

## Native boundary

Do not build a native app in Plan 010.

Record future-native concerns only:

- indoor positioning/bluedot generated from device sensors;
- permission handling for positioning;
- device-motion-aware turn-by-turn navigation and rerouting;
- current-location wayfinding that depends on the handset's actual indoor position;
- mobile-specific positioning/alarm behavior.

Web may consume realtime positions produced by devices; it must not pretend the browser itself is performing Situm indoor positioning.

## Credential and security contract

Current code still contains the historical POC browser credential path. Treat it as **legacy to be constrained/migrated**, not the backend architecture.

Target rules:

- Situm REST/data calls from the product go through authenticated Nitro routes when server-side data is required;
- Nitro-side Situm credentials are private runtime configuration and never `public` runtime config;
- every product Situm API route requires the existing Situm Explore session;
- never build a generic unauthenticated Situm proxy;
- do not expose a Read-Write server credential to browser code;
- `NUXT_PUBLIC_SITUM_BUILDING_ID` may remain public because it is an identifier, not a secret;
- browser Viewer authentication must use the smallest safe mechanism supported by the installed/current Situm SDK and official contract; verify JWT/token flow before changing implementation;
- until that migration is implemented, the existing Viewer may remain operational, but its public credential must not be reused for new REST/domain integration.

Plan 010 must record the exact final environment-variable/runtimeConfig contract before Plan 011 starts.

## Architecture rule

Follow `ARCHITECTURE.md`:

```text
Vue page/component
  -> /api/situm/* when server data is needed
      -> small server/integrations/situm/* helper
          -> Situm REST

SitumViewer.vue
  -> browser Viewer SDK only for verified Viewer-owned behavior
```

No generic repository layer, no generic `SitumService`, no Pinia requirement, no cache/database/background job without a concrete need.

`SitumViewer.vue` should remain the single owner of the real Viewer instance. Later implementation may expose a small typed command surface (`selectBuilding`, `selectFloor`, `selectPoi`, static directions, realtime/trajectory, location picker, etc.) instead of scattering SDK instances across pages.

## Phase 0 — Freeze source inventory

- [ ] Record current `main` SHA used to create this branch.
- [ ] Inventory every public/authenticated route, sidebar entry, major metric, Map action, and Settings control.
- [ ] Read current Nuxt implementation first; prototype HTML is secondary historical visual evidence.
- [ ] Update `design/data-source-matrix.md` as the canonical capability/source matrix.

## Phase 1 — Prune web-invalid UI

- [ ] Remove confirmed native-only controls from web navigation/pages.
- [ ] Remove fake demo flows/actions with no future product owner.
- [ ] Remove unsupported/low-value Situm-domain panels and metrics.
- [ ] Preserve visual composition where practical, but correctness outranks fidelity.
- [ ] Do not replace surviving fixtures with real Situm data yet.
- [ ] Do not add native implementation.

## Phase 2 — Freeze credential boundary

- [ ] Verify current official Situm auth contracts for REST and JS Viewer.
- [ ] Define private Nitro credential/runtimeConfig naming.
- [ ] Define safe browser Viewer auth path.
- [ ] Mark `NUXT_PUBLIC_SITUM_API_KEY` as legacy/retirement path if it is no longer required after Viewer auth migration.
- [ ] Confirm no future Plan 011–016 instruction requires exposing a server credential.

## Phase 3 — Exact capability mapping

For every surviving Situm-domain UI field/action record:

- route/screen;
- UI field/action;
- exact REST endpoint or Viewer SDK method;
- read/write;
- browser Viewer vs authenticated Nitro;
- minimal response fields needed;
- loading/empty/error semantics;
- later plan owner.

No ambiguous ownership may leave Plan 010.

## Phase 4 — Later plan ownership

- Plan 011 — Buildings/Floors/POIs/Categories and Map selection context.
- Plan 012 — Geofences/Paths/static routing and route constraints.
- Plan 013 — Realtime positions/device context and realtime Viewer overlay.
- Plan 014 — Reports/Analytics and real CSV/report output.
- Plan 015 — Organization/Users/Groups/Alarms read-only.
- Plan 016 — only remaining verified **web-safe** Viewer/config/settings actions not already owned above; no native positioning work.

If a retained Situm capability has no owner, fix the mapping before Plan 010 closes.

## Phase 5 — Dead fixture/type cleanup

- [ ] Remove fixtures/types used only by UI removed in Phase 1.
- [ ] Keep fixtures needed by Plans 011–016 until their real integration replaces them.
- [ ] Do not introduce fixture API routes or persistence.

## Phase 6 — Validation and closeout

- [ ] No web UI claims browser indoor positioning.
- [ ] No retained Situm-domain control is permanently fake/ownerless.
- [ ] No fake Register/Sync/unsourced business metric remains unless explicitly reclassified as product-owned with a real source.
- [ ] Future plans use the new credential boundary.
- [ ] Native-only features are documented but absent from web.
- [ ] `git diff --check`.
- [ ] `npm run lint` for code-changing pruning.
- [ ] `npm run typecheck`.
- [ ] `npm run build`.
- [ ] update `.agents/state.md` and durable decisions.
- [ ] commit/push branch.
- [ ] no PR/merge until user authorization.

## Non-goals

- replacing domain fixtures with real Situm data;
- native/mobile implementation;
- new application DB tables;
- background sync/workers;
- broad admin/write console;
- UI redesign unrelated to pruning truthfulness.

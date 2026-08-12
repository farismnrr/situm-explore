# Plan 008 — Operations & Reports UI

Status: planned
Branch: `plan/008-operations-reports-ui`
Depends on: Plan 007 complete, reviewed, and integrated into `main`

## Goal

Implement Realtime, Analytics & Reports, Alarms, Users & Groups, Organization, and Viewer Settings as polished **dummy-first/local-only** surfaces matching the approved reference.

Even though the time-boxed POC may use one Read & Write Situm key, this UI plan must not add new Situm backend/REST/SDK feature integrations. Real integration comes after UI acceptance.

## Mandatory HTML-first implementation protocol

Canonical visual/interaction reference:

`design/reference/situm-explore-interactive-prototype.html`

Every operations/report page must be read from the **current canonical HTML** before implementation.

For each phase:

1. Open the canonical HTML.
2. Locate the corresponding Realtime, Analytics, Alarms, Users, Organization, or Settings section semantically. Old selectors such as `#app-realtime`, `#app-analytics`, `#app-alarms`, `#app-users`, `#app-organization`, and `#app-settings` are locator hints if still present.
3. Inspect hierarchy, card/table density, tabs, control grouping, responsive behavior, and local interaction intent.
4. Implement the same product composition using Nuxt/Vue/Nuxt UI.
5. Keep missing backend domains typed-dummy/local only.
6. Reuse only real behavior that already existed before the UI roadmap; do not add new Situm product-domain calls.
7. Compare the implemented page against the same HTML area before completion.

## Required reading

- `AGENTS.md`
- `ARCHITECTURE.md`
- `DESIGN.md`
- `design/IMPLEMENTATION.md`
- `design/data-source-matrix.md`
- `design/reference/situm-explore-interactive-prototype.html`
- completed Plans 004–007 implementation/state
- this plan

## Data mode

Dummy/local only unless an existing foundation endpoint already provides the exact state being displayed.

Do not add:

- Situm proxy/API endpoints;
- new Viewer feature-method wiring;
- polling/subscription infrastructure;
- report jobs;
- account-management models;
- database persistence for fixtures/settings.

## Phase 1 — Realtime `/app/realtime`

Before implementation, inspect the complete Realtime reference state and its refresh/follow interaction intent.

- [x] Stats use typed dummy fixture data.
- [x] Live-map preview uses local visual markers; do not instantiate a second Situm viewer.
- [x] Refresh locally updates/repositions dummy records.
- [x] Follow routes into `/app/map` and may set only local/query UI context; do not claim real user-follow capability.
- [x] Reuse canonical fixture identities if the same dummy users/devices appear elsewhere.
- [x] No realtime Situm API/SDK integration in this plan.
- [x] Compare desktop/mobile output with current HTML.

## Phase 2 — Analytics & Reports `/app/analytics`

Before implementation, inspect every analytics/report state in the current HTML.

Represent only report tabs shown by the approved reference, such as:

- Visitors;
- Heatmap;
- Geofence stay time;
- Positioning time;
- User positions;
- Map Viewer usage.

Rules:

- [x] typed local fixture data;
- [x] match tab density/selected state and information hierarchy;
- [x] lightweight CSS/SVG chart/heatmap visuals where suitable;
- [x] no chart dependency solely for dummy graphics;
- [x] date range is local state;
- [x] CSV action may create a local dummy CSV or local completion state only;
- [x] no report endpoint/job;
- [x] never silently mix fake metric values with a real source;
- [x] compare every state against the current HTML.

## Phase 3 — Alarms `/app/alarms`

Before implementation, inspect filters/table/status states in current HTML.

- [x] Typed synthetic rows only.
- [x] Match filter positioning, compact density, type/status hierarchy.
- [x] Read-only/local visual states only.
- [x] No real acknowledge/resolve/create action.
- [x] No Situm alarms API call in this plan.

## Phase 4 — Users & Groups `/app/users`

Before implementation, inspect Users/Groups and shared details-drawer behavior.

- [x] Match desktop composition and responsive stacking.
- [x] Use synthetic fixtures.
- [x] Keep Situm organization users conceptually distinct from Situm Explore app auth/session identity.
- [x] Do not create user/account CRUD.
- [x] Reuse Plan 007 shared drawer where appropriate rather than inventing another drawer.
- [x] No Situm users/groups API integration in this plan.

## Phase 5 — Organization `/app/organization`

Before implementation, inspect the current Organization/credential-boundary composition.

- [x] Organization data stays synthetic/static unless an already-existing foundation response truly provides a field.
- [x] Never render/log the API key value.
- [x] If the approved reference shows a key-permission label, current explicit POC policy overrides stale prototype copy: use `Read & Write (POC)` or a neutral `POC key configured` label rather than falsely claiming `Only Read`.
- [x] Preserve the reference layout even if wording is adjusted for truthful current configuration.
- [x] Do not turn this into an admin interface.

## Phase 6 — Viewer Settings `/app/settings`

Before implementation, inspect all settings tabs/rows/switches/reset states in current HTML.

Typical reference areas may include general, navigation, map configuration, styles, and images.

Tasks:

- [x] Match settings navigation/row density/responsive behavior using Nuxt UI primitives.
- [x] **All newly represented settings are local UI state in Plan 008.** Do not wire them to Situm simply because the POC key has Read & Write permission.
- [x] Switches/selects/reset reproduce approved local interaction intent.
- [x] Light mode stays locked.
- [x] Reset restores local defaults.
- [x] Map-style/image/config writes are explicitly deferred to later dedicated integration work if they are still needed after UI acceptance.

## Validation

- [ ] Plan 007 is integrated in main before this branch starts;
- [ ] every surface is reachable from the app sidebar;
- [ ] dummy interactions work without new backend/Situm feature calls;
- [ ] no fake remote-success wording;
- [ ] no credential value/private resource is exposed;
- [ ] organization permission wording matches the current POC decision, not stale `Only Read` copy;
- [ ] Realtime/Analytics/Alarms/Users/Organization/Settings compare against current HTML reference areas;
- [ ] responsive/accessibility behavior is checked;
- [ ] deliberate deviations are documented;
- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] update plan + `.agents/`, commit, and push phases;
- [ ] no PR until authorized.

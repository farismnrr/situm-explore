# Plan 010 — Situm Integration Feasibility & Contract Mapping

Status: planned-later
Branch: `plan/010-progressive-situm-data-integration`
Depends on: Plan 009A closed baseline plus Plan 009B completed (or explicitly skipped by the user after review), integrated into the chosen cumulative UI baseline, **and explicit user acceptance of the final rendered UI**

## Goal

Prepare later Situm backend/data integration work **without replacing any UI dummy dataset yet**.

Plan 010 is feasibility/contract-mapping only. Plans 011–015 own real read/data domains; Plan 016 conditionally owns any remaining accepted Viewer/settings/write actions that still need to become real. This prevents duplicate or ownerless implementation during sequential execution.

## Hard boundary

During Plan 010:

- do not replace dummy datasets;
- do not redesign accepted UI;
- do not introduce remote write actions;
- do not create broad backend infrastructure merely for future plans.

## UI gate clarification after Plan 009A closure

Plan 009A was intentionally closed with known UI gaps. That closure does **not** satisfy the final UI acceptance gate.

Before Plan 010 can start:

1. Plan 009B must be scoped from the user's concrete remaining UI punch list;
2. Plan 009B must be completed, or the user must explicitly decide after review that it is unnecessary/skipped;
3. the user must explicitly accept the final rendered UI baseline.

Do not infer UI acceptance merely because Plan 009A is closed.

## Required reading

- `AGENTS.md`
- `ARCHITECTURE.md`
- `DESIGN.md`
- `design/IMPLEMENTATION.md`
- `design/data-source-matrix.md`
- populated canonical HTML reference
- completed Plans 004–009 implementation/state
- closed historical `plans/009a-ui-prototype-fidelity-recovery.md`
- completed/accepted `plans/009b-ui-final-fidelity-punch-list.md`, or explicit user decision that 009B is skipped/not needed
- Plans 011–016 so feasibility decisions match later scopes
- this plan

## UI-preservation rule

For every candidate dataset/action inspect:

1. final accepted Nuxt route/components/types after the UI roadmap and Plan 009B boundary;
2. corresponding current canonical HTML area or newer explicit user direction;
3. canonical dummy fixtures/local actions that may later be replaced.

Later Situm payloads/capabilities are adapted into the accepted UI contract; external API shape does not redesign the product.

## POC credential and server-security contract

Current environment contract:

```text
NUXT_PUBLIC_SITUM_API_KEY
NUXT_PUBLIC_SITUM_BUILDING_ID
```

The time-boxed POC uses one Situm key and the user may provision it with Read & Write permission for speed.

Rules:

- reuse the same environment variable unless the user changes the decision;
- never commit/render/log the key value;
- do not create a second Situm key/env merely for architectural purity;
- broader key permission does not mean every plan performs writes;
- Plan 010 uses safe read/discovery probes only;
- a real mutation requires an explicit later owner and an accepted UI action;
- if a later domain uses Nitro/server API routes to expose Situm data to Vue, those routes must require the existing Situm Explore authenticated session (`requireUserSession` or equivalent current server guard);
- client route middleware is not API security;
- never create a generic unauthenticated Situm proxy.

## Phase 1 — Verify current local setup and accepted UI gate

- [ ] Confirm Plan 009A is closed and treated as historical.
- [ ] Confirm Plan 009B is complete or explicitly skipped/not needed by the user.
- [ ] Confirm the final rendered UI has been explicitly accepted by the user.
- [ ] Confirm ignored local `.env` has the POC key without printing it.
- [ ] If building ID is missing, follow documented `/api/v1/buildings` discovery and write only selected ID to local `.env`.
- [ ] Do not change environment naming.

## Phase 2 — Official API/SDK capability inventory

Using current official Situm docs and safe local read probes, map **every accepted non-static UI capability**, including:

- Buildings/Floors/POIs/Categories;
- Geofences/Paths/Routing;
- Realtime positions and any device metadata required by the accepted Realtime UI;
- Reports/Analytics;
- Organization/Users/Groups/Alarms;
- accepted Map Viewer tools represented in the final UI, such as POI selection/favorites, location picker, follow/trajectory/navigation, save-car/navigation-to-car, search/accessibility settings, or other tools actually present in the accepted UI;
- Viewer/map configuration, styles, images, or other settings actually represented by the accepted Settings UI;
- any accepted action that would require a remote mutation.

For each capability record:

- official endpoint/SDK method;
- required permission;
- fields/state required by accepted UI only;
- browser Viewer vs authenticated Nitro/server access path;
- read vs write behavior;
- expected loading/empty/error behavior;
- exact later plan owner;
- explicit `remain dummy/local` decision when real integration is unsupported or not worth POC scope.

Do not add product fields/actions merely because Situm exposes them.

## Phase 3 — Decide one data path per domain

Choose the smallest appropriate approach:

- existing browser Viewer capability when behavior genuinely belongs to Viewer; or
- a small authenticated Nitro/server integration when the app needs REST data.

Rules:

- do not implement browser + server paths for the same capability without concrete reason;
- new server routes returning Situm organization/building/user/device/report data require the existing app session;
- follow `ARCHITECTURE.md`;
- do not create generic repository/service layers preemptively;
- a small Situm request helper can be introduced by the first later plan that actually needs it.

## Phase 4 — Assign every accepted capability an owner

Required baseline ownership:

- Plan 011 — Buildings/Floors/POIs/Categories;
- Plan 012 — Geofences/Paths/Routing;
- Plan 013 — Realtime positions **plus only device metadata needed by the accepted realtime experience**;
- Plan 014 — Reports/Analytics;
- Plan 015 — Organization/Users/Groups/Alarms;
- Plan 016 — conditional remaining Viewer tools, Viewer settings/config/styles/images, favorites/local-to-real actions, and any accepted remote writes not owned above.

For each accepted screen/control, record one of:

```text
real in Plan 011-016
or
intentionally remains local/dummy for POC
```

**No accepted interactive control may leave Plan 010 with ambiguous ownership.**

Do not delete/replace fixtures in Plan 010.

## Phase 5 — Plan 016 go/no-go decision

- [ ] Identify accepted Viewer/settings/write actions still needing real integration after Plans 011–015.
- [ ] Record the exact subset in Plan 016 before it is executed.
- [ ] If none are needed, mark Plan 016 `skipped-not-needed` and do not create implementation work merely because the POC key can write.
- [ ] If needed, keep Plan 016 narrow to those accepted actions only.

## Validation / completion

- [ ] No accepted UI composition changed.
- [ ] No dummy source replaced.
- [ ] No remote mutation occurred.
- [ ] No credential value committed/logged.
- [ ] Every planned Nitro/server data route has an existing-session auth boundary in its later mapping.
- [ ] Every accepted non-static capability has exactly one later owner or explicit `remain dummy/local` decision.
- [ ] Devices needed by Realtime are assigned to Plan 013.
- [ ] Remaining Viewer/settings/write actions are assigned to conditional Plan 016 or explicitly skipped.
- [ ] Dependency/order is unambiguous.
- [ ] `git diff --check` for docs/config changes.
- [ ] Update `.agents/` and this plan.
- [ ] Commit/push plan branch.
- [ ] No PR until user authorization.

## Non-goals

- actual domain data replacement;
- UI redesign;
- new DB tables;
- background workers/queues;
- credential split;
- remote Situm writes;
- unauthenticated Situm proxy endpoints.

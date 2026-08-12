# Plan 010 — Situm Integration Feasibility & Contract Mapping

Status: planned-later
Branch: `plan/010-progressive-situm-data-integration`
Depends on: Plan 009 integrated into `main` **and** explicit user acceptance of the completed UI roadmap

## Goal

Prepare later Situm backend/data integration work **without replacing any UI dummy dataset yet**.

Plan 010 is feasibility/contract-mapping only. Plans 011–015 are the actual domain integration plans. This prevents duplicate implementation during sequential execution.

## Hard boundary

During Plan 010:

- do not replace dummy datasets;
- do not redesign accepted UI;
- do not introduce remote write actions;
- do not create broad backend infrastructure merely for future plans.

Actual domain replacement belongs to Plans 011–015. A later explicit write-action plan is created only if the user still needs real mutations after those integrations.

## Required reading

- `AGENTS.md`
- `ARCHITECTURE.md`
- `DESIGN.md`
- `design/IMPLEMENTATION.md`
- `design/data-source-matrix.md`
- populated canonical HTML reference
- completed/accepted Plans 004–009 implementation/state
- Plans 011–015 so feasibility decisions match their scopes
- this plan

## UI-preservation rule

For every candidate dataset inspect:

1. accepted Nuxt route/components/types from Plans 004–009;
2. corresponding current canonical HTML area;
3. canonical typed dummy fixtures that may later be replaced.

Later API payloads are adapted into the accepted UI contract; response shape does not redesign the product.

## POC credential and server-security contract

Current environment contract:

```text
NUXT_PUBLIC_SITUM_API_KEY
NUXT_PUBLIC_SITUM_BUILDING_ID
```

The time-boxed POC uses one Situm key and the user may provision it with Read & Write permission for speed.

Rules:

- reuse the same environment variable unless the user explicitly changes the POC decision;
- never commit/render/log the key value;
- do not create a second Situm key/env variable merely for architectural purity;
- broader key permission does not mean every plan performs writes;
- Plan 010 uses safe read/discovery probes only;
- any real mutation requires an explicit later plan and accepted product action;
- **if a later domain chooses Nitro/server API routes to expose Situm data to the Vue app, those routes must require the existing Situm Explore authenticated session (`requireUserSession` or the equivalent current server-side auth guard).** Do not rely on client route middleware as API security;
- return only fields needed by the accepted app UI; do not create a generic unauthenticated Situm proxy.

## Phase 1 — Verify current local setup

- [ ] Confirm Plan 009 is integrated and UI explicitly accepted.
- [ ] Confirm ignored local `.env` has the POC key without printing it.
- [ ] If building ID is missing, follow documented `/api/v1/buildings` discovery and write only selected ID to local `.env`.
- [ ] Do not change environment naming.

## Phase 2 — Official API/SDK capability inventory

Using current official Situm docs and safe local read probes, map accepted UI needs for:

- Buildings/Floors/POIs/Categories;
- Geofences/Paths/Routing;
- Realtime;
- Reports/Analytics;
- Organization/Users/Groups/Alarms;
- any accepted UI action that might actually require a write later.

For each capability record:

- official endpoint/SDK capability;
- required permission;
- fields required by accepted UI only;
- browser Viewer vs authenticated Nitro/server access path;
- expected loading/empty/error behavior;
- target later plan number.

Do not add product fields merely because Situm exposes them.

## Phase 3 — Decide one data path per domain

Choose the smallest appropriate approach:

- existing browser Viewer capability when behavior genuinely belongs to Viewer; or
- a small **authenticated** Nitro/server integration when the application needs REST data.

Rules:

- do not implement browser + server paths for the same dataset without concrete reason;
- any new server API route that returns Situm organization/building/user/report data must enforce the existing app session;
- follow `ARCHITECTURE.md`;
- do not create generic repository/service layers preemptively;
- a small Situm request helper can be introduced by the first later plan that actually needs it.

## Phase 4 — Map fixture contracts to later plans

Document deterministic ownership:

- Plan 011 — Buildings/Floors/POIs/Categories;
- Plan 012 — Geofences/Paths/Routing;
- Plan 013 — Realtime;
- Plan 014 — Reports/Analytics;
- Plan 015 — Organization/Users/Groups/Alarms.

For each, identify which canonical `app/data/prototype/` records will be replaced and which intentionally remain dummy.

Do not delete/replace fixtures in Plan 010.

## Phase 5 — Write-action decision

- [ ] Identify accepted UI actions, if any, that genuinely need a Situm mutation for the POC.
- [ ] Do not implement them here.
- [ ] If writes are still needed, create a later dedicated plan with narrow mutation scope and the same POC key.
- [ ] If not needed for the demo, leave those interactions local and avoid unnecessary backend scope.

## Validation / completion

- [ ] No accepted UI composition changed.
- [ ] No dummy source replaced.
- [ ] No remote mutation occurred.
- [ ] No credential value committed/logged.
- [ ] Every planned Nitro/server data route has an explicit existing-session auth boundary in its later mapping.
- [ ] Every domain has one owner among Plans 011–015.
- [ ] Later dependency/order is unambiguous.
- [ ] Unsupported capabilities are explicitly marked to remain dummy rather than left as implicit blockers.
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

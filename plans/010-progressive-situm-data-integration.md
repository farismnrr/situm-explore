# Plan 010 — Situm Integration Feasibility & Contract Mapping

Status: planned-later
Branch: `plan/010-progressive-situm-data-integration`
Depends on: Plan 009 integrated into `main` **and** explicit user acceptance of the completed UI roadmap

## Goal

Prepare the later Situm backend/data integration work **without replacing any UI dummy dataset yet**.

Plan 010 is a feasibility/contract-mapping gate only. Plans 011–015 are the actual domain integration plans. This separation prevents duplicate implementation when the roadmap is executed sequentially.

## Hard boundary

During Plan 010:

- do not replace Buildings/Floors dummy data;
- do not replace POIs;
- do not integrate Geofences/Paths/Routing;
- do not integrate Realtime;
- do not replace Reports/Analytics;
- do not integrate Organization/Users/Groups/Alarms;
- do not redesign accepted UI;
- do not introduce remote write actions.

Those belong to Plans 011–015 or to a later explicit write-action plan if the user still needs one after read/data integration.

## Required reading

- `AGENTS.md`
- `ARCHITECTURE.md`
- `DESIGN.md`
- `design/IMPLEMENTATION.md`
- `design/data-source-matrix.md`
- populated `design/reference/situm-explore-interactive-prototype.html`
- completed/accepted Plans 004–009 implementation and state
- Plans 011–015 so feasibility decisions line up with their scopes
- this plan

## UI-preservation rule

For every candidate dataset, inspect:

1. the accepted Nuxt route/components/types produced by Plans 004–009;
2. the corresponding current canonical HTML reference area;
3. the canonical typed dummy fixtures that will eventually be replaced.

The later API payload must be adapted into the accepted UI contract. API response shape does not get to redesign the product.

## POC credential contract

Current environment contract:

```text
NUXT_PUBLIC_SITUM_API_KEY
NUXT_PUBLIC_SITUM_BUILDING_ID
```

The time-boxed POC uses one Situm key and the user may provision it with Read & Write permission for speed.

Rules:

- reuse that same environment variable for later Situm integrations unless the user explicitly changes the POC decision;
- never commit/render/log the key value;
- do not create a second Situm key/env variable during this roadmap merely for architectural purity;
- broader key permission does **not** mean every plan should perform writes;
- Plan 010 uses safe read/discovery probes only while mapping capability;
- any real mutation must be explicitly owned by a later plan and correspond to an accepted product action.

## Phase 1 — Verify current local setup

- [ ] Confirm Plan 009 is integrated and UI is explicitly accepted by the user.
- [ ] Confirm local ignored `.env` has the POC key without printing it.
- [ ] If building ID is missing, follow the documented `/api/v1/buildings` discovery flow and write only the selected ID to local `.env`.
- [ ] Do not change public environment naming.

## Phase 2 — Official API/SDK capability inventory

Using current official Situm documentation and safe local read probes, map the accepted UI needs for:

- Buildings/Floors/POIs/Categories;
- Geofences/Paths/Routing;
- Realtime;
- Reports/Analytics;
- Organization/Users/Groups/Alarms;
- any accepted UI action that might actually require a write later.

For each capability record in this plan's notes:

- official endpoint/SDK capability;
- required permission;
- fields required by the accepted UI only;
- browser Viewer vs Nitro/server access path;
- expected loading/empty/error behavior;
- target later plan number.

Do not add product fields just because the external API exposes them.

## Phase 3 — Decide one data path per domain

For each domain, choose the smallest appropriate approach:

- existing browser Viewer capability when the feature genuinely belongs to Viewer behavior; or
- a small Nitro/server integration when the app needs REST data.

Rules:

- do not implement both browser and server paths for the same data without a concrete reason;
- follow `ARCHITECTURE.md`;
- do not create generic repository/service layers preemptively;
- a simple server-side Situm request helper may be introduced later by the first domain plan that actually needs it, rather than ceremonially in Plan 010.

## Phase 4 — Map existing fixture contracts to later plans

Create/update plan notes so later implementation is deterministic:

- Plan 011 owns Buildings/Floors/POIs/Categories;
- Plan 012 owns Geofences/Paths/Routing;
- Plan 013 owns Realtime;
- Plan 014 owns Reports/Analytics;
- Plan 015 owns Organization/Users/Groups/Alarms.

For each plan, identify which canonical `app/data/prototype/` records will be replaced and which remain intentionally dummy.

Do not delete or replace fixtures in Plan 010.

## Phase 5 — Write-action decision

Review accepted dummy/local actions after all read/data mappings are known.

- [ ] Identify which accepted UI actions, if any, genuinely need a Situm mutation for the POC.
- [ ] Do not implement them here.
- [ ] If real writes are still needed, create a new dedicated plan after Plan 015 (or another explicitly ordered point chosen by the user) with narrow mutation scope and the same POC key.
- [ ] If no real writes are needed for the demo, leave those interactions local and avoid unnecessary backend scope.

## Validation / completion

- [ ] No accepted UI composition was changed.
- [ ] No dummy source was replaced yet.
- [ ] No remote mutation occurred.
- [ ] No credential value was committed/logged.
- [ ] Every domain has a clear owner among Plans 011–015.
- [ ] Later plan dependency/order is unambiguous.
- [ ] Any capability that cannot be implemented cleanly is explicitly marked to remain dummy rather than left as an implicit blocker.
- [ ] `git diff --check` for docs/config changes.
- [ ] Update `.agents/` and this plan.
- [ ] Commit/push the plan branch.
- [ ] No PR until user authorization.

## Non-goals

- actual domain data replacement;
- UI redesign;
- new database tables;
- background workers/queues;
- credential/key split;
- remote Situm writes.

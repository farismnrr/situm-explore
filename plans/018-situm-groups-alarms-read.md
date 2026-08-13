# Plan 018 — Situm Groups & Alarms Read Integration

Status: **queued**
Branch: `plan/018-situm-groups-alarms-read`
Base: final HEAD of Plan 017
Depends on: Plan 017 complete in the explicit stacked 017→020 execution
Stacked successor: Plan 019

## Goal

Complete the remaining read-only organization/operations scope by integrating real Situm Groups and Alarms into the web console without introducing mutation/admin behavior.

Target surfaces:

- real Groups read model and UI;
- user/group relationship/filtering where the exact contract supports it;
- real Alarms list/detail/filtering;
- optional existing Home/Dashboard alarm counts only when their semantics exactly match the live alarm data.

## Required reading

- `AGENTS.md`
- `.agents/state.md`
- `.agents/memory/decisions.md`
- `.agents/protocols/git-workflow.md`
- `ARCHITECTURE.md`
- `plans/README.md`
- `design/data-source-matrix.md`
- Plan 015 historical evidence only
- current Users/Organization/Alarms pages and sidebar/navigation
- current server Situm client/error/session patterns
- latest official Situm REST/OpenAPI for Groups and Alarms
- this plan

## Fixed boundaries

- Read-only only. Do not create/update/delete groups, confirm/close alarms, or add any Situm mutation just because the private key can write.
- Use `NUXT_SITUM_API_KEY` only in Nitro/server code.
- Every product endpoint remains protected by the existing application session.
- Direct authenticated Nitro→Situm REST is allowed when the exact official endpoint is verified and the installed SDK lacks a wrapper.
- No fixture alarms/groups may appear as live data.
- Do not infer user/group membership, device/group membership, alarm ownership, alarm state transitions, or timestamps from names/IDs alone.

## Phase 0 — Exact contract + live evidence

- [ ] inspect the latest official Situm OpenAPI and verify the exact Groups list/detail/membership operations needed by the UI;
- [ ] verify exact Alarms list/detail operations, supported filters/pagination, state/type fields, timestamps, subject/user/device/building references, permissions, and error/empty semantics;
- [ ] inspect installed SDK/source only as supporting evidence; do not treat wrapper absence as REST absence;
- [ ] run safe authenticated live probes with configured credentials and record only consumed non-secret field names/semantics;
- [ ] identify which user/group relationships can truthfully be shown without extra speculative joins;
- [ ] identify which alarm fields are stable enough for list/detail/status badges;
- [ ] if one sub-capability remains materially unresolved, mark only that sub-capability unresolved and continue when the other core capability remains meaningful; stop only if both Groups and Alarms core read contracts cannot be verified.

## Phase 1 — Shared contracts + server reads

- [ ] add small shared DTO/types for only the verified fields consumed by the app;
- [ ] add protected Groups server read endpoint(s) using the smallest correct Situm access path;
- [ ] add protected Alarms list endpoint and detail endpoint only if detail is verified/useful;
- [ ] map pagination/filter inputs explicitly and validate user-controlled query parameters;
- [ ] normalize Situm failures into truthful product errors without leaking credential/upstream internals;
- [ ] preserve truthful empty arrays/absence instead of fixture fallback;
- [ ] reuse existing Situm client/auth/error patterns rather than adding generic API architecture.

## Phase 2 — Groups product surface

- [ ] add `/app/groups` as a compact read-only Groups page using current page/header/table/card conventions;
- [ ] show only verified safe fields (for example name/identifier and verified counts/relationships when actually available);
- [ ] add search/filtering locally or server-side only when supported by the verified contract/data volume;
- [ ] integrate group membership/filtering into `/app/users` only when the exact relationship is available;
- [ ] do not invent counts, descriptions, roles, memberships, or status values;
- [ ] add navigation entry in the most appropriate existing organization/admin section without creating a new navigation hierarchy.

## Phase 3 — Alarms product surface

- [ ] replace `/app/alarms` unresolved empty state with real loading/empty/error/success states;
- [ ] render a useful read-only alarms list/table with verified type/state/time and related subject context;
- [ ] add bounded filters for only officially supported/locally truthful dimensions;
- [ ] add a detail drawer/card only if the verified detail contract contains product-useful fields beyond the list;
- [ ] visually distinguish states using current design tokens without implying mutation controls;
- [ ] never show confirm/close/delete/edit actions;
- [ ] preserve exact timestamp/time-zone semantics from the source.

## Phase 4 — Existing dashboard/home integration

- [ ] inspect existing Home/Dashboard alarm/user/group metrics;
- [ ] replace only metrics whose semantics exactly match the new real data;
- [ ] remove or leave unresolved any placeholder whose denominator/status meaning cannot be derived truthfully;
- [ ] do not add a synthetic activity feed.

## Phase 5 — Validation and closeout

- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] authenticated live Groups read smoke;
- [ ] authenticated live Alarms read smoke including a detail path if implemented;
- [ ] truthful empty/filter/error behavior verified where applicable;
- [ ] unauthorized app-session behavior verified;
- [ ] no private Situm credential in responses/logs/client bundles;
- [ ] update this plan, `.agents/state.md`, evidence/decisions/session truth;
- [ ] commit and push the completed branch;
- [ ] do not create a PR or merge.

## Non-goals

- group CRUD;
- alarm confirmation/closure/deletion or rule creation;
- mobile-side alarm triggers;
- notifications/push/webhooks;
- generic organization admin console;
- fake alarms/groups;
- new PostgreSQL or ClickHouse persistence for upstream read-only resources.

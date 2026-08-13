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

- [x] inspect the latest official Situm OpenAPI and verify the exact Groups list/detail/membership operations needed by the UI;
- [x] verify exact Alarms list/detail operations, supported filters/pagination, state/type fields, timestamps, subject/user/device/building references, permissions, and error/empty semantics;
- [x] inspect installed SDK/source only as supporting evidence; do not treat wrapper absence as REST absence;
- [x] run safe authenticated live probes with configured credentials and record only consumed non-secret field names/semantics;
- [x] identify which user/group relationships can truthfully be shown without extra speculative joins;
- [x] identify which alarm fields are stable enough for list/detail/status badges;
- [x] if one sub-capability remains materially unresolved, mark only that sub-capability unresolved and continue when the other core capability remains meaningful; stop only if both Groups and Alarms core read contracts cannot be verified.

### Phase 0 evidence (2026-08-13)

- Official source: [Situm REST OpenAPI](https://developers.situm.com/pages/rest/openapi/) and its published `situm_public_api.yaml`.
- Groups: `GET /api/v1/groups` returns an array of `Group`; the only documented list filter is `has_parent` (boolean). `Group` fields are `id`, `uuid`, `name`, `organization_id`, `parent_group_id`, `icon_colour`, and `is_staff`. No group detail endpoint, membership endpoint, pagination contract, or user/device membership payload is documented. Group membership remains unresolved for product display; users can truthfully expose their existing `group_ids`/`groups` fields only after the current SDK response mapping is explicitly extended and verified.
- Alarms: `GET /api/v1/alarms` returns an array of `Alarm`; `GET /api/v1/alarms/{id}` returns one `Alarm` or `404`. Documented filters are `organization_id`, required-by-schema `building_id` (though the live server also accepted omission), `active`, repeated/array `type`, `startDate`, `endDate`, `created_by`, and `secondsFromCreation`. No pagination parameters are documented. Stable schema fields are `uuid`, `x`, `y`, `lat`, `lng`, `building_id`, `floor_id`, `outside`, `inside`, `created_at`, `updated_at`, `type`, `status_changes`, `active`, `current_state`, and `custom_fields`; `chat_room` is explicitly deprecated. Alarm type/state enums and timestamp semantics are recorded in `.agents/knowledge/situm-groups-alarms-phase0.md`.
- Permissions/errors: official OpenAPI documents authenticated API access and `401`, `403`, `422`, and `500` for list; detail additionally documents `404`. The configured read probe used the private API key transiently and returned `200` with arrays (including empty arrays); a nonexistent detail returned `404` with an error object. No mutation was attempted.
- Live probe observations: Groups list returned HTTP 200 with one item; `has_parent=true` returned HTTP 200 with zero items. Alarms for the configured building returned HTTP 200 with zero items; `active=true` also returned HTTP 200 with zero items. A users probe returned an object with `data` and `metadata`; its sampled user fields included `group_ids` and `groups`, but no relationship claim is made until explicitly consumed/verified.
- Installed `@situm/sdk-js` is present at the repository-declared `^0.25.0`; its declaration surface exposes user/cartography/realtime/reports domains but no Groups or Alarms wrapper. This is supporting evidence only; direct authenticated Nitro REST remains the verified access path.

## Phase 1 — Shared contracts + server reads

- [x] add small shared DTO/types for only the verified fields consumed by the app;
- [x] add protected Groups server read endpoint(s) using the smallest correct Situm access path;
- [x] add protected Alarms list endpoint and detail endpoint only if detail is verified/useful;
- [x] map pagination/filter inputs explicitly and validate user-controlled query parameters;
- [x] normalize Situm failures into truthful product errors without leaking credential/upstream internals;
- [x] preserve truthful empty arrays/absence instead of fixture fallback;
- [x] reuse existing Situm client/auth/error patterns rather than adding generic API architecture.

### Phase 1 implementation record (2026-08-13)

- Added shared DTOs for verified Group and Alarm fields, protected `/api/situm/groups`, `/api/situm/alarms`, and `/api/situm/alarms/:uuid` reads, using direct authenticated Nitro REST.
- Groups support only the verified `has_parent` filter; membership/detail/pagination remain absent. Alarms support the verified building-required list plus documented filters and detail 404 behavior; no undocumented pagination or mutation paths were added.
- Normalization strictly validates verified numeric, boolean, timestamp, enum, and identifier fields. The full official alarm type enum is accepted, including deprecated types if returned; deprecated status is not reinterpreted as a mutation/state action.
- Static validation passed in the worker; Phase 2 UI work is next.

## Phase 2 — Groups product surface

- [x] add `/app/groups` as a compact read-only Groups page using current page/header/table/card conventions;
- [x] show only verified safe fields (for example name/identifier and verified counts/relationships when actually available);
- [x] add search/filtering locally or server-side only when supported by the verified contract/data volume;
- [x] integrate group membership/filtering into `/app/users` only when the exact relationship is available;
- [x] do not invent counts, descriptions, roles, memberships, or status values;
- [x] add navigation entry in the most appropriate existing organization/admin section without creating a new navigation hierarchy.

### Phase 2 implementation record (2026-08-13)

- Added `/app/groups` with protected real Groups reads, loading/error/empty/success states, local identifier/name search, verified parent filter, responsive table/cards, and current organization navigation.
- No membership, counts, roles, descriptions, or mutation controls are shown because those contracts remain unresolved.

## Phase 3 — Alarms product surface

- [x] replace `/app/alarms` unresolved empty state with real loading/empty/error/success states;
- [x] render a useful read-only alarms list/table with verified type/state/time and related subject context;
- [x] add bounded filters for only officially supported/locally truthful dimensions;
- [x] add a detail drawer/card only if the verified detail contract contains product-useful fields beyond the list;
- [x] visually distinguish states using current design tokens without implying mutation controls;
- [x] never show confirm/close/delete/edit actions;
- [x] preserve exact timestamp/time-zone semantics from the source.

### Phase 3 implementation record (2026-08-13)

- Replaced `/app/alarms` with real protected list/detail UI, required building filter, verified active/type filters, truthful loading/empty/error/success states, responsive table/cards, and read-only detail drawer.
- Displayed only verified type/state/activity/timestamp/building/floor/location/status-change fields. No confirm, close, delete, edit, or other mutation controls were added.

## Phase 4 — Existing dashboard/home integration

- [x] inspect existing Home/Dashboard alarm/user/group metrics;
- [x] replace only metrics whose semantics exactly match the new real data;
- [x] remove or leave unresolved any placeholder whose denominator/status meaning cannot be derived truthfully;
- [x] do not add a synthetic activity feed.

### Phase 4 implementation record (2026-08-13)

- Reviewed dashboard/home metrics and replaced the stale Plan 014 wording with a truthful unresolved-metrics notice linking users to real Reports.
- Alarm, user, and group totals remain absent because their source scopes/denominators are not equivalent. No synthetic activity or relabeled metric was added.

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

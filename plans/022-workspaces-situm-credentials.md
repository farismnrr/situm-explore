# Plan 022 — Private Workspaces & Situm Configuration

> Historical implementation evidence. Its intermediate `VIEW_ONLY`/`VIEW_WRITE` product-mode notes are superseded by the enforced dual-credential model documented in the current architecture and design references.

Status: **complete; workspace ownership, encrypted configuration, and safe validation accepted**

Branch: `plan/022-workspaces-situm-credentials`

Depends on: Plan 021 accepted and integrated into updated `main`.

## Goal

Build the private workspace and workspace-managed Situm configuration foundation required by the later backend migration.

Plan 022 does **not** migrate every existing Situm/Viewer/analytics consumer and does not remove the working global baseline. Plan 024 owns that cutover.

## Required scope

### Stacked execution progress

- [x] Phase 1 — add and apply private workspace ownership schema.
- [x] Phase 2 — implement owned workspace CRUD and authorization.
- [x] Phase 3 — implement encrypted workspace Situm configuration and safe metadata.
- [x] Phase 4 — validate non-destructive Situm configuration and permission metadata.
- [x] Phase 5 — complete Plan 022 acceptance and retained global baseline smoke.

- one app user may own many private workspaces;
- one owner per workspace; no invites/members/team model;
- different users may independently configure workspaces that refer to the same external Situm account;
- workspace Situm configuration is managed server-side;
- product modes are `VIEW_ONLY` and `VIEW_WRITE`;
- supplied Situm configuration receives non-destructive validation;
- safe configuration/capability metadata may be returned; stored secret values are not returned;
- workspace ownership is enforced server-side.

## Evidence gates

Verify the installed `@situm/sdk-js` and current official Situm contracts before relying on permission detection or changing Viewer authentication.

Do not perform a write merely to discover write capability.

If browser authentication for a write-capable workspace cannot be proven safe/appropriately scoped, stop that exact path and ask the user rather than guessing.

## Acceptance

- create/list/update/delete own workspaces;
- cross-user access denied;
- duplicate external Situm account usage across different app users allowed;
- workspace Situm configuration add/replace/validate works;
- `VIEW_ONLY` / `VIEW_WRITE` metadata is available for later enforcement;
- missing required server protection configuration fails closed;
- existing retained Situm product behavior remains working on the pre-migration baseline.

## Boundaries

- Do not remove old global Situm runtime values in Plan 022.
- Do not migrate all Situm APIs, analytics, Viewer bootstrap, or building context here; Plan 024 owns that work.
- Do not add new Situm product capabilities.

Protection/config details and operator prerequisites are defined in `ARCHITECTURE.md` and `plans/021-025-prerequisites.md`.

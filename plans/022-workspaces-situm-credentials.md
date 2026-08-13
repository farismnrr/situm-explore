# Plan 022 — Private Workspaces & Situm Configuration

Status: **queued after Plan 021 integration**

Branch: `plan/022-workspaces-situm-credentials`

## Goal

Introduce private user-owned workspaces and replace global Situm runtime configuration with dashboard-managed workspace configuration persisted server-side.

## Scope

- Workspace ownership in PostgreSQL/Drizzle.
- One user may own many workspaces.
- No invites, members, shared workspace roles, or application org hierarchy.
- Different users may independently point workspaces at the same Situm account.
- Server-side protected persistence for Situm configuration using authenticated encryption.
- Supported product modes: `VIEW_ONLY` and `VIEW_WRITE`.
- Non-destructive validation of supplied Situm configuration.

## Permission behavior

Verify the exact installed SDK/current official Situm permission contract before implementation. Do not perform a write operation just to test whether a configuration can write.

If exact permission level can be read safely, persist normalized capability metadata. If the user selects `VIEW_WRITE` but upstream evidence does not support it, do not grant local write authorization.

Unsupported/intermediate Situm permission levels must receive clear configuration guidance instead of being silently treated as full write.

## Viewer authentication gate

Current Situm docs support short-lived JWT authentication and the JS SDK exposes JWT/Viewer auth behavior. Verify the installed `@situm/sdk-js` contract before replacing the current Viewer setup.

Prefer an evidence-backed ephemeral Viewer auth path over exposing long-lived stored configuration in browser code. If least-privilege browser auth cannot be proven for a write-capable workspace, leave that exact path unresolved rather than assuming it is safe.

## Acceptance

- create/list/update/delete own workspaces;
- cross-user workspace access is denied;
- duplicate external Situm account usage across different app users is allowed;
- Situm configuration can be added/replaced and validated without mutation;
- read APIs return configuration metadata/status only;
- server persistence is protected at rest;
- missing protection configuration fails closed;
- `VIEW_ONLY` / `VIEW_WRITE` state is available for later backend/UI enforcement.

Run migrations plus baseline diff/lint/typecheck/build and targeted production-preview API smoke.

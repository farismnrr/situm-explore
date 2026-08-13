# Plan 022 — Private Workspaces & Situm Configuration

Status: queued after Plan 021 integration.

Branch: plan/022-workspaces-situm-credentials

Depends on: Plan 021 accepted and integrated into updated main.

## Goal

Introduce private user-owned workspaces and replace global Situm runtime configuration with dashboard-managed workspace configuration persisted server-side.

## Scope

- Workspace ownership in PostgreSQL/Drizzle.
- One user may own many workspaces.
- No invites, members, shared workspace roles, or application org hierarchy.
- Different users may independently point workspaces at the same Situm account; do not add global uniqueness on external Situm account/org identity.
- Do not invent same-owner external-account uniqueness rules merely for deduplication; only add a constraint if a concrete product rule requires it.
- Server-side protected persistence for Situm configuration using authenticated encryption.
- Supported product modes: `VIEW_ONLY` and `VIEW_WRITE`.
- Non-destructive validation of supplied Situm configuration.
- Safe discovered organization/account metadata may be stored when exact evidence supports it; never return the stored credential value.

## Credential protection

Required server-only runtime configuration target:

`NUXT_WORKSPACE_CREDENTIAL_ENCRYPTION_KEY`

Implementation must define/document exact format. Prefer a random 32-byte master key encoded for environment transport and a versioned authenticated-encryption envelope.

Fail closed when protection config is missing/invalid. Never fall back to plaintext persistence. Never log stored/decrypted keys, JWTs, encryption-key values, or credential-bearing upstream payloads.

Long-lived Situm keys are decrypted only server-side for the operation that needs them and are never exposed through read APIs or public runtime config.

## Permission validation

Verify exact installed SDK/current official Situm permission contract. Do not perform a write merely to test whether a key can write.

Current official JS SDK documentation exposes `authSession` privilege information and `SitumApiPermissionLevel`; verify the installed package before relying on those surfaces. If exact permission can be read safely, persist normalized detected capability metadata separately from the user's declared mode.

- `VIEW_ONLY` never grants product mutation authorization.
- `VIEW_WRITE` is a declared mode, not proof of upstream write permission.
- If verified upstream evidence contradicts `VIEW_WRITE`, do not grant local write authorization.
- If write capability cannot be proven non-destructively, retain truthful unknown/unverified metadata and let later verified mutations treat upstream forbidden responses as authoritative.
- Situm Positioning, Cartography Edition, and Disabled permission levels are unsupported product modes in this roadmap and receive configuration guidance.

## Viewer authentication gate

Current official Situm REST documentation exposes JWT bearer issuance and the JS SDK exposes JWT/auth-session surfaces plus `Viewer.setAuth(jwt)`. Verify the installed package contract and real runtime behavior before replacing the current Viewer setup.

Prefer an evidence-backed expiring/least-privilege Viewer authentication path over exposing a long-lived workspace API key in browser code. Do not assume an exact token lifetime until verified.

Potential blocker: if a JWT derived from a Read & Write key inherits broad write privilege and no evidence-backed least-privilege downgrade exists for Viewer use, do not silently ship it. Stop and surface the choice to the user; a separate least-privilege Viewer credential may be required.

## Acceptance

- create/list/update/delete own workspaces;
- cross-user workspace access denied;
- duplicate external Situm account usage allowed across users as defined above;
- Situm config add/replace + non-mutating validation;
- read APIs return metadata/status only;
- server persistence protected at rest and fails closed without protection config;
- product mode + detected capability metadata available for later enforcement;
- no raw workspace Situm API key returned to browser code.

Run migrations, baseline checks, and targeted production-preview API smoke.

See `plans/021-025-prerequisites.md`.

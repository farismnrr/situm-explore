# Plans 021–025 — Prerequisites & Blocker Matrix

Status: active roadmap support document.

Never persist real secret values here.

## Before Plan 021

- The roadmap planning branch must be reviewed/integrated into main before Plan 021 starts under the normal Git protocol. Stacked execution requires explicit user authorization.
- DATABASE_URL must reach the existing PostgreSQL instance and permit changes inside the app-owned situm_explore schema.
- NUXT_SESSION_PASSWORD remains required and must be at least 32 characters.
- Google credentials are not required for Plan 021 acceptance because real Google OAuth testing is deferred.

Prepared Google OAuth configuration:
- NUXT_OAUTH_GOOGLE_CLIENT_ID
- NUXT_OAUTH_GOOGLE_CLIENT_SECRET
- optional NUXT_OAUTH_GOOGLE_REDIRECT_URL when automatic callback discovery is unsuitable.

The Google Console callback URL must match the implemented route before manual OAuth acceptance.

## Before Plan 022

Workspace credential encryption requires one server-only master key:
- NUXT_WORKSPACE_CREDENTIAL_ENCRYPTION_KEY

Implementation must define/document exact encoding and length. Prefer a random 32-byte key encoded for environment transport and authenticated encryption with a versioned stored envelope. Never return or commit the value.

For local acceptance, the agent may generate a fresh local value if missing, write it only to .env, and never print/persist it elsewhere.

At least one valid Situm API key is required for real validation. Final permission regression ideally has both Only Read and Read & Write keys.

## Viewer least-privilege gate

Official Situm REST supports API-key-to-JWT issuance and current JS SDK docs expose JWT auth plus Viewer.setAuth(jwt). Plan 022 must verify the exact installed @situm/sdk-js contract locally.

A long-lived workspace API key must not be sent to browser code.

Potential blocker: if a JWT derived from a Read & Write key inherits broad write privilege and there is no evidence-backed scope downgrade for Viewer use, stop and ask the user rather than silently exposing broad browser authority. A separate least-privilege Viewer credential may be required.

## Before Plan 023

Inspect local docker ps and runtime/repository configuration before selecting telemetry libraries or endpoints. Reuse the existing stack.

If the discovered stack requires endpoint/auth/network settings that cannot be inferred safely, report the exact operator prerequisite. Do not provision a duplicate observability stack.

## Before / during Plan 024

Global Situm runtime state includes both credentials and account-specific identifiers such as the current public building ID. A single process-global building cannot remain authoritative for multiple workspaces.

ClickHouse analytics must become workspace-isolated. Existing legacy rows predate workspace ownership and must not be assigned arbitrarily to a new user/workspace. Prefer a non-destructive workspace-scoped storage path; legacy unscoped rows stay outside workspace reads unless attribution is proven.

If preserving/attributing old analytics history matters, stop before destructive migration and ask the user for the retention policy.

## Before Plan 025 final regression

Full real permission regression requires testable Situm Read & Write primary and separate Read-only Viewer credentials. If either permission level is unavailable, leave that external smoke manual/unresolved rather than fabricating it.

Google OAuth runtime acceptance remains user-owned and is not a roadmap blocker unless scope changes.

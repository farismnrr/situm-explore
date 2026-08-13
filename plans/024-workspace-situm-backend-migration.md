# Plan 024 — Workspace-scoped Situm Backend Migration

Status: **queued after Plan 023 integration**

Branch: `plan/024-workspace-situm-backend-migration`

## Goal

Migrate the retained Situm-backed backend from one global runtime configuration to authenticated per-workspace context.

## Required work

1. Inventory all Situm API routes, integration helpers, analytics sync paths, and remaining global Situm runtime-config usage.
2. Define one consistent workspace-context contract for protected requests.
3. Verify workspace ownership server-side on every protected workspace/Situm request.
4. Resolve Situm integration per request/workspace rather than through one shared global account context.
5. Apply the permission model from Plan 022 consistently: read-only workspaces keep read scenarios, while write-capable behavior remains limited to already verified product mutations.
6. Route Situm/database failures through the correlation and safe-error boundary created in Plan 023.
7. Migrate cartography, groups/alarms, realtime, analytics/report sync, and supporting static-directions server behavior where applicable.
8. Remove old global Situm runtime configuration only after all retained behavior has moved successfully.

## Boundaries

- Client-provided workspace identity is context, not authorization authority.
- No new Situm capabilities are invented during migration.
- ClickHouse stays analytics storage only.
- Cross-user workspace access must remain impossible.

## Acceptance

- retained Situm server behavior no longer depends on global account configuration;
- switching workspace changes the Situm account context without process restart;
- read-only and write-capable workspace behavior is consistent with Plan 022;
- analytics/realtime/static-directions regressions pass under workspace context;
- errors remain sanitized to the client and traceable in server observability.

Run baseline checks plus production-preview authenticated multi-workspace smoke.

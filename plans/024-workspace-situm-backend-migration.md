# Plan 024 — Workspace-scoped Situm Backend Migration

Status: queued after Plan 023 integration.

Branch: plan/024-workspace-situm-backend-migration

Depends on: Plan 023 accepted and integrated into updated main.

## Current stacked execution

- [x] Phase 1 — define reusable owner-scoped workspace Situm context and migrate organization/users/status/cartography/config routes.
- [x] Phase 2 — migrate remaining retained Situm consumers and permission paths.
- [x] Phase 3 — migrate workspace-scoped analytics and complete acceptance.

## Goal

Migrate retained Situm-backed backend behavior from one global runtime configuration to authenticated per-workspace context.

## Workspace request context

Prefer explicit route-scoped workspace identity for workspace-backed APIs, e.g. /api/workspaces/:workspaceId/..., rather than authorization authority stored in a mutable process/session-global active workspace. Frontend selection is UX state; every request authorizes the referenced workspace server-side.

If another explicit request-context shape is retained for a concrete reason, document it and prove multi-tab/multi-workspace isolation. Client-provided workspace identity is never authorization authority by itself.

## Required work

1. Inventory Situm API routes, integration helpers, analytics sync, Viewer bootstrap/auth, and all remaining global Situm runtime config.
2. Include account-specific identifiers such as the current global public Situm building ID; one process-global building cannot remain authoritative for multiple workspaces.
3. Define one explicit workspace-context contract.
4. Verify ownership server-side on every protected workspace/Situm/analytics request.
5. Resolve/decrypt Situm integration per request/workspace, not through one shared global account singleton/cache.
6. Permission behavior:
   - VIEW_ONLY mutations rejected locally with safe forbidden domain error;
   - VIEW_WRITE may attempt only already verified product mutations;
   - upstream authorization failures remain authoritative and are normalized safely.
7. Route failures through Plan 023 correlation/safe-error boundary.
8. Migrate cartography, groups/alarms, organization/users, realtime, analytics/report sync, and applicable static-directions/Viewer bootstrap behavior.
9. Remove old global Situm key/building runtime config only after retained behavior has moved successfully.

## ClickHouse workspace isolation

Existing analytics predates app workspaces. New workspace analytics reads/writes must include app workspace identity in storage/query/deduplication semantics so one workspace cannot observe another workspace's rows.

Legacy unscoped rows must not be attributed arbitrarily. Prefer non-destructive migration/new workspace-scoped app-owned tables. Keep legacy rows untouched and excluded from new workspace reads unless attribution is proven.

Do not drop/rewrite history just to simplify migration. If preserving/attributing old analytics matters, stop before destructive work and ask the user.

## Boundaries

- No new Situm capabilities invented.
- ClickHouse remains analytics storage; PostgreSQL remains relational app/workspace persistence.
- Cross-user workspace access impossible.
- No external Situm account/org uniqueness assumption.

## Acceptance

- retained Situm server behavior no longer depends on global account config;
- explicit workspace switching changes account context without restart/cross-tab authority leakage;
- old global Situm API-key and building-selection env values are no longer active product authority after migration;
- permission behavior matches Plan 022;
- ClickHouse analytics workspace isolated;
- analytics/realtime/static-directions/Viewer regressions pass under workspace context;
- errors sanitized and traceable.

Run baseline checks plus production-preview authenticated multi-user/multi-workspace smoke.

See plans/021-025-prerequisites.md.

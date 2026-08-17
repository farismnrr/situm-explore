# Plan 027 — Analytics Correctness & Security Hardening

Branch: `plan/027-analytics-security-hardening`
Base: `origin/main` at phase start (Plan 026 integrated via PR #20)
Status: active

## Objective

Fix confirmed analytics correctness, workspace data-lifecycle, authentication-abuse, Situm credential-consistency, upstream reliability, and browser-security gaps while preserving the existing Nuxt architecture and workspace ownership/security boundaries established by Plans 021–026.

## Rules

- No CI, PR, merge, force-push, or implementation on `main`.
- No Redis, queues, or new infrastructure without a concrete repository requirement.
- No new unit-test framework merely for ceremony; use Node-native/available tooling for regression evidence, or stop at that decision boundary and report it.
- No arbitrary deletion/attribution of legacy pre-workspace analytics.
- No Viewer authentication redesign unless a confirmed bug requires it.
- Never persist or log credentials, tokens, or secrets.
- Situm behavior changes: no evidence, no implementation.

## Phase checklist

- [x] Phase 0 — Pre-flight and authority reconciliation.
- [x] Phase 1 — Analytics correctness and filter contract.
- [x] Phase 2 — Workspace deletion data lifecycle.
- [x] Phase 3 — Authentication abuse protection.
- [ ] Phase 4 — Situm credential consistency (org match).
- [ ] Phase 5 — Bounded upstream failures and timeouts.
- [ ] Phase 6 — Browser security hardening.
- [ ] Phase 7 — Regression coverage and testing decision.
- [ ] Phase 8 — Full acceptance and closeout.

## Confirmed findings (pre-implementation)

1. Overlapping analytics sync windows can be double-counted — workspace queries do not properly constrain `source_window_id`.
2. Workspace positioning analytics reads historical rows without respecting the requested date window.
3. UI sends `buildingId`/`geofenceId`; workspace analytics summary backend ignores them.
4. Analytics sync body types rely on TS annotations only, no runtime validation.
5. Workspace deletion does not remove that workspace's ClickHouse-owned analytics (visitors, positioning time, geofencing stay, sync runs).
6. No application-level rate limiting on login/registration.
7. Registration runs expensive scrypt hashing before checking for an existing account.
8. Workspace Situm config save does not verify the Viewer credential belongs to the same organization as the primary credential.
9. App-owned outbound fetch calls to Situm/telemetry lack explicit timeout/cancellation.
10. Browser security headers/CSP have not been audited for the current Nuxt/Nitro + Viewer setup.

Each finding is reconfirmed against current code in Phase 0/at the start of its phase before any change is made; if a finding is stale, that is recorded here rather than forcing a change.

## Phase 1 evidence

Findings 1–4 confirmed exactly as described by inspecting `server/integrations/clickhouse/analytics.ts`, `server/integrations/situm/reports.ts`, `server/integrations/clickhouse/schema.ts`, `server/api/workspaces/[workspaceId]/analytics/{summary.get.ts,sync.post.ts}`, and `app/pages/app/analytics.vue`.

- `queryWorkspaceAnalytics` previously filtered only by `workspace_id`, summing every synced window ever written for that workspace regardless of requested date range — overlapping/re-synced windows were double-counted, and positioning/geofencing ignored the requested window entirely.
- Fix mirrors the existing legacy (`queryAnalytics`) pattern: `source_window_id` is a deterministic key `${report}:${fromDate}:${toDate}:${workspaceId}:${scope}` written by `syncSitumReport`; workspace queries now match `startsWith(source_window_id, '${report}:${fromDate}:${toDate}:${workspaceId}:')` in addition to `workspace_id = ...`, so only rows from the exact requested window are read, exactly as the legacy path already did for its own scope.
- `buildingId` filtering restored via the same `endsWith(source_window_id, ':<building_id>')` suffix match used by the legacy visitors/positioning queries (building id is embedded in `scope` at sync time). `geofenceId` filtering restored via the real `matched_fence_id` column on the geofencing table, same as legacy.
- `summary.get.ts` now parses and validates `buildingId` (positive integer) and `geofenceId` (bounded `[a-zA-Z0-9_-]{1,64}`) from the query string and passes them through; previously these were silently dropped.
- `sync.post.ts` now validates its body with a zod schema (`report` enum, `fromDate`/`toDate` strings checked by `isValidDateRange`, bounded `buildingId`/`buildingIds`) instead of relying on a TS generic on `readBody`.
- All identifiers remain parameter-bound; table/database names remain allowlist-validated. No changes to legacy (non-workspace) query paths or legacy row attribution.
- Validation: `npm run lint` and `npm run typecheck` both pass clean.

## Phase 2 evidence

Finding 5 confirmed: `server/api/workspaces/[id].delete.ts` previously only deleted the Postgres `workspaces` row and never touched ClickHouse-owned analytics (`analytics_workspace_visitors`, `analytics_workspace_positioning_time`, `analytics_workspace_geofencing_stay`, `analytics_workspace_sync_runs`), leaving orphaned rows keyed to a now-deleted `workspace_id`.

- Added `deleteWorkspaceAnalytics(workspaceId)` in `server/integrations/clickhouse/analytics.ts`: issues `ALTER TABLE ... DELETE WHERE workspace_id = {workspace_id:UUID}` (parameter-bound, `mutations_sync: '2'` for deterministic completion) against a hardcoded allowlist of exactly the four `analytics_workspace_*` tables. Legacy/unscoped tables (`analytics_visitors`, `analytics_positioning_time`, `analytics_geofencing_stay`, `analytics_sync_runs`) are never referenced by this function.
- Reordered the delete route: (1) verify ownership via a `SELECT` (404 if not owned/found) without mutating anything yet; (2) run the bounded ClickHouse cleanup — if it throws, the handler throws a 503 and the Postgres workspace row is left untouched (no partial state, no false "deleted" report); (3) only once ClickHouse cleanup succeeds does the Postgres `DELETE ... RETURNING` run, scoped by both `id` and `ownerId` as before.
- This ordering means the only inconsistency window is theoretical (ClickHouse cleanup succeeds, then the Postgres delete itself fails) — in that case Postgres still reflects the workspace as existing and the operation can be safely retried; ClickHouse cleanup is idempotent (re-running `DELETE WHERE workspace_id = ...` against already-empty rows is a no-op).
- Unrelated workspaces/users are unaffected because every mutation is `WHERE workspace_id = {workspace_id:UUID}`, never a blanket delete.
- Validation: `npm run lint` and `npm run typecheck` pass clean. Live row-count regression evidence (before/after row counts for the deleted workspace and an unrelated control workspace) is captured in Phase 7 against the reachable local ClickHouse instance (`shared-clickhouse` container, port 8124).

## Phase 3 evidence

Findings 6–7 confirmed by inspecting `server/api/auth/{register,login}.post.ts`: no rate limiting existed on either endpoint, and registration called `hashPassword` (scrypt via `nuxt-auth-utils`) before checking whether the email already existed — an unauthenticated caller could trigger repeated expensive scrypt work by POSTing to `/api/auth/register` regardless of outcome, and could always force one scrypt hash per request with no throttling.

- Added `server/utils/rate-limit.ts`: a KISS in-memory fixed-window limiter keyed by `scope:ip` (uses h3's `getRequestIP` with `xForwardedFor: true`). No Redis/queue — this repo runs a single Nitro process (Plan 026 production containerization target), so a shared external store is not justified. `requireRateLimit` throws a `429` before any expensive work runs.
- `register.post.ts`: rate limit (5/min/IP) is checked first, before body parsing; existing-account check now runs before `hashPassword` (previously reversed), so an unauthenticated caller hitting `/api/auth/register` with an already-registered email no longer triggers a scrypt hash at all, and repeated distinct-email attempts are bounded by the rate limit regardless.
- `login.post.ts`: rate limit (10/min/IP) added; login already avoided hashing when no matching user existed (`verifyPassword` was only called when `record[0]?.passwordHash` was truthy), so no reordering was needed there — only the rate limit was added. Generic `401 Invalid credentials.` response is unchanged for both missing-user and wrong-password cases.
- This is intentionally per-process/in-memory (not distributed), consistent with the KISS requirement; a restart clears counters, which is an acceptable tradeoff for abuse throttling (not a hard security boundary) at this scale. No redesign of the account/email-verification system was made or needed.
- Validation: `npm run lint` and `npm run typecheck` pass clean.

## Acceptance evidence

Record lint/typecheck/build results, targeted regression evidence per phase (window dedup, date/building/geofence filtering, workspace-deletion row counts, rate-limit-before-hash ordering, org-mismatch rejection, timeout behavior), and any intentionally unresolved items (e.g. CSP limitations, SDK cancellation evidence gaps) in the final phase commit and session log.

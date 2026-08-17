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
- [ ] Phase 2 — Workspace deletion data lifecycle.
- [ ] Phase 3 — Authentication abuse protection.
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

## Acceptance evidence

Record lint/typecheck/build results, targeted regression evidence per phase (window dedup, date/building/geofence filtering, workspace-deletion row counts, rate-limit-before-hash ordering, org-mismatch rejection, timeout behavior), and any intentionally unresolved items (e.g. CSP limitations, SDK cancellation evidence gaps) in the final phase commit and session log.

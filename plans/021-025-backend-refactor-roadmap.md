# Backend Refactor Roadmap — Plans 021–025

Status: **planning ready; integration gate before Plan 021**

Planning branch: `roadmap/021-025-backend-refactor`

## Locked product model

- One application user may own many private workspaces.
- Each workspace has exactly one application owner; no invites or workspace members in this roadmap.
- Different application users may independently configure workspaces that point to the same Situm account/organization; do not introduce global external-account uniqueness.
- Situm organization identity is external metadata, not application tenancy.
- Situm configuration moves from global environment values to workspace configuration managed from the dashboard and persisted server-side with authenticated encryption.
- Long-lived workspace Situm credentials never become public runtime config/read-API output.
- Product access modes are `VIEW_ONLY` and `VIEW_WRITE`; verified upstream permission remains authoritative.
- Email/password register/login must work end-to-end.
- Google OAuth is schema/callback/config ready, while runtime OAuth acceptance is deferred to the user.
- Existing local observability infrastructure must be inspected and reused instead of provisioning duplicates.
- Browser-to-Nitro requests carry trace/correlation context and internal failures are sanitized at the client boundary.
- Multi-workspace isolation includes PostgreSQL ownership, ClickHouse analytics, Situm account context, and Viewer/building context.

## Sequence

```text
Plan 021 — Identity & Auth Foundation
-> Plan 022 — Private Workspaces & Situm Configuration
-> Plan 023 — Observability, Correlation & Safe Error Boundary
-> Plan 024 — Workspace-scoped Situm Backend Migration
-> Plan 025 — Workspace UX, Permission-aware Actions & Full Regression
```

Normal workflow applies: one plan per branch, no direct implementation on `main`, and each dependent plan starts only after its prerequisite is accepted/integrated into updated `main`. No stacked implementation authorization exists unless the user explicitly adds it later.

## Current workflow gate

Before Plan 021 begins, this planning branch must be reviewed/integrated into `main`. Otherwise `.agents/protocols/git-workflow.md` requires execution to stop rather than starting Plan 021 from stale `main`.

## Prerequisites / blockers

Read `plans/021-025-prerequisites.md` before execution. It records required DB/session/encryption config, deferred Google OAuth values, Situm permission test prerequisites, observability discovery gates, Viewer least-privilege risk, legacy ClickHouse isolation, and global building-context migration.

## Situm evidence gate

Current official Situm documentation describes multiple API-key permission levels, JWT authentication, and JS SDK auth/Viewer surfaces. Plan 022 must still verify the exact installed `@situm/sdk-js` contract before relying on permission introspection or changing Viewer authentication.

No destructive mutation is performed merely to discover whether a supplied key can write.

## Baseline validation

- `git diff --check`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- production runtime acceptance uses `npm run preview`, not Nuxt dev mode.

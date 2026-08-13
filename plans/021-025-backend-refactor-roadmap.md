# Backend Refactor Roadmap — Plans 021–025

Status: **roadmap ready; Plan 021 next**

Planning branch: `roadmap/021-025-backend-refactor`

## Locked product model

- One application user may own many private workspaces.
- Each workspace has exactly one application owner; no invites or workspace members in this roadmap.
- Different application users may independently configure workspaces that point to the same Situm account or organization.
- Situm organization identity is external metadata, not application tenancy.
- Situm configuration moves from global environment values to workspace configuration managed from the dashboard and persisted server-side.
- Product access modes are `VIEW_ONLY` and `VIEW_WRITE`; real upstream permission remains authoritative.
- Email/password register/login must work end-to-end.
- Google OAuth is configuration/callback/schema ready, while runtime OAuth acceptance is deferred to the user.
- Existing local observability infrastructure must be inspected and reused instead of provisioning duplicates.
- Browser-to-Nitro requests must carry trace/correlation context and internal failures must be sanitized at the client boundary.

## Sequence

```text
Plan 021 — Identity & Auth Foundation
-> Plan 022 — Private Workspaces & Situm Configuration
-> Plan 023 — Observability, Correlation & Safe Error Boundary
-> Plan 024 — Workspace-scoped Situm Backend Migration
-> Plan 025 — Workspace UX, Permission-aware Actions & Full Regression
```

Default workflow applies: one plan per branch and no implementation directly on `main`. No stacked implementation authorization exists for Plans 021–025 unless the user explicitly adds it later.

## Situm evidence gate

Current official Situm documentation describes multiple API-key permission levels and supports short-lived JWT authentication. Plan 022 must verify the exact installed `@situm/sdk-js` contract before changing Viewer authentication or permission handling.

References:
- https://situm.com/docs/managing-api-keys/
- https://developers.situm.com/pages/rest/openapi/
- https://developers.situm.com/sdk_documentation/sdk-js/

## Baseline validation

- `git diff --check`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- production runtime acceptance uses `npm run preview`, not Nuxt dev mode.

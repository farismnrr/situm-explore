# Situm Explore

Situm Explore is a full-stack Nuxt 4 web operations/exploration application using Nuxt UI, Nitro, PostgreSQL/Drizzle, Situm web integrations, and ClickHouse analytics.

## Current status

Plans 017–020 are complete and integrated into `main` by PR #12.

The active planning roadmap is Plans 021–025 on `roadmap/021-025-backend-refactor`:

```text
Plan 021 — Identity & Auth Foundation
-> Plan 022 — Private Workspaces & Situm Configuration
-> Plan 023 — Observability, Correlation & Safe Error Boundary
-> Plan 024 — Workspace-scoped Situm Backend Migration
-> Plan 025 — Workspace UX & Full Regression
```

Read `AGENTS.md`, `.agents/state.md`, `ARCHITECTURE.md`, `plans/021-025-backend-refactor-roadmap.md`, and `plans/021-025-prerequisites.md` before executing roadmap work.

Under the normal Git protocol, the planning branch must be reviewed/integrated into `main` before Plan 021 starts. No stacked implementation authorization currently exists.

## Current runtime vs target

The current integrated runtime still contains the previous PoC's env-defined app login and global Situm account/Viewer/building context. Those are migration inputs, not the final target.

Plans 021–025 move the product to:

- database-backed users with real email/password registration and login;
- Google OAuth plumbing prepared for later manual acceptance;
- many private single-owner workspaces per user;
- protected server-side Situm configuration per workspace;
- `VIEW_ONLY` / `VIEW_WRITE` product modes with upstream permission authoritative;
- workspace-scoped Situm, Viewer/building, and ClickHouse analytics context;
- reuse of the user's existing observability stack;
- end-to-end request correlation/tracing;
- sanitized client errors while detailed diagnostics remain server-side.

Current architecture/design documents are already reconciled for this roadmap. Historical plans/sessions remain evidence only and should not be read as current execution authority.

## Setup

```sh
npm install
cp .env.example .env
npm run dev
```

Current runtime configuration is documented in `.env.example`. New roadmap prerequisites are introduced by their owning plan and summarized in `plans/021-025-prerequisites.md`.

Never commit local environment files, credentials, session material, encryption material, or credential-bearing output.

## Validation

Code-changing plans use at least:

```sh
git diff --check
npm run lint
npm run typecheck
npm run build
```

Runtime acceptance uses a production build plus `npm run preview`; Nuxt dev mode is not acceptance evidence.

## Product boundary

The Nuxt web app remains an operations/admin/exploration product. Device indoor positioning, sensor-generated blue dot, handset live navigation, and movement-aware rerouting remain outside this web roadmap.

For Situm behavior: **no evidence, no implementation**. Verify exact official/current contracts and installed SDK compatibility instead of inferring behavior from historical UI, old plans, or model memory.

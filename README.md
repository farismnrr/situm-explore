# Situm Explore

Situm Explore is a full-stack Nuxt 4 web operations/exploration application using Nuxt UI, Nitro, PostgreSQL/Drizzle, Situm web integrations, and ClickHouse analytics.

## Current status

Plans 017–020 are complete and integrated into `main` by PR #12.

Plans 021–025 are complete and integrated into `main`. Plan 026 is the active production-containerization plan on `plan/026-production-containerization`:

```text
Plan 021 — Identity & Auth Foundation
-> Plan 022 — Private Workspaces & Situm Configuration
-> Plan 023 — Observability, Correlation & Safe Error Boundary
-> Plan 024 — Workspace-scoped Situm Backend Migration
-> Plan 025 — Workspace UX & Full Regression
```

Read `AGENTS.md`, `.agents/state.md`, `ARCHITECTURE.md`, and `plans/026-production-containerization.md` before executing current plan work. The Plans 021–025 roadmap and prerequisites are historical context.

## Production container workflow

The Makefile is the canonical interface for routine Docker, Buildx, release, and staging operations. Raw Docker/Buildx/Compose commands are diagnosis-only. Local laptop builds and pushes publish GHCR images for `linux/amd64` and `linux/arm64`; no CI is used. The approved filtered local context helper is used for builds, never routine root-dot context.

Staging Compose is pull-only: it contains neither `build:` nor `context:`. It reuses external PostgreSQL, ClickHouse, and observability services. Runtime secrets are external only; `.env` is never baked into an image. A 64-bit Orange Pi consumes `linux/arm64`.

Staging updates are `pull -> recreate -> health -> smoke`. Immutable SHA tags/digests support rollback. `staging-migrate` is explicit and never runs at startup.

## Historical pre-refactor baseline

The previous PoC used env-defined app login and global Situm account/Viewer/building context. That pre-refactor baseline is retained here as migration history, not as the current runtime architecture.

Plans 021–025 moved the product to:

- database-backed users with real email/password registration and login;
- Google OAuth plumbing prepared for later manual acceptance;
- many private single-owner workspaces per user;
- protected server-side Situm configuration per workspace;
- workspace configuration requires a verified Situm Read & Write primary credential plus a separate verified Situm Read-only Viewer credential; the account ID is derived server-side;
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

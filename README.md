# Situm Explore

Situm Explore is a full-stack Nuxt 4 web operations/exploration application using Nuxt UI, Nitro, PostgreSQL/Drizzle, Situm web integrations, and ClickHouse analytics.

## Current status

Plans 017–035 are closed/integrated into `main`. The native companion closeout, Realtime lifecycle remediation, Android release/distribution polish, public MinIO download, and release-artifact standardization were integrated through PR #32 at merge commit `840c0f9`. There is currently **no active implementation plan**.

The shipped architecture remains one Nuxt/Nitro web/backend runtime plus the React Native companion under `mobile/`; there is no second backend. The native roadmap history is retained in `plans/028-034-native-mobile-roadmap.md`, Plan 035 records the final bounded Realtime remediation, and unresolved items from earlier acceptance plans remain historical limitations unless a future plan explicitly reopens them.

```text
Plan 028 — Native Capability, Auth & Distribution Spike [complete/integrated]
-> Plan 029 — Native App Foundation & Workspace Session [complete/integrated]
-> Plan 030 — Native Map, Positioning & Navigation [complete/integrated]
-> Plan 031 — Native Realtime Operations [complete/integrated]
-> Plan 032 — Web/Native Handoff & Distribution [complete/integrated]
-> Plan 033 — Native UI/UX Reference Reconciliation [complete/integrated]
-> Plan 034 — Full E2E Acceptance & Roadmap Closeout [closed with documented limitations]
-> Plan 035 — Realtime Remediation [complete/integrated via PR #32]
```

Read `AGENTS.md`, `.agents/state.md`, `ARCHITECTURE.md`, and `plans/README.md` before starting new work. Historical roadmap/prerequisite files are evidence and context, not active execution authority.

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

Current runtime configuration is documented in `.env.example`. `plans/021-025-prerequisites.md` is historical support material; future work must revalidate prerequisites in its own scope.

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

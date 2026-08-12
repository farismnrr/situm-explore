# Decisions

This file contains **currently active durable decisions**. Historical/superseded details belong in session logs and completed plans, not as competing active instructions.

## 2026-08-12 — Repo-native agent context

- Root `AGENTS.md` stays concise and routes persistent context into `.agents/`.
- `.agents/` owns durable agent state/memory/protocols; architecture/design guidance stays in root contracts to avoid duplicate sources of truth.
- Every conversation runs the persistence pass; session history is chronological evidence, while durable stores contain current truth.
- Never persist credentials, API keys, passwords, or unnecessary sensitive data.

Status: active.

## 2026-08-12 — Full-stack web foundation

- Build web first; native/mobile is deferred.
- Use one full-stack Nuxt application with Nitro server routes rather than a separate backend app.
- Use Nuxt UI as the production component/design foundation.
- Use `nuxt-auth-utils` for the existing configured-owner authentication/session flow.
- Use PostgreSQL through Drizzle for application-owned data in the fixed `situm_explore` schema.
- Preserve existing real `/api/auth/login`, session/logout, `/api/me`, and Situm Viewer behavior while product UI evolves.
- CI and unit-test-runner infrastructure remain deferred; lint is mandatory for code-changing phases, and active plans additionally require typecheck/build where specified.

Status: active.

## 2026-08-12 — Nuxt 4 architecture

- Root `ARCHITECTURE.md` is the single application architecture/folder/dependency contract.
- Use Nuxt 4 native runtime boundaries: Vue application code under `app/`, Nitro/server code under root `server/`, and only genuinely cross-runtime contracts/pure helpers under root `shared/`.
- Apply layered architecture lightly: presentation -> reusable client coordination -> HTTP transport -> application service only when needed -> DB/external integration.
- KISS is the default tie-breaker. SOLID applies to real responsibilities/dependencies; DRY follows meaningful proven repetition.
- Do not introduce generic repositories/services, DI containers, global stores, Nuxt layers, generic API clients, or empty architecture folders without a concrete requirement.
- Plan 004 Phase 0 owns the one-time behavior-preserving migration from the current root Vue directories into Nuxt 4 `app/` and moves DB initialization beside `server/db/schema.ts`.

Status: active.

## 2026-08-12 — Git and sequential plan execution

- One plan = one dedicated `plan/<number>-<slug>` branch in the normal repository working directory.
- Do not create linked Git worktrees unless the user explicitly asks.
- Never implement a plan directly on `main`.
- Each completed phase updates its plan/relevant `.agents`, validates, commits, and pushes.
- PR creation/integration is user-gated; pushing a plan branch does not authorize a PR or merge.
- The roadmap is sequential: if Plan N+1 depends on Plan N, Plan N must be complete and integrated into `main` before Plan N+1 starts from updated `origin/main`.
- Do not silently use stacked branches, stale `main`, manual file copying, or cherry-picks to bypass an unintegrated dependency. Stacked branches require explicit user request.

Status: active.

## 2026-08-12 — Canonical UI reference

- Plan 003 is historical; it was closed, but its rendered UI was not accepted as the current design target.
- Root `DESIGN.md` is the single design router; do not recreate `.agents/design/` or another parallel design tree.
- `design/reference/situm-explore-interactive-prototype.html` is the **only** HTML visual/interaction reference.
- The user owns/populates that file. While it is placeholder-only (`Hello World`), visual UI implementation must stop rather than infer a design.
- The populated HTML defines visual/interaction intent only. Production must translate it using Nuxt 4 + Vue + Nuxt UI and must not copy prototype HTML/CSS/JS architecture.
- `design/IMPLEMENTATION.md` defines Nuxt UI translation rules; `design/data-source-matrix.md` defines UI-roadmap real-vs-dummy boundaries.
- Light mode remains the current product mode and the approved brand mark is the navigation-arrow mark when it remains present in the populated reference.

Status: active.

## 2026-08-12 — UI-first / dummy-first roadmap

- Plans 004–009 implement and validate the complete approved UI before adding missing product-domain backend integrations.
- Existing real foundation stays real: login/session/logout, auth protection, `/api/me`/PostgreSQL, `/api/situm/status` configuration semantics, and the existing Situm Viewer create/readiness/error lifecycle.
- Missing product domains stay typed local dummy during Plans 004–009, including registration, business metrics, Buildings/POIs/Geofences/Paths data, new Map Explore/Route/Layers behavior, Realtime, Reports, Alarms, organization/users, and new Viewer settings behavior.
- A broader Situm credential does not authorize UI plans to wire new Situm product-domain REST/SDK calls.
- Canonical dummy records live under `app/data/prototype/` after the Nuxt 4 migration and should be reused across screens rather than duplicated.
- Plan 009 is the final whole-product UI conformance gate; later integration work cannot start until Plan 009 is integrated and the user explicitly accepts the UI.

Status: active.

## 2026-08-12 — Time-boxed Situm POC credential/setup

- Use one environment variable, `NUXT_PUBLIC_SITUM_API_KEY`, for the Situm POC credential and `NUXT_PUBLIC_SITUM_BUILDING_ID` for the configured Viewer building.
- The user may provision the one POC key with Read & Write permission for speed; revoke/replace it after the POC.
- Never persist or print the key value.
- If the local building ID is blank, the agent may discover accessible buildings with `GET https://api.situm.com/api/v1/buildings` using `X-API-KEY` and write only the selected ID to ignored local `.env`.
- Do not silently guess among genuinely ambiguous building candidates.
- This building discovery is setup only, not permission to expand Plans 004–009 into Situm backend work.

Status: active.

## 2026-08-12 — Post-UI Situm integration sequence

- Plan 010 is feasibility/capability/data-contract mapping only; it does not replace dummy UI data.
- Actual domain integrations execute sequentially after Plan 010: Plan 011 Buildings/Floors/POIs, Plan 012 Geofences/Paths/Routing, Plan 013 Realtime, Plan 014 Reports/Analytics, Plan 015 Organization/Users/Groups/Alarms where still valuable.
- Plans 011–015 may reuse the same POC key but should perform only the behavior their plan owns; broad Read & Write permission does not imply broad mutations.
- If accepted UI actions still need real Situm writes after read/data integration, create a separate explicit write-action plan. Do not leak mutations backward into UI plans or auto-expand scope.

Status: active.

# Current State

_Last reviewed: 2026-08-12_

## Current focus

Refresh the existing Nuxt web UI/UX into a clean minimalist SaaS experience while preserving the hardened foundation behavior.

## Phase

**Phase 7 — UI/UX refresh in progress**

## Active decisions

- Root `AGENTS.md` acts as a short router into `.agents/`.
- `.agents/` is the source of truth for persistent agent context.
- Every conversation creates a concise session entry.
- Every plan executes on its own `plan/<number>-<slug>` branch in the normal repository working directory.
- Linked Git worktrees are not required; do not create them unless the user explicitly asks for them.
- After each completed implementation phase, update the plan + relevant `.agents/`, validate, commit, and push the plan branch.
- Do not implement plans directly on `main`.
- Do not create a PR until the user explicitly authorizes it.
- CI and unit-test infrastructure are deferred for now; Nuxt lint is mandatory for code-changing phases.
- Build web first; native/mobile remains deferred.
- Use one full-stack Nuxt application for frontend and backend.
- Use Nuxt UI.
- UI direction is clean minimalist SaaS, light mode only.
- Use `DESIGN.md` and `.agents/design/` as mandatory persistent design context for UI/UX work.
- Keep current navigation minimal: top bar + content canvas; no sidebar until real destinations justify it.
- Integrate Situm on web first and preserve truthful viewer readiness.
- Reuse the existing PostgreSQL database with the fixed `situm_explore` application schema.
- Use Drizzle ORM.
- Use `nuxt-auth-utils` for the current simple owner authentication/session flow.
- Keep architecture deliberately simple until real requirements justify more complexity.

## Active plan

- `plans/003-ui-ux-refresh.md` — active implementation on branch `plan/003-ui-ux-refresh`; Phases 1–6 are complete and Phase 7 is next.

## Completed plans

- `plans/000-resource-gathering.md`
- `plans/001-web-foundation.md`
- `plans/002-foundation-hardening.md` — merged through PR #3; manual authenticated/API and Situm browser checks were later confirmed complete by the user.

## Known foundation state

- Nuxt full-stack foundation and foundation hardening are merged to `main`.
- Login, authenticated `/api/me`, PostgreSQL access, and Situm browser readiness have been manually tested by the user after hardening.
- Local PostgreSQL `situm_explore` schema is application-owned; unrelated database objects remain out of scope.
- Building floorplan resources are not present in the current public tree; historical Git blobs remain because history rewrite was not authorized.
- Local credentials remain ignored and must never be committed.

## Open loops

- Execute Plan 003 without changing auth/database/Situm behavior beyond UI composition and feedback presentation; Phases 1–6 are complete.
- Keep light-mode-only scope and avoid premature navigation/design-system complexity.

## Next likely action

From a clean, up-to-date `main`, create/switch to `plan/003-ui-ux-refresh` in the normal repository directory and execute `plans/003-ui-ux-refresh.md` phase by phase. Read `DESIGN.md` and `.agents/design/` before editing UI. Commit and push each completed phase; do not create a PR until explicitly authorized.

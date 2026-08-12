# Current State

_Last reviewed: 2026-08-12_

## Current focus

Gathered building assets and Situm metadata; PostgreSQL discovery is blocked until local `DATABASE_URL` is available.

## Phase

**Phase 0.5 — Resource gathering (blocked on PostgreSQL credentials)**

## Active decisions

- Root `AGENTS.md` acts as a short router into `.agents/`.
- `.agents/` is the source of truth for persistent agent context.
- Every conversation creates a concise session entry.
- Every plan executes in its own `plan/<number>-<slug>` branch and linked worktree; do not implement plans directly on `main`.
- After each completed implementation phase, update the plan + relevant `.agents/`, validate, commit, and push the plan branch.
- Do not create a PR until the user explicitly authorizes it.
- CI and unit-test infrastructure are deferred for now; Nuxt lint is mandatory once code/lint tooling exists.
- Build web first; native/mobile remains deferred.
- Use one full-stack Nuxt application for frontend and backend.
- Use Nuxt UI.
- Integrate Situm on web first through environment configuration.
- Reuse the existing PostgreSQL database with a dedicated Situm Explore schema.
- Codex must inspect the existing database before applying any schema/migration changes.
- Use Drizzle ORM.
- Use a maintained Nuxt-oriented auth module/plugin rather than custom auth infrastructure.
- Keep the architecture deliberately simple until real requirements justify more complexity.
- Gather resources before implementation when they already exist locally; do not ask the user for metadata Codex can safely discover from Situm/PostgreSQL.
- Preserve original local source assets during intake; copy normalized repository-local versions instead of deleting the originals.

## Active plans

1. `plans/000-resource-gathering.md`
2. `plans/001-web-foundation.md`

## Known local resources

- `/home/farismnrr/Downloads/lt 1-1422.jpeg`
- `/home/farismnrr/Downloads/lt 2-1422.jpeg`
- Situm API key exists locally and must never be committed.
- Existing PostgreSQL database will be accessed through a local `DATABASE_URL` and a dedicated application schema.

## Open loops

- Confirm local PostgreSQL connectivity and inspect existing schemas read-first.
- After plan 000 is complete and pushed, start `plans/001-web-foundation.md` in a **new** branch/worktree `plan/001-web-foundation` / `../situm-explore-worktrees/001-web-foundation`; do not continue 001 in the 000 branch.

## Next likely action

Provide/configure the local `DATABASE_URL`, then complete the read-only PostgreSQL inspection before starting plan 001. Do not create a PR until explicitly requested.

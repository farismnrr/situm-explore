# Current State

_Last reviewed: 2026-08-12_

## Current focus

Harden the completed Nuxt web foundation before starting the first self-improvement product/domain plan.

## Phase

**Phase 2 — Foundation hardening planned**

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
- Integrate Situm on web first.
- Reuse the existing PostgreSQL database with the dedicated Situm Explore schema.
- Use Drizzle ORM.
- Use `nuxt-auth-utils` for the current simple owner authentication/session flow.
- Keep architecture deliberately simple until real requirements justify more complexity.

## Active plan

- `plans/002-foundation-hardening.md`

## Completed plans

- `plans/000-resource-gathering.md`
- `plans/001-web-foundation.md`

## Known foundation state

- Nuxt full-stack foundation is merged to `main`.
- Local PostgreSQL `situm_explore` schema has been migrated without touching unrelated database objects.
- Situm building discovery identified building `19866` and floors `69904`/`69905`.
- Building floorplan JPEGs and related non-secret metadata are currently committed in a public repository; visibility/exposure must be treated as an explicit policy decision during hardening.
- Local credentials remain ignored and must never be committed.

## Open loops

- Execute `plans/002-foundation-hardening.md` on branch `plan/002-foundation-hardening` using the normal repository working directory.
- Resolve the public-resource exposure decision before treating the foundation as fully hardened.
- Verify least-privilege Situm browser credential usage.
- Make Nuxt ESLint clean-clone reproducible.
- Make Situm viewer ready-state reflect the SDK's actual ready event.
- Remove false PostgreSQL schema configurability and keep `situm_explore` explicit.
- Reconcile stale checkboxes in completed plans 000/001.

## Next likely action

From a clean, up-to-date `main`, create/switch to `plan/002-foundation-hardening` in the normal repository directory and execute the plan phase by phase. Commit and push each completed phase; do not open a PR until explicitly authorized.

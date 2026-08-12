# Current State

_Last reviewed: 2026-08-12_

## Current focus

Prepare and execute the first minimal web foundation for Situm Explore.

## Phase

**Phase 1 — Web foundation planned**

## Active decisions

- Root `AGENTS.md` acts as a short router into `.agents/`.
- `.agents/` is the source of truth for persistent agent context.
- Every conversation creates a concise session entry.
- Build web first; native/mobile remains deferred.
- Use one full-stack Nuxt application for frontend and backend.
- Use Nuxt UI.
- Integrate Situm on web first through environment configuration.
- Reuse the existing PostgreSQL database with a dedicated Situm Explore schema.
- Codex must inspect the existing database before applying any schema/migration changes.
- Use Drizzle ORM.
- Use a maintained Nuxt-oriented auth module/plugin rather than custom auth infrastructure.
- Keep the architecture deliberately simple until real requirements justify more complexity.

## Active plan

- `plans/001-web-foundation.md`

## Open loops

- Bootstrap the Nuxt application without disturbing `.agents/` or `plans/`.
- Verify the current supported Situm web integration and exact environment requirements.
- Select the simplest maintained Nuxt auth integration during implementation.
- Explore the existing PostgreSQL schemas safely before creating the application-owned schema.
- Implement the minimal authenticated Situm web vertical slice.

## Next likely action

Have Codex execute `plans/001-web-foundation.md` in order, starting with repository inspection and Nuxt bootstrap, while stopping short of product/domain feature development.

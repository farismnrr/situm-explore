# Current State

_Last reviewed: 2026-08-12_

## Current focus

Gather local building assets and required credentials/metadata before executing the first Nuxt web foundation.

## Phase

**Phase 0.5 — Resource gathering**

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

- Copy and normalize the two building images into `resources/buildings/building-1422/source/` while preserving originals.
- Create the local resource manifest.
- Configure Situm credentials locally, then discover the actual building identifier and floor metadata through Situm rather than assuming `1422` is the Situm ID.
- Confirm local PostgreSQL connectivity and inspect existing schemas read-first.
- After resource gathering is complete, execute `plans/001-web-foundation.md`.

## Next likely action

Have Codex execute `plans/000-resource-gathering.md` locally. Once its ready-for-implementation checklist passes, continue directly with `plans/001-web-foundation.md`.

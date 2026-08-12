# Decisions

## 2026-08-12 — Repo-native persistence foundation

- Keep root `AGENTS.md` concise and use it as a router into `.agents/`.
- Treat `.agents/` as the canonical persistent context directory.
- Require a persistence pass at the end of every conversation.
- Create a concise session trace for every conversation.
- Update durable stores selectively to avoid memory noise and duplication.

Status: active.

## 2026-08-12 — Initial web architecture

- Move from agent-foundation-only into the first web foundation phase.
- Build web first; native/mobile is explicitly deferred.
- Use a single full-stack Nuxt application for frontend and backend to minimize operational complexity.
- Keep backend routes and server logic inside Nuxt/Nitro rather than introducing a separate backend service.
- Use Nuxt UI for UI primitives.
- Integrate Situm on the web first using environment-based configuration; do not commit the real API key.
- Reuse the existing PostgreSQL database, but isolate Situm Explore in a dedicated PostgreSQL schema.
- Codex must inspect the existing database before applying migrations and must not modify unrelated schemas/tables.
- Use Drizzle ORM for application-owned database access and migrations.
- Use a maintained Nuxt-oriented auth module/plugin rather than building custom authentication infrastructure.
- Avoid premature architecture: no monorepo, microservices, queues, separate API app, or native layer until requirements justify them.
- The implementation sequence is tracked in `plans/001-web-foundation.md`.

Status: active.

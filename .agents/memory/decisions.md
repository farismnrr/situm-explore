# Decisions

## 2026-08-12 — Repo-native persistence foundation

- Keep root `AGENTS.md` concise and use it as a router into `.agents/`.
- Treat `.agents/` as the canonical persistent context directory.
- Require a persistence pass at the end of every conversation.
- Create a concise session trace for every conversation.
- Update durable stores selectively to avoid memory noise and duplication.

Status: active.

## 2026-08-12 — Web foundation implementation

- Use `nuxt-auth-utils` for sealed sessions and its scrypt password utilities; the first slice authenticates one configured owner credential rather than introducing account management.
- Use `@situm/sdk-js` Map Viewer in the browser. Its documented browser initialization requires the Situm API key client-side, so the integration uses an explicitly public `NUXT_PUBLIC_SITUM_API_KEY`; no server-only secret is exposed through runtime configuration.
- Drizzle owns only the `situm_explore` PostgreSQL schema and its initial `app_settings` table.

Status: active.

## 2026-08-12 — Initial web architecture

- Build web first; native/mobile is explicitly deferred.
- Use a single full-stack Nuxt application for frontend and backend to minimize operational complexity.
- Keep backend routes and server logic inside Nuxt/Nitro rather than introducing a separate backend service.
- Use Nuxt UI for UI primitives.
- Integrate Situm on the web first using environment-based configuration; do not commit real credentials.
- Reuse the existing PostgreSQL database, but isolate Situm Explore in its dedicated PostgreSQL schema.
- Codex must inspect the existing database before applying migrations and must not modify unrelated schemas/tables.
- Use Drizzle ORM for application-owned database access and migrations.
- Use a maintained Nuxt-oriented auth module/plugin rather than building custom authentication infrastructure.
- Avoid premature architecture: no monorepo, microservices, queues, separate API app, or native layer until requirements justify them.

Status: active.

## 2026-08-12 — Git execution workflow

- Every plan must be implemented on its own dedicated `plan/<number>-<slug>` branch.
- Use the normal repository working directory. Linked Git worktrees are no longer required and should not be created unless the user explicitly requests them.
- New plan work should start from the latest fetched `origin/main` unless an explicit dependency requires another base.
- Never implement plan changes directly on `main`.
- Every completed implementation phase must update the plan and relevant `.agents/` persistence first, then be validated, committed, and pushed to the plan branch.
- Pull requests are user-gated: pushing a plan branch must never automatically create a PR, including a draft PR.
- CI is intentionally deferred for now.
- Unit tests/test-runner infrastructure are intentionally deferred for now to avoid premature complexity.
- Nuxt lint is mandatory for code-changing phases and must pass before commit/push.
- Avoid force-push/destructive Git operations as normal workflow; preserve small, reviewable, phase-scoped history.

Status: active.

## 2026-08-12 — Foundation hardening before product work

- Run one narrow hardening plan before introducing self-improvement product/domain features.
- Hardening should address public-resource exposure policy, least-privilege Situm browser credentials, reproducible Nuxt ESLint setup, truthful Situm viewer readiness, fixed `situm_explore` schema ownership, and stale completed-plan checklist state.
- Keep this as foundation cleanup only; do not expand it into product architecture, CI, tests, or native/mobile work.

Status: active.

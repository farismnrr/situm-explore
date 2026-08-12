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
- Use `@situm/sdk-js` Map Viewer in the browser with the dedicated read-only viewer credential boundary established during hardening.
- Drizzle owns only the fixed `situm_explore` PostgreSQL schema and its application-owned tables.

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

- One narrow hardening plan was completed before further product/UI work.
- Hardening addressed public-resource exposure policy, least-privilege Situm browser credentials, reproducible Nuxt ESLint setup, truthful Situm viewer readiness, fixed `situm_explore` schema ownership, and stale completed-plan checklist state.
- Manual authenticated/API and Situm browser checks were confirmed complete by the user after integration.

Status: complete.

## 2026-08-12 — UI/UX design direction

- Refresh the existing web UI before introducing broader self-improvement product features.
- Target a clean minimalist SaaS visual language.
- Support light mode only for now; do not add a theme toggle or spend complexity on dark variants.
- Keep Nuxt UI as the design/component foundation rather than creating a parallel custom design system.
- Introduce root `DESIGN.md` plus `.agents/design/` as persistent design guidance that Codex must read for UI/UX work.
- Prefer a compact top bar and content canvas for the current information architecture; do not add a sidebar until real navigation destinations justify it.
- Treat Linear, Vercel, Notion, and Stripe Dashboard as principle references only: borrow restraint, hierarchy, whitespace, and operational clarity without copying their exact layouts or brands.
- Preserve working auth, PostgreSQL, and Situm behavior during the visual refresh.

Status: active.

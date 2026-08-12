# Plan 001 — Web Foundation

Status: planned  
Scope: web only  
Principle: ship the simplest working architecture first; do not over-engineer.

## Goal

Build the first usable web foundation for Situm Explore as a single full-stack Nuxt application.

The first milestone should prove these things only:

- Nuxt can serve the UI and backend endpoints from one application.
- Nuxt UI is the component system.
- Situm can be configured and loaded in the web app using environment-based configuration.
- Authentication works using a maintained Nuxt-oriented auth module/plugin rather than a custom auth system.
- The app can connect to the existing PostgreSQL database without taking ownership of unrelated schemas.
- Situm Explore owns a dedicated PostgreSQL schema and accesses it through Drizzle ORM.
- A protected authenticated page can load a minimal record from the application schema.

Native/mobile work is explicitly out of scope for this plan.

---

## Architecture constraints

- [ ] Use a single Nuxt application for frontend and backend.
- [ ] Keep server functionality inside Nuxt/Nitro (`server/api`, server utilities, middleware, etc.).
- [ ] Do not create a separate backend service.
- [ ] Use Nuxt UI for application UI primitives.
- [ ] Use PostgreSQL as the database.
- [ ] Reuse the existing PostgreSQL database instance.
- [ ] Create/use a dedicated database schema for Situm Explore instead of creating a new database.
- [ ] Use Drizzle ORM and Drizzle migrations for tables owned by Situm Explore.
- [ ] Do not modify unrelated existing schemas/tables.
- [ ] Use an existing, maintained Nuxt auth module/plugin; do not hand-roll password/session/auth crypto.
- [ ] Integrate Situm for web first.
- [ ] Do not add native/mobile integration yet.
- [ ] Prefer boring, direct code over abstractions until there is a demonstrated need.

### Explicit non-goals

- [ ] No monorepo unless a future requirement makes it necessary.
- [ ] No microservices.
- [ ] No queues/event bus.
- [ ] No separate API application.
- [ ] No generic repository/service abstraction layers just for architecture purity.
- [ ] No native app.
- [ ] No premature caching layer.
- [ ] No custom design system on top of Nuxt UI.

---

# Implementation checklist

## 1. Repository and Nuxt bootstrap

- [ ] Read root `AGENTS.md` and relevant `.agents/` context before implementation.
- [ ] Inspect the repository before generating files; preserve the existing agent infrastructure and `plans/` directory.
- [ ] Initialize a current stable Nuxt project in the repository root.
- [ ] Use TypeScript.
- [ ] Use one package manager consistently and commit its lockfile.
- [ ] Add standard scripts for development, build, preview, typecheck, lint if configured, and database tasks.
- [ ] Confirm `npm run build` / equivalent succeeds before moving on.

### Expected minimal structure

```text
.
├── app/
├── server/
│   ├── api/
│   ├── db/
│   └── utils/
├── drizzle/
├── plans/
├── .agents/
├── .env.example
├── drizzle.config.ts
├── nuxt.config.ts
└── package.json
```

Do not force this exact layout if the installed Nuxt/Drizzle modules establish a simpler conventional structure. Prefer current framework conventions.

---

## 2. Nuxt UI

- [ ] Install and configure Nuxt UI using its current recommended Nuxt setup.
- [ ] Create only a minimal application shell.
- [ ] Add a simple home/login state and one authenticated app/dashboard page.
- [ ] Use Nuxt UI components directly instead of creating wrapper components without a real need.
- [ ] Keep styling minimal; functionality comes first.

Acceptance:

- [ ] App renders correctly in development.
- [ ] Nuxt UI components are working.
- [ ] No parallel custom component/design system is introduced.

---

## 3. Environment configuration

Create `.env.example` with placeholders only. Never commit real credentials.

Start with a minimal shape similar to:

```dotenv
# Application
NUXT_PUBLIC_APP_URL=http://localhost:3000

# PostgreSQL
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
DB_SCHEMA=situm_explore

# Situm
SITUM_API_KEY=

# Auth
AUTH_SECRET=
```

- [ ] Before implementation, verify the exact environment variable names required by the chosen Situm web SDK/integration.
- [ ] Verify whether any Situm value must be exposed to the browser.
- [ ] Never expose a server-only Situm credential through `runtimeConfig.public` unless Situm explicitly requires a browser-safe/public credential.
- [ ] Map environment variables through Nuxt `runtimeConfig` rather than reading `process.env` throughout application code.
- [ ] Add any additional auth provider variables only after the auth implementation is selected.
- [ ] Update `.env.example` when the final integration requirements are known.

Acceptance:

- [ ] A fresh developer can copy `.env.example` to `.env` and understand which values are required.
- [ ] No actual API keys, passwords, database URLs, or secrets are committed.

---

## 4. Situm web integration

Web only for this milestone.

### Discovery first

- [ ] Inspect the Situm setup already available to the developer/user.
- [ ] Check the current official Situm web documentation/SDK before choosing packages or initialization code.
- [ ] Determine the minimum configuration needed to authenticate/load Situm in a browser.
- [ ] Determine which Situm configuration is safe for client-side exposure versus server-only use.

### Minimal integration

- [ ] Add the Situm dependency/integration using the current supported web approach.
- [ ] Create one small client-side integration boundary, e.g. a composable/plugin, rather than scattering Situm initialization across pages.
- [ ] Read Situm configuration from Nuxt runtime config.
- [ ] Add a minimal page/component that proves Situm initializes successfully.
- [ ] Add useful error handling for missing/invalid configuration.

Acceptance:

- [ ] Situm can initialize in the Nuxt web app using `.env` configuration.
- [ ] Missing Situm config fails clearly during development.
- [ ] No native SDK/package is introduced.

---

## 5. Authentication

The goal is fast, conventional Nuxt authentication—not a custom identity platform.

### Discovery

- [ ] Check the current Nuxt module/plugin ecosystem and official/current documentation.
- [ ] Select the simplest maintained auth option that integrates cleanly with Nuxt server routes and PostgreSQL/Drizzle where appropriate.
- [ ] Prefer an auth solution that already handles sessions, cookies, CSRF/security concerns, and route protection.
- [ ] Document the choice briefly in the implementation PR/commit.

### Implementation

- [ ] Configure the selected auth module/plugin.
- [ ] Add login/logout flow.
- [ ] Add server-side session/user access.
- [ ] Add route protection for the app/dashboard area.
- [ ] Keep provider scope minimal; start with only what is required to authenticate the owner/user.
- [ ] Do not build account management features unless required for the initial flow.

Acceptance:

- [ ] Unauthenticated users cannot access the protected app page.
- [ ] Authenticated users can access it.
- [ ] Server endpoints can resolve the authenticated user/session.

---

## 6. Existing PostgreSQL discovery

The database already exists. Codex must inspect before changing anything.

- [ ] Connect using `DATABASE_URL` supplied locally by the developer.
- [ ] Inspect existing schemas.
- [ ] Inspect naming conventions and extensions that may affect the new schema.
- [ ] Do not infer that `public` is available for application-owned tables.
- [ ] Choose `DB_SCHEMA` from environment configuration, defaulting to a project-specific name such as `situm_explore` only if appropriate.
- [ ] Confirm the target schema does not collide with an existing unrelated schema.
- [ ] Record discoveries that affect implementation in `.agents/knowledge/` or project docs.
- [ ] Never copy actual credentials or sensitive connection details into repository docs/memory.

Acceptance:

- [ ] Existing database structure is understood before migrations run.
- [ ] The implementation touches only the application-owned schema.

---

## 7. Drizzle ORM

- [ ] Install Drizzle ORM and the appropriate PostgreSQL driver.
- [ ] Configure `drizzle.config.ts` from environment variables.
- [ ] Define the application schema explicitly using the dedicated PostgreSQL schema.
- [ ] Keep the initial data model intentionally tiny.
- [ ] If the selected auth module owns tables, decide whether they live in the same application schema or a clearly named adjacent schema; prefer the simpler operational choice.
- [ ] Generate migrations for application-owned tables only.
- [ ] Review generated SQL before applying it to the existing database.
- [ ] Add package scripts for generate/migrate/studio or equivalent useful Drizzle commands.

### Initial model guidance

Do not design the self-improvement domain yet. Create only tables strictly required to prove authentication/database wiring.

Possible minimum:

- auth-required tables from the selected auth integration;
- optionally one small `profiles` or `app_settings` table if needed to validate authenticated DB access.

Acceptance:

- [ ] Migration creates objects only inside the intended schema.
- [ ] Nuxt server code can query PostgreSQL through Drizzle.
- [ ] Protected endpoint/page can read a minimal application record.

---

## 8. Nuxt server/API wiring

- [ ] Keep backend endpoints inside `server/api`.
- [ ] Add a minimal authenticated endpoint such as `/api/me` or `/api/app/status`.
- [ ] Resolve session server-side.
- [ ] Query Drizzle from the server only for private data.
- [ ] Return a small typed response to the Nuxt frontend.
- [ ] Avoid creating service/repository classes unless logic actually becomes complex.

Acceptance:

- [ ] Browser -> Nuxt page -> Nuxt server endpoint -> Drizzle -> PostgreSQL works end-to-end.

---

## 9. Minimal vertical slice

Build one thin end-to-end user flow:

1. [ ] User opens the Nuxt web app.
2. [ ] User signs in.
3. [ ] User reaches the protected app page.
4. [ ] App loads authenticated user/session data.
5. [ ] App loads one small record/status from the Situm Explore PostgreSQL schema through Drizzle.
6. [ ] App initializes the Situm web integration.
7. [ ] UI displays clear success/error states using Nuxt UI.

Do not add self-improvement product features yet. This milestone is infrastructure proof only.

---

## 10. Validation

- [ ] Fresh install succeeds from the lockfile.
- [ ] Development server starts from documented command.
- [ ] Typecheck passes.
- [ ] Build passes.
- [ ] Auth flow works.
- [ ] Protected route protection works server-side, not only visually on the client.
- [ ] Database connection works.
- [ ] Drizzle migration is scoped to the dedicated schema.
- [ ] Situm initializes on web.
- [ ] Missing required env variables produce understandable errors.
- [ ] No secrets are committed.
- [ ] No native/mobile dependencies are present.

---

## 11. Documentation closeout

After implementation:

- [ ] Update root `README.md` with actual setup commands.
- [ ] Document `.env` setup without real secrets.
- [ ] Document database migration commands and schema ownership boundary.
- [ ] Document which auth module/plugin was selected and why, in one short section.
- [ ] Document Situm web setup at the level needed for another developer to run it.
- [ ] Update `.agents/state.md` to reflect the implemented phase.
- [ ] Persist architectural decisions/discoveries through the normal `.agents` persistence protocol.

---

# Definition of done

This plan is complete when a developer can clone the repository, supply the required environment variables, run the Nuxt application, authenticate, access one protected page backed by the existing PostgreSQL database through Drizzle, and initialize Situm in the browser—all from a single Nuxt codebase.

Anything beyond that belongs to the next product-feature plan.

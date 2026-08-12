# Plan 004 — UI Foundation, Landing, Login & Register

Status: planned
Branch: `plan/004-ui-foundation-public-auth`
Depends on: merged foundation; populated `design/reference/situm-explore-interactive-prototype.html` required before visual Phase 1+

## Goal

First align the small existing application with the repository's Nuxt 4 architecture contract, then establish the approved visual foundation and implement the public/auth entry flow using the existing Nuxt/Vue/Nuxt UI stack without changing the existing authentication backend.

## Architecture contract

Read `ARCHITECTURE.md` before changing code.

The architecture phase is intentionally early because the application still has very few pages/components. Do the one-time Nuxt 4 directory migration before the UI roadmap multiplies files.

Architecture principles for this plan:

- Nuxt 4 conventions first;
- KISS over ceremonial layers;
- SOLID responsibility boundaries where they are real;
- DRY only after meaningful repetition;
- no speculative service/repository/store architecture;
- preserve behavior while moving files.

## Phase 0 — Nuxt 4 architecture alignment

**This phase may execute while the canonical HTML still contains `Hello World`.** It is architecture-only and must not make visual/design decisions from the missing reference.

Target migration:

```text
app.vue                         -> app/app.vue
app.config.ts                   -> app/app.config.ts
assets/css/main.css             -> app/assets/css/main.css
pages/index.vue                 -> app/pages/index.vue
pages/dashboard.vue             -> app/pages/dashboard.vue
middleware/auth.ts              -> app/middleware/auth.ts
components/SitumViewer.vue      -> app/components/situm/SitumViewer.vue
components/AppShell.vue         -> app/components/app/AppShell.vue temporarily
server/utils/db.ts              -> server/db/client.ts
server/db/schema.ts             -> unchanged
server/api/**                   -> unchanged routes
```

Tasks:

- [ ] Read `ARCHITECTURE.md` and inspect the current tree before moving files.
- [ ] Migrate the Vue application files into Nuxt 4's `app/` structure using file moves/renames rather than duplicate copies.
- [ ] Keep `server/`, `shared/`, `public/`, `drizzle/`, `nuxt.config.ts`, and `drizzle.config.ts` at repository root as appropriate.
- [ ] Move the real Situm viewer into `app/components/situm/SitumViewer.vue` without changing its SDK lifecycle.
- [ ] Move the current shell into `app/components/app/AppShell.vue` only as an interim location; later authenticated-shell work may replace it with `app/layouts/app.vue`. Do not keep both architectures once the real app layout exists.
- [ ] Move DB initialization from `server/utils/db.ts` to `server/db/client.ts` and update server imports. Keep `server/db/schema.ts` and the Drizzle tooling path stable.
- [ ] Keep existing API URLs unchanged: `/api/auth/login`, `/api/me`, `/api/situm/status`.
- [ ] Do not add `server/services/`, `server/repositories/`, `shared/`, Pinia, a generic API client, or Nuxt layers unless this migration discovers a concrete current need. Empty architecture folders are not required.
- [ ] Ensure `nuxt.config.ts` continues to resolve the global CSS correctly after `~` points to the Nuxt 4 `app/` source directory.
- [ ] Preserve the current `/` and `/dashboard` routes during this architecture-only phase; route expansion happens in later UI phases/plans.
- [ ] Verify auth middleware, login, `/api/me`, and Situm Viewer imports still resolve after moves.
- [ ] `git diff --check`.
- [ ] `npm run lint`.
- [ ] `npm run typecheck`.
- [ ] `npm run build`.

Acceptance:

- the current application behaves the same;
- Vue app code lives under Nuxt 4 `app/`;
- server/database code remains root `server/`;
- there are no old duplicate root `pages/`, `components/`, `middleware/`, or `assets/` application trees;
- no speculative architecture was introduced.

After Phase 0, stop before Phase 1 if the canonical HTML is still placeholder-only.

## Mandatory reference-first protocol for Phase 1+

Canonical visual/interaction reference:

`design/reference/situm-explore-interactive-prototype.html`

### Hard stop when placeholder is present

Before any **visual UI implementation**, open the canonical HTML.

If it still contains only placeholder content such as `Hello World`, **stop after architecture work and do not change visual UI code**. Do not infer the missing design from Plan 003, memory, generic SaaS patterns, deleted design docs, or agent taste.

### When the HTML is populated

For every visual phase:

1. Open the exact relevant section of the canonical HTML first.
2. Understand its rendered hierarchy, proportions, spacing, typography, responsive behavior, interaction states, and action priority.
3. Treat its HTML/CSS/JS only as evidence of UI/UX intent. Do not copy its architecture into production.
4. Inspect the existing Nuxt implementation and real backend/integration behavior.
5. Map the reference intent to Nuxt UI primitives, Vue composition, and Nuxt routing.
6. Use small custom CSS only for genuine fidelity gaps after Nuxt UI/Tailwind options are exhausted.
7. Compare the resulting Nuxt page against the same reference section before marking the phase complete.

Production implementation order is mandatory:

1. Nuxt UI primitive;
2. Nuxt UI props/variants/slots/semantic tokens/app config + existing utilities;
3. composition of Nuxt UI primitives;
4. small Vue component where reuse/readability is real;
5. narrow centralized custom CSS only if necessary.

Do not paste prototype CSS, recreate its `.btn`/`.card`/`.pill` system, or copy its JavaScript screen-switching logic.

## Required reading

- `AGENTS.md`
- `ARCHITECTURE.md`
- `DESIGN.md`
- `design/IMPLEMENTATION.md`
- `design/data-source-matrix.md`
- `design/reference/situm-explore-interactive-prototype.html`
- this plan

## Reference sections for this plan

When the user has populated the HTML, inspect the sections representing:

- global product visual language and reusable controls;
- public landing page;
- login state;
- register state;
- navigation-arrow brand mark;
- desktop/mobile behavior for those surfaces.

Selector/class names in the user's HTML may change when they replace the placeholder. **Do not assume old prototype selectors exist.** Identify the relevant sections from the actual current HTML.

## Phase 1 — Visual tokens and brand

- [ ] Confirm the canonical HTML is populated; stop if it is still placeholder-only.
- [ ] Audit current Nuxt UI `app/app.config.ts` and `app/assets/css/main.css` after Phase 0.
- [ ] Preserve light-only behavior.
- [ ] Identify the populated reference's neutral hierarchy, semantic accents, border treatment, radii, typography scale, spacing rhythm, and shadow restraint.
- [ ] Express those decisions primarily through Nuxt UI semantic configuration/app config and existing utility classes.
- [ ] Add the approved navigation-arrow product mark as a small Vue/local SVG component if the populated reference still uses it.
- [ ] Do not create a second design system.
- [ ] Do not copy prototype classes or stylesheet blocks into production.

Acceptance: common Nuxt UI primitives can reproduce the populated reference's visual language without page-by-page styling drift.

## Phase 2 — Landing page

Target: `/`.

Before implementing, inspect the full landing composition in the **current populated HTML**.

Match its actual:

- navigation structure;
- hero hierarchy/proportions;
- CTA hierarchy;
- product-preview composition;
- content-section density;
- final CTA/footer treatment;
- responsive reflow.

Tasks:

- [ ] Replace the current auth-only root page with the populated reference's approved public landing composition.
- [ ] Use Nuxt links/routes for navigation and auth CTAs.
- [ ] Keep landing content static; no backend endpoint is required.
- [ ] If a real session exists, provide an appropriate route to the authenticated workspace without breaking the approved composition.
- [ ] Compare desktop and mobile output against the populated HTML before completion.

Do not add marketing sections that are not represented by the populated reference.

## Phase 3 — Real login page

Target: `/login`.

Before implementing, inspect the login state in the current populated HTML.

Reuse existing production behavior:

- `/api/auth/login`;
- `useUserSession()`;
- current error response;
- current session handling.

Rules:

- [ ] Match the populated reference's login layout, hierarchy, fields, feedback, and responsive behavior using Nuxt UI form primitives.
- [ ] Keep labels/autocomplete accessible.
- [ ] Preserve submit loading/disabled behavior.
- [ ] Preserve real inline authentication errors.
- [ ] Successful login enters the authenticated app route defined by the implementation roadmap.
- [ ] Logged-in visitors should not be forced through another fake login.
- [ ] Never copy dummy authentication logic from the HTML even if its prototype accepts arbitrary credentials.

Do not modify authentication backend unless a real regression is discovered.

## Phase 4 — Dummy register page

Target: `/register`.

Before implementing, inspect the registration state in the current populated HTML.

There is no registration/account backend in current scope.

- [ ] Match the reference's form composition and responsive behavior using Nuxt UI form primitives.
- [ ] Use local validation/demo state only.
- [ ] No database insert.
- [ ] No new Drizzle table/migration.
- [ ] No registration API route.
- [ ] Do not fake a durable authenticated account/session.
- [ ] Prefer a safe prototype completion state or route to real login when auth middleware requires a real session.
- [ ] Never claim a real account was created.

## Phase 5 — Responsive/accessibility/validation

- [ ] Re-check the populated HTML's desktop and mobile behavior before the final pass.
- [ ] Mobile nav/auth layout works without overflow.
- [ ] Keyboard/focus behavior works.
- [ ] CTA links use real Nuxt navigation.
- [ ] Nuxt implementation materially matches the populated HTML without copying its code architecture.
- [ ] Architecture still follows `ARCHITECTURE.md`; do not let UI implementation create feature-specific folder conventions ad hoc.
- [ ] Document any deliberate deviation caused by accessibility/framework constraints.
- [ ] `git diff --check`.
- [ ] `npm run lint`.
- [ ] `npm run typecheck`.
- [ ] `npm run build`.
- [ ] Update plan + `.agents/` before each completed phase commit.
- [ ] Commit/push each completed phase.
- [ ] No PR until explicit authorization.

## Non-goals

- authenticated sidebar/app feature pages;
- new auth model;
- registration backend;
- Situm API expansion;
- analytics backend;
- copying the reference HTML/CSS/JS into production;
- speculative services/repositories/global state/layers.

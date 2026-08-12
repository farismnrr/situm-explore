# Plan 004 — UI Foundation, Landing, Login & Register

Status: planned
Branch: `plan/004-ui-foundation-public-auth`
Depends on: merged foundation; populated `design/reference/situm-explore-interactive-prototype.html` required before visual Phase 1+

## Goal

First align the small existing application with the repository's Nuxt 4 architecture contract, then establish the approved visual foundation and implement the public/auth entry flow using the existing Nuxt/Vue/Nuxt UI stack without changing the existing authentication backend.

This plan must finish in a usable state on its own. It must **not** redirect users to `/app` yet because the `/app/**` route tree is created by Plan 005.

## Architecture contract

Read `ARCHITECTURE.md` before changing code.

Architecture principles for this plan:

- Nuxt 4 conventions first;
- KISS over ceremonial layers;
- SOLID responsibility boundaries where they are real;
- DRY only after meaningful repetition;
- no speculative service/repository/store architecture;
- preserve behavior while moving files.

## Phase 0 — Nuxt 4 architecture alignment

**This phase may execute while the canonical HTML still contains `Hello World`.** It is architecture/setup-only and must not make visual/design decisions from the missing reference.

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

- [x] Read `ARCHITECTURE.md` and inspect the current tree before moving files.
- [x] Migrate the Vue application files into Nuxt 4's `app/` structure using file moves/renames rather than duplicate copies.
- [x] Keep `server/`, `shared/`, `public/`, `drizzle/`, `nuxt.config.ts`, and `drizzle.config.ts` at repository root as appropriate.
- [x] Move the real Situm viewer into `app/components/situm/SitumViewer.vue` without changing its SDK lifecycle.
- [x] Move the current shell into `app/components/app/AppShell.vue` only as an interim location; Plan 005 replaces it with the authenticated app layout. Do not keep both shell architectures afterward.
- [x] Move DB initialization from `server/utils/db.ts` to `server/db/client.ts` and update server imports. Keep `server/db/schema.ts` and the Drizzle tooling path stable.
- [x] Keep existing API URLs unchanged: `/api/auth/login`, `/api/me`, `/api/situm/status`.
- [x] Do not add `server/services/`, `server/repositories/`, `shared/`, Pinia, a generic API client, or Nuxt layers unless a concrete current need is discovered. Empty architecture folders are not required.
- [x] Ensure `nuxt.config.ts` continues to resolve `~/assets/css/main.css` after `~` points at the Nuxt 4 `app/` source directory.
- [x] Preserve the current `/` and `/dashboard` routes during this architecture-only phase.
- [x] Verify auth middleware, login, `/api/me`, and Situm Viewer imports still resolve after moves.

### Optional local Situm building discovery

If local `.env` has `NUXT_PUBLIC_SITUM_API_KEY` but `NUXT_PUBLIC_SITUM_BUILDING_ID` is blank:

1. Read the key from ignored local `.env` without printing or persisting its value.
2. Call `GET https://api.situm.com/api/v1/buildings` with header `X-API-KEY`.
3. Inspect returned building names and IDs.
4. If exactly one intended building is unambiguous, write only its ID to ignored local `.env` as `NUXT_PUBLIC_SITUM_BUILDING_ID`.
5. If multiple buildings make the target genuinely ambiguous and there is no existing local/project evidence that identifies the POC building, do not guess silently; surface the candidate names/IDs for user selection.
6. Never commit `.env`, the API key, or credential-bearing command output.

The discovery is setup only. Do not turn it into a new application endpoint or UI feature.

Validation:

- [x] `git diff --check`.
- [x] `npm run lint`.
- [x] `npm run typecheck`.
- [x] `npm run build`.

Acceptance:

- current behavior is preserved;
- Vue app code lives under Nuxt 4 `app/`;
- server/database code remains root `server/`;
- old duplicate root `pages/`, `components/`, `middleware/`, and `assets/` application trees are gone;
- no speculative architecture was introduced.

After Phase 0, stop before Phase 1 if the canonical HTML is still placeholder-only.

## Mandatory reference-first protocol for Phase 1+

Canonical visual/interaction reference:

`design/reference/situm-explore-interactive-prototype.html`

### Hard stop when placeholder is present

Before visual UI implementation, open the canonical HTML.

If it still contains only placeholder content such as `Hello World`, stop after architecture/setup work. Do not infer design from Plan 003, memory, generic SaaS patterns, deleted design docs, or agent taste.

### When the HTML is populated

For every visual phase:

1. Open the exact relevant section of the canonical HTML first.
2. Understand hierarchy, proportions, spacing, typography, responsive behavior, interaction states, and action priority.
3. Treat HTML/CSS/JS only as UI/UX evidence, not production architecture.
4. Inspect current Nuxt behavior before changing it.
5. Translate reference intent to Nuxt UI primitives, Vue composition, and Nuxt routing.
6. Use small custom CSS only for genuine fidelity gaps after Nuxt UI/Tailwind options are exhausted.
7. Compare the resulting Nuxt page against the same HTML section before completing the phase.

Production implementation order:

1. Nuxt UI primitive;
2. Nuxt UI props/variants/slots/semantic tokens/app config + existing utilities;
3. composition of Nuxt UI primitives;
4. small Vue component when reuse/readability is real;
5. narrow centralized custom CSS only if necessary.

Do not paste prototype CSS, recreate its `.btn`/`.card`/`.pill` system, or copy its JavaScript screen-switching logic.

## Required reading

- `AGENTS.md`
- `ARCHITECTURE.md`
- `DESIGN.md`
- `design/IMPLEMENTATION.md`
- `design/data-source-matrix.md`
- `design/reference/situm-explore-interactive-prototype.html`
- `.env.example` and the Situm setup section in `README.md` for Phase 0 environment handling
- this plan

## Reference sections for this plan

When the HTML is populated, inspect the sections representing:

- global product visual language and reusable controls;
- public landing page;
- login state;
- register state;
- navigation-arrow brand mark;
- desktop/mobile behavior for those surfaces.

Selector/class names may change when the user replaces the placeholder. Do not assume an old selector exists; locate the actual current section semantically.

## Phase 1 — Visual tokens and brand

- [ ] Confirm the canonical HTML is populated.
- [ ] Audit `app/app.config.ts` and `app/assets/css/main.css` after Phase 0.
- [ ] Preserve light-only behavior.
- [ ] Extract the reference's neutral hierarchy, semantic accents, border treatment, radii, typography scale, spacing rhythm, and restrained shadows.
- [ ] Express those decisions primarily through Nuxt UI semantic configuration/app config and existing utilities.
- [ ] Add the navigation-arrow product mark as a small Vue/local SVG component if it remains in the populated reference.
- [ ] Do not create a second design system or copy prototype stylesheet blocks.

Acceptance: common Nuxt UI primitives reproduce the reference language without page-by-page styling drift.

## Phase 2 — Landing page

Target: `/`.

Before implementation, inspect the full landing composition in the current populated HTML.

Match its actual navigation, hero hierarchy/proportions, CTA hierarchy, product preview, content density, final CTA/footer treatment, and responsive reflow.

Tasks:

- [ ] Replace the current auth-only root page with the approved public landing composition.
- [ ] Use Nuxt links/routes for navigation and auth CTAs.
- [ ] Keep landing content static; no backend endpoint is required.
- [ ] Auth CTAs route to `/login` or `/register`.
- [ ] If a real session exists during Plan 004, the authenticated continuation must still use the existing `/dashboard` route. Do **not** point to `/app` before Plan 005 creates it.
- [ ] Compare desktop/mobile output against the HTML.

Do not add marketing sections not represented by the populated reference.

## Phase 3 — Real login page

Target: `/login`.

Before implementation, inspect the login state in the current populated HTML.

Reuse existing production behavior:

- `/api/auth/login`;
- `useUserSession()`;
- current error response;
- current session handling.

Rules:

- [ ] Match layout, hierarchy, fields, feedback, and responsive behavior with Nuxt UI form primitives.
- [ ] Keep labels/autocomplete accessible.
- [ ] Preserve submit loading/disabled behavior and real inline auth errors.
- [ ] **During Plan 004, successful login continues to existing `/dashboard`.** Plan 005 owns the atomic migration to `/app`.
- [ ] Logged-in visitors to `/login` should continue to `/dashboard` rather than seeing a fake login.
- [ ] Never copy dummy `anything works` authentication from the HTML.

Do not modify the authentication backend unless a real regression is discovered.

## Phase 4 — Dummy register page

Target: `/register`.

Before implementation, inspect the registration state in the current populated HTML.

There is no registration/account backend in current scope.

- [ ] Match the reference form composition and responsive behavior using Nuxt UI form primitives.
- [ ] Use local validation/demo state only.
- [ ] No DB insert, Drizzle migration, or registration API route.
- [ ] Do not fake a durable authenticated account/session.
- [ ] Successful demo completion should clearly route the user to real `/login` or show a local completion state; never claim a real account was created.

## Phase 5 — Responsive/accessibility/final validation

- [ ] Re-check populated HTML desktop/mobile behavior.
- [ ] Mobile landing/auth layout has no overflow.
- [ ] Keyboard/focus behavior works.
- [ ] CTA links use real Nuxt navigation.
- [ ] Login still succeeds into `/dashboard` at the end of this plan.
- [ ] Existing `/dashboard` remains authenticated and the real Situm Viewer remains reachable.
- [ ] Nuxt output materially matches the populated HTML without copying its code architecture.
- [ ] Architecture still follows `ARCHITECTURE.md`.
- [ ] Document deliberate accessibility/framework deviations.
- [ ] `git diff --check`.
- [ ] `npm run lint`.
- [ ] `npm run typecheck`.
- [ ] `npm run build`.
- [ ] Update plan + `.agents/` before each completed phase commit.
- [ ] Commit/push each completed phase.
- [ ] No PR until explicit authorization.

## Non-goals

- creating `/app/**` routes before Plan 005;
- authenticated sidebar/app feature pages;
- new auth model;
- registration backend;
- Situm feature/API expansion beyond the already-working viewer;
- analytics backend;
- copying reference HTML/CSS/JS into production;
- speculative services/repositories/global state/layers.

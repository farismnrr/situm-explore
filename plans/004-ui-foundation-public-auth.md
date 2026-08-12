# Plan 004 — UI Foundation, Landing, Login & Register

Status: planned
Branch: `plan/004-ui-foundation-public-auth`
Depends on: merged foundation + approved `design/ui-reference.html`

## Goal

Establish the visual foundation from the approved HTML reference and implement the public/authenticated entry flow without changing the existing authentication backend.

## Required reading

- `AGENTS.md`
- `DESIGN.md`
- `design/ui-reference.html`
- `design/IMPLEMENTATION.md`
- `.agents/design/*`

The approved HTML reference is the visual source of truth. Do not redesign it.

## Phase 1 — Visual tokens and brand

- [ ] Audit current Nuxt UI app config and global CSS from Plan 003.
- [ ] Preserve light-only behavior.
- [ ] Translate prototype neutrals, borders, radii and spacing into Nuxt UI semantic configuration/global CSS.
- [ ] Add the approved navigation-arrow product mark as a small reusable brand component.
- [ ] Remove the `S` lettermark anywhere it appears in new UI.
- [ ] Do not add a new design-system package.

Acceptance: global primitives can reproduce the reference without page-specific hardcoded design drift.

## Phase 2 — Landing page

Target: `/`.

- [ ] Replace the current auth-only root page with the approved public landing composition.
- [ ] Implement sticky light nav, brand, Product/Operations/Analytics/About anchors and auth CTAs.
- [ ] Implement hero hierarchy and product-preview window from reference.
- [ ] Implement compact feature sections and final CTA only to the level represented by the reference; do not expand marketing scope.
- [ ] CTA routes: Sign in -> `/login`; Start prototype -> `/register`.
- [ ] If session already exists, show a quiet `Open workspace` action rather than forcing login.

Data: static.
Backend: none.

## Phase 3 — Real login page

Target: `/login`.

Reuse existing production behavior:

- `/api/auth/login`;
- `useUserSession()`;
- current error response;
- current session handling.

Tasks:

- [ ] Match split-panel auth design on desktop and single-panel design on mobile.
- [ ] Use approved brand mark.
- [ ] Keep proper labels/autocomplete.
- [ ] Preserve submit loading/disabled state.
- [ ] Preserve inline auth errors.
- [ ] Successful login -> `/app`.
- [ ] Logged-in visitor -> provide `Open workspace` rather than another login attempt.

Do not modify authentication backend unless a regression is discovered.

## Phase 4 — Dummy register page

Target: `/register`.

There is no registration/account backend in current scope.

- [ ] Implement approved registration form and validation UI.
- [ ] Make it explicit in code that registration is prototype-only.
- [ ] No database insert, no new Drizzle table, no new API route.
- [ ] On valid submit, use a local demo continuation flow that navigates to `/app` only if that does not interfere with real auth middleware; otherwise show a `Registration is demo-only; use Sign in` completion state.
- [ ] Prefer the safer behavior if middleware requires a real session.

Acceptance: page visually matches reference without pretending a real account was created.

## Phase 5 — Responsive/accessibility/validation

- [ ] Mobile nav and auth layout work without overflow.
- [ ] Keyboard/focus behavior works.
- [ ] CTA links are real Nuxt links/routes.
- [ ] `git diff --check`.
- [ ] `npm run lint`.
- [ ] `npm run typecheck`.
- [ ] `npm run build`.
- [ ] Update plan + `.agents/` before each phase commit.
- [ ] Commit/push each phase.
- [ ] No PR until explicit authorization.

## Non-goals

- authenticated sidebar/app pages;
- new auth model;
- registration backend;
- Situm API expansion;
- analytics backend.

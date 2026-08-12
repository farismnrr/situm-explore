# Plan 004 — UI Foundation, Landing, Login & Register

Status: planned
Branch: `plan/004-ui-foundation-public-auth`
Depends on: merged foundation + approved `design/reference/situm-explore-interactive-prototype.html`

## Goal

Establish the visual foundation from the approved HTML reference and implement the public/authenticated entry flow without changing the existing authentication backend.

## Mandatory HTML-first implementation protocol

Canonical visual/interaction reference:

`design/reference/situm-explore-interactive-prototype.html`

**Do not start Vue/Nuxt implementation before reading this HTML file.**

For every phase in this plan:

1. Open/read the canonical HTML reference first.
2. Locate the exact prototype section named below.
3. Inspect its HTML structure, CSS variables/classes, visual hierarchy, responsive rules, and JavaScript interaction behavior.
4. Write down the relevant implementation mapping in the active-plan notes if anything is ambiguous.
5. Only then translate that section into Nuxt/Vue/Nuxt UI.
6. Reuse existing project behavior where it already exists; the HTML is a UI/interaction reference, not backend architecture.
7. Compare the implemented page against the same HTML section before marking the phase complete.

Do not reinterpret the reference from memory. Do not use generic SaaS inspiration as a substitute for reading the file.

### Prototype sections required for this plan

- Global visual foundation: `:root`, reusable `.brand`, `.brand-mark`, `.btn*`, `.card`, `.pill`, `.field`, input/select styles, responsive media queries.
- Landing page: `#screen-landing` including `.public-nav`, `.hero`, `.hero-grid`, `.hero-window`, trust strip, feature sections, analytics teaser, CTA and footer.
- Login/register: `#screen-auth` including `.auth-page`, `.auth-art`, `.auth-panel`, `.auth-tabs`, `#loginPane`, `#registerPane`, and the login/register JavaScript flow.
- Brand mark: use the navigation-arrow SVG from `.brand-mark`; never restore the old `S` lettermark.

## Required reading

- `AGENTS.md`
- `DESIGN.md`
- `design/reference/situm-explore-interactive-prototype.html`
- `design/IMPLEMENTATION.md`
- `.agents/design/*`

The approved HTML reference is the visual source of truth. Do not redesign it.

## Phase 1 — Visual tokens and brand

HTML reference to inspect first: global `:root` tokens and reusable component classes at the top of the canonical prototype.

- [ ] Read the canonical HTML reference before editing Nuxt files.
- [ ] Audit current Nuxt UI app config and global CSS from Plan 003.
- [ ] Preserve light-only behavior.
- [ ] Translate prototype neutrals, borders, radii, spacing, typography hierarchy and restrained shadows into Nuxt UI semantic configuration/global CSS.
- [ ] Add the approved navigation-arrow SVG as a small reusable brand component matching `.brand-mark` dimensions/weight.
- [ ] Remove the `S` lettermark anywhere it appears in new UI.
- [ ] Reproduce common button/card/pill/input density closely enough that later pages do not need independent visual reinvention.
- [ ] Do not copy the HTML's CSS architecture literally if Nuxt UI semantics provide a cleaner equivalent.
- [ ] Do not add a new design-system package.

Acceptance: global primitives can reproduce the reference without page-specific hardcoded design drift, and a side-by-side inspection of common primitives is visually close.

## Phase 2 — Landing page

Target: `/`.

**Before implementing this phase, read `#screen-landing` in the canonical HTML reference from its opening element through the public footer.**

Pay particular attention to:

- sticky translucent light navigation;
- hero column proportions and typography scale;
- CTA hierarchy;
- product-preview browser/window composition;
- trust strip density;
- feature-card spacing and icon treatment;
- operations/analytics sections;
- dark final CTA block;
- mobile breakpoints and how the hero becomes one column.

Tasks:

- [ ] Replace the current auth-only root page with the approved public landing composition.
- [ ] Implement sticky light nav, brand, Product/Operations/Analytics/About anchors and auth CTAs.
- [ ] Implement hero hierarchy and product-preview window from reference.
- [ ] Implement compact feature sections and final CTA only to the level represented by the reference; do not expand marketing scope.
- [ ] CTA routes: Sign in -> `/login`; Start prototype -> `/register`.
- [ ] If session already exists, show a quiet `Open workspace` action rather than forcing login.
- [ ] Compare desktop and mobile output against `#screen-landing` before marking complete.

Data: static.
Backend: none.

## Phase 3 — Real login page

Target: `/login`.

**Before implementing this phase, inspect `#screen-auth`, `.auth-art`, `.auth-panel`, `.auth-box`, `#loginPane`, and the prototype `loginForm` JavaScript.**

Reuse existing production behavior:

- `/api/auth/login`;
- `useUserSession()`;
- current error response;
- current session handling.

The prototype accepts any dummy credentials, but production Nuxt **must not** copy that fake authentication behavior. Match only the visual/interaction design while retaining the real login backend.

Tasks:

- [ ] Match split-panel auth design on desktop and single-panel design on mobile.
- [ ] Match auth heading, supporting copy, field rhythm, tabs and button hierarchy from HTML.
- [ ] Use approved brand mark.
- [ ] Keep proper labels/autocomplete.
- [ ] Preserve submit loading/disabled state.
- [ ] Preserve inline real auth errors while styling them like the reference.
- [ ] Successful login -> `/app`.
- [ ] Logged-in visitor -> provide `Open workspace` rather than another login attempt.
- [ ] Compare against the HTML login state before marking complete.

Do not modify authentication backend unless a regression is discovered.

## Phase 4 — Dummy register page

Target: `/register`.

**Before implementing this phase, inspect the same `#screen-auth` container with `#registerPane`, registration fields, tab behavior, responsive layout and submit interaction.**

There is no registration/account backend in current scope.

- [ ] Implement approved registration form and validation UI.
- [ ] Match the prototype's desktop/mobile composition and field grouping.
- [ ] Make it explicit in code that registration is prototype-only.
- [ ] No database insert, no new Drizzle table, no new API route.
- [ ] On valid submit, use a local demo continuation flow that navigates to `/app` only if that does not interfere with real auth middleware; otherwise show a `Registration is demo-only; use Sign in` completion state.
- [ ] Prefer the safer behavior if middleware requires a real session.
- [ ] Do not pretend a real account was created.
- [ ] Compare against the HTML register state before marking complete.

Acceptance: page visually matches reference without pretending a real account was created.

## Phase 5 — Responsive/accessibility/validation

Re-read the prototype's `@media` blocks before this pass; do not invent breakpoints solely from desktop output.

- [ ] Mobile nav and auth layout work without overflow.
- [ ] Keyboard/focus behavior works.
- [ ] CTA links are real Nuxt links/routes.
- [ ] Desktop landing/auth hierarchy materially matches the canonical HTML.
- [ ] Mobile landing/auth hierarchy materially matches the canonical HTML.
- [ ] Document any deliberate deviation caused by accessibility/framework constraints.
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

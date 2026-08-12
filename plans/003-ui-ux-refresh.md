# Plan 003 — UI/UX Refresh

Status: in progress
Scope: visual and interaction refresh of the existing web foundation
Direction: clean minimalist SaaS, light mode only
Principle: improve clarity, hierarchy, polish, and responsiveness without inventing product complexity.

## Goal

Refresh the current login and authenticated dashboard so Situm Explore feels like a clean, calm, modern SaaS product while preserving the existing Nuxt/Nitro/auth/PostgreSQL/Situm behavior.

The work should improve the current surfaces, not redesign the application architecture or introduce self-improvement domain features yet.

## Required design context

Before editing UI, read and follow:

1. `AGENTS.md`
2. `DESIGN.md`
3. `.agents/design/README.md`
4. `.agents/design/design-principles.md`
5. `.agents/design/ui-guide.md`
6. `.agents/design/references.md`
7. this plan

Reference products are quality cues only. Do not pixel-copy them.

## Git execution

Follow `.agents/protocols/git-workflow.md`.

Use branch:

```text
plan/003-ui-ux-refresh
```

Use the normal repository working directory. Do **not** create a linked Git worktree.

Start from the latest fetched `origin/main`:

```bash
git status --short
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c plan/003-ui-ux-refresh origin/main
```

If the branch already exists, inspect and reuse it safely. Do not recreate or force it.

No pull request may be created until the user explicitly asks for one.

---

# Phase 1 — Audit current UI and lock the visual baseline

Inspect before changing:

- `app.vue`
- `assets/css/main.css`
- `pages/index.vue`
- `pages/dashboard.vue`
- `components/SitumViewer.vue`
- current Nuxt UI/Nuxt configuration

Current surface inventory should remain intentionally small:

1. login/home page;
2. authenticated dashboard shell;
3. account/logout action;
4. database/application status;
5. Situm viewer;
6. loading/error states.

- [x] Confirm no extra application navigation currently justifies a sidebar.
- [x] Keep a simple top application bar + content canvas for this phase.
- [x] Inspect the current official Nuxt UI theming APIs before configuring global tokens/defaults.
- [x] Define the implementation baseline using Nuxt UI semantic primary/neutral colors, text/background/border tokens, shared radius, and container sizing.
- [x] Keep the existing/system font stack unless a concrete readability/brand reason justifies another dependency.
- [x] Record any durable visual-system decision before committing.

Acceptance:

- [x] No unnecessary navigation or new component architecture is introduced.
- [x] The visual baseline follows `DESIGN.md` and `.agents/design/`.

---

# Phase 2 — Enforce light-only appearance and global theme

The product is intentionally light mode only.

- [x] Configure Nuxt UI/color mode so the application consistently renders light.
- [x] Do not add a theme toggle.
- [x] Avoid dead dark-mode-specific classes/configuration.
- [x] Ensure initial browser/page rendering uses a light color scheme without a dark flash.
- [x] Configure a restrained neutral palette plus one primary accent using Nuxt UI semantics.
- [x] Set shared radius/container/global surface decisions centrally where supported.
- [x] Keep success/warning/error colors semantic and secondary to the main palette.

Acceptance:

- [x] Login and dashboard remain light regardless of system dark preference.
- [x] Global visual values are centralized rather than duplicated across pages.

---

# Phase 3 — Refresh the login experience

Keep authentication behavior unchanged while improving clarity and polish.

- [x] Use a focused, vertically balanced auth layout on a light page background.
- [x] Keep the auth surface narrow and readable on desktop while responsive on mobile.
- [x] Add visible field labels with Nuxt UI form primitives; do not rely on placeholders as labels.
- [x] Improve title/supporting copy hierarchy without turning the page into a marketing landing page.
- [x] Use one obvious full-width primary sign-in action.
- [x] Add submit loading/disabled behavior so duplicate submissions are discouraged.
- [x] Keep useful inline login errors and make their visual treatment calm but clear.
- [x] Preserve password-manager/autofill semantics.
- [x] When already logged in, provide one clean continue-to-dashboard action.

Acceptance:

- [x] Login feels like a polished SaaS auth screen without unnecessary illustration/marketing content.
- [x] Mobile and desktop layouts are both comfortable.
- [x] Existing auth success/failure behavior is preserved.

---

# Phase 4 — Build the minimal authenticated app shell

The current information architecture does not justify a sidebar.

- [x] Add/compose a compact light top bar for product identity and account/logout action.
- [x] Keep shell chrome visually quieter than the Situm content.
- [x] Use a responsive centered content area with consistent horizontal padding.
- [x] Keep logout accessible but visually secondary.
- [x] Avoid adding fake navigation destinations, command palettes, breadcrumbs, or settings menus.
- [x] If a reusable shell component/layout materially reduces duplication, keep it small and concrete; do not create abstraction layers for hypothetical future pages.

Acceptance:

- [x] The authenticated app has clear orientation without a heavy dashboard frame.
- [x] Shell works from mobile through desktop without horizontal overflow.

---

# Phase 5 — Recompose dashboard hierarchy around the Situm viewer

The map/viewer is the primary product content for the current app.

- [x] Replace the foundation-style stack of generic cards with a clearer content hierarchy.
- [x] Give the Situm viewer substantially more viewport space on desktop.
- [x] Keep a practical responsive minimum height on mobile/tablet.
- [x] Make database/application connectivity a compact secondary status rather than a dominant card.
- [x] Use concise human-readable labels; avoid exposing technical implementation detail more prominently than necessary.
- [x] Keep account identity in the app shell instead of duplicating it in dashboard content.
- [x] Do not add fake KPIs, charts, activity feeds, or widgets.

Acceptance:

- [x] User attention naturally lands on the map.
- [x] Operational state remains visible but secondary.
- [x] Dashboard feels useful even though the product scope is still intentionally small.

---

# Phase 6 — Polish Situm viewer loading/error/ready states

Preserve the hardened `MAP_IS_READY` behavior.

- [x] Do not regress truthful readiness semantics from Plan 002.
- [x] Style loading state so it occupies stable map space and does not cause layout jump.
- [x] Use a subtle skeleton/spinner/message appropriate to the viewer surface.
- [x] Keep error state in-context with concise error copy.
- [x] If a safe retry/reload action is straightforward with the current SDK lifecycle, add it; otherwise do not invent complexity.
- [x] Ready state should remove temporary feedback cleanly.
- [x] Keep viewer border/radius/surface styling aligned with the global UI system.
- [x] Do not add custom map overlays or controls without a real feature requirement.

Acceptance:

- [x] Loading, error, and ready are visually clear and consistent.
- [x] No false-ready regression is introduced.

---

# Phase 7 — Responsive and accessibility pass

Review the implemented UI as a system rather than fixing isolated desktop screenshots.

- [ ] Check mobile phone layout.
- [ ] Check tablet/small laptop layout.
- [ ] Check desktop layout.
- [ ] Ensure no accidental horizontal overflow.
- [ ] Verify keyboard navigation and logical tab order.
- [ ] Verify visible focus treatments.
- [ ] Verify all form controls have accessible labels.
- [ ] Verify icon-only actions have accessible names if any exist.
- [ ] Ensure statuses/errors are not communicated by color alone.
- [ ] Check readable contrast in light mode.
- [ ] Keep motion minimal and non-essential.

Acceptance:

- [ ] Core login/dashboard flow is usable without a mouse.
- [ ] Layout hierarchy survives smaller screens rather than merely shrinking.

---

# Phase 8 — Final validation and closeout

No CI or unit-test framework is required for this plan.

- [ ] `git diff --check`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] Manual login success check.
- [ ] Manual login error-state check.
- [ ] Manual authenticated dashboard check.
- [ ] Manual Situm loading -> `MAP_IS_READY` check.
- [ ] Manual responsive check at mobile and desktop widths.
- [ ] Confirm application stays light-only under system dark preference.
- [ ] Confirm no auth/database/Situm behavior was intentionally changed by this visual plan.
- [ ] Confirm no secrets are staged or committed.
- [ ] Update active plan and relevant `.agents/` context before the final phase commit.
- [ ] Commit and push each completed phase according to the Git protocol.
- [ ] Do not create a PR until explicitly authorized.

---

## Explicit non-goals

- No self-improvement domain features.
- No new domain/database tables.
- No native/mobile application.
- No CI setup.
- No unit-test framework.
- No dark mode.
- No custom design-system package.
- No sidebar until real navigation requires it.
- No marketing landing page redesign.
- No fake dashboard metrics.
- No unrelated auth/database/Situm refactor.

## Definition of done

Plan 003 is complete when Situm Explore's existing login and authenticated dashboard feel like one coherent, clean minimalist light-mode SaaS product; the Situm viewer is visually primary; feedback states are polished; mobile/desktop behavior is sound; accessibility basics hold; Nuxt quality gates pass; and no product or infrastructure scope has leaked into the visual refresh.

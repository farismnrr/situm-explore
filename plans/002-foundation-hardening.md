# Plan 002 — Foundation Hardening

Status: in progress
Scope: harden the completed web foundation before starting product/self-improvement features
Principle: fix concrete foundation risks without expanding architecture.

## Goal

Close the small security, reproducibility, and configuration gaps found during the post-foundation review so the next plan can focus on product behavior instead of infrastructure cleanup.

This plan must stay narrow. Do not add self-improvement domain models, native/mobile work, CI, unit-test infrastructure, or unrelated refactors.

## Git execution

Follow `AGENTS.md` and `.agents/protocols/git-workflow.md`.

Use branch:

```text
plan/002-foundation-hardening
```

Use the normal repository working directory. Do **not** create a linked Git worktree for this plan.

Start from the latest fetched `origin/main`:

```bash
git status --short
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c plan/002-foundation-hardening origin/main
```

If the branch already exists, reuse it safely instead of recreating/forcing it.

No pull request may be created until the user explicitly asks for one.

---

# Phase 1 — Public repository / resource exposure decision

The repository is currently public and contains committed building floorplan JPEGs plus metadata that maps the local assets to Situm building/floor identifiers.

Do not silently assume this exposure is acceptable.

- [x] Confirm current repository visibility before changing anything: the repository is public.
- [x] Inventory committed building resources and metadata that were publicly reachable.
- [x] Confirm the intended policy: building floorplans and related metadata must not remain public (user-stated, 2026-08-12).
- [x] Remove the current-tree resources and add an ignore rule to prevent accidental recommit.
- [x] Remember: deleting a file in a new commit does not remove its historical Git blob.
- [x] Do not rewrite Git history or change repository visibility without explicit user authorization.

Acceptance:

- [x] Resource visibility policy is explicit and persisted.
- [x] No destructive history rewrite or visibility change happened implicitly.

---

# Phase 2 — Situm browser credential boundary

Status: complete (2026-08-12)

The browser Map Viewer requires a client-visible credential, but the browser should not receive a broad discovery/admin key if a least-privilege viewer key is available.

- [x] Inspect local Situm credential usage without printing or persisting credential values.
- [x] Verify current official Situm Map Viewer/browser key guidance: the SDK requires an API key in browser initialization and exposes viewer readiness events.
- [x] Confirm the configured local key as read-only and approved for browser use (user-stated, 2026-08-12).
- [x] Use the confirmed read-only credential under `NUXT_PUBLIC_SITUM_VIEWER_API_KEY`.
- [x] Keep discovery/admin/server credentials out of `runtimeConfig.public`.
- [x] Document that no manual key action is required; the existing credential was not copied or exposed.
- [x] Update `.env.example`, README, and runtime references for the explicit viewer credential boundary.

Acceptance:

- [x] Browser credential exposure is intentional and least-privilege; the user confirmed the existing configured key is read-only and approved for the browser viewer.
- [x] No broad server/admin credential is exposed to the browser by the application configuration.

---

# Phase 3 — Make Nuxt ESLint reproducible from a clean clone

Status: complete

The foundation uses `@nuxt/eslint` and imports generated `.nuxt/eslint.config.mjs`. Make sure the Nuxt module actually generates that config reliably.

- [x] Register `@nuxt/eslint` in `nuxt.config.ts` using the current recommended Nuxt setup.
- [x] Keep one flat-config ESLint setup; do not introduce a parallel legacy config.
- [x] Verify a clean generated state can produce the expected Nuxt ESLint config.
- [x] Run `npm run lint` and require zero lint errors.

Acceptance:

- [x] Fresh clone/install does not rely on stale local `.nuxt` output for lint configuration.
- [x] `npm run lint` passes.

---

# Phase 4 — Make Situm viewer readiness truthful

Status: complete

Do not mark the viewer ready just because `viewer.create(...)` returned without a synchronous exception.

- [x] Inspect the current Situm SDK viewer lifecycle/events; installed `@situm/sdk-js` exposes `ViewerEventType.MAP_IS_READY` (`app.map_is_ready`) and `APP_ERROR` events via `viewer.on(...)`.
- [x] Wait for the current supported viewer/map-ready event before setting UI state to `ready`.
- [x] Keep a clear loading state until the viewer is actually ready.
- [x] Surface initialization/runtime errors clearly with Nuxt UI.
- [x] Avoid adding a generalized event bus or abstraction layer.
- [x] If `/api/situm/status` remains, make its semantics explicit: configuration-present is not viewer-ready.

Acceptance:

- [x] Dashboard reports Situm ready only after the SDK signals real readiness.
- [x] Missing config, initialization failure, runtime failure, and ready states are distinguishable.

---

# Phase 5 — Remove fake PostgreSQL schema configurability

Status: complete

The committed migration owns the fixed `situm_explore` schema. Runtime config should not pretend a different schema can be selected when committed migrations do not follow that choice.

Preferred direction: keep the application-owned schema fixed as `situm_explore` until a real multi-schema requirement exists.

- [x] Remove `DB_SCHEMA` from `.env.example` and setup docs.
- [x] Define the Drizzle schema with the fixed `situm_explore` name.
- [x] Remove `runtimeConfig.dbSchema` because it was unused by runtime queries.
- [x] Scope `drizzle.config.ts` explicitly to `situm_explore` instead of environment-driven schema selection.
- [x] Do not generate a destructive migration merely because config was simplified.
- [x] Inspect the existing migration and confirm it still matches the intended fixed schema.
- [x] Keep `DATABASE_URL` configurable.

Acceptance:

- [x] Runtime queries and migrations agree on the same fixed application schema.
- [x] No unrelated PostgreSQL object is touched.

---

# Phase 6 — Reconcile completed plan history

Status: complete

Plans 000 and 001 are marked complete but contain stale unchecked items. Plans are persistent execution history, so status and checkboxes should not contradict each other.

- [x] Review unchecked items in `plans/000-resource-gathering.md` against actual implementation/session evidence.
- [x] Review unchecked vertical-slice items in `plans/001-web-foundation.md` against actual smoke-test evidence; none remained unchecked.
- [x] Mark items complete only when evidence supports it.
- [x] Mark intentionally skipped/non-applicable optional items explicitly as deferred/N/A.
- [x] Keep historical blockers/discovery truthful; do not rewrite history to look cleaner.
- [x] Update `.agents/state.md` so only current work is presented as active.

Acceptance:

- [x] Completed plans no longer contain misleading status/checklist contradictions.
- [x] Deferred optional work remains explicitly visible.

---

# Phase 7 — Final validation and closeout

No CI or unit-test framework is required for this plan.

- [ ] `git diff --check`
- [ ] Clean lockfile install validation with `npm ci` when practical.
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] Manual unauthenticated `/api/me` check still rejects access.
- [ ] Manual authenticated `/api/me` check still reaches Drizzle/PostgreSQL.
- [ ] Manual Situm dashboard check reaches the real SDK ready state with local config.
- [ ] No secrets are staged or committed.
- [ ] Update relevant `.agents/` files before final phase commit.
- [ ] Commit and push every completed phase according to the Git protocol.
- [ ] Do not open a PR until explicitly authorized.

---

## Explicit non-goals

- No self-improvement product/domain tables yet.
- No native/mobile app.
- No CI setup.
- No unit-test framework.
- No account-management expansion.
- No unrelated refactor.

## Definition of done

This plan is complete when the current Nuxt foundation has an explicit resource-visibility policy, a least-privilege Situm browser credential boundary, reproducible lint setup, truthful viewer readiness, one fixed PostgreSQL schema contract, reconciled plan history, and passing local quality gates.

After that, the next plan may start the first actual self-improvement product behavior.

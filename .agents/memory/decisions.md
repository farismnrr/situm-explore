# Decisions

This file contains **currently active durable decisions**. Historical/superseded details belong in session logs and completed plans, not as competing active instructions.

## 2026-08-12 — Repo-native agent context

- Root `AGENTS.md` stays concise and routes persistent context into `.agents/`.
- `.agents/` owns durable state/memory/protocols; architecture/design guidance stays in root contracts.
- Session history is chronological evidence; durable stores contain current truth.
- Never persist credentials, API keys, passwords, tokens, or unnecessary sensitive data.

Status: active.

## 2026-08-12 — Full-stack Nuxt architecture

- Build one full-stack Nuxt 4 web application with Nitro server routes; native/mobile is separate scope.
- Use Nuxt UI for production UI, `nuxt-auth-utils` for configured-owner auth/session, and PostgreSQL/Drizzle only for application-owned data in schema `situm_explore`.
- Use Nuxt-native `app/`, `server/`, and genuinely shared `shared/` boundaries.
- KISS is the default tie-breaker. Do not add generic repositories/services, DI, global stores, layers, generic API clients, caches, or workers without concrete need.

Status: active.

## 2026-08-13 — Web vs native Situm boundary

- The product is a web operations/admin/exploration console.
- Web may own verified Map Viewer interaction, cartography reads, static directions, realtime monitoring, reports, read-only organization/users/groups/alarms, and verified Viewer settings.
- Device indoor positioning/bluedot, sensor/permission handling, and movement-aware navigation/rerouting belong to a future native roadmap.
- Web may consume positions produced by devices; it must not claim the browser itself performs Situm indoor positioning.
- Situm-domain UI without a truthful real/product owner is removed rather than kept permanently fake.

Status: active.

## 2026-08-13 — Situm credential/security boundary

The final Situm credential model intentionally uses exactly two keys:

- `NUXT_PUBLIC_SITUM_API_KEY` — browser-visible credential used only by the current Map Viewer integration. Use the minimum Situm permission that supports the retained Viewer behavior.
- `NUXT_SITUM_API_KEY` — single private Nitro credential for all server-side Situm operations currently implemented or explicitly approved later.
- Do not maintain separate read/write private environment variables unless a future concrete requirement justifies reintroducing that complexity.
- Every protected product `/api/situm/*` route requires the existing Situm Explore session.
- Never expose `NUXT_SITUM_API_KEY` to browser code, public runtime config, logs, docs, or error payloads, and never create a generic unauthenticated Situm proxy.
- `NUXT_PUBLIC_SITUM_BUILDING_ID` may remain public because it is an identifier, not a secret.
- `NUXT_PUBLIC_APP_URL` had no real runtime consumer and was removed instead of being kept as documented-but-unused configuration.

Status: active — final two-key credential model implemented and runtime-verified by Plan 016A.

## 2026-08-13 — Evidence-backed Situm integration

- **No evidence, no implementation.** External Situm behavior must be evidence-backed, not memory-backed.
- Prototype labels, historical plans, fixtures, similar APIs, and model recollection are not sufficient evidence.
- Verify the exact endpoint/SDK method, installed-SDK compatibility where relevant, web/native ownership, browser/server ownership, auth/permission, request inputs, consumed response/event fields, and relevant failure/empty/stale semantics.
- If a material part is not verified, keep the capability `UNRESOLVED`/absent instead of guessing or fabricating success.
- Lack of an `@situm/sdk-js` wrapper is **not** proof that the official Situm REST API lacks a capability. Nitro may call a verified official REST endpoint directly when that is the smallest correct path.

Status: active.

## 2026-08-13 — Plans 010–016A integrated lineage

- Plans 010–016 were explicitly executed as stacked plan branches, each continuing from the previous completed HEAD.
- Plan 016A continued the same cumulative lineage as the small credential/config/runtime closeout.
- PR #8 integrated the complete Plans 010–016A lineage into `main`.
- `main` is now canonical; there is no active plan branch.
- Historical plan branches no longer own current authority and may be deleted after integration because their commits are contained in `main`.
- Do not restart or recreate Plans 010–016A from historical branches.
- The old `plan/017-situm-credential-split-runtime-verification` branch/name was superseded by Plan 016A and is disposable.

Status: active/completed-and-integrated.

## 2026-08-13 — Plan 016A credential/runtime closeout

- Plan 016A was a small hardening/closeout step for Plans 010–016 rather than a new substantive feature domain.
- Final scope: enforce the two-key Situm model, reconcile environment/docs/runtime consumers, perform real authenticated runtime smoke, and capture evidence for unresolved Reports/Groups/Alarms without implementing a broad new feature domain.
- Runtime smoke was completed with configured Situm credentials: implemented read paths returned real success responses where data existed, truthful empty/error behavior was observed where applicable, unauthorized/missing-credential behavior was verified, and no private credential leaked through responses/logs/client bundles.
- Reports, Groups, and Alarms remain evidence-gated follow-up candidates; substantive implementation belongs in a future plan only if justified.
- Plan 016A was integrated into `main` through PR #8 and is closed.

Status: complete/integrated.

## 2026-08-13 — Post-stack implementation truth

- Plan 011 implemented verified Buildings/Floors/POIs/Categories reads and map selection context.
- Plan 012 implemented verified Geofence/Path reads; route-result/details/constraints remain unresolved/absent.
- Plan 013 implemented current-position monitoring; stale/offline semantics, Viewer overlay, trajectory/follow remain unresolved/absent.
- Plan 014 was skipped-unresolved; report endpoint paths/purpose now have partial evidence, but exact schema/filter/permission/runtime mapping remains insufficient for implementation.
- Plan 015 implemented Organization + Users reads; Groups + Alarms remain unresolved/absent pending exact REST evidence.
- Plan 016 implemented verified Viewer language, font size, accessibility panel, and location picker actions.
- Plan 016A completed the final two-key credential model, configuration cleanup, static/security validation, and live Situm runtime smoke for the implemented server read paths.
- Full hydrated browser automation of every Viewer interaction was not required for Plan 016A closeout; retained Viewer commands remain bounded by their verified Plan 016 contract.

Status: active current truth.

## 2026-08-12 — Git workflow default

- One plan = one dedicated `plan/<number>-<slug>` branch in the normal repository working directory.
- Never implement a plan directly on `main`.
- Each completed phase updates plan/relevant `.agents`, validates, commits, and pushes.
- PR creation/integration is user-gated.
- Normal sequential dependencies start from updated `main` after integration; explicit stacked execution is allowed only when the user authorizes it and current durable state records it.
- After a plan lineage is integrated, historical plan branches may be deleted; `main` becomes the canonical starting point for future work.

Status: active.

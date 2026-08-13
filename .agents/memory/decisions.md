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

- Browser Viewer behavior uses `NUXT_PUBLIC_SITUM_API_KEY` only while the current Viewer implementation requires a browser-visible credential; this public key is not the backend REST credential.
- Private Nitro read operations use `NUXT_SITUM_READ_API_KEY`, intended for a Situm **Only Read** key.
- Private Nitro mutations use `NUXT_SITUM_WRITE_API_KEY`, intended for a Situm **Read and Write** key, and must remain unused unless a real approved mutation requires it.
- `NUXT_SITUM_API_KEY` was the temporary compatibility variable for the pre-split Nitro implementation; Plan 016A Phase 1 removed it entirely from code and `.env.example` after migrating every current Nitro read to `NUXT_SITUM_READ_API_KEY`.
- Every protected product `/api/situm/*` route requires the existing Situm Explore session.
- Never expose private read/write credentials to browser code, logs, docs, or error payloads, and never create a generic unauthenticated Situm proxy.
- `NUXT_PUBLIC_SITUM_BUILDING_ID` may remain public because it is an identifier, not a secret.
- `NUXT_PUBLIC_APP_URL` had no real runtime consumer; Plan 016A Phase 2 removed it from `nuxt.config.ts` and `.env.example` rather than keeping it as documented-but-unused.

Status: active — credential split implemented (Plan 016A Phase 1 complete); Phase 2 documentation now reflects implemented state.

## 2026-08-13 — Evidence-backed Situm integration

- **No evidence, no implementation.** External Situm behavior must be evidence-backed, not memory-backed.
- Prototype labels, historical plans, fixtures, similar APIs, and model recollection are not sufficient evidence.
- Verify the exact endpoint/SDK method, installed-SDK compatibility where relevant, web/native ownership, browser/server ownership, auth/permission, request inputs, consumed response/event fields, and relevant failure/empty/stale semantics.
- If a material part is not verified, keep the capability `UNRESOLVED`/absent instead of guessing or fabricating success.
- Lack of an `@situm/sdk-js` wrapper is **not** proof that the official Situm REST API lacks a capability. Nitro may call a verified official REST endpoint directly when that is the smallest correct path.

Status: active.

## 2026-08-13 — Plans 010–016 explicit stacked execution

- The user explicitly authorized Plans 010–016 to execute as **stacked plan branches**, with each next branch created from the completed previous plan HEAD.
- This stack intentionally did **not** require intermediate integration into `main`.
- No PR and no merge to `main` were authorized for the stack.
- One plan still owns one branch; no force-push/history rewrite is implied.
- The stacked sequence has completed through `plan/016-situm-viewer-settings-integration`, which is the cumulative current implementation lineage.
- Do not restart Plan 010 or recreate Plans 011–016 from `main`.

Status: active/completed-sequence.

## 2026-08-13 — Plan 016A credential split/runtime verification

- The credential/runtime follow-up is **Plan 016A**, not Plan 017, because it is a small hardening/closeout step for the Plans 010–016 stack rather than a new substantive feature domain.
- Active branch: `plan/016a-situm-credential-split-runtime-verification`.
- It continues the cumulative Plan 016 lineage and preserves the preparation commits briefly created under the superseded Plan 017 draft.
- It owns migration from the temporary generic private Situm key to separate private read-only and read-write credentials plus runtime smoke verification.
- `.env.example` and runtime consumers must match exactly after the migration; documented-but-unused and used-but-undocumented configuration is treated as a gap.
- Runtime smoke must be real; static lint/typecheck/build cannot substitute for configured Situm API/Viewer/session verification.
- Reports, Groups, and Alarms are evidence-capture only in Plan 016A; substantive implementation belongs in Plan 017 or later if justified.
- The old `plan/017-situm-credential-split-runtime-verification` name/branch is superseded and must not be executed as a separate roadmap step.

Status: active.

## 2026-08-13 — Post-stack implementation truth

- Plan 011 implemented verified Buildings/Floors/POIs/Categories reads and map selection context.
- Plan 012 implemented verified Geofence/Path reads; route-result/details/constraints remain unresolved/absent.
- Plan 013 implemented current-position monitoring; stale/offline semantics, Viewer overlay, trajectory/follow remain unresolved/absent.
- Plan 014 was skipped-unresolved; report endpoints exist in official REST, but exact schema/filter/permission/runtime mapping still needs follow-up before implementation.
- Plan 015 implemented Organization + Users reads; Groups + Alarms remain unresolved/absent pending exact REST/runtime verification.
- Plan 016 implemented verified Viewer language, font size, accessibility panel, and location picker actions.
- Runtime manual Situm API/Viewer smoke remains pending because the execution environment did not have the configured credentials plus authenticated session required to exercise the live integration.

Status: active current truth.

## 2026-08-12 — Git workflow default

- One plan = one dedicated `plan/<number>-<slug>` branch in the normal repository working directory.
- Never implement a plan directly on `main`.
- Each completed phase updates plan/relevant `.agents`, validates, commits, and pushes.
- PR creation/integration is user-gated.
- Normal sequential dependencies start from updated `main` after integration; explicit stacked execution is allowed only when the user authorizes it and current durable state records it.

Status: active.

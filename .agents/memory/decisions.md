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
- Use Nuxt UI for production UI, `nuxt-auth-utils` for configured-owner auth/session, and PostgreSQL/Drizzle only for application-owned relational data in schema `situm_explore`.
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
- `main` became canonical for the next roadmap baseline.
- Historical plan branches no longer own current authority and may be deleted after integration because their commits are contained in `main`.
- Do not restart or recreate Plans 010–016A from historical branches.
- The old `plan/017-situm-credential-split-runtime-verification` branch/name was superseded by Plan 016A and is disposable.

Status: active/completed-and-integrated.

## 2026-08-13 — Plan 016A credential/runtime closeout

- Plan 016A was a small hardening/closeout step for Plans 010–016 rather than a new substantive feature domain.
- Final scope: enforce the two-key Situm model, reconcile environment/docs/runtime consumers, perform real authenticated runtime smoke, and capture evidence for unresolved Reports/Groups/Alarms without implementing a broad new feature domain.
- Runtime smoke was completed with configured Situm credentials: implemented read paths returned real success responses where data existed, truthful empty/error behavior was observed where applicable, unauthorized/missing-credential behavior was verified, and no private credential leaked through responses/logs/client bundles.
- Reports, Groups, and Alarms remained evidence-gated follow-up candidates after 016A.
- Plan 016A was integrated into `main` through PR #8 and is closed.

Status: complete/integrated.

## 2026-08-13 — Post-stack implementation truth

- Plan 011 implemented verified Buildings/Floors/POIs/Categories reads and map selection context.
- Plan 012 implemented verified Geofence/Path reads; route-result/details/constraints remained unresolved/absent until the new Plan 020 evidence pass.
- Plan 013 implemented current-position monitoring; Viewer realtime overlay/trajectory remained unresolved/absent until the new Plan 019 evidence pass.
- Plan 014 was skipped-unresolved historically; the official report surface is now concrete enough to justify a new Plan 017, but exact consumed filters/fields/runtime behavior must still be re-verified before implementation.
- Plan 015 implemented Organization + Users reads; Groups + Alarms now move to Plan 018 exact-contract/runtime verification.
- Plan 016 implemented verified Viewer language, font size, accessibility panel, and location picker actions.
- Plan 016A completed the final two-key credential model, configuration cleanup, static/security validation, and live Situm runtime smoke for the implemented server read paths.
- PRs #10 and #11 integrated the user's final manual UI/mobile refinement pass into `main`; that updated `main` is the UI baseline for Plans 017–020.

Status: active current truth.

## 2026-08-13 — Plan 017 local ClickHouse analytics architecture

- Plan 017 uses the user's **existing local ClickHouse instance** for Situm analytics/report persistence and querying.
- Do not install/provision another ClickHouse server and do not add Docker/Compose for ClickHouse.
- Safely discover the actual local connection/config during Phase 0 without printing/persisting secrets or asking the user to paste them into chat.
- Inspect the existing instance before creating app-owned objects; never alter/drop unrelated databases/tables.
- Keep ClickHouse server-only behind Nitro. Browser code never connects directly to ClickHouse or receives its credentials.
- PostgreSQL/Drizzle remains the application relational store; ClickHouse is an additional analytics store for Plan 017, not a replacement.
- Use explicit product sync from Situm Reports into ClickHouse for this PoC; do not introduce a background worker/queue/cron just to keep analytics fresh.
- Prefer the official current ClickHouse Node.js client when a client dependency is needed, after verifying the current package/API.

Status: active for Plan 017.

## 2026-08-13 — Plans 017–020 stacked feature roadmap

The user explicitly authorized an unattended stacked execution:

```text
roadmap/017-020-next-features
-> plan/017-situm-analytics-clickhouse
-> plan/018-situm-groups-alarms-read
-> plan/019-situm-realtime-viewer-trajectory
-> plan/020-situm-static-directions
```

- Plan 017: real Situm Reports analytics persisted/queried through local ClickHouse.
- Plan 018: Groups + Alarms read-only integration.
- Plan 019: realtime Viewer overlay and conditional verified trajectory playback.
- Plan 020: static Viewer directions only; no live handset navigation.
- Each next plan branches from the previous plan's final validated/pushed HEAD, not from stale `main`.
- No PR and no merge during the 017–020 execution.
- The configured `worker` subagent owns implementation/tests for each phase; the parent owns orchestration, review, state/plan updates, commits, pushes, and phase/plan transitions.
- If the configured `worker` cannot be spawned, stop instead of substituting another agent/model.
- Otherwise continue automatically through the stack without waiting for user confirmation between phases.
- Optional sub-capabilities explicitly marked conditional may remain unresolved when evidence/runtime is insufficient; core behavior must never be faked to force completion.

Status: active execution authorization.

## 2026-08-12 — Git workflow default

- One plan = one dedicated `plan/<number>-<slug>` branch in the normal repository working directory.
- Never implement a plan directly on `main`.
- Each completed phase updates plan/relevant `.agents`, validates, commits, and pushes.
- PR creation/integration is user-gated.
- Normal sequential dependencies start from updated `main` after integration; explicit stacked execution is allowed only when the user authorizes it and current durable state records it.
- After a plan lineage is integrated, historical plan branches may be deleted; the integrated branch becomes the canonical starting point for future work.

Status: active.

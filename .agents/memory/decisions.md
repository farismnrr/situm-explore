# Decisions

This file contains **currently active durable decisions**. Historical/superseded details belong in session logs and completed plans, not as competing active instructions.

## 2026-08-12 — Repo-native agent context

- Root `AGENTS.md` stays concise and routes persistent context into `.agents/`.
- `.agents/` owns durable state/memory/protocols; architecture/design guidance stays in root contracts.
- Session history is chronological evidence; durable stores contain current truth.
- Never persist credentials, API keys, passwords, tokens, session cookies, or unnecessary sensitive data.

Status: active.

## 2026-08-12 — Full-stack Nuxt architecture

- Build one full-stack Nuxt 4 web application with Nitro server routes; native/mobile is separate scope.
- Use Nuxt UI, `nuxt-auth-utils`, and PostgreSQL/Drizzle for application-owned relational data in schema `situm_explore`.
- Use Nuxt-native `app/`, `server/`, and genuinely shared `shared/` boundaries.
- KISS is the default tie-breaker. Do not add generic repositories/services, DI, global stores, event buses, generic API clients, caches, or workers without concrete need.

Status: active.

## 2026-08-13 — Web vs native Situm boundary

- The product is a web operations/admin/exploration console.
- Web may own verified Map Viewer interaction, cartography reads, static directions, realtime monitoring, reports, and read-only operations/admin views.
- Device indoor positioning/bluedot, sensor/permission handling, current-handset navigation, movement-aware rerouting, and native turn-by-turn behavior remain outside the Nuxt web roadmap.
- Web may consume positions produced by devices; it must not claim the browser performs Situm indoor positioning.
- Situm-domain UI without a truthful real owner is removed rather than kept fake.

Status: active.

## 2026-08-13 — Situm credential/security boundary

The final Situm credential model intentionally uses exactly two keys:

- `NUXT_PUBLIC_SITUM_API_KEY` — browser-visible credential used only by the Map Viewer integration;
- `NUXT_SITUM_API_KEY` — single private Nitro credential for server-side Situm operations.

Rules:

- do not maintain separate private read/write variables without a future concrete requirement;
- protected product `/api/situm/*` routes require the existing application session;
- never expose `NUXT_SITUM_API_KEY` through public runtime config, browser code, logs, docs, tests, built client assets, or error payloads;
- never create a generic unauthenticated Situm proxy;
- `NUXT_PUBLIC_SITUM_BUILDING_ID` may remain public because it is an identifier;
- no mutation is added merely because the private key could support it.

Status: active.

## 2026-08-13 — Evidence-backed Situm integration

- **No evidence, no implementation.** External Situm behavior must be evidence-backed, not memory-backed.
- Verify exact endpoint/SDK method, installed-version compatibility, web/native ownership, browser/server ownership, auth/permission, request inputs, consumed response/event fields, and relevant failure/empty/runtime semantics.
- If a material part is not verified, keep that capability `UNRESOLVED`/absent instead of guessing or fabricating success.
- Lack of an `@situm/sdk-js` wrapper is not proof the official REST API lacks a capability; Nitro may call a verified official REST endpoint directly when that is the smallest correct path.

Status: active.

## 2026-08-13 — Plans 010–016A integrated lineage

- Plans 010–016A are complete/integrated and historical for current execution.
- PR #8 integrated the cumulative Plans 010–016A lineage into `main`.
- Do not restart or recreate Plans 010–016A from historical plan branches.
- The old credential-split Plan 017 name was superseded by Plan 016A and is historical only.

Status: complete/integrated.

## 2026-08-13 — Local ClickHouse analytics architecture

- Plan 017 uses the user's existing local ClickHouse instance for Situm analytics/report persistence and querying.
- Do not install/provision another ClickHouse server or add Docker/Compose for it.
- Keep ClickHouse server-only behind Nitro; browser code never connects directly or receives ClickHouse credentials.
- PostgreSQL/Drizzle remains the application relational store; ClickHouse is the analytics store, not a replacement.
- Explicit product sync is sufficient for the PoC; no background worker/queue/cron is required.
- Never alter/drop unrelated ClickHouse databases/tables.

Status: active architecture decision; Plan 017 implementation complete.

## 2026-08-13 — Completed feature lineage through Plan 019

- Plan 017 completed real Situm Reports analytics using local ClickHouse; optional Map Viewer usage/heatmap remain unresolved.
- Plan 018 completed Groups + Alarms read-only integration; group-membership relationships remain unresolved/absent.
- Plan 019 completed realtime Viewer overlay and hydrated Playwright smoke; trajectory remains unresolved/omitted because exact hydrated date/user/empty/error semantics were not verified.
- Final pushed Plan 019 HEAD is `513f65e820635e05a22a54270f3bf21f5925e6c8`.

Status: complete.

## 2026-08-13 — Completed Plan 019A and Plan 020 lineage

The user explicitly changed the stacked roadmap after the first Plan 020 Phase 0 attempt exposed a sequencing problem.

The resulting branch chain is complete and integrated into `main` by PR #12:

```text
roadmap/017-020-next-features
-> plan/017-situm-analytics-clickhouse            [complete]
-> plan/018-situm-groups-alarms-read              [complete]
-> plan/019-situm-realtime-viewer-trajectory      [complete]
-> plan/019a-situm-static-directions-foundation   [complete]
-> plan/020-situm-static-directions-v2            [complete]
```

Plan 019A exists because a real `startDirections(...)` runtime proof could not be performed through the product before the product exposed the minimal verified command surface.

Plan 019A therefore owns both:

1. the smallest production-safe directions wiring whose contracts are already verified; and
2. the hydrated Playwright runtime proof against the real configured Viewer/account.

The earlier `plan/020-situm-static-directions` branch created before 019A is superseded as an execution base and is historical evidence only where still accurate. It is not current authority and must not be merged/cherry-picked into the completed lineage.

Do not delete the stale pre-019A Plan 020 branch unless the user explicitly asks.

Status: complete roadmap decision; current authority is the completed lineage above.

PR #12 merged the cumulative `plan/020-situm-static-directions-v2` branch into `main` at `5163af2a71c92441b01bccb81faac44933a91d1c`. `main` is now the canonical execution baseline; all non-main roadmap/plan branches are historical or superseded and may be removed without replaying their commits.

## 2026-08-13 — Static directions architecture boundary

For Plan 019A and Plan 020:

- static routes use real known Situm POIs/endpoints only;
- current evidence supports numeric Situm POI IDs as route endpoint identifiers for the configured cartography;
- the single `SitumViewer` instance remains the only Viewer owner;
- expose only small typed directions commands; no raw Viewer or generic invoke escape hatch;
- Viewer owns route calculation/rendering;
- `/app/map` route controls remain outside the Viewer canvas;
- no `startNavigation`, `My location`, browser indoor positioning, turn-by-turn guidance, live rerouting, follow-user, save-car, or flight semantics;
- do not invent route distance, duration, steps, instructions, ETA, geometry, completion events, or route-summary payloads;
- unresolved directions events/result details/tag semantics remain absent until exact runtime evidence exists;
- Playwright/Chrome is available locally and should be used for real hydrated directions smoke in Plan 019A.

Status: active.

## 2026-08-13 — Completed worker-only stacked execution

For the completed stacked feature lineage:

- implementation and implementation fixes for each phase are delegated specifically to the configured `worker` subagent;
- parent agent owns orchestration, review, plan/state/session persistence, commits, pushes, and phase/plan transitions;
- use the same worker for targeted follow-up when practical;
- if the configured worker cannot be spawned, stop rather than silently substituting another agent/model;
- no PR and no merge during the stacked run;
- each successor plan starts from the preceding plan's exact final validated/pushed HEAD.

Status: complete historical execution authorization.

## 2026-08-12 — Git workflow default

- One plan = one dedicated `plan/<number>-<slug>` branch in the normal repository working directory.
- Never implement a plan directly on `main`.
- Each completed phase updates plan/relevant `.agents`, validates, commits, and pushes.
- PR creation/integration is user-gated.
- Normal dependent plans start after integration into updated `main`; explicit stacked execution is allowed only when the user authorizes it and current durable state records the exception.
- Historical plan branches may be deleted only after safe containment/integration or explicit user direction.

Status: active.

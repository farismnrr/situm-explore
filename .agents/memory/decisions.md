# Decisions

This file contains **currently active durable decisions**. Historical/superseded details belong in session logs and completed plans, not as competing active instructions.

## 2026-08-12 — Repo-native agent context

- Root `AGENTS.md` stays concise and routes persistent context into `.agents/`.
- `.agents/` owns durable agent state/memory/protocols; architecture/design guidance stays in root contracts to avoid duplicate sources of truth.
- Every conversation runs the persistence pass; session history is chronological evidence, while durable stores contain current truth.
- Never persist credentials, API keys, passwords, or unnecessary sensitive data.

Status: active.

## 2026-08-13 — Plan 010 evidence and credential freeze

- Plan 010 verified `@situm/sdk-js@0.25.0` Viewer/domain declarations against official Situm documentation before changing capability UI.
- Future Nitro Situm REST/domain reads use private runtime variable `NUXT_SITUM_API_KEY`; the historical `NUXT_PUBLIC_SITUM_API_KEY` remains only for the legacy current Viewer until a later safe migration.
- `/api/situm/*` product routes require the existing Situm Explore session; `/api/situm/status` now enforces that boundary and reports private server configuration separately from legacy Viewer configuration, never Viewer readiness.
- Reports beyond trajectory, Groups, Alarms, and unimplemented Viewer settings commands remain evidence-gated and are not presented as working data/actions.

Status: active.

## 2026-08-12 — Full-stack web foundation

- Build web first; native/mobile implementation is deferred.
- Use one full-stack Nuxt application with Nitro server routes rather than a separate backend app.
- Use Nuxt UI as the production component/design foundation.
- Use `nuxt-auth-utils` for the configured-owner authentication/session flow.
- Use PostgreSQL through Drizzle for application-owned data in the fixed `situm_explore` schema.
- Preserve existing real login/session/logout, `/api/me`, and Situm Viewer lifecycle while later product integrations evolve.
- CI and unit-test-runner infrastructure remain deferred; lint is mandatory for code-changing phases, with typecheck/build where active plans require them.

Status: active.

## 2026-08-12 — Nuxt 4 architecture

- Root `ARCHITECTURE.md` is the current application architecture/folder/dependency contract.
- Use Nuxt-native boundaries: browser/application code under `app/`, Nitro/server code under `server/`, genuinely cross-runtime contracts under `shared/`.
- KISS is the default tie-breaker; SOLID applies to real responsibilities and DRY follows meaningful repetition.
- Do not introduce generic repositories/services, DI containers, global stores, layers, generic API clients, or empty architecture folders without a concrete requirement.
- Historical directory-migration instructions are not current architecture work.

Status: active.

## 2026-08-12 — Git and sequential plan execution

- One plan = one dedicated `plan/<number>-<slug>` branch in the normal repository working directory.
- Do not create linked Git worktrees unless explicitly requested.
- Never implement a plan directly on `main`.
- Each completed phase updates its plan/relevant `.agents`, validates, commits, and pushes.
- PR creation/integration is user-gated.
- Sequential dependency plans start from updated `main` only after the dependency is integrated, unless the user explicitly requests stacked execution.

Status: active.

## 2026-08-12 — Canonical UI reference

- `design/reference/situm-explore-interactive-prototype.html` remains historical visual/interaction evidence.
- Production uses Nuxt/Vue/Nuxt UI; prototype HTML/CSS/JS is never production architecture.
- The user manually corrected and accepted the final UI baseline that was later integrated into `main`.
- Visual fidelity no longer outranks capability truthfulness: native-only, fake, unsupported, or ownerless Situm-domain controls may be removed during Plan 010.

Status: active.

## 2026-08-12 — UI-first / dummy-first history

- Plans 004–009 intentionally used typed local fixtures for missing product-domain integrations while preserving the existing real foundation.
- Those fixture decisions describe the historical UI phase, not permanent product behavior.
- `app/data/prototype/` fixtures are transitional and must be removed when their retained UI is replaced by real data or when Plan 010 removes the owning UI.
- Real integration failures must never silently fall back to believable fixture success values.

Status: active.

## 2026-08-13 — Web vs native Situm boundary

- The current product remains a web operations/admin/exploration console.
- Web may own Situm Map Viewer interaction, cartography reads, static directions, realtime monitoring, reports, alarms, users/groups/organization reads, and verified Viewer/config controls.
- Device indoor positioning/bluedot, sensor/permission handling, and motion-aware live navigation/rerouting belong to a separate future native roadmap.
- Web may consume positions produced by devices; it must not claim that the browser itself performs Situm indoor positioning.
- Situm-domain UI that is neither real web capability nor product-owned behavior is removed rather than kept permanently dummy.

Status: active.

## 2026-08-13 — Situm credential/security boundary

- The historical `NUXT_PUBLIC_SITUM_API_KEY` path exists in the accepted baseline only because the initial browser Viewer used it.
- That public credential path is **not** the backend integration contract and must not be reused for new REST/domain calls.
- Future Situm REST/domain integration uses private Nitro runtime credentials behind authenticated `/api/situm/*` routes.
- Every product Situm API route must enforce the existing Situm Explore session; never create a generic unauthenticated Situm proxy.
- A broad Read-Write server credential must never be exposed to browser code.
- Browser Viewer authentication is a separate boundary; Plan 010 verifies the smallest safe mechanism supported by the current Situm SDK before implementation changes.
- `NUXT_PUBLIC_SITUM_BUILDING_ID` may remain public because it is an identifier, not a secret.

Status: active.

## 2026-08-13 — Evidence-backed Situm integration

- External Situm behavior must be evidence-backed, not memory-backed.
- Prototype labels, historical plans, dummy fixture shapes, similar APIs, and model recollection are not sufficient implementation evidence.
- Before implementation, verify the exact official endpoint/SDK method, current installed-SDK compatibility where relevant, web/native availability, browser/server ownership, auth/permission, and fields/events actually consumed.
- If a material part of a capability is not verified, classify it `UNRESOLVED` and do not implement or fake it.
- Plan 010 may not close while an unresolved capability is still presented as a working Situm feature.
- Plans 011–016 may implement only capabilities with exact evidence plus one declared owner.

Status: active.

## 2026-08-13 — Post-UI Situm integration sequence

- Plan 010 owns web capability pruning plus exact capability/security/data ownership mapping.
- Plan 011: Buildings/Floors/POIs/Categories.
- Plan 012: Geofences/Paths/static routing only; no native positioning/navigation.
- Plan 013: realtime monitoring and retained web overlays; no browser positioning engine.
- Plan 014: reports/analytics and real report-derived Home/Dashboard metrics.
- Plan 015: Organization/Users/Groups/Alarms read-only.
- Plan 016: conditional remaining verified web-safe Viewer/config/settings behavior only.
- Native/mobile implementation is explicitly outside Plans 010–016.
- Do not restore UI removed by Plan 010 merely because a later Situm API exposes a related capability.

Status: active.

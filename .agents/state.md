# Current State

_Last reviewed: 2026-08-13_

## Current focus

The Situm backend/web integration roadmap Plans 010–016 has finished its **stacked implementation pass**.

The active follow-up is now:

`plans/017-situm-credential-split-runtime-verification.md`

Active branch:

`plan/017-situm-credential-split-runtime-verification`

Plan 017 was created directly from the final cumulative Plan 016 branch. Do not restart Plans 010–016, recreate their branches from `main`, or replay completed implementation work.

## Roadmap result before Plan 017

- Plan 010 — implementation/review complete; web/native/security/evidence boundary frozen.
- Plan 011 — implementation complete: Buildings/Floors/POIs/Categories reads and map selection context.
- Plan 012 — implementation complete for verified Geofences/Paths reads; static route-result/product mapping remains unresolved and absent.
- Plan 013 — implementation complete for current-position monitoring; stale/offline semantics, Viewer realtime overlay, trajectory/follow remain unresolved and absent.
- Plan 014 — **skipped-unresolved**, not implemented. Official REST report endpoints exist, but exact report filter/schema/permission/runtime mapping still requires follow-up verification and live smoke.
- Plan 015 — implementation complete for Organization + Users reads; Groups + Alarms remain unresolved/absent and require direct REST follow-up evidence/runtime verification.
- Plan 016 — implementation complete for verified Viewer language, font-size, accessibility-panel, and location-picker commands.

## Plan 017 purpose

Plan 017 owns the cross-cutting configuration/runtime follow-up:

1. split Situm credentials into Viewer/public, Nitro read-only, and Nitro read-write responsibilities;
2. migrate current Nitro reads away from temporary `NUXT_SITUM_API_KEY` to `NUXT_SITUM_READ_API_KEY`;
3. keep `NUXT_SITUM_WRITE_API_KEY` private and unused unless a real approved mutation requires it;
4. audit `.env.example` against actual runtime consumers in both directions;
5. perform real authenticated runtime smoke for the existing Situm integrations;
6. revisit Reports/Groups/Alarms through exact official REST evidence rather than assuming missing JS SDK wrappers mean the REST capability is unavailable.

## Credential target

- `NUXT_PUBLIC_SITUM_API_KEY` — browser Viewer only.
- `NUXT_SITUM_READ_API_KEY` — private Nitro read operations; intended Situm role: Only Read.
- `NUXT_SITUM_WRITE_API_KEY` — private Nitro mutations only; intended Situm role: Read and Write.
- `NUXT_PUBLIC_SITUM_BUILDING_ID` — public identifier.
- `NUXT_SITUM_API_KEY` — temporary compatibility variable only; remove after current reads migrate.

Never expose private read/write credentials to browser/public runtime config or logs.

## Validation truth

Plans 010–016 passed static/local validation where applicable:

- `git diff --check`;
- `npm run lint`;
- `npm run typecheck`;
- `npm run build`.

**Runtime Situm smoke is still pending** and is now an explicit Plan 017 responsibility. Do not mark runtime smoke complete without exercising the configured Situm environment.

## Evidence-gated follow-up gaps

The following remain intentionally absent rather than faked until exact evidence/runtime verification exists:

- report/analytics data and CSV integration;
- Groups read integration;
- Alarms read integration;
- static route-result/details/constraints presentation;
- realtime stale/offline semantics and Viewer overlay;
- trajectory/follow semantics;
- unverified generic Viewer config/settings operations.

Official Situm REST documentation confirms Reports, Groups, and Alarms endpoint families exist. Their absence in the current implementation is a follow-up contract/runtime-verification gap, not proof that Situm lacks those capabilities.

## No-hallucination rule

For Situm behavior: **no evidence, no implementation**.

Before adding a missing capability, verify exact official endpoint/SDK method, auth/permission, request parameters, response/event fields, web/native ownership, and relevant failure/empty/stale semantics. If material evidence is missing, keep it unresolved/absent rather than inventing behavior.

## Web/native boundary

The Nuxt product remains the web operations/admin/exploration console.

Native-only scope remains outside this roadmap:

- handset indoor positioning / blue dot from sensors;
- Wi-Fi/BLE positioning and permission handling;
- movement-aware live turn-by-turn navigation/rerouting;
- other mobile-runtime positioning behavior.

Web may consume positions produced by devices; it must not pretend the browser performs Situm indoor positioning.

## Git / branch truth

The user explicitly uses stacked plan branches for this roadmap:

- one plan = one branch;
- a dependent follow-up branch starts from the completed cumulative predecessor when explicitly requested;
- no PR;
- no merge to `main`;
- no force-push/history rewrite.

Plan 017 therefore starts from the cumulative Plan 016 branch, not from `main`.

## Next action

Execute Plan 017 phase-by-phase from the existing branch.

Do not create a PR or merge. Do not reopen Plans 010–016. If remaining REST capabilities become materially larger than credential/runtime verification, capture them as a separate follow-up plan instead of silently broadening Plan 017.

# Current State

_Last reviewed: 2026-08-13_

## Current focus

The Situm backend/web integration roadmap Plans 010–016 has finished its **stacked implementation pass**.

The active small hardening follow-up is:

`plans/016a-situm-credential-split-runtime-verification.md`

Active branch:

`plan/016a-situm-credential-split-runtime-verification`

Plan 016A continues the cumulative Plan 016 lineage and preserves the credential-split preparation commits that were briefly created under a superseded Plan 017 draft. Do not restart Plans 010–016, recreate their branches from `main`, or use the old Plan 017 draft as active authority.

## Roadmap result before Plan 016A

- Plan 010 — implementation/review complete; web/native/security/evidence boundary frozen.
- Plan 011 — implementation complete: Buildings/Floors/POIs/Categories reads and map selection context.
- Plan 012 — implementation complete for verified Geofences/Paths reads; static route-result/product mapping remains unresolved and absent.
- Plan 013 — implementation complete for current-position monitoring; stale/offline semantics, Viewer realtime overlay, trajectory/follow remain unresolved and absent.
- Plan 014 — **skipped-unresolved**, not implemented. Official REST report endpoints exist, but exact report filter/schema/permission/runtime mapping still requires follow-up verification and live smoke.
- Plan 015 — implementation complete for Organization + Users reads; Groups + Alarms remain unresolved/absent and require direct REST follow-up evidence/runtime verification.
- Plan 016 — implementation complete for verified Viewer language, font-size, accessibility-panel, and location-picker commands.

## Plan 016A purpose

Plan 016A owns only the post-stack hardening/verification work:

1. split Situm credentials into Viewer/public, Nitro read-only, and Nitro read-write responsibilities;
2. migrate current Nitro reads away from temporary `NUXT_SITUM_API_KEY` to `NUXT_SITUM_READ_API_KEY`;
3. keep `NUXT_SITUM_WRITE_API_KEY` private and unused unless a real approved mutation requires it;
4. audit `.env.example` against actual runtime consumers in both directions, including stale variables such as `DB_SCHEMA` and potentially unused `NUXT_PUBLIC_APP_URL`;
5. perform real authenticated runtime smoke for the integrations already implemented in Plans 011–016;
6. capture exact evidence for Reports/Groups/Alarms only far enough to decide later plan scope.

Plan 016A does **not** implement the full Reports/Groups/Alarms feature set. Substantive follow-up feature work should start at Plan 017 or later.

## Credential target

- `NUXT_PUBLIC_SITUM_API_KEY` — browser Viewer only.
- `NUXT_SITUM_READ_API_KEY` — private Nitro read operations; intended Situm role: Only Read.
- `NUXT_SITUM_WRITE_API_KEY` — private Nitro mutations only; intended Situm role: Read and Write.
- `NUXT_PUBLIC_SITUM_BUILDING_ID` — public identifier.
- `NUXT_SITUM_API_KEY` — temporary compatibility variable only; remove after current reads migrate.

Never expose private read/write credentials to browser/public runtime config, logs, docs, or error payloads.

## Validation truth

Plans 010–016 passed static/local validation where applicable:

- `git diff --check`;
- `npm run lint`;
- `npm run typecheck`;
- `npm run build`.

**Runtime Situm smoke is still pending** and is now an explicit Plan 016A responsibility. Do not mark runtime smoke complete without exercising the configured Situm environment.

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

Plan 016A therefore continues from the cumulative Plan 016 lineage, not from `main`.

The old `plan/017-situm-credential-split-runtime-verification` branch/name is superseded by Plan 016A and must not be executed as a separate roadmap step.

## Next action

Execute Plan 016A phase-by-phase from the existing branch.

Do not create a PR or merge. Do not reopen Plans 010–016. Keep the scope limited to credential split, environment/runtime verification, and evidence capture; create Plan 017 or later only for substantive new feature implementation.

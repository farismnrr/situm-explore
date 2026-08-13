# Current State

_Last reviewed: 2026-08-13_

## Current focus

The Situm backend/web integration roadmap Plans 010–016 plus the small Plan 016A hardening follow-up are complete on the cumulative branch:

`plan/016a-situm-credential-split-runtime-verification`

Plan 016A continued the cumulative Plan 016 lineage and absorbed the credential/runtime preparation that was briefly drafted under a superseded Plan 017 name. Do not restart Plans 010–016, recreate their branches from `main`, or execute the old Plan 017 credential-split draft as a separate roadmap step.

## Completed roadmap result

- Plan 010 — implementation/review complete; web/native/security/evidence boundary frozen.
- Plan 011 — implementation complete: Buildings/Floors/POIs/Categories reads and map selection context.
- Plan 012 — implementation complete for verified Geofences/Paths reads; static route-result/product mapping remains unresolved and absent.
- Plan 013 — implementation complete for current-position monitoring; stale/offline semantics, Viewer realtime overlay, trajectory/follow remain unresolved and absent.
- Plan 014 — skipped-unresolved; report paths/purpose now have partial evidence, but exact implementation contract remains insufficient.
- Plan 015 — implementation complete for Organization + Users reads; Groups + Alarms remain unresolved/absent pending exact REST evidence.
- Plan 016 — implementation complete for verified Viewer language, font-size, accessibility-panel, and location-picker commands.
- Plan 016A — complete: final Situm credential contract, environment/config cleanup, Nuxt 4 tsconfig cleanup, static/security validation, and live runtime smoke for implemented Situm server reads.

## Final Situm credential contract

Exactly two Situm keys are intentional:

- `NUXT_PUBLIC_SITUM_API_KEY` — browser Viewer credential only.
- `NUXT_SITUM_API_KEY` — single private Nitro credential for all server-side Situm operations.
- `NUXT_PUBLIC_SITUM_BUILDING_ID` — public identifier.

Do not reintroduce separate private read/write keys unless a future concrete requirement justifies that complexity.

All current Nitro Situm operations use the private `NUXT_SITUM_API_KEY`. `/api/situm/status` reports server and Viewer configuration separately without exposing values. The private key must never enter browser/public runtime config, client bundles, logs, docs, or error payloads.

`NUXT_PUBLIC_APP_URL` and `DB_SCHEMA` are not part of the current runtime contract.

## Validation truth

Plan 016A closeout passed:

- `git diff --check`;
- `npm run lint`;
- `npm run typecheck`;
- `npm run build`;
- client-bundle/private-credential leakage checks;
- unauthorized and missing/invalid credential behavior checks;
- real authenticated Situm success-path smoke for cartography, geofences, paths, realtime positions, organization, and users;
- truthful empty/error handling where applicable.

Runtime Situm smoke is complete for the implemented server read paths using configured credentials. No private Situm credential leakage was observed in API responses, logs, or built public client assets.

The retained Plan 016 Viewer command surface remains bounded by its verified Viewer contract. Full browser automation of every hydrated interaction was not required for Plan 016A closeout.

## Evidence-gated follow-up gaps

The following remain intentionally absent rather than faked:

- full Reports/Analytics/CSV implementation;
- Groups read integration;
- Alarms read integration;
- static route-result/details/constraints presentation;
- realtime stale/offline semantics and Viewer overlay;
- trajectory/follow semantics;
- unverified generic Viewer config/settings operations.

Reports, Groups, and Alarms may become Plan 017 or later only if exact official contracts and a concrete product scope justify implementation.

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

## Git / integration truth

Plans 010–016 and 016A were executed as a cumulative stacked lineage without intermediate PRs/merges to `main`.

Plan 016A is now closed and the cumulative branch is ready for user-gated review/integration. Opening a PR is now an appropriate next step if the user chooses to integrate this lineage into `main`.

The old `plan/017-situm-credential-split-runtime-verification` branch/name is superseded and must not be treated as a separate active plan.

## Next action

No further Plan 016A implementation work is required.

Next action is one of:

1. open/review a PR from `plan/016a-situm-credential-split-runtime-verification` into `main`;
2. after integration, start a genuinely new Plan 017+ only for substantive follow-up scope.

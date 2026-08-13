# Current State

_Last reviewed: 2026-08-13_

## Current focus

The Situm backend/web integration roadmap Plans 010–016 has finished its **stacked implementation pass**.

Final cumulative branch:

`plan/016-situm-viewer-settings-integration`

Last implementation HEAD before later documentation-only consistency fixes:

`1931dbfc53be3d748baa840f784c8cbb9d52dae7`

The branch is a direct cumulative descendant of `main` at `170110c1d60c32600e1641a0f89cc53823bba9cc`. Plans 010→011→012→013→014→015→016 were executed as explicit stacked branches: every next plan was based on the completed previous plan HEAD. No PR or merge to `main` was authorized or performed.

Do **not** restart Plan 010, recreate Plans 011–016 from `main`, or interpret stale historical integration wording as a request to repeat this roadmap.

## Roadmap result

- Plan 010 — implementation/review complete; web/native/security/evidence boundary frozen.
- Plan 011 — implementation complete: Buildings/Floors/POIs/Categories reads and map selection context.
- Plan 012 — implementation complete for verified Geofences/Paths reads; static route-result/product mapping remains unresolved and absent.
- Plan 013 — implementation complete for current-position monitoring; stale/offline semantics, Viewer realtime overlay, trajectory/follow remain unresolved and absent.
- Plan 014 — **skipped-unresolved**, not implemented. Official REST report endpoints exist, but exact report filter/schema/permission/runtime mapping still requires follow-up verification and live smoke.
- Plan 015 — implementation complete for Organization + Users reads; Groups + Alarms remain unresolved/absent and require direct REST follow-up evidence/runtime verification.
- Plan 016 — implementation complete for verified Viewer language, font-size, accessibility-panel, and location-picker commands.

## Validation truth

Static/local validation passed on implemented plans where applicable:

- `git diff --check`;
- `npm run lint`;
- `npm run typecheck`;
- `npm run build`.

**Runtime Situm smoke is still pending.** Manual API/Viewer smoke could not be completed in the execution environment because configured local credentials plus an authenticated browser/session were unavailable there. Therefore the roadmap is implementation-complete, not production/runtime-verified.

Do not mark runtime smoke complete without actually exercising the configured Situm environment.

## Current blockers / follow-up gaps

### 1. Runtime environment smoke

Before treating the integration as runtime-verified, confirm locally without printing secrets:

- private `NUXT_SITUM_API_KEY` is configured;
- legacy/current Viewer credential is configured if the Viewer still requires it;
- `NUXT_PUBLIC_SITUM_BUILDING_ID` is configured;
- app authentication/session works;
- protected `/api/situm/*` reads work with the configured Situm organization/building.

### 2. Evidence-gated Situm capabilities

The following are intentionally absent rather than faked:

- report/analytics data and CSV integration;
- Groups read integration;
- Alarms read integration;
- static route-result/details/constraints presentation;
- realtime stale/offline semantics and Viewer overlay;
- trajectory/follow semantics;
- unverified generic Viewer config/settings operations.

Official Situm REST documentation confirms Reports, Groups, and Alarms endpoint families exist. Their absence in the current implementation is therefore a follow-up contract/runtime-verification gap, not proof that Situm lacks those capabilities.

## No-hallucination rule

For Situm behavior: **no evidence, no implementation**.

Before adding a missing capability, verify exact official endpoint/SDK method, auth/permission, request parameters, response/event fields, web/native ownership, and relevant failure/empty/stale semantics. If material evidence is missing, keep it unresolved/absent rather than inventing behavior.

## Web/native boundary

The Nuxt product is the web operations/admin/exploration console.

Native-only scope remains outside this roadmap:

- handset indoor positioning / blue dot from sensors;
- Wi-Fi/BLE positioning and permission handling;
- movement-aware live turn-by-turn navigation/rerouting;
- other mobile-runtime positioning behavior.

Web may consume positions produced by devices; it must not pretend the browser performs Situm indoor positioning.

## Credential/security boundary

- Situm REST/domain reads use private Nitro runtime configuration (`NUXT_SITUM_API_KEY`).
- Protected product `/api/situm/*` routes require the existing Situm Explore session.
- Server credentials never enter browser/public runtime config.
- No generic unauthenticated Situm proxy.
- `NUXT_PUBLIC_SITUM_BUILDING_ID` may remain public.
- Historical `NUXT_PUBLIC_SITUM_API_KEY` remains a legacy Viewer concern only while still required by the current Viewer implementation.

## Git / branch truth

The user explicitly authorized **stacked execution for Plans 010–016** with these rules:

- one plan = one branch;
- next plan starts from the completed previous plan HEAD;
- no PR;
- no merge to `main`;
- no force-push/history rewrite.

That stacked execution is now complete. Treat `plan/016-situm-viewer-settings-integration` as the cumulative current implementation branch until the user explicitly chooses an integration or follow-up strategy.

## Next action

Do not restart Plans 010–016.

Next work should be one of these only when explicitly requested:

1. runtime smoke/repair on the final stacked branch;
2. targeted follow-up for unresolved REST capabilities (Reports/Groups/Alarms/etc.);
3. review/integration strategy for the cumulative branch;
4. a new separately planned feature.

No PR or merge is implied.
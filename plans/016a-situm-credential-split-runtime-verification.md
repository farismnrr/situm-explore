# Plan 016A — Situm Credential Boundary & Runtime Verification

Status: **complete**
Branch: `plan/016a-situm-credential-split-runtime-verification`
Base: final cumulative Plan 016 lineage, preserving the credential/runtime preparation commits previously created under the superseded Plan 017 draft
Depends on: Plans 010–016 stacked implementation pass complete

## Goal

Close out the Plans 010–016 Situm integration stack by enforcing the final two-key Situm credential boundary, cleaning the environment/runtime contract, and runtime-verifying the integrations already implemented.

This is a small post-Plan-016 hardening plan. It does **not** reopen or replay Plans 010–016 and it must not silently become a broad Reports/Groups/Alarms feature plan.

## Required reading

- `AGENTS.md`
- `.agents/README.md`
- `.agents/state.md`
- `.agents/memory/decisions.md`
- `.agents/protocols/git-workflow.md`
- `ARCHITECTURE.md`
- `plans/README.md`
- `design/data-source-matrix.md`
- current `.env.example`
- `nuxt.config.ts`
- current `server/integrations/situm/*`
- current `/api/situm/*` routes
- this plan

## Final credential contract

Exactly two Situm keys are intentional:

- `NUXT_PUBLIC_SITUM_API_KEY` — browser Viewer credential only; use the minimum Situm permission that supports the retained Viewer behavior.
- `NUXT_SITUM_API_KEY` — single private Nitro credential for all server-side Situm operations.
- `NUXT_PUBLIC_SITUM_BUILDING_ID` — public identifier, not a secret.

Rules:

- never expose `NUXT_SITUM_API_KEY` through public runtime config, browser code, logs, docs, tests, or error payloads;
- keep the browser Viewer credential separate from the private Nitro credential;
- do not reintroduce separate private read/write credentials without a concrete future requirement;
- do not add a mutation merely because the server key is capable of it;
- every protected product `/api/situm/*` route continues to require the existing application session.

## Phase 0 — Config inventory and gap check

- [x] inventory every environment variable in `.env.example`;
- [x] inventory every environment variable actually consumed by Nuxt/Drizzle/server/client code;
- [x] classify documented-but-unused and used-but-undocumented variables;
- [x] confirm `DB_SCHEMA` is not part of the current runtime contract;
- [x] confirm the Drizzle schema remains fixed to `situm_explore`;
- [x] remove `NUXT_PUBLIC_APP_URL` after confirming it has no real current consumer;
- [x] migrate the root TypeScript configuration to the proper Nuxt 4 project-reference structure;
- [x] record and resolve config contradictions before final runtime verification.

See `.agents/sessions/016a-phase0-config-inventory.md` for detailed historical findings.

## Phase 1 — Final runtime credential boundary

- [x] use `NUXT_SITUM_API_KEY` as the single private Nitro Situm credential;
- [x] keep `NUXT_PUBLIC_SITUM_API_KEY` Viewer-only;
- [x] keep `NUXT_PUBLIC_SITUM_BUILDING_ID` public as an identifier;
- [x] ensure all current Situm Nitro clients/routes use the private server key;
- [x] keep `/api/situm/status` configuration reporting separated into server and Viewer readiness without exposing credential values;
- [x] remove abandoned read/write-key split wording and configuration from current authority docs.

## Phase 2 — Documentation and durable context

- [x] update `.env.example` to the final implemented two-key contract;
- [x] update README setup/runtime configuration;
- [x] update architecture/security wording where required;
- [x] update `.agents/state.md` and durable decisions;
- [x] ensure current authority docs agree that the two-key model is intentional;
- [x] ensure the superseded Plan 017 credential-split draft is not treated as active work;
- [x] reserve Plan 017 for future substantive scope only.

## Phase 3 — Existing Situm runtime smoke

With configured local credentials and an authenticated Situm Explore session, the implemented paths were exercised without printing or persisting secrets.

Verified:

- [x] `/api/situm/status`;
- [x] Buildings/Floors/POIs/Categories;
- [x] Geofences;
- [x] Paths metadata;
- [x] Realtime positions;
- [x] Organization;
- [x] Users;
- [x] Viewer load and retained Plan 016 Viewer command surface at the locally testable route/config integration level.

For applicable server paths:

- [x] real success responses with configured Situm credentials where data exists;
- [x] truthful empty handling where empty results naturally occur;
- [x] unauthorized application-session behavior;
- [x] missing/invalid Situm credential behavior;
- [x] no secret-bearing API responses or server logs;
- [x] no private Situm credential present in built public client bundles.

Runtime verification used the real configured Situm environment. No test-only unauthenticated login bypass remains in the repository.

Full browser automation of every hydrated Viewer interaction was not required for this closeout; Plan 016 remains the authority for the verified Viewer command contract.

## Phase 4 — Follow-up evidence capture only

Re-check the unresolved REST capabilities discovered during Plans 014–015:

- [x] Reports / Analytics / CSV — paths/purpose partially evidenced; parameter/response/pagination/permission/error contracts remain `UNRESOLVED` for implementation;
- [x] Groups read — `UNRESOLVED` for implementation;
- [x] Alarms read — resource/write evidence exists, but the exact read/list contract remains `UNRESOLVED`.

See `.agents/sessions/016a-phase4-rest-evidence.md` for the historical evidence capture.

Rules:

- absence from `@situm/sdk-js` is not proof the REST capability is unavailable;
- exact official REST evidence is still required before implementation;
- do not add broad feature implementation to 016A;
- substantive implementation belongs in Plan 017 or later if justified;
- if exact evidence remains insufficient, keep the capability `UNRESOLVED` and absent.

## Phase 5 — Validation and closeout

- [x] `git diff --check`;
- [x] `npm run lint`;
- [x] `npm run typecheck`;
- [x] `npm run build`;
- [x] no browser bundle contains the private `NUXT_SITUM_API_KEY` value;
- [x] `.env.example` matches actual implemented consumers;
- [x] current authority docs agree on the final two-key model;
- [x] runtime success/empty/error/security smoke completed for implemented Situm server reads;
- [x] plan + `.agents` persistence reconciled to exact runtime truth;
- [x] completed work committed and pushed to the plan branch;
- [x] no PR or merge was created during plan execution.

## Closeout truth

Plan 016A is complete and requires no further implementation work.

The cumulative branch `plan/016a-situm-credential-split-runtime-verification` is ready for user-gated PR review/integration into `main`.

## Non-goals / follow-up

- full Reports/Analytics domain implementation;
- Groups/Alarms product implementation;
- native/mobile positioning;
- new application DB schema/tables;
- speculative write features;
- account/cartography administration;
- fake fallback data;
- generic proxy/service/repository architecture.

Any substantive next capability should be scoped as Plan 017 or later after this cumulative lineage is reviewed/integrated.

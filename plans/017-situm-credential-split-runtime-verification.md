# Plan 017 — Situm Credential Split & Runtime Verification

Status: **planned-ready**
Branch: `plan/017-situm-credential-split-runtime-verification`
Base: final cumulative Plan 016 branch `plan/016-situm-viewer-settings-integration`
Depends on: Plans 010–016 stacked implementation pass complete

## Goal

Split Situm credentials by responsibility, remove the temporary generic server credential, and verify the current Situm integration against a real configured environment before any further backend expansion.

This plan is cross-cutting infrastructure/runtime work. It does not reopen or replay Plans 010–016.

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

## Credential contract

Target environment contract:

- `NUXT_PUBLIC_SITUM_API_KEY` — browser Viewer credential only; minimum Viewer permission that works for the POC.
- `NUXT_SITUM_READ_API_KEY` — private Nitro credential for Situm read operations; intended role: Only Read.
- `NUXT_SITUM_WRITE_API_KEY` — private Nitro credential for explicitly approved Situm mutations; intended role: Read and Write.
- `NUXT_PUBLIC_SITUM_BUILDING_ID` — public identifier, not a secret.

Temporary compatibility variable:

- `NUXT_SITUM_API_KEY` — remove after every existing Nitro read path has migrated to `NUXT_SITUM_READ_API_KEY`.

Rules:

- never expose read/write server credentials through public runtime config;
- never use the write key for reads when the read key is sufficient;
- never implement a mutation merely because the write key exists;
- no secret values in logs, docs, sessions, tests, or error payloads.

## Phase 0 — Config inventory and gap check

- [ ] inventory every environment variable in `.env.example`;
- [ ] inventory every environment variable actually consumed by Nuxt/Drizzle/server/client code;
- [ ] classify documented-but-unused and used-but-undocumented variables;
- [ ] confirm `DB_SCHEMA` is not part of the current runtime contract;
- [ ] confirm the Drizzle schema remains fixed to `situm_explore`;
- [ ] record any config contradiction before changing runtime behavior.

## Phase 1 — Runtime credential split

- [ ] add private runtime config for `NUXT_SITUM_READ_API_KEY`;
- [ ] add private runtime config for `NUXT_SITUM_WRITE_API_KEY`;
- [ ] keep `NUXT_PUBLIC_SITUM_API_KEY` Viewer-only;
- [ ] migrate all current Situm Nitro read clients/routes to the read key;
- [ ] keep write-key plumbing minimal and unused unless a current approved mutation genuinely requires it;
- [ ] remove `NUXT_SITUM_API_KEY` compatibility plumbing after all reads migrate;
- [ ] update `/api/situm/status` semantics so read/write/viewer configuration is reported separately without exposing values.

## Phase 2 — Documentation and durable context

- [ ] update `.env.example` to the final implemented contract;
- [ ] update README setup/runtime configuration;
- [ ] update `ARCHITECTURE.md` credential/security boundary if required;
- [ ] update `.agents/state.md` and durable decisions;
- [ ] remove stale references that imply one generic private Situm key is still the target architecture.

## Phase 3 — Existing Situm read runtime smoke

With configured local credentials and an authenticated Situm Explore session, verify the current implemented read paths without printing secrets.

At minimum smoke:

- [ ] `/api/situm/status`;
- [ ] Buildings/Floors/POIs/Categories;
- [ ] Geofences;
- [ ] Paths metadata;
- [ ] Realtime positions;
- [ ] Organization;
- [ ] Users;
- [ ] Viewer load and the verified Viewer commands retained by Plan 016.

For each path:

- [ ] verify success with the configured organization/building where data exists;
- [ ] verify truthful empty handling where data does not exist;
- [ ] verify unauthorized app-session behavior;
- [ ] verify missing/invalid Situm credential behavior;
- [ ] verify no secret-bearing error payload/logging.

If the environment cannot perform a required smoke, leave that exact check pending and record the concrete blocker. Do not mark it passed from static validation alone.

## Phase 4 — Remaining REST capability evidence

Revisit unresolved capabilities that official Situm REST exposes but the installed JS SDK may not wrap.

Priority:

- [ ] Reports / Analytics / CSV;
- [ ] Groups read;
- [ ] Alarms read.

Rules:

- absence from `@situm/sdk-js` is not proof the REST capability is unavailable;
- verify exact official REST path, auth, parameters, schema/format, pagination, permissions, and failure behavior;
- use a small Nitro-side direct REST helper only when exact evidence justifies it;
- do not implement speculative UI or mutations;
- if exact evidence remains insufficient, keep the capability `UNRESOLVED` and absent.

This phase may produce a follow-up implementation plan if the scope becomes materially larger than credential/runtime verification. Do not silently expand Plan 017 into a broad feature plan.

## Phase 5 — Validation and closeout

- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] no browser bundle contains `NUXT_SITUM_READ_API_KEY` or `NUXT_SITUM_WRITE_API_KEY`;
- [ ] no current Nitro read depends on removed `NUXT_SITUM_API_KEY`;
- [ ] no read path uses the write key unnecessarily;
- [ ] `.env.example` matches actual implemented consumers;
- [ ] current authority docs agree;
- [ ] update plan + `.agents` persistence;
- [ ] commit and push completed phases;
- [ ] no PR and no merge unless explicitly authorized by the user.

## Stop conditions

Stop the affected phase/capability instead of guessing if:

- branch ancestry is not the cumulative Plan 016 lineage;
- a local dirty working tree cannot be safely attributed;
- official Situm evidence conflicts materially with runtime behavior;
- required permission/auth semantics cannot be verified;
- a runtime smoke would require exposing/logging a secret;
- a remaining capability would significantly broaden the plan beyond credential split/runtime verification.

## Non-goals

- native/mobile positioning;
- new application DB schema/tables;
- broad Situm write features;
- account/cartography administration;
- fake fallback data;
- generic proxy/service/repository architecture;
- PR/merge/integration to `main`.

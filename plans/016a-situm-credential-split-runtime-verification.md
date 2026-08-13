# Plan 016A — Situm Credential Split & Runtime Verification

Status: **planned-ready**
Branch: `plan/016a-situm-credential-split-runtime-verification`
Base: final cumulative Plan 016 lineage, preserving the credential-split preparation commits previously created under the superseded Plan 017 draft
Depends on: Plans 010–016 stacked implementation pass complete

## Goal

Close out the Plans 010–016 Situm integration stack by splitting Situm credentials by responsibility, removing the temporary generic server credential, auditing the environment contract, and runtime-verifying the integrations that are already implemented.

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

## Credential contract

Target environment contract:

- `NUXT_PUBLIC_SITUM_API_KEY` — browser Viewer credential only; minimum Viewer permission that works for the POC.
- `NUXT_SITUM_READ_API_KEY` — private Nitro credential for Situm read operations; intended role: Only Read.
- `NUXT_SITUM_WRITE_API_KEY` — private Nitro credential reserved for explicitly approved Situm mutations; intended role: Read and Write.
- `NUXT_PUBLIC_SITUM_BUILDING_ID` — public identifier, not a secret.

Temporary compatibility variable:

- `NUXT_SITUM_API_KEY` — remove after every existing Nitro read path has migrated to `NUXT_SITUM_READ_API_KEY`.

Rules:

- never expose read/write server credentials through public runtime config;
- never use the write key for reads when the read key is sufficient;
- do not add a mutation merely because the write key exists;
- no secret values in logs, docs, sessions, tests, or error payloads.

## Phase 0 — Config inventory and gap check

- [x] inventory every environment variable in `.env.example`;
- [x] inventory every environment variable actually consumed by Nuxt/Drizzle/server/client code;
- [x] classify documented-but-unused and used-but-undocumented variables;
- [x] confirm `DB_SCHEMA` is not part of the current runtime contract;
- [x] confirm the Drizzle schema remains fixed to `situm_explore`;
- [x] decide whether `NUXT_PUBLIC_APP_URL` has a real current consumer; remove or explicitly classify it if not;
- [x] record any config contradiction before changing runtime behavior.

See `.agents/sessions/016a-phase0-config-inventory.md` for full findings.

## Phase 1 — Runtime credential split

- [x] add private runtime config for `NUXT_SITUM_READ_API_KEY`;
- [x] add private runtime config for `NUXT_SITUM_WRITE_API_KEY`;
- [x] keep `NUXT_PUBLIC_SITUM_API_KEY` Viewer-only;
- [x] migrate all current Situm Nitro read clients/routes to the read key;
- [x] keep write-key plumbing minimal and unused unless an approved mutation genuinely requires it;
- [x] remove `NUXT_SITUM_API_KEY` compatibility plumbing after all reads migrate;
- [x] update `/api/situm/status` semantics so Viewer/read/write configuration is reported separately without exposing values.

## Phase 2 — Documentation and durable context

- [x] update `.env.example` to the final implemented contract;
- [x] update README setup/runtime configuration;
- [x] update `ARCHITECTURE.md` credential/security boundary if required;
- [x] update `.agents/state.md` and durable decisions;
- [x] remove stale references that imply one generic private Situm key is still the target architecture;
- [x] ensure Plan 017 remains unassigned/reserved for future substantive scope.

## Phase 3 — Existing Situm runtime smoke

With configured local credentials and an authenticated Situm Explore session, verify the current implemented paths without printing secrets.

At minimum smoke:

- [ ] `/api/situm/status`;
- [ ] Buildings/Floors/POIs/Categories;
- [ ] Geofences;
- [ ] Paths metadata;
- [ ] Realtime positions;
- [ ] Organization;
- [ ] Users;
- [ ] Viewer load and the verified Viewer commands retained by Plan 016.

For each applicable path:

- [ ] verify success with the configured organization/building where data exists;
- [ ] verify truthful empty handling where data does not exist;
- [ ] verify unauthorized app-session behavior;
- [ ] verify missing/invalid Situm credential behavior;
- [ ] verify no secret-bearing error payload/logging.

If the environment cannot perform a required smoke, leave that exact check pending and record the concrete blocker. Static validation is not a substitute for runtime verification.

## Phase 4 — Follow-up evidence capture only

Re-check the unresolved REST capabilities discovered during Plans 014–015:

- [ ] Reports / Analytics / CSV;
- [ ] Groups read;
- [ ] Alarms read.

For Plan 016A, the goal is only to determine whether exact official REST contracts are sufficiently evidenced for a later implementation plan.

Rules:

- absence from `@situm/sdk-js` is not proof the REST capability is unavailable;
- verify exact official REST path, auth, parameters, response/format shape, pagination, permissions, and failure behavior where available;
- do not add broad feature implementation to 016A;
- if implementation is worthwhile, capture it as Plan 017 or later with explicit scope;
- if exact evidence remains insufficient, keep the capability `UNRESOLVED` and absent.

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

Stop the affected phase instead of guessing if:

- branch ancestry is not the cumulative Plan 016 lineage;
- a local dirty working tree cannot be safely attributed;
- official Situm evidence conflicts materially with runtime behavior;
- required permission/auth semantics cannot be verified;
- a runtime smoke would require exposing/logging a secret;
- unresolved feature implementation would materially broaden this small hardening plan.

## Non-goals

- implementing the full Reports/Analytics domain;
- implementing Groups/Alarms product features;
- native/mobile positioning;
- new application DB schema/tables;
- broad Situm write features;
- account/cartography administration;
- fake fallback data;
- generic proxy/service/repository architecture;
- PR/merge/integration to `main`.

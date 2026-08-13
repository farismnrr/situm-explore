# Plan 015 — Situm Organization, Users, Groups & Alarms Read Integration

Status: **complete**
Branch: `plan/015-situm-organization-alarms-read-integration`
Base: Plan 014 final HEAD `657cb2b` (explicit stacked execution; not integrated into `main`)
Depends on: Plan 014 complete/skipped and available as the stacked parent branch

## Goal

Replace retained Organization/Users/Groups/Alarms fixtures with real Situm **read-only** data where those screens remain useful after Plan 010 pruning.

Do not turn the POC into an account-administration console.

## Required reading

- `AGENTS.md`
- `ARCHITECTURE.md`
- `design/data-source-matrix.md`
- completed Plan 010 capability mapping
- completed Plans 011–014
- current Organization/Users/Alarms implementation
- this plan

## Retained product boundary

Expected retained scope:

- current Situm organization summary using safe non-secret fields;
- Users & Groups directory context, separate from Situm Explore application auth;
- Alarms read-only list/filter/status.

Plan 010 removes credential/key-detail product UI. Do not display API keys, permission secrets, or implementation credential cards.

No create/update/delete users/groups, no organization mutation, and no acknowledge/resolve/create alarm mutation unless a separate explicit future requirement is approved.

## Credential/data path

- All organization/user/group/alarm REST reads use authenticated Nitro routes and private server credential configuration.
- Never expose the server credential or permission details to browser UI.
- Keep Situm directory identities separate from the configured Situm Explore login/session identity.
- No generic Situm admin proxy.

## Phase 1 — Revalidate value and contracts

- [x] Confirm retained screens from Plan 010.
- [x] Verify exact installed SDK read methods and minimal safe UI fields.
- [x] Drop groups/alarms fields and panels with no verified SDK/schema mapping rather than keeping fixtures.

## Phase 2 — Organization

- [x] Replace synthetic organization summary with real safe fields.
- [x] Remove stale POC credential-boundary copy if still present.
- [x] Add truthful loading/empty/error handling.

## Phase 3 — Users & Groups

- [x] Replace verified user directory reads; groups remain unresolved and absent.
- [x] Preserve read-only directory presentation.
- [x] Keep Situm users separate from app login users.

## Phase 4 — Alarms

- [ ] Alarm reads remain unresolved and absent because exact installed/official schema and filters are unavailable.
- [x] No fixture alarm rows or status mutations are presented.
- [x] No mobile-side alarm triggers or mutation controls were added.

## Validation

- [x] no organization/user/group/alarm mutation;
- [x] no credential/key UI;
- [x] no public REST credential;
- [x] no silent fake fallback rows;
- [x] `git diff --check`;
- [x] `npm run lint`;
- [x] `npm run typecheck`;
- [x] `npm run build`;
- [ ] manual API smoke (requires configured Situm credentials/session; unavailable here);
- [x] update plan + `.agents/`, commit/push;
- [x] no PR until user authorization.

## Non-goals

- Situm user administration;
- app account registration/management;
- alarm acknowledgement/resolution;
- API-key management UI;
- native/mobile alarm behavior;
- new application DB tables.

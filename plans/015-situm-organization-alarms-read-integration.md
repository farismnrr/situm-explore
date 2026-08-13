# Plan 015 — Situm Organization, Users, Groups & Alarms Read Integration

Status: planned-later
Branch: `plan/015-situm-organization-alarms-read-integration`
Depends on: Plan 014 complete, reviewed, and integrated into `main`

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

- [ ] Confirm retained screens from Plan 010.
- [ ] Verify exact current read endpoints and minimal UI fields.
- [ ] Drop any field/panel with no useful real mapping rather than keeping a fixture.

## Phase 2 — Organization

- [ ] Replace synthetic organization summary with real safe fields.
- [ ] Remove stale POC credential-boundary copy if still present.
- [ ] Add truthful loading/empty/error handling.

## Phase 3 — Users & Groups

- [ ] Replace directory/group fixtures if retained by Plan 010.
- [ ] Preserve read-only table/detail hierarchy.
- [ ] Do not conflate Situm users with app login users.

## Phase 4 — Alarms

- [ ] Replace alarm fixtures with real read/status data.
- [ ] Preserve read-only filters/status treatment.
- [ ] Do not add mobile-side alarm triggers or mutation controls.

## Validation

- [ ] no organization/user/group/alarm mutation;
- [ ] no credential/key UI;
- [ ] no public REST credential;
- [ ] no silent fake fallback rows;
- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] manual API smoke;
- [ ] update plan + `.agents/`, commit/push;
- [ ] no PR until user authorization.

## Non-goals

- Situm user administration;
- app account registration/management;
- alarm acknowledgement/resolution;
- API-key management UI;
- native/mobile alarm behavior;
- new application DB tables.

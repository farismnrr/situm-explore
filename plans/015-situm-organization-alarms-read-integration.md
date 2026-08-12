# Plan 015 — Situm Organization, Users & Alarms Read Integration

Status: planned-later
Branch: `plan/015-situm-organization-alarms-read-integration`
Depends on: Plan 014 complete, reviewed, and integrated into `main`

## Goal

Replace remaining Organization/Users/Groups/Alarms dummy context with real Situm read data **only where those surfaces are still useful to the POC**, while preserving the accepted UI.

Reuse the same single POC API key. It may have Read & Write permission, but this plan does not perform organization/user/alarm mutations.

## Required reading

- `AGENTS.md`
- `ARCHITECTURE.md`
- `DESIGN.md`
- `design/IMPLEMENTATION.md`
- `design/data-source-matrix.md`
- current canonical Organization/Users/Alarms/shared-detail reference areas
- accepted Nuxt implementation
- Plan 010 mapping notes and completed Plans 011–014
- this plan

## UI-preservation rule

Real Situm metadata must map into the existing accepted UI contract. Do not broaden these pages into admin consoles because the API exposes additional fields/actions.

Old selectors such as `#app-organization`, `#app-users`, `#app-alarms`, and `#detailDrawer` are only locator hints if they still exist in the current user-populated HTML.

## Credential/data-path rules

- Reuse `NUXT_PUBLIC_SITUM_API_KEY`.
- Do not create another Situm key/env variable.
- Never render/log/commit its value.
- Use the data paths chosen by Plan 010.
- Keep Situm organization identities separate from Situm Explore application auth/session users.

## Phases

### Phase 1 — Revalidate mappings/value

- [ ] Re-read accepted Organization/Users/Alarms UI.
- [ ] Revalidate current official read capabilities identified in Plan 010.
- [ ] Confirm which of these surfaces still matter to the POC demo.
- [ ] Explicitly mark any low-value/unsupported surface to remain dummy rather than creating unnecessary backend work.

### Phase 2 — Organization

- [ ] Replace synthetic organization summary only with safe fields required by accepted UI.
- [ ] Preserve current composition.
- [ ] Permission/status wording must remain truthful to the POC (`Read & Write (POC)` or neutral configured wording when shown), never stale `Only Read` copy.
- [ ] Never expose credential/private configuration values.

### Phase 3 — Users & Groups

- [ ] Replace dummy directory/group data only if it still adds POC value.
- [ ] Preserve accepted table/group/detail hierarchy.
- [ ] Keep app auth identity conceptually and technically separate.
- [ ] No create/update/delete membership/user operation.

### Phase 4 — Alarms

- [ ] Replace dummy alarm rows/status only if supported and valuable.
- [ ] Preserve accepted filters/table/status treatment.
- [ ] No acknowledge/resolve/create mutation.
- [ ] Real empty/error states must not silently fall back to dummy success rows.

### Phase 5 — Final read-integration cleanup

- [ ] Remove only fixtures replaced by real data.
- [ ] Keep intentionally dummy/unsupported actions clearly local in source.
- [ ] Verify all integrations still follow `ARCHITECTURE.md` and share the same POC credential contract.
- [ ] Do not create a mutation plan automatically; only add one if the user still wants specific real write actions.

## Validation

- [ ] Plan 014 is integrated in main before branch creation.
- [ ] accepted UI composition remains stable.
- [ ] no organization/user/alarm mutation occurs.
- [ ] no credential leakage.
- [ ] loading/empty/error states are truthful.
- [ ] `git diff --check`.
- [ ] `npm run lint`.
- [ ] `npm run typecheck`.
- [ ] `npm run build`.
- [ ] manual API smoke for integrated domains.
- [ ] update plan + `.agents/`, commit/push phases.
- [ ] no PR until authorized.

## Non-goals

- Situm user administration;
- app account management;
- alarm acknowledgement/resolution;
- API-key management UI;
- new credential architecture;
- new application DB tables;
- automatic write-feature expansion merely because the POC key has Read & Write permission.

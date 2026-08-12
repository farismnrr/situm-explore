# Plan 016 — Situm Viewer, Settings & Write Actions Integration

Status: planned-later-conditional
Branch: `plan/016-situm-viewer-actions-write-integration`
Depends on: Plan 015 complete, reviewed, and integrated into `main`; Plan 010 must have recorded a **go** decision and exact accepted capabilities for this plan

## Goal

Implement only the remaining accepted Situm Viewer/settings/write capabilities that Plans 011–015 did not own and that Plan 010 explicitly determined are still valuable for the POC.

This plan is **conditional**. If Plan 010 records that no remaining accepted capability needs real integration, mark this plan `skipped-not-needed` and do not create its branch.

## Scope source of truth

Before execution, Plan 010 must contain an explicit list such as:

```text
Plan 016 real:
- <accepted Viewer/settings/write capability>
- <accepted Viewer/settings/write capability>

Remain dummy/local:
- <accepted capability intentionally not integrated>
```

Do not invent additional scope in Plan 016.

Potential capabilities may include only those actually present in the accepted canonical HTML/Nuxt UI, for example:

- Viewer POI/favorite behavior not already handled by Plan 011;
- location picker / set-user-location behavior;
- follow/trajectory/navigation helper behavior not already owned by Plans 012–013;
- save-car / navigate-to-car behavior;
- Viewer accessibility/search/preferences;
- map configuration profiles;
- map styles;
- image resources;
- other accepted settings/actions that require a real Situm call;
- narrowly scoped remote mutations explicitly approved by the accepted product UI.

The examples above are **not automatic requirements**.

## Required reading

- `AGENTS.md`
- `ARCHITECTURE.md`
- `DESIGN.md`
- `design/IMPLEMENTATION.md`
- populated canonical HTML reference
- accepted Nuxt implementation after Plans 004–009
- completed Plan 010 capability/ownership mapping
- completed Plans 011–015
- this plan

## UI-preservation rule

For every capability selected by Plan 010:

1. Open the corresponding current canonical HTML state.
2. Inspect the accepted Nuxt control/component/local behavior.
3. Verify current official Situm SDK/REST capability and permission.
4. Replace only the local/dummy action/data path with real behavior.
5. Preserve accepted composition and interaction hierarchy.
6. Add truthful loading/success/error state only where the real operation requires it.

Do not redesign the UI because the real Situm method/API behaves differently. If the capability cannot fit the accepted interaction cleanly, leave it local/dummy and document the deviation.

## Credential and security contract

- Reuse `NUXT_PUBLIC_SITUM_API_KEY`; do not create a second POC credential variable.
- The key may have Read & Write permission for the time-boxed POC.
- Never render/log/commit the key value.
- Browser Viewer actions may use the existing SDK only where the official capability belongs in the Viewer.
- REST operations exposed through new Nitro routes must require the existing Situm Explore authenticated session.
- Do not create a generic Situm proxy.
- Every remote mutation must be triggered by a corresponding accepted user action; no automatic/background writes.

## Phase 1 — Freeze exact implementation scope

- [ ] Confirm Plan 015 is integrated into main.
- [ ] Read Plan 010 go/no-go decision.
- [ ] Copy the exact Plan 016 capability list into this plan's execution notes/checklist before coding.
- [ ] If the list is empty, mark `Status: skipped-not-needed`, update `.agents/`, and stop without creating implementation code.
- [ ] Verify each selected capability against current official Situm docs.
- [ ] Classify each selected capability as browser Viewer SDK vs authenticated Nitro/server REST.

## Phase 2+ — One capability group per phase

For each selected capability group:

- [ ] re-open its accepted HTML/Nuxt state;
- [ ] implement the smallest real integration;
- [ ] preserve existing accepted UI;
- [ ] remove only the dummy/local behavior actually replaced;
- [ ] keep unsupported adjacent controls local rather than broadening scope;
- [ ] handle truthful error/success/loading state;
- [ ] confirm no unrelated remote write occurred;
- [ ] run validation before moving to the next capability group;
- [ ] update plan + `.agents/`, commit, and push the completed phase.

Do not batch unrelated writes/settings into one giant phase merely because the same key can authorize them.

## Final validation

- [ ] Only capabilities explicitly assigned by Plan 010 were implemented.
- [ ] Accepted UI composition remains intact.
- [ ] Every new Nitro route requires existing app session auth.
- [ ] Every remote mutation corresponds to an explicit accepted user action.
- [ ] No credential value appears in logs/UI/repository.
- [ ] No duplicate API/SDK path exists for the same action without reason.
- [ ] Remaining local/dummy controls are documented and do not claim remote success.
- [ ] `git diff --check`.
- [ ] `npm run lint`.
- [ ] `npm run typecheck`.
- [ ] `npm run build`.
- [ ] manual smoke for each implemented real capability.
- [ ] update plan + `.agents/`, commit/push phases.
- [ ] no PR until user authorization.

## Non-goals

- broad admin console;
- automatic synchronization engine;
- background jobs/queues;
- credential/key management UI;
- new database persistence unless a separate concrete requirement is approved;
- implementing Situm capabilities not present in the accepted product UI.

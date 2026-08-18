# Plan 033 execution brief — Native UI/UX Reference Reconciliation

Branch: `plan/033-native-ui-ux-reference-reconciliation`
Base: updated `origin/main` after Plan 032 integration (`f4f729d8bbd10e0bd257423682489c928c74c95b` or later updated main)
Plan: `/home/farismnrr/Projects/situm-explore/plans/033-native-ui-ux-reference-reconciliation.md`
Canonical visual reference: `/home/farismnrr/Projects/situm-explore/design/reference/situm-explore-native-responsive-prototype.html`

Execute the whole plan end-to-end on one dedicated plan branch. Do not stop after each phase for routine approval.

## Required reads

Before implementation read, in order:

1. `/home/farismnrr/Projects/situm-explore/AGENTS.md`
2. `/home/farismnrr/Projects/situm-explore/.agents/state.md`
3. this execution brief
4. `/home/farismnrr/Projects/situm-explore/.agents/memory/decisions.md`
5. `/home/farismnrr/Projects/situm-explore/ARCHITECTURE.md`
6. `/home/farismnrr/Projects/situm-explore/plans/README.md`
7. `/home/farismnrr/Projects/situm-explore/DESIGN.md`
8. `/home/farismnrr/Projects/situm-explore/design/data-source-matrix.md`
9. `/home/farismnrr/Projects/situm-explore/design/reference/situm-explore-native-responsive-prototype.html`
10. `/home/farismnrr/Projects/situm-explore/.agents/evidence/plan-033-ui-reference.md`
11. `/home/farismnrr/Projects/situm-explore/plans/033-native-ui-ux-reference-reconciliation.md`

## Execution contract

- Implement Plan 033 as one coherent UI/UX reconciliation plan, not a new redesign.
- Match the canonical native reference as closely as possible in hierarchy, composition, responsive behavior, wording, density, surfaces, typography, radii, navigation and interaction states.
- Real backend/SDK/security truth always overrides prototype sample data or unsupported interactions.
- Preserve all Plans 028–032 auth/session/workspace/credential/Map/positioning/navigation/Realtime/deep-link/distribution ownership and lifecycle fixes.
- Do not add a second backend, new auth system, event/audit backend for Recent, fake POIs, fake activity, fake permission success, fake route metrics, generic Realtime markers/focus, Share Live Location conflation, presence/freshness classes, or background-location scope.
- Use one shared responsive layout-mode contract across shell and feature screens.
- Phone content must remain reachable with bottom navigation; tablet/POS/wide layouts must be genuinely adaptive rather than a stacked phone layout with a different sidebar.
- Reuse existing authorized backend/cartography data; add no server endpoint merely for cosmetic filtering when existing data is sufficient.
- Recheck exact installed `@situm/react-native` 3.19.2 source before using optional helpers such as MapView POI search/nearby or `followUser`.
- Keep Recent truthful: use an existing proven source if one exists; otherwise ship the final reference-shaped empty/unavailable surface with no fabricated history.
- Keep Realtime factual: device/position identity, real building/floor context, accuracy, coordinates and source time only; selected styling is not presence status.
- Keep Plan 034 carry-over explicitly UNPASSED.

## Phase discipline

For every completed phase:

- self-review the actual diff against the canonical reference and capability authority;
- update `/home/farismnrr/Projects/situm-explore/plans/033-native-ui-ux-reference-reconciliation.md` and `/home/farismnrr/Projects/situm-explore/.agents/evidence/plan-033-ui-reference.md` with truthful evidence;
- update current state/decisions only when runtime/product truth changes;
- run phase-relevant tests/lint/typecheck/build/runtime checks;
- run `git diff --check`;
- commit and push the completed phase;
- continue to the next phase.

Pause only for a real product/security/architecture decision, contradictory capability evidence, impossible required capability, or external access/device/credential gate that prevents truthful implementation. Do not pause for routine implementation choices that the plan already resolves.

## Final validation

At minimum run:

- root tests;
- root lint;
- root typecheck;
- root production build;
- mobile lint;
- mobile typecheck;
- Expo config/doctor under current frozen-version policy;
- clean Expo prebuild when relevant;
- Android `assembleDebug` with `/home/farismnrr/Android/Sdk`;
- focused responsive/search/filter/accessibility regressions;
- emulator/runtime visual checks at representative phone/tablet/POS/wide sizes where executable;
- bounded secret/log/source scan;
- `git diff --check origin/main...HEAD`;
- final full branch diff review against updated `origin/main`.

Final report must list:

- implementation commits;
- visual/reference changes by screen/layout mode;
- deliberate capability-driven deviations from the HTML reference;
- validation results;
- emulator/runtime visual evidence actually obtained;
- every Plan 034 item still explicitly UNPASSED.

Stop before PR/merge.
Do not start Plan 034.

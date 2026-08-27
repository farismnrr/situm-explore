# Current State

_Last reviewed: 2026-08-27_

## Work status

Plan 037 — Web Loading-State Hygiene is the current unintegrated implementation on branch `plan/037-loading-state-hygiene`. The 2026-08-27 review found a common first-render defect: workspace-scoped Nuxt requests using `immediate: false` begin in `idle`, while multiple pages treated only `pending` as loading. This allowed false empty/count/configuration copy to render before skeletons.

Plan 037 now centralizes `idle`/`pending` loading semantics and applies resolved-state precedence across the workspace web surfaces, including Alarms and browser Map. Alarms no longer renders the transient `Select a building` prompt, the Map no longer mounts `SitumViewer` before a real building resolves, and Workspace configuration no longer claims `Not configured` while its read is unresolved. Automated validation passed: 74/74 tests, lint, typecheck, build, and `git diff --check`. No production deployment, PR, or merge has occurred.

Latest **integrated** product work remains PR #35 at merge commit `7a87afb` (`Realtime reliability hardening`). Plan 037 is not integrated yet. Navigation camera/perspective work remains separate future scope.

Continue Plan 037 only from branch `plan/037-loading-state-hygiene`; preserve the already-present local changes that predated this loading-state review. Historical plans, execution briefs, sessions, reviews, and evidence are not current execution instructions.

## Last completed work

Plan 035 closed the Realtime/foreground-positioning lifecycle defect and Android release/distribution polish. Recorded evidence includes:

- shared shell-scoped foreground positioning ownership;
- Android runtime permission gate before Positioning credential use;
- physical POS sensor-backed positioning and own-device server-mediated Realtime PASS for the bounded Plan 035 scope;
- standardized arm64 Android release artifact generation;
- public MinIO Android distribution and logged-out web download;
- final validation captured in `.agents/evidence/plan-035-realtime-remediation-2026-08-18.md`.

Product/runtime details belong in `README.md`, `ARCHITECTURE.md`, `DESIGN.md`, `design/IMPLEMENTATION.md`, `design/data-source-matrix.md`, and `docs/mobile-distribution.md`. Do not duplicate those contracts here unless a temporary work item changes them.

## Historical limitations

Plan 034 was administratively closed without fabricating full acceptance. Plan 035 later proved the specific physical positioning/Realtime path it remediated, but unrelated Plan 034 items that were never exercised remain historical limitations rather than implicit PASS.

These historical limitations are **not an active backlog by default**. A future scoped plan must explicitly reopen any of them.

Other recorded external/deferred items include Google OAuth runtime acceptance, iOS/macOS device/build delivery, and store/association gates. Revalidate current conditions before treating any historical note as a new blocker.

## Security maintenance note

Historical dependency remediation evidence is in `.agents/evidence/security-dependency-remediation.md`. Do not infer current vulnerability status from that snapshot; run a fresh scan for new security work.

## Current execution authority

For future work read:

1. `AGENTS.md`;
2. this file;
3. `.agents/memory/decisions.md` when durable implementation decisions matter;
4. `.agents/protocols/git-workflow.md`;
5. current product docs relevant to the task;
6. an explicitly created active plan.

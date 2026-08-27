# Current State

_Last reviewed: 2026-08-27_

## Work status

Plan 037 — Web Loading-State Hygiene is implementation-complete on `plan/037-loading-state-hygiene`, committed as `cb00201c` and pushed. It centralizes unresolved `idle`/`pending` semantics, removes transient false empty/configuration copy, and gates Alarms/Map/Workspace states behind real resolution. Validation passed with 74/74 tests, lint, typecheck, build, and `git diff --check`. It is not yet integrated or deployed.

Plan 038 — Two-Key Situm Credential Model is now the active stacked implementation on `plan/038-two-key-situm-credentials`, explicitly authorized by the user to proceed after finishing Plan 037 without waiting for integration. The runtime/configuration model now exposes exactly **Only Read** plus **Read & Write**: Only Read powers authenticated browser Viewer, native positioning, and server read paths; Read & Write remains server-only for mutation/admin authority. Dedicated Positioning storage/UI/runtime contracts were removed and a forward migration drops the legacy column. Automated validation passed: 75/75 root tests, root lint/typecheck/build, mobile lint/typecheck, and `git diff --check`.

Plan 038 runtime acceptance is still pending. The generated migration has not been applied to a real database because it drops the legacy encrypted Positioning column, no production deployment has occurred, and no stored/raw Situm secret was accessed. Physical Android confirmation that a real Only Read key produces a Situm fix remains required before calling Plan 038 fully accepted.

Latest **integrated** product work remains PR #35 at merge commit `7a87afb` (`Realtime reliability hardening`). Plans 037–038 are not integrated yet. Navigation camera/perspective work remains separate future scope.

Continue Plan 038 from `plan/038-two-key-situm-credentials`. Historical plans, execution briefs, sessions, reviews, and evidence are not current execution instructions.

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

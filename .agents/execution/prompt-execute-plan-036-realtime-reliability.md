# Execute Plan 036 — Realtime Reliability

Repository root:
`/home/farismnrr/Projects/situm-explore`

Primary plan:
`/home/farismnrr/Projects/situm-explore/plans/036-realtime-reliability.md`

Expected branch:
`plan/036-realtime-reliability`

## Mission

Execute Plan 036 end-to-end to diagnose and remediate the intermittent native Realtime issue on the physical POS. Explore positioning is already known to work; the observed defect is that the authenticated server-mediated Realtime view sometimes contains the device and sometimes returns/shows no reported positions.

Do not guess at the cause. First determine exactly where the chain fails:

`native Situm fix -> Situm Realtime upload -> Situm realtime.getPositions() -> server normalization -> mobile polling/state`

Then implement the smallest coherent reliability fix, validate it repeatedly on the physical POS, and leave the branch ready for user review. Do not open a PR, merge, deploy production, publish a release, or delete branches without a later explicit user instruction.

## Read first — full paths

Read these in order before changing implementation:

1. `/home/farismnrr/Projects/situm-explore/AGENTS.md`
2. `/home/farismnrr/Projects/situm-explore/.agents/identity.md`
3. `/home/farismnrr/Projects/situm-explore/.agents/state.md`
4. `/home/farismnrr/Projects/situm-explore/.agents/README.md`
5. `/home/farismnrr/Projects/situm-explore/.agents/protocols/chat-lifecycle.md`
6. `/home/farismnrr/Projects/situm-explore/.agents/protocols/git-workflow.md`
7. `/home/farismnrr/Projects/situm-explore/.agents/protocols/persistence.md`
8. `/home/farismnrr/Projects/situm-explore/.agents/memory/decisions.md`
9. `/home/farismnrr/Projects/situm-explore/ARCHITECTURE.md`
10. `/home/farismnrr/Projects/situm-explore/DESIGN.md`
11. `/home/farismnrr/Projects/situm-explore/design/IMPLEMENTATION.md`
12. `/home/farismnrr/Projects/situm-explore/design/data-source-matrix.md`
13. `/home/farismnrr/Projects/situm-explore/plans/035-realtime-remediation.md`
14. `/home/farismnrr/Projects/situm-explore/.agents/evidence/plan-035-realtime-remediation-2026-08-18.md`
15. `/home/farismnrr/Projects/situm-explore/plans/036-realtime-reliability.md`

Also inspect these implementation files directly rather than searching for them:

- `/home/farismnrr/Projects/situm-explore/mobile/src/positioning/session.ts`
- `/home/farismnrr/Projects/situm-explore/mobile/src/realtime/RealtimeScreen.tsx`
- `/home/farismnrr/Projects/situm-explore/mobile/src/realtime/state.ts`
- `/home/farismnrr/Projects/situm-explore/mobile/src/map/NativeMapScreen.tsx`
- `/home/farismnrr/Projects/situm-explore/server/api/workspaces/[workspaceId]/situm/realtime.get.ts`
- `/home/farismnrr/Projects/situm-explore/server/utils/situm-realtime.ts`
- `/home/farismnrr/Projects/situm-explore/test/mobile-plan-035-positioning.test.ts`
- `/home/farismnrr/Projects/situm-explore/test/situm-realtime-normalization.test.ts`
- `/home/farismnrr/Projects/situm-explore/mobile/package.json`

## Branch and existing uncommitted setup

The plan branch and planning files may already have been created by the parent session. Before doing anything:

```bash
cd /home/farismnrr/Projects/situm-explore
git status --short --branch
git branch --show-current
```

Expected branch is `plan/036-realtime-reliability`.

There may already be legitimate uncommitted Plan 036 planning/persistence files. Inspect and preserve them; do not reset, clean, overwrite, or discard them.

If branch state differs, follow `/home/farismnrr/Projects/situm-explore/.agents/protocols/git-workflow.md` and resolve safely. Never use destructive reset/clean or force-push.

Once execution actually begins, update the Plan 036 status and `.agents/state.md` from draft/awaiting authorization to active truthfully.

## Known architecture that must remain intact

- Native own-device positioning is foreground-only and owned by the shared shell-scoped `ForegroundPositioningSession`.
- Explore and Realtime must consume the same process-global native positioning session; tab/screen unmount must not independently stop it.
- Realtime remote reads stay authenticated and server-mediated through:
  `/api/workspaces/:workspaceId/situm/realtime`
- The server route calls installed `@situm/sdk-js` Realtime `getPositions()` and maps coordinate-bearing `features`.
- Mobile must not receive a Situm Read & Write / general remote-read credential.
- The existing dedicated Positioning credential remains bounded to positioning.
- Do not invent online/offline/idle state or fabricate stale/current positions.
- Do not add background positioning.
- Map Viewer/navigation-profile work is explicitly out of scope for Plan 036.

Plan 035 already physically proved real own-device positioning and server-mediated Realtime on this POS. Plan 036 exists because the behavior is now observed as intermittent and needs deterministic diagnosis/reliability.

## Primary physical target

Physical POS ADB target:
`100.113.52.76:35911`

Display target:
`1366x720` landscape

Verify the device is still reachable before assuming it is connected.

Development reverse mappings may need verification/restoration rather than assumption. Prior work used device port 3000 for the staging/backend path and device 8081 for Metro, but inspect current runtime before changing mappings.

Do not use sudo. Do not access or print secrets.

## Execution strategy

Work iteratively. Do not make the presumed `realtimeUpdateInterval` change first and call it done.

### Phase 0 — reproduce and establish the failure boundary

Follow `/home/farismnrr/Projects/situm-explore/plans/036-realtime-reliability.md` exactly.

At minimum reproduce these paths repeatedly on the physical POS:

1. Explore -> start location -> wait for real native Situm fixes -> Realtime.
2. Realtime -> start location directly -> wait across several polls.
3. Explore -> Realtime -> Explore while active.
4. Explicit stop/start.
5. Network interruption/recovery if safely reproducible.

Collect only sanitized evidence needed to distinguish:

- native producer never receives a fix;
- native producer receives fixes but upstream Realtime remains empty;
- upstream has features but server normalization drops them;
- server returns positions but mobile poll/state loses or hides them;
- lifecycle transitions unexpectedly stop/restart the producer.

Use timestamps/counts/state, not keys/tokens/raw authorization headers.

Do not change product behavior until you have a defensible failure-boundary hypothesis.

### Phase 1 — verify installed Situm upload-cadence contract

Do not rely only on web/docs. Inspect the installed dependency at:

`/home/farismnrr/Projects/situm-explore/mobile/node_modules/@situm/react-native`

The project currently uses `@situm/react-native@3.19.2`.

Verify all of the following from installed typings/source/Android bridge as available:

- exact `LocationRequest` field name for Realtime upload cadence;
- exact accepted value/enum shape;
- whether the React Native bridge actually forwards it to Android;
- default behavior in this installed version.

If and only if verified, make the desired upload cadence explicit in:

`/home/farismnrr/Projects/situm-explore/mobile/src/positioning/session.ts`

The candidate is the vendor's realtime/fastest appropriate upload mode, but installed-contract evidence and physical behavior decide the actual implementation. Keep `buildingIdentifier` scoping unchanged.

### Phase 2 — lifecycle continuity

Adversarially verify the shared `ForegroundPositioningSession` semantics from Plan 035. Fix only if evidence shows a remaining lifecycle defect.

Required transitions include:

- Explore start -> Realtime;
- Realtime start -> Explore;
- repeated tab switching;
- duplicate same workspace/building start;
- explicit stop;
- workspace switch;
- logout;
- background/foreground;
- native error/stopped callbacks;
- clean restart after stale/error state.

No hidden automatic foreground restart and no background positioning.

### Phase 3 — mobile polling correctness

Audit:

`/home/farismnrr/Projects/situm-explore/mobile/src/realtime/RealtimeScreen.tsx`

The current poll interval is defined in:

`/home/farismnrr/Projects/situm-explore/mobile/src/realtime/state.ts`

Pay special attention to:

- overlapping requests;
- reuse of one `AbortController`/signal across interval polls;
- stale responses updating state after workspace/lifecycle changes;
- manual Refresh interacting with an existing interval;
- foreground resume;
- a transient failed/aborted request replacing known-good data with a misleading empty/current state.

Keep the remote read server-mediated. Prefer simple generation/request ownership over adding a state-management dependency.

UI semantics must distinguish current empty truth from refresh failure with previous successful data.

### Phase 4 — server normalization

Audit:

- `/home/farismnrr/Projects/situm-explore/server/api/workspaces/[workspaceId]/situm/realtime.get.ts`
- `/home/farismnrr/Projects/situm-explore/server/utils/situm-realtime.ts`

Capture bounded real upstream response shape/count evidence without persisting sensitive raw payloads.

Revalidate actual timestamp/numeric/coordinate/deviceId shapes. Add regression tests for payload shapes genuinely observed. Malformed/ambiguous features stay excluded fail-closed.

Do not manufacture positions from metadata that lacks coordinates.

### Phase 5 — diagnostics

Use existing logging/correlation infrastructure where possible. Diagnostics should let a future agent/operator distinguish:

- producer active/no fix;
- producer receiving fixes;
- upstream Realtime zero/non-zero features;
- normalization accepted/dropped counts;
- mobile poll success/error/empty.

No new observability framework. No secret-bearing logs. Avoid permanent developer clutter in the product UI.

### Phase 6 — physical acceptance

Do not accept one lucky poll. Repeatedly validate the criteria in the primary plan across multiple consecutive poll cycles.

A successful run should prove, with real sensor-backed evidence:

- positioning receives repeated Situm fixes;
- Explore -> Realtime does not stop the producer;
- own device appears through the server-mediated route within an observed bounded delay;
- it remains visible across consecutive polls while publishing continues;
- starting from Realtime is equivalent;
- stop/background/workspace switch/logout remain fail-closed;
- temporary network failure is represented truthfully and recovers without app restart;
- no duplicate native positioning ownership occurs.

If upstream Situm itself intermittently omits the current device despite confirmed native fixes/upload configuration, record that boundary truthfully and do not paper it over by fabricating/storing a current position.

## Tests and validation

Add focused deterministic regression coverage for every app defect actually fixed.

At minimum preserve/extend:

- `/home/farismnrr/Projects/situm-explore/test/mobile-plan-035-positioning.test.ts`
- `/home/farismnrr/Projects/situm-explore/test/situm-realtime-normalization.test.ts`

Run from repository root:

```bash
cd /home/farismnrr/Projects/situm-explore
git diff --check
npm test
npm run lint
npm run typecheck
```

Run from mobile:

```bash
cd /home/farismnrr/Projects/situm-explore/mobile
npm run lint
npm run typecheck
npm run build:android
```

If a native dependency/configuration change requires a rebuild/install, do the appropriate Android rebuild and install on the POS. Do not claim a native change is active merely from Metro hot reload.

Use additional focused tests/scripts where useful.

Do not weaken existing security/fail-closed tests simply to get green output.

## Git / phase discipline

Follow:
`/home/farismnrr/Projects/situm-explore/.agents/protocols/git-workflow.md`

For each completed phase:

1. update Plan 036 check/status truthfully;
2. update `.agents/state.md` when focus/open loops change;
3. add evidence/session/decision/knowledge updates only where durable;
4. run required validation for that phase;
5. inspect diff and staged diff;
6. commit a scoped Conventional Commit-style commit;
7. push the Plan 036 branch.

Do not open a PR or merge. Those remain user-gated.

## Evidence and persistence

Create/update the final evidence file at exactly:

`/home/farismnrr/Projects/situm-explore/.agents/evidence/plan-036-realtime-reliability-2026-08-19.md`

It should include:

- reproduction matrix and timestamps;
- proven failure boundary/root causes;
- installed Situm 3.19.2 contract evidence;
- before/after architecture only where behavior actually changed;
- sanitized counts/state diagnostics;
- files changed;
- tests/build commands and results;
- physical POS acceptance matrix with PASS/BLOCKED/FAIL truthfully classified;
- remaining vendor/network/runtime limitations;
- security boundary confirmation.

Keep product docs about product/runtime behavior only. Keep agent procedure/evidence in `.agents/`.

Required current-state files to maintain when truth changes:

- `/home/farismnrr/Projects/situm-explore/plans/036-realtime-reliability.md`
- `/home/farismnrr/Projects/situm-explore/.agents/state.md`
- `/home/farismnrr/Projects/situm-explore/.agents/sessions/2026-08-19.md`

## ai-self self-improvement layer

For this substantial technical task, inspect these exact paths if present/useful:

- `/home/farismnrr/Projects/situm-explore/ai-self/CONSTITUTION.md`
- `/home/farismnrr/Projects/situm-explore/ai-self/registry.yaml`
- `/home/farismnrr/Projects/situm-explore/ai-self/skills/`

After substantial work, evaluate whether a reusable skill/lesson/tool improvement is warranted. Prefer improving an existing skill. Validate any change before relying on it. Do not persist temporary runtime state, secrets, credentials, device tokens, or one-off debugging values there.

## Hard constraints

- no sudo/elevation;
- no destructive Git/filesystem operations;
- no production changes;
- no release publication;
- no PR/merge/branch deletion without later explicit authorization;
- no secret access/exposure;
- no keys/tokens/authorization headers in logs/evidence;
- no fake/synthetic position data to make acceptance pass;
- no online/offline presence fabrication;
- no mobile remote-read Situm credential;
- no second backend/direct mobile remote-read bypass;
- no background positioning;
- no Map Viewer/navigation-profile work in this plan;
- no unnecessary framework/dependency additions.

## Completion definition

Do not stop at code-complete or static checks. Stop when either:

A. Plan 036 acceptance is genuinely satisfied with repeated physical evidence, automated validation passes, branch is committed/pushed, and the branch is ready for user review; or

B. a genuine external/vendor/runtime blocker prevents full acceptance, but the app-controlled failure boundary has been isolated as far as possible, all safe remediation is complete, evidence is explicit, and no PASS is fabricated.

At the end, report concisely:

- root cause(s);
- exact implementation changes;
- physical POS result;
- automated validation result;
- branch/commit/push status;
- remaining blocker, if any;
- what requires user authorization next.

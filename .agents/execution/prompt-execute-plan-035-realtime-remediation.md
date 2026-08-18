# Execute Plan 035 — Realtime Remediation

Repository root:
`/home/farismnrr/Projects/situm-explore`

Primary plan:
`/home/farismnrr/Projects/situm-explore/plans/035-realtime-remediation.md`

Authoritative supporting context:
- `/home/farismnrr/Projects/situm-explore/AGENTS.md`
- `/home/farismnrr/Projects/situm-explore/.agents/README.md`
- `/home/farismnrr/Projects/situm-explore/.agents/state.md`
- `/home/farismnrr/Projects/situm-explore/.agents/memory/decisions.md`
- `/home/farismnrr/Projects/situm-explore/.agents/protocols/git-workflow.md`
- `/home/farismnrr/Projects/situm-explore/ARCHITECTURE.md`
- `/home/farismnrr/Projects/situm-explore/DESIGN.md`
- `/home/farismnrr/Projects/situm-explore/design/IMPLEMENTATION.md`
- `/home/farismnrr/Projects/situm-explore/plans/031-native-realtime-operations.md`
- `/home/farismnrr/Projects/situm-explore/plans/034-full-e2e-acceptance.md`
- `/home/farismnrr/Projects/situm-explore/.agents/evidence/plan-034-physical-e2e-checkpoint-2026-08-18.md`
- `/home/farismnrr/Projects/situm-explore/.agents/evidence/plan-034-explore-navigation-refactor-2026-08-18.md`

Current known facts you must preserve:

1. Plan 034 is merged and closed. Start Plan 035 from current `main` unless branch state already reflects a user-authorized Plan 035 branch.
2. Realtime mobile UI currently polls:
   `/api/workspaces/:workspaceId/situm/realtime`
   every 10 seconds.
3. The backend route currently calls `client.realtime.getPositions()` from installed `@situm/sdk-js` 0.25.0 and maps only `result.features` to the minimal product response.
4. Runtime probe against staging returned HTTP 200 with `{"positions":[]}`. The UI empty state is therefore reflecting backend truth, not a rendering failure.
5. The installed `@situm/sdk-js` implementation calls Situm upstream endpoint `/api/v1/realtime/positions` and returns a structure containing both `features` and `devicesInfo`.
6. Situm positioning/publishing on the physical POS is currently blocked by the vendor Android location stack. Existing evidence includes Situm `LOCATION` error code `8002`, with Android reporting location enabled but `network provider enabled=false`.
7. There is a likely lifecycle ownership bug: `NativeMapScreen` owns positioning and its unmount cleanup invokes `SitumPlugin.removeLocationUpdates()`. Switching Explore -> Realtime unmounts `NativeMapScreen`, so a device that had started positioning may stop publishing exactly when entering Realtime.
8. Realtime remote reads must remain server-mediated. Do not expose the server Read & Write Situm credential to mobile.
9. Mobile may only receive the dedicated encrypted `POSITIONING` credential via the authenticated backend route already established in Plan 034.
10. Do not fake positions, freshness, online/offline presence, identity mapping, or movement to make tests pass.
11. Do not widen the mobile Situm credential from POSITIONING to READ_ONLY or READ_WRITE merely to simplify Realtime.
12. Do not reintroduce deprecated duplicate Explore UI. Situm SDK remains owner of Explore map/search/building/floor/POI chrome; the app owns only product overlays needed for location/guidance.

## Goal

Fix the actual Plan 035 Realtime problem so that the native app has a correct, explicit foreground positioning lifecycle that can persist across Explore <-> Realtime when the user has explicitly started positioning, while remote Realtime monitoring remains server-mediated and security boundaries remain unchanged.

This is not a cosmetic-only task. The primary concern is ownership/lifecycle correctness and truthful runtime behavior.

## Execution model

Use an iterative agent loop:

1. inspect current state and reproduce/verify the issue;
2. form a concrete root-cause hypothesis from code + installed SDK contracts + runtime evidence;
3. implement the smallest coherent architectural fix;
4. add deterministic regression coverage;
5. run static and focused validation;
6. hot reload/build/install as appropriate;
7. inspect the physical POS with ADB/logs/UI hierarchy;
8. refine if the observed behavior does not match the intended lifecycle;
9. stop only when acceptance criteria pass or a genuine external/runtime blocker is proven and documented.

Do not stop after lint/typecheck or one implementation pass.

Delegate narrow work to workers where useful, for example:
- worker A: audit installed `@situm/react-native` / Android source contracts for `requestLocationUpdates`, `removeLocationUpdates`, realtime upload interval, and listener ownership;
- worker B: adversarial review of lifecycle transitions (Explore -> Realtime -> Explore, workspace switch, logout, background/resume, restart);
- worker C: focused tests/state-machine design review;
- worker D: physical ADB/log inspection and evidence review.

Keep one primary owner responsible for integration, final decisions, and acceptance evidence.

## Branch / git workflow

- Work from `/home/farismnrr/Projects/situm-explore`.
- If currently on `main`, create a dedicated branch named `plan/035-realtime-remediation` from up-to-date `main`.
- Do not rewrite history or force-push.
- Preserve unrelated user changes if any exist; inspect first.
- Do not open a PR, merge, or delete branches unless the user explicitly asks after completion.

## Required technical direction

Do not blindly patch `RealtimeScreen` to call native positioning itself if that would duplicate listeners/ownership.

Prefer a single shared foreground positioning owner at authenticated/workspace scope. The implementation should make ownership explicit and testable.

A good architecture may look like:

Authenticated app/workspace scope
-> ForegroundPositioningSession / PositioningController
   -> obtains the existing dedicated POSITIONING credential only when needed
   -> owns `requestLocationUpdates()` / `removeLocationUpdates()`
   -> owns native listener subscription exactly once
   -> exposes state/current location to Explore
   -> remains alive across Explore <-> Realtime tab changes while user-requested positioning is active
   -> stops on explicit stop, logout, workspace switch, lifecycle/background rule, fatal error, or app teardown according to the existing foreground-only product contract

Explore
-> consumes the shared positioning session
-> controls explicit user actions such as Locate me / Stop
-> owns map/guidance presentation only

Realtime
-> continues to poll the authenticated backend route for remote/server-mediated positions
-> must not require a Read-only/Read-write key on mobile
-> may reflect own-device data only when it actually exists upstream

The exact class/module names are up to you. Keep it simple and avoid adding a framework/state library.

## Important lifecycle semantics

You must define and validate each transition explicitly:

- fresh launch, authenticated, no positioning started;
- user taps Locate me in Explore;
- Explore -> Realtime while positioning is active;
- Realtime -> Explore while positioning is active;
- explicit Stop location;
- workspace switch while positioning is active;
- logout while positioning is active;
- app background / foreground according to the existing foreground-only rule;
- process/app restart;
- Situm location error / stopped callback;
- navigation/guidance start and cancellation while positioning ownership remains correct;
- repeated tab switching must not create duplicate native listeners or repeated `requestLocationUpdates()` ownership.

Do not silently keep positioning active in cases that violate the existing privacy/foreground contract.

## Backend investigation requirement

Before changing server Realtime mapping, prove whether a server change is necessary.

Inspect and, where possible, safely probe:
- installed `@situm/sdk-js` `RealtimePositions` typing;
- semantics of `features` vs `devicesInfo`;
- whether `features=[]` while `devicesInfo>0` is possible/meaningful;
- current upstream response counts using existing workspace credentials without printing or persisting secrets;
- any existing max-age threshold behavior (`maxSecThreshold`) and whether the product intentionally wants all current positions or only a bounded recent window.

Do not expose raw credential values in logs/evidence.
Do not fabricate a Realtime position from `devicesInfo` if coordinates are absent.

If `features` is the correct source of truth for position records, leave that mapping intact and document why.

## Physical POS target

Primary device:
`100.113.52.76:35911`

Known display target:
`1366x720` landscape POS

Known development reverse mappings from prior work may need to be restored/verified:
- device `tcp:3000` -> staging backend host `tcp:3005`
- device `tcp:8081` -> active Metro host port (historically `8099` because an old 8081 listener was outside the visible process namespace)

Verify rather than assume current mappings.

Physical acceptance must be truthful:

- If the vendor POS still cannot obtain a real Situm position due `LOCATION 8002` / `network provider enabled=false`, do NOT claim end-to-end own-device Realtime publishing PASS.
- You should still physically verify the corrected ownership semantics as far as possible with logs/state, e.g. that entering Realtime no longer causes an app-owned `removeLocationUpdates()` solely due screen unmount.
- If physical positioning cannot start, document the exact blocker separately from the lifecycle implementation result.

## Tests you should add/update

Add focused deterministic tests for the shared positioning lifecycle. At minimum cover:

- no positioning starts without explicit user action;
- active session survives Explore -> Realtime -> Explore tab changes;
- repeated consumers/tab changes do not duplicate start/stop ownership;
- explicit stop stops once;
- workspace switch stops old workspace session and invalidates stale location;
- logout stops and clears protected positioning state;
- background lifecycle follows the foreground-only contract;
- error/stopped callbacks clear or transition state safely;
- existing navigation freshness/workspace/building guards remain fail-closed;
- Realtime polling remains server-mediated and uses no mobile Situm read credential;
- malformed Realtime payload handling remains fail-closed.

Do not weaken old tests merely to accommodate the new architecture.

## Validation gates

Run at least:

From `/home/farismnrr/Projects/situm-explore`:

- `git diff --check`
- `npm test`
- `npm run lint`
- `npm run typecheck`

From `/home/farismnrr/Projects/situm-explore/mobile`:

- `npm run lint`
- `npm run typecheck`
- any focused mobile scripts/tests relevant to Plan 035

If native source/config changes require Android rebuild, perform the appropriate debug build/install and validate it on the POS. Do not claim a native config change is active from Metro hot reload if it requires a native rebuild.

## Evidence

Create a detailed evidence file:

`/home/farismnrr/Projects/situm-explore/.agents/evidence/plan-035-realtime-remediation-2026-08-18.md`

Record:
- reproduced symptom;
- root cause(s);
- installed SDK contract evidence;
- architecture before/after;
- files changed;
- security boundary confirmation;
- validation commands/results;
- physical POS observations/log evidence;
- whether upstream Realtime returned `features` and/or `devicesInfo` counts, without secret values;
- remaining external/runtime blocker(s), especially vendor positioning provider state;
- explicit PASS/BLOCKED classification for each acceptance item.

Update:
- `/home/farismnrr/Projects/situm-explore/plans/035-realtime-remediation.md`
- `/home/farismnrr/Projects/situm-explore/.agents/state.md`
- session notes if required by repository workflow

Do not mark physical own-device publishing/navigation PASS unless real sensor-backed evidence exists.

## Self-improvement layer

Because this is a substantial technical task, inspect when useful:
- `/home/farismnrr/Projects/situm-explore/ai-self/CONSTITUTION.md`
- `/home/farismnrr/Projects/situm-explore/ai-self/registry.yaml`
- relevant `/home/farismnrr/Projects/situm-explore/ai-self/skills/`

After substantial work, evaluate whether a reusable correction/skill should be added or improved. Prefer improving an existing skill over adding duplicate infrastructure. Do not persist secrets or one-off runtime data.

## Hard constraints

- No secrets in repo, logs, screenshots, evidence, or commit messages.
- No sudo/elevation.
- No destructive operations.
- No production changes.
- No PR/merge unless explicitly requested later.
- No fake position or synthetic PASS.
- No mobile Read & Write credential.
- No disabling security checks to make Realtime work.
- No second backend or direct mobile Realtime read bypass.
- No new state-management framework/dependency unless clearly necessary and validated.

## Completion definition

Plan 035 implementation is ready for review when:

1. the lifecycle bug is proven and fixed with a single coherent positioning owner;
2. Explore -> Realtime no longer stops positioning merely because the Explore screen unmounted;
3. privacy/security/lifecycle stop conditions remain explicit and tested;
4. Realtime remote reads remain server-mediated;
5. focused/full tests, lint, typecheck, and diff checks pass;
6. the physical POS is inspected and the corrected lifecycle is verified as far as the runtime allows;
7. any remaining `LOCATION 8002` / provider limitation is documented as an external physical blocker, not conflated with the app lifecycle fix;
8. evidence and Plan 035/state docs are truthful and complete.

At the end, report concisely:
- root cause;
- architecture implemented;
- tests/validation;
- physical outcome;
- blockers;
- exact evidence path;
- branch/commit status;
- whether it is ready for reviewer inspection.

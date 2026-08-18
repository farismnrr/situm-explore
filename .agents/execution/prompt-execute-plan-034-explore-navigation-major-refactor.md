# Execution Prompt — Plan 034 Explore Map-First & Guidance Major Refactor

Work inside exactly:

`/home/farismnrr/Projects/situm-explore`

Active branch must remain:

`plan/034-full-e2e-acceptance`

Primary remediation authority:

`/home/farismnrr/Projects/situm-explore/.agents/execution/plan-034-explore-navigation-major-refactor.md`

Parent acceptance authority:

`/home/farismnrr/Projects/situm-explore/plans/034-full-e2e-acceptance.md`

## Mission

Execute the major native Explore/navigation refactor completely using an agent loop. Continue iterating through implementation, validation, physical-device inspection, and correction until the plan's physical PASS criteria are met or a genuine external/runtime blocker is proven and documented.

Do not stop after a single code pass, lint pass, or emulator/static success.

Use worker delegation for narrow subproblems when useful, but keep one primary owner responsible for integration, acceptance truthfulness, and evidence.

## Required initial reads

Read before modifying code:

1. `/home/farismnrr/Projects/situm-explore/ai-self/CONSTITUTION.md` if present.
2. `/home/farismnrr/Projects/situm-explore/ai-self/registry.yaml` if present.
3. relevant existing skills under `/home/farismnrr/Projects/situm-explore/ai-self/skills/` if useful.
4. `/home/farismnrr/Projects/situm-explore/.agents/execution/plan-034-explore-navigation-major-refactor.md`
5. `/home/farismnrr/Projects/situm-explore/plans/034-full-e2e-acceptance.md`
6. `/home/farismnrr/Projects/situm-explore/.agents/state.md`
7. `/home/farismnrr/Projects/situm-explore/mobile/src/map/NativeMapScreen.tsx`
8. `/home/farismnrr/Projects/situm-explore/mobile/src/map/state.ts`
9. `/home/farismnrr/Projects/situm-explore/mobile/src/ui/layout.ts`
10. `/home/farismnrr/Projects/situm-explore/mobile/App.tsx`
11. `/home/farismnrr/Projects/situm-explore/.agents/reference/native-ui-reference.html`
12. `/home/farismnrr/Projects/situm-explore/mobile/node_modules/@situm/react-native`

Preserve all current unrelated working-tree changes. Do not reset or discard user/previous-agent work.

## Agent-loop behavior

Iterate this loop until done:

1. inspect current runtime/code state;
2. choose one bounded improvement;
3. implement;
4. run targeted static tests;
5. hot reload/rebuild as appropriate;
6. inspect physical POS UI/runtime via ADB;
7. compare against acceptance criteria;
8. fix regressions or poor UX;
9. repeat.

Do not declare success because the code looks cleaner.

## Worker delegation

Delegate narrow tasks where useful. Good worker scopes:

- inspect installed `@situm/react-native` package for exact `MapViewRef` APIs;
- verify `followUser`, `unfollowUser`, navigation callbacks, route-snapped location and map interaction callbacks;
- compare official Situm docs to the installed package;
- review guidance state-machine design;
- inspect responsive layout behavior for `1366×720` POS versus phone;
- adversarial review for lifecycle/security/navigation ownership regressions;
- focused pure-state test design.

Workers should return concrete findings/patch suggestions to the primary owner. Do not let workers independently claim physical PASS.

## Product direction

Implement this design direction:

### Explore browse mode

- MapView dominates authenticated Explore.
- Remove the current dashboard-like permanent structure around the map wherever Situm already provides equivalent functionality.
- Specifically challenge/remove permanent:
  - `Select a place` side panel;
  - `PLACES` list;
  - custom `LEVELS` selector;
  - verbose location status card;
  - oversized welcome/search/chip stack.
- Keep only minimal Situm Explore-specific overlays needed for product state and actions.
- Search/POI UI may remain only if the frozen SDK does not provide a practical native alternative; if retained, keep it compact/collapsible.

### Guidance mode

Build a trip-style map-first experience inspired by Google Maps/Gojek, without copying branding or inventing unsupported camera features.

- route/current position dominate;
- start guidance using real Situm navigation;
- enter follow mode through the proven installed Situm API;
- show compact destination + remaining distance + state + Stop HUD/bottom sheet;
- show Recenter when follow mode is not active;
- restore follow mode on Recenter;
- handle arrived/cancelled/outside-route/error states clearly;
- never fake turn-by-turn instruction content.

Use real SDK data only.

## Frozen SDK rule

The source of truth for API signatures is:

`/home/farismnrr/Projects/situm-explore/mobile/node_modules/@situm/react-native`

Official web docs may guide semantics, but do not call APIs that are absent or differently typed in the installed frozen package.

If official docs and installed package differ, code against the installed package and document the mismatch.

## Security boundaries

Do not change these:

- Read & Write key server-only;
- Viewer authority separate;
- Positioning key dedicated `POSITIONING` only;
- Positioning key encrypted server-side;
- native gets it only through authenticated `/api/workspaces/:workspaceId/mobile-positioning`;
- Realtime remains server-mediated;
- no secret in Expo env;
- no secret in evidence/logs/screenshots;
- no direct DB credential bypass.

## Known current runtime context

Physical POS:

`100.113.52.76:35911`

Display:

`1366×720` landscape

Staging API host:

`http://127.0.0.1:3005`

Device mobile API route should be:

`http://127.0.0.1:3000`

Known reverse:

`adb -s 100.113.52.76:35911 reverse tcp:3000 tcp:3005`

Metro has recently been running on host port `8099` with device `8081 -> host 8099`; inspect actual current state before assuming.

Current local ignored mobile env should contain a staging base URL. Never print credential values.

Known already-fixed runtime issue:

- Nitro catch-all now handles `/api/workspaces/:workspaceId/mobile-positioning`; do not regress it.

Known physical device blocker:

- vendor Android has previously reported `network provider enabled=false` despite Location true and Bluetooth/Wi-Fi scan configuration;
- Situm returned LOCATION error code 8002;
- do not fake positioning to bypass this blocker.

Known APK distribution issue:

- installed APK has previously exposed `situm-explore-dev` deep-link scheme rather than staging;
- do not conflate this with Explore refactor success.

## Validation commands

At minimum run repeatedly as appropriate:

```bash
cd /home/farismnrr/Projects/situm-explore/mobile
npm run lint
npm run typecheck
```

Run focused tests for map/navigation state. Add tests if new pure state helpers are introduced.

Also run:

```bash
cd /home/farismnrr/Projects/situm-explore
git diff --check
```

Run relevant root Plan 030/031/033/034 tests before completion.

If native package/config changes require an APK rebuild, use the existing Android SDK paths and do not assume install success if `adb install -r` hangs.

## Physical inspection

Use ADB to inspect actual rendered bounds and runtime behavior.

Useful device:

```bash
adb -s 100.113.52.76:35911 ...
```

Verify visually/structurally that:

- map occupies most of `1366×720` content area;
- critical guidance controls are within visible bounds;
- no giant stacked dashboard extends below the viewport;
- HUD does not block most of the map;
- no redbox/crash;
- session/workspace/cartography still restore/load.

Do not store credentials in temporary shell history/files where avoidable. Never include them in evidence.

## Physical acceptance

Do not declare PASS unless supported by the plan's Phase 6 criteria.

Where physical positioning cannot proceed due the vendor provider blocker:

- exercise the real flow until the blocker;
- verify map-first UI around that state;
- verify no fake location/navigation state is presented;
- mark positioning-dependent guidance acceptance BLOCKED rather than PASS.

If the physical device does produce a current Situm position, continue through real Directions/navigation/follow/recenter/stop/background/resume acceptance.

## Evidence

Write evidence to:

`/home/farismnrr/Projects/situm-explore/.agents/evidence/plan-034-explore-navigation-refactor-2026-08-18.md`

Evidence should include:

- exact implementation summary;
- exact installed Situm APIs relied upon;
- static validation results;
- physical POS layout findings/bounds;
- actual navigation/follow behavior observed;
- blocker details if positioning remains unavailable;
- no secrets.

Then update, only truthfully:

- `/home/farismnrr/Projects/situm-explore/plans/034-full-e2e-acceptance.md`
- `/home/farismnrr/Projects/situm-explore/.agents/state.md`

## Git / release restrictions

- Do not merge.
- Do not open PR unless explicitly requested.
- Do not push production changes.
- Do not use sudo.
- Do not perform destructive operations.
- Do not reset unrelated uncommitted changes.
- Local staging rebuild/recreate is allowed only as needed for acceptance and must preserve current staging data/config.

## Self-improvement

After substantial completion, inspect whether a reusable lesson belongs in existing `/home/farismnrr/Projects/situm-explore/ai-self/` skills/lessons. Prefer improving an existing skill over creating duplicates. Do not store temporary device state, secrets, credentials, or one-off debugging noise.

Validate any modified skill before relying on it.

## Completion report

Return a concise report containing:

- what changed;
- worker findings that materially affected implementation;
- validations passed/failed;
- physical POS acceptance status;
- remaining blockers;
- exact evidence file path;
- exact changed files;
- whether Plan 034 can resume and from which gate.

Continue the loop until physical acceptance is satisfied or a genuine blocker is established. Do not stop merely because implementation is complete.

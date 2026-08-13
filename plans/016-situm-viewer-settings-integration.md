# Plan 016 — Remaining Web Viewer & Settings Integration

Status: planned-later-conditional
Branch: `plan/016-situm-viewer-settings-integration`
Depends on: Plan 015 complete, reviewed, and integrated into `main`; Plan 010 must have recorded a **go** decision and exact retained capabilities

## Goal

Implement only remaining **web-safe** Situm Viewer/config/settings capabilities not already owned by Plans 011–015.

Plan 016 is not a catch-all write plan and does not own native positioning/navigation. If Plan 010 assigns no remaining capability here, mark it `skipped-not-needed`.

## Scope source of truth

Plan 010 must provide an explicit retained list with exact evidence before this plan starts.

Potential web-safe examples, only when retained and verified:

- Viewer location picker;
- search filter;
- language/font/accessibility UI controls;
- selected map configuration/profile controls;
- verified map-style read/use behavior;
- Viewer favorites not already owned by Plan 011;
- trajectory or other Viewer actions not already owned by Plans 012–013.

Explicitly excluded unless a later user decision changes scope:

- browser indoor self-positioning;
- end-user `Set user location` developer control;
- dynamic handset navigation/rerouting;
- save-car/navigate-to-car POC UI;
- flight selection;
- generic image inventory UI;
- remote-person follow semantics not exactly verified;
- broad account/cartography mutations.

## Evidence gate

Implement only capabilities that Plan 010 closed with exact verified evidence:

- official endpoint or SDK method;
- official source reference;
- installed SDK compatibility where relevant;
- browser Viewer vs authenticated Nitro ownership;
- auth/permission;
- exact fields/events consumed;
- read/write semantics.

If evidence became stale or conflicts with the installed SDK, reverify before coding. Do not guess.

## Credential and security contract

- Browser Viewer actions use only the browser-safe auth mechanism frozen by Plan 010.
- REST-backed configuration operations, if explicitly retained, go through authenticated Nitro routes with private server credentials.
- A server credential must never be exposed to browser code.
- Every mutation requires an explicit retained product action and exact Plan 010 ownership; otherwise do not implement it.
- No generic Situm proxy and no background/automatic writes.

## Viewer ownership

Keep one Viewer instance owner in `SitumViewer.vue`.

Expose only the smallest typed command surface needed by retained UI. Example shape only; exact method mapping must come from Plan 010 evidence:

```text
selectBuilding
selectFloor
selectPoi
showStaticDirections
showRealtime
showTrajectory
openLocationPicker
setLanguage
setSearchFilter
```

Do not expose a generic `invokeViewer(method, payload)` escape hatch.

## Phase 1 — Freeze exact scope

- [ ] Confirm Plan 015 is integrated.
- [ ] Read Plan 010 final capability/evidence matrix.
- [ ] Copy exact Plan 016 retained capabilities into execution notes.
- [ ] If empty, mark `skipped-not-needed` and stop.
- [ ] Revalidate each selected capability against current official docs and installed SDK version.
- [ ] Classify each as direct Viewer action vs authenticated Nitro operation.

## Phase 2+ — Implement one capability group at a time

For each selected group:

- [ ] wire the exact verified real capability;
- [ ] remove replaced dummy/local success behavior;
- [ ] preserve retained product composition;
- [ ] add truthful loading/success/error state where required;
- [ ] do not resurrect adjacent controls removed by Plan 010;
- [ ] validate before the next capability group.

## Final validation

- [ ] only Plan 010-assigned web-safe capabilities were implemented;
- [ ] no native positioning/navigation feature leaked into web;
- [ ] no public server credential;
- [ ] every mutation, if any, maps to an explicit retained user action;
- [ ] no ownerless dummy Situm-domain control remains;
- [ ] no implementation relies on guessed endpoint/method/payload semantics;
- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] manual Viewer smoke;
- [ ] update plan + `.agents/`, commit/push;
- [ ] no PR until user authorization.

## Non-goals

- native/mobile app;
- positioning engine;
- broad admin console;
- credential/key management UI;
- automatic synchronization;
- background jobs/queues;
- speculative Viewer wrappers.
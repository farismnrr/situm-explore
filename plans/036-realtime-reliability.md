# Plan 036 — Realtime Reliability

Status: **complete / acceptance passed 2026-08-19**

Branch: `plan/036-realtime-reliability`

Depends on: Plan 035 complete/integrated on `main`.

## Objective

Make native Realtime reporting deterministic and diagnosable on the physical POS without changing the established security boundary: own-device positioning remains native foreground positioning, while remote Realtime reads remain authenticated and server-mediated.

The observed symptom is intermittent Realtime visibility: Explore positioning can work, but the Realtime list may sometimes contain the device and sometimes show no reported positions.

## Non-negotiable boundaries

- Keep `/api/workspaces/:workspaceId/situm/realtime` as the mobile remote-read path.
- Do not expose Read & Write, Viewer, Positioning, or other Situm credentials in Realtime payloads, logs, diagnostics, or UI.
- Do not invent online/offline/idle presence semantics.
- Do not persist or fabricate stale positions as if they were current Situm Realtime results.
- Do not broaden the mobile Positioning credential to support remote Realtime reads.
- Preserve the shared shell-scoped `ForegroundPositioningSession` lifecycle introduced by Plan 035.
- Preserve explicit stop, workspace-switch, logout, background, and native error/stopped fail-closed behavior.
- No production deployment, release publication, PR, or merge without explicit user authorization.

## Phase 0 — Reproduce and instrument the failure boundary

1. Reproduce the intermittent symptom on the physical POS using a controlled sequence:
   - open Explore;
   - enable positioning and wait for a real Situm fix;
   - switch to Realtime without stopping positioning;
   - observe at least several Realtime poll cycles;
   - repeat from Realtime-started positioning;
   - repeat after explicit stop/start and Explore ↔ Realtime transitions.
2. Record timestamps for these boundaries without secrets:
   - native positioning start request;
   - first native Situm location callback;
   - latest native location callback;
   - Realtime API request/response time;
   - normalized Realtime feature count.
3. Classify each failure as one of:
   - no native fix;
   - native fix exists but is not appearing in Situm Realtime;
   - Situm Realtime returns data but server normalization drops it;
   - server returns positions but mobile polling/state handling loses or hides them;
   - lifecycle transition stops/restarts positioning unexpectedly.
4. Do not change product behavior until the failure boundary is objectively identified.

## Phase 1 — Verify and make Situm upload cadence explicit

1. Inspect the installed `@situm/react-native@3.19.2` typings/runtime for the exact supported `LocationRequest` field and enum/value used to control Realtime uploads.
2. Confirm the installed bridge forwards that setting to native Android before relying on vendor documentation alone.
3. If confirmed, update `ForegroundPositioningSession.start()` so `requestLocationUpdates()` explicitly requests the intended Realtime upload cadence rather than relying on an implicit/default value.
4. Prefer the vendor's real-time upload mode only if installed-version evidence confirms it and physical validation shows acceptable behavior.
5. Keep building scoping unchanged and do not add background positioning.
6. Add deterministic source-level/runtime-mock coverage proving the explicit request option is sent and remains scoped to the selected building.

## Phase 2 — Harden producer lifecycle continuity

1. Verify that Explore and Realtime remain consumers of one process-global positioning session and that screen unmounts do not stop a running session.
2. Cover these transitions:
   - Explore start → Realtime;
   - Realtime start → Explore;
   - Explore → Realtime → Explore while active;
   - explicit stop from either screen;
   - app background/foreground;
   - workspace switch;
   - logout;
   - native error/stopped callback.
3. Ensure duplicate starts for the same workspace/building are idempotent and do not tear down a healthy native producer.
4. Ensure a stale/error session can be explicitly restarted cleanly without retaining an old location snapshot.
5. Do not introduce automatic background or hidden restart behavior.

## Phase 3 — Harden Realtime polling and state transitions

1. Keep foreground polling server-mediated and bounded.
2. Review the current 10-second polling loop for overlapping requests, stale AbortSignal reuse, foreground resume behavior, and refresh-button interaction.
3. Ensure only the latest valid request may update visible Realtime state when workspace/lifecycle changes occur.
4. Preserve the last successful list only for transient request errors; never represent it as a fresh response.
5. Distinguish visibly and internally between:
   - loading;
   - current empty response;
   - successful current positions;
   - transient refresh failure with previous data;
   - authorization/session failure.
6. Prevent a temporary failed/aborted refresh from incorrectly replacing a known-good response with an empty state.
7. Keep search/filter behavior purely client-side and unrelated to producer freshness.

## Phase 4 — Server normalization and freshness evidence

1. Capture a bounded sample of real Situm Realtime `features` metadata on the test workspace without secrets or personal data beyond the test device identifier needed for debugging.
2. Revalidate normalization for:
   - timestamp formats actually returned by Situm;
   - numeric/string numeric building/floor/accuracy fields if present in the installed SDK response;
   - coordinates;
   - missing optional `deviceId`.
3. Add/extend regression tests for every payload shape observed during reproduction.
4. Keep malformed features fail-closed and excluded rather than coercing ambiguous data.
5. If Situm exposes a documented current-position/freshness contract, record it; otherwise continue describing the UI as reported positions and do not invent a freshness threshold.

## Phase 5 — Bounded diagnostics for future intermittent failures

1. Add sanitized diagnostics sufficient to answer where the chain stopped, using counts/state/timestamps only.
2. Prefer existing server/app logging conventions and request correlation rather than a new diagnostics subsystem.
3. Never log API keys, authorization headers, raw credentials, or full sensitive payloads.
4. Keep high-frequency producer callbacks bounded; native-fix diagnostics must be throttled rather than emitted for every location update.
5. Ensure diagnostics can differentiate:
   - native producer active/no fix;
   - native producer receiving fixes;
   - server Realtime zero/non-zero features;
   - normalization drop count;
   - mobile poll success/error/empty.
6. Keep user-facing UI clean; diagnostics should not become permanent developer clutter unless a small status line materially improves operator understanding.

## Phase 6 — Physical POS acceptance

Run the final candidate on the physical POS and verify all of the following with timestamped evidence:

1. Starting location from Explore produces repeated real Situm fixes.
2. Switching to Realtime does not stop the producer.
3. The own device appears through the authenticated server-mediated Realtime route within a bounded expected delay after native fixes begin.
4. Realtime remains visible across multiple consecutive poll cycles while positioning continues.
5. Starting location directly from Realtime behaves equivalently.
6. Explicit stop causes the native producer to stop and Realtime eventually reflects whatever Situm's real API returns; the app does not fabricate immediate disappearance.
7. Explore ↔ Realtime transitions do not create duplicate native positioning sessions.
8. Backgrounding stops positioning according to the existing foreground-only policy.
9. Foreground return does not silently restart positioning.
10. Workspace switch/logout invalidates the previous session and Realtime scope.
11. Network interruption shows a truthful refresh error and recovers without requiring app restart once connectivity returns.
12. No credential or secret appears in logs, UI, network payloads owned by this app, or committed evidence.

## Phase 7 — Regression, docs, and closeout

Required validation before implementation closeout:

- `git diff --check`;
- root Realtime/normalization/positioning tests;
- root `npm run lint`;
- root `npm run typecheck`;
- mobile `npm run lint`;
- mobile `npm run typecheck`;
- Android debug build;
- physical POS acceptance from Phase 6.

Update only product documentation affected by actual behavior. Keep implementation/process evidence in `.agents/`; do not turn README/docs into agent notes.

## Acceptance criteria

Plan 036 is complete only when all of the following are true:

- the intermittent failure boundary is reproduced or ruled out with objective instrumentation;
- the installed Situm SDK contract for Realtime upload cadence is verified before implementation;
- own-device positioning upload cadence is explicit if supported and proven useful;
- Explore/Realtime shared positioning lifecycle remains deterministic;
- mobile polling cannot race stale requests into misleading empty/current states;
- real observed Situm payload shapes are normalized with regression coverage;
- diagnostics identify native producer vs Situm Realtime vs server normalization vs mobile poll failures without exposing secrets;
- repeated physical POS runs show stable server-mediated Realtime visibility while foreground positioning is active;
- existing security and foreground-only architecture remains intact;
- required automated validation passes;
- no production deployment, PR, or merge has occurred without explicit user authorization.

## Out of scope

- Map Viewer/navigation-profile work.
- Background positioning.
- Push/WebSocket presence infrastructure.
- Synthetic online/offline state.
- Realtime map markers unless separately proven and planned.
- iOS acceptance unless separately requested.
- Production release/publication in this plan without a later explicit user instruction.

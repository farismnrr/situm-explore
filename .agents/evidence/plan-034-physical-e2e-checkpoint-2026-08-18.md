# Plan 034 Physical E2E Checkpoint — 2026-08-18

## Scope

Physical Android POS acceptance checkpoint after the login keyboard remediation passed.

Device: `100.113.52.76:35911` (`Pos_System`, landscape 1366×720).
Staging backend: host port `3005`, reached from the device through `adb reverse tcp:3000 tcp:3005`.
Metro: host port `8099`, reached from the device through `adb reverse tcp:8081 tcp:8099` because an older inaccessible listener occupied host port 8081.

No password, application session, Situm API key, Positioning credential, or other secret is recorded in this evidence.

## Runtime configuration remediation

The installed debug shell initially loaded a Metro bundle with no `EXPO_PUBLIC_API_BASE_URL`, producing `The mobile service address is not configured.`

A local ignored `mobile/.env` now supplies:

- environment: staging;
- API base URL: device-local reverse endpoint `http://127.0.0.1:3000`.

A clean Metro instance loaded this environment and the app subsequently authenticated successfully against staging.

## Authentication / session

PASS for the exercised path:

- smoke owner account authenticated on the physical POS;
- authenticated shell rendered the owned workspace `Test Situm`;
- workspace readiness rendered truthfully;
- force-stop/relaunch restored the authenticated session and workspace without re-entering credentials.

Credential values are intentionally omitted.

## Acceptance-discovered runtime routing defect and remediation

Initial Explore load failed with the generic product error `Map unavailable — The request could not be completed.`

A temporary local observability proxy that logged only HTTP method, request path, and response status (never headers/body/session/credentials) established:

- `GET /api/workspaces/<owned-workspace>/mobile-positioning -> 404`;
- `GET /api/workspaces/<owned-workspace>/situm/cartography -> 200`.

Root cause: Nitro runtime routing selected `server/api/workspaces/[...workspacePath].ts` ahead of the sibling `server/api/workspaces/[workspaceId]/mobile-positioning.get.ts`, the same class of route-shadowing previously discovered for Viewer auth. The catch-all did not handle `mobile-positioning` and returned 404.

Remediation added an owner/session-gated `mobile-positioning` branch to the runtime catch-all using the existing `resolveMobilePositioningCredential` authority. Focused Plan 034 tests, root typecheck, and `git diff --check` passed. A local linux/amd64 staging image was rebuilt and the staging container force-recreated without pushing to GHCR.

Post-remediation runtime evidence:

- `GET /api/workspaces/<owned-workspace>/mobile-positioning -> 200`;
- `GET /api/workspaces/<owned-workspace>/situm/cartography -> 200`;
- Explore rendered the real `PT Berjaya Inovasi Global` building, real floors, and real POIs including `Pintu Masuk` and `Ruang Kerja Lt 2`.

## Realtime

PASS for the exercised no-data path:

- Realtime destination loaded for the authorized workspace;
- response produced a truthful `No positions reported` state;
- no invented online/presence/freshness state or fake marker was rendered.

No claim is made for live remote records because the workspace returned no current device-position records during this checkpoint.

## Settings

PASS for exercised presentation:

- owned workspace rendered;
- signed-in account context rendered;
- Location access remained contextual;
- Background location remained `Not requested`.

## Physical positioning attempt

Positioning authority now reaches the app and real cartography loads, but physical positioning is BLOCKED by the vendor Android location stack.

Exercised runtime path:

1. `Find my location` opened the Situm User Helper.
2. Fine/coarse location permission was granted through the Android runtime dialog.
3. Android reports `Location Enabled: true`.
4. Wi-Fi scanning and Bluetooth scanning settings were enabled.
5. Bluetooth was enabled through Settings (`bluetooth_on=1`).
6. The app has granted fine/coarse location permissions.
7. Situm still emits `LOCATION` error code `8002`: `Location must be enabled to scan Bluetooth, Wi-FI and GPS` and immediately returns positioning to STOPPED.
8. Android `dumpsys location` simultaneously reports Location enabled but its `network provider` remains `enabled=false`; adding `network` to `location_providers_allowed` did not make the provider become enabled.

This is treated as a real physical/runtime blocker, not a positioning PASS. No location fix, floor transition, navigation progress, destination completion, or out-of-route event may be claimed from this run.

## Deep-link checkpoint

The currently installed native shell advertises only custom scheme `situm-explore-dev` according to `dumpsys package com.situm.explore`.

A staging deep-link intent using `situm-explore-staging://...` therefore could not resolve. The Metro JS bundle is staging-configured, but changing Expo environment variables does not rewrite an already-installed native manifest. Staging custom-scheme acceptance requires a staging-configured native rebuild/reinstall (or a deliberate decision to exercise the installed dev scheme as supplemental evidence only).

## Current result

Passed in this checkpoint:

- mobile runtime API base URL correction;
- physical login/authentication;
- authenticated session restore after force-stop/relaunch;
- workspace selection/readiness;
- owner-scoped Positioning credential retrieval after route remediation;
- real cartography/building/floor/POI load;
- Realtime authorized empty state;
- Settings truthful state.

Still incomplete / blocked:

- physical location fix because Situm reports LOCATION/8002 on this vendor POS even while Android Location is enabled; network location provider remains disabled;
- floor transition;
- navigation start/progress/completion/out-of-route based on a real current fix;
- staging custom-scheme deep-link acceptance until a staging native shell is rebuilt/reinstalled;
- live Realtime record/lifecycle claims where no current records are available;
- remaining Plan 034 cross-feature/background/logout/restart/failure sequences not explicitly exercised here.

Plan 034 remains in progress and must not be closed or merged from this evidence.

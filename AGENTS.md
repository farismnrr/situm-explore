# AGENTS.md

This repository is a persistent agent workspace for Situm Explore.

Keep this file short. Current authority lives in `.agents/state.md`.

## Mandatory read order

1. `.agents/identity.md`
2. `.agents/state.md`
3. the active plan execution brief under `.agents/execution/` when a new plan is explicitly active
4. `.agents/protocols/chat-lifecycle.md`
5. `.agents/protocols/git-workflow.md`
6. `.agents/memory/decisions.md`
7. `.agents/memory/roadmap-021-025.md` for completed-roadmap context when needed
8. `ARCHITECTURE.md`
9. `plans/README.md`
10. `plans/021-025-prerequisites.md` when historical prerequisite context is needed
11. `design/data-source-matrix.md` when Situm/product capability scope matters
12. the relevant plan
13. `DESIGN.md` / `design/IMPLEMENTATION.md` for presentation changes

Historical plans/sessions/branches are evidence only and do not override current state, durable decisions, architecture, or a future explicitly activated plan.

## Current roadmap

Completed/integrated:

```text
Plan 017 -> 018 -> 019 -> 019A -> 020 [complete/integrated]
```

Completed implementation roadmap:

```text
Plan 021 -> Plan 022 -> Plan 023 -> Plan 024 -> Plan 025 [complete on stacked branch]
```

Plans 026–035 are closed/integrated. Plans 028–034 delivered and closed the native companion roadmap, with Plan 034 retaining truthful documented limitations rather than fabricating full-E2E PASS. Plan 035 then remediated the Realtime/foreground-positioning lifecycle and was integrated with the Android release/distribution polish through PR #32 at merge commit `840c0f9`; the former Plan 035 branch was deleted. There is currently **no active implementation plan**. New product work must start from updated `main` on a new dedicated plan branch. Google OAuth runtime remains user-owned and deferred.

## Backend-refactor direction

The completed roadmap introduced DB-backed users, real email/password registration/login, private single-owner workspaces, workspace-managed Situm configuration, permission-aware behavior, reuse of existing observability infrastructure, request correlation/tracing, workspace-isolated analytics, and sanitized client error boundaries.

Google OAuth is prepared but real runtime acceptance is deferred to the user.

The legacy env-defined auth/global Situm context is historical migration evidence from before Plans 021–025. The current integrated source/runtime and completed-plan outcomes are authoritative; do not resurrect the legacy global model.

## External integration rule

For Situm behavior: **no evidence, no implementation**. Verify current official contracts and installed SDK/runtime behavior. Keep unresolved capabilities absent rather than guessing.

## Git workflow

- one plan = one dedicated plan branch;
- never implement directly on `main`;
- avoid destructive history rewriting;
- PR creation and merge are user-gated;
- dependent plans normally start after the preceding plan is integrated into updated `main`;
- implementation/fixes for an explicitly active plan go to the configured `worker` subagent;
- parent owns orchestration, review, state/plan persistence, commits, pushes, and transitions.

## Android build safety

- The physical acceptance POS is `arm64-v8a`; ordinary agent Android builds must not compile x86/x86_64/armeabi-v7a unless a task explicitly requires another ABI.
- Prefer `cd mobile && npm run build:android:release` for release candidates; its script pins `-PreactNativeArchitectures=arm64-v8a` and validates the public API origin.
- `expo-build-properties` also pins `android.buildArchs` to `arm64-v8a`, so `expo prebuild` must preserve the single-ABI default in `android/gradle.properties`.
- Before a long physical-device build, verify the target ABI with `adb shell getprop ro.product.cpu.abi` and inspect the effective `reactNativeArchitectures` value. If the build starts CMake tasks for four ABIs, stop and correct the invocation/config instead of letting it burn CPU.
- For normal React Native UI/TypeScript E2E iteration, do **not** regenerate native projects or run a release build on every change. Build/install the native debug shell once with `cd mobile && npm run build:android:device`, then keep Metro running with the required API env and iterate through JS/TS reloads. Rebuild native only after native dependencies/config plugins/app config change.
- The MCP terminal sandbox does not preserve the normal user Gradle home reliably between calls. The device-build script therefore uses the ignored `mobile/.gradle-agent-home` cache by default; direct agent Gradle commands must set that same `GRADLE_USER_HOME` explicitly. Never use `--no-daemon` for iterative local/device builds.

## Mandatory closeout

Follow `.agents/protocols/persistence.md` and keep durable state aligned with exact current truth.

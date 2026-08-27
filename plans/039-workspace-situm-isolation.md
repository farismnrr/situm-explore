# Plan 039 — Workspace Situm Isolation

Status: **implementation complete / automated validation passed / deployment pending**
Branch: `plan/039-workspace-situm-isolation`

## Goal

Make Situm configuration truly independent per Situm Explore workspace. Each workspace owns its own Situm organization/account binding and exactly two credentials: **Only Read** and **Read & Write**. Creating or configuring one workspace must never inherit, constrain, or mutate another workspace's Situm organization.

## Required behavior

- First-time configuration of a workspace may use credentials from any Situm organization.
- A workspace may have zero, one, or both credentials configured.
- Replacing only one credential must keep the other credential unchanged and require the replacement to belong to the same Situm organization as the retained credential.
- Replacing both credentials in one save may move that workspace to a different Situm organization when both new credentials belong to the same organization.
- No operation on one workspace may read or update another workspace's Situm config row.
- Safe validation failures must reach the Workspace UI with actionable copy; raw credentials and upstream sensitive details must never be exposed.

## Implementation

1. Refactor workspace Situm save logic to determine the authoritative organization from the credentials that will remain after the update rather than blindly pinning to the previous `situmAccountId`.
2. Verify retained credentials server-side when required to establish the organization boundary for partial updates.
3. Allow full two-key replacement to change `situmAccountId` atomically for that workspace.
4. Preserve first-time configuration semantics for new workspaces.
5. Preserve owner/workspace scoping on every DB query.
6. Add safe error metadata/code propagation through the global error boundary and map those codes to actionable UI messages without exposing arbitrary upstream text.
7. Add regression coverage for first-time config, multi-workspace isolation, partial replacement, full cross-organization replacement, and safe error propagation.

## Validation

- `git diff --check`
- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

Validation passed on 2026-08-27: 83/83 tests, lint, typecheck, production build, and `git diff --check`.

No deployment, PR, or merge is part of this plan unless separately authorized.

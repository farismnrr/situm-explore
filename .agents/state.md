# Current State

_Last reviewed: 2026-08-13_

## Integrated baseline

Plans 017–020 are complete and integrated into `main` by PR #12. Current canonical baseline before this roadmap is `main`.

## Active roadmap

Planning branch:

`roadmap/021-025-backend-refactor`

```text
Plan 021 — Identity & Auth Foundation                       [ready after roadmap integration]
Plan 022 — Private Workspaces & Situm Configuration         [queued]
Plan 023 — Observability, Correlation & Safe Error Boundary [queued]
Plan 024 — Workspace-scoped Situm Backend Migration         [queued]
Plan 025 — Workspace UX & Full Regression                   [queued]
```

No stacked implementation authorization exists for Plans 021–025. Normal workflow requires this roadmap planning branch to be reviewed/integrated into `main` before Plan 021 starts from updated `main`.

## Mandatory roadmap reads

While Plans 021–025 are active, after general durable decisions read:

- `.agents/memory/roadmap-021-025.md`;
- `plans/021-025-prerequisites.md`;
- `design/ROADMAP-021-025-OVERRIDES.md`;
- the active plan.

These transition documents supersede stale pre-refactor wording that treats env-defined app users, no registration backend, exactly two global Situm env keys, or one global Situm building as the permanent target.

`ARCHITECTURE.md`, `design/IMPLEMENTATION.md`, and `design/data-source-matrix.md` still contain useful current-runtime/historical evidence. Where they conflict with the approved transition, use the roadmap override instead. Plan 025 will reconcile them to the final post-refactor architecture.

## Locked product direction

- database-backed application users replace the env-defined owner login;
- working email/password registration/login is acceptance-critical;
- Google OAuth is prepared but real runtime acceptance is deferred to the user;
- one user may own many private single-owner workspaces;
- no workspace invites/members/org hierarchy in this roadmap;
- external Situm account/org association is not globally unique; multiple users may configure the same external account;
- Situm API keys become encrypted workspace-managed server data, not permanent global env values;
- product modes are `VIEW_ONLY` and `VIEW_WRITE`, while verified upstream permission remains authoritative;
- long-lived Situm workspace credentials must not be returned to browser code;
- existing observability infrastructure must be discovered with local `docker ps`/runtime inspection and reused;
- frontend requests gain trace/correlation context;
- critical/internal error details stay server-side and client responses remain sanitized;
- workspace isolation must extend to ClickHouse analytics and account-specific Viewer/building context.

## Known prerequisites / potential blockers

See `plans/021-025-prerequisites.md` for the detailed matrix.

Important current items:

1. **Workflow gate:** roadmap planning must land in `main` before Plan 021 under normal workflow, unless the user explicitly authorizes stacking.
2. **Plan 021:** requires working PostgreSQL migration access and `NUXT_SESSION_PASSWORD`; Google OAuth credentials are not required for acceptance.
3. **Plan 022:** requires a server-only workspace credential encryption master key; local value may be generated into `.env` only without printing/committing it.
4. **Situm Viewer security gate:** if a JWT derived from a write-capable key cannot be safely least-privileged for browser Viewer use, stop and ask the user rather than exposing broad write authority silently.
5. **Plan 023:** observability endpoint/auth/network prerequisites depend on what local `docker ps` actually discovers; do not provision duplicates.
6. **Plan 024:** legacy ClickHouse rows have no workspace owner and must not be assigned arbitrarily; global Situm building/account context must also be migrated.
7. **Plan 025:** full real permission smoke ideally needs both Situm `Only Read` and `Read & Write` test configurations.

## Next action

Review/integrate the planning-only branch `roadmap/021-025-backend-refactor` into `main`. After that, create `plan/021-auth-identity-foundation` from updated `main` and execute Plan 021 only.

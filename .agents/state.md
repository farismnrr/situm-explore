# Current State

_Last reviewed: 2026-08-13_

## Integrated baseline

Plans 017–020 are complete and integrated into `main` by PR #12.

The Plans 021–025 backend-refactor roadmap and reconciled current documentation are integrated into `main` by PR #13.

## Active roadmap

```text
Plan 021 — Identity & Auth Foundation                       [ready / next]
Plan 022 — Private Workspaces & Situm Configuration         [queued]
Plan 023 — Observability, Correlation & Safe Error Boundary [queued]
Plan 024 — Workspace-scoped Situm Backend Migration         [queued]
Plan 025 — Workspace UX & Full Regression                   [queued]
```

No stacked implementation authorization exists for Plans 021–025. Normal sequential workflow applies: Plan 021 starts from updated `main`, and each dependent plan starts only after its predecessor is accepted/integrated.

The former planning branch `roadmap/021-025-backend-refactor` is historical after PR #13 and is not an implementation base.

## Mandatory roadmap reads

While Plans 021–025 are active, read current authority in this order after the general protocols:

1. `.agents/memory/decisions.md`;
2. `.agents/memory/roadmap-021-025.md`;
3. `ARCHITECTURE.md`;
4. `plans/README.md`;
5. `plans/021-025-prerequisites.md`;
6. `design/data-source-matrix.md` when Situm/product capability scope matters;
7. the active plan;
8. `DESIGN.md` / `design/IMPLEMENTATION.md` for presentation changes.

Historical plans/sessions/branches are evidence only and do not override current authority.

## Locked product direction

- database-backed application users replace the env-defined owner login;
- working email/password registration/login is acceptance-critical;
- Google OAuth is prepared but real runtime acceptance is deferred to the user;
- one user may own many private single-owner workspaces;
- no workspace invites/members/org hierarchy in this roadmap;
- external Situm account/org association is not globally unique; multiple users may configure the same external account;
- Situm configuration becomes protected workspace-managed server data rather than permanent global runtime configuration;
- product modes are `VIEW_ONLY` and `VIEW_WRITE`, while verified upstream permission remains authoritative;
- stored long-lived workspace credentials must not be returned to browser code;
- existing observability infrastructure must be discovered with local `docker ps`/runtime inspection and reused;
- frontend requests gain trace/correlation context;
- critical/internal error details stay server-side and client responses remain sanitized;
- workspace isolation must extend to ClickHouse analytics and account-specific Viewer/building context.

## Known prerequisites / potential blockers

See `plans/021-025-prerequisites.md` for the detailed matrix.

Important current items:

1. **Roadmap integration gate:** satisfied by PR #13.
2. **Plan 021:** requires working PostgreSQL migration access and `NUXT_SESSION_PASSWORD`; Google OAuth credentials are not required for acceptance.
3. **Plan 022:** requires a server-only workspace encryption master key.
4. **Viewer auth gate:** if browser auth for a write-capable workspace cannot be proven safe from current Situm/SDK evidence, stop that exact path and ask the user.
5. **Plan 023:** observability endpoint/auth/network prerequisites depend on what local `docker ps` and runtime configuration discover; do not provision duplicates.
6. **Plan 024:** legacy ClickHouse rows have no workspace owner and must not be assigned arbitrarily; global Situm building/account context must also be migrated.
7. **Plan 025:** full real permission smoke ideally needs both Situm `Only Read` and `Read & Write` test configurations.

Environment/config prerequisite handling is intentionally deferred until the user moves to that step.

## Documentation state

Current authority/docs have been reconciled for this roadmap. Completed plans and old sessions remain historical evidence and are intentionally not rewritten.

## Next action

When the user authorizes implementation, create `plan/021-auth-identity-foundation` from updated `main` and execute Plan 021 only. Do not start environment/config work before that separate user step.

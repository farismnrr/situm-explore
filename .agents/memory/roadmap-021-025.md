# Roadmap 021–025 Durable Decisions

Status: **active for Plans 021–025**

This file resolves roadmap-specific conflicts with pre-refactor durable wording.

## Conflict rule

For Plans 021–025, this file plus `.agents/state.md` supersedes older active wording that treats the permanent target as one env-defined application user or exactly two global Situm environment keys.

Those old values remain only the current pre-refactor runtime baseline until their replacement is implemented and accepted.

## Identity and workspace

- Real application users are persisted in the app database.
- Email/password registration/login is required.
- Google OAuth is prepared, but real OAuth acceptance is deferred to the user.
- One app user may own many private workspaces.
- Workspaces are single-owner only; no invite/member/team model in this roadmap.
- Different app users may independently point workspaces at the same external Situm account.
- Situm organizations are external metadata, not app workspace tenancy.

## Situm workspace configuration

- Situm configuration becomes workspace-managed from the dashboard rather than permanent global runtime configuration.
- Product access modes are `VIEW_ONLY` and `VIEW_WRITE`.
- Real upstream permission remains authoritative.
- Unsupported/intermediate Situm permissions are handled conservatively.
- Viewer authentication changes require exact verification against current official Situm docs and the installed SDK.

## Observability

- Inspect `docker ps` and current runtime/repository configuration before adding observability components.
- Reuse the user's existing observability stack rather than provisioning duplicates.
- Add browser -> Nitro -> downstream trace/correlation context.
- Keep detailed internal diagnostics server-side and client failures sanitized.

## Execution

- Plan 021 is next.
- Plans 022–025 remain queued.
- No stacked implementation authorization exists unless the user explicitly grants it later.

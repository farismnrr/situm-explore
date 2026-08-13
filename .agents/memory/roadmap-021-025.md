# Roadmap 021–025 Durable Decisions

Status: **active for Plans 021–025**

This file records roadmap-specific decisions that remain useful across individual plan branches.

## Identity and workspace

- Real application users are persisted in the app database.
- Email/password registration/login is required.
- Google OAuth is prepared, but real OAuth acceptance is deferred to the user.
- One app user may own many private workspaces.
- Workspaces are single-owner only; no invite/member/team model in this roadmap.
- Different app users may independently point workspaces at the same external Situm account.
- Situm organizations are external metadata, not app workspace tenancy.

## Workspace Situm configuration

- Situm configuration becomes workspace-managed from the authenticated product rather than permanent global runtime configuration.
- Protected workspace configuration is persisted server-side.
- Product access modes are `VIEW_ONLY` and `VIEW_WRITE`.
- Real upstream permission remains authoritative.
- Unsupported/intermediate Situm permission states are handled conservatively.
- Browser Viewer authentication changes require exact verification against current official Situm docs and the installed SDK.
- Stored long-lived workspace credentials are not browser-facing product data.

## Analytics/workspace isolation

- ClickHouse remains analytics-only and server-side.
- Multi-workspace analytics must be isolated by owned workspace context.
- Legacy pre-workspace rows have no proven workspace owner and are not assigned arbitrarily.
- If old analytics history must be attributed/preserved under a workspace, obtain a user retention decision before destructive migration.

## Observability / errors

- Inspect `docker ps` and current runtime/repository configuration before adding observability dependencies or endpoints.
- Reuse the user's existing observability stack rather than provisioning duplicates.
- Add browser -> Nitro -> downstream trace/correlation context.
- Keep detailed internal diagnostics server-side and client failures sanitized.
- Do not place sensitive values into correlation headers, baggage, logs, or spans.

## Execution

- Planning branch: `roadmap/021-025-backend-refactor`.
- Plan 021 is next only after the planning branch is reviewed/integrated into `main` under the normal workflow.
- Plans 022–025 remain sequential dependencies.
- No stacked implementation authorization exists unless the user explicitly grants it later.

## Authority

Current `.agents/state.md`, `.agents/memory/decisions.md`, `ARCHITECTURE.md`, current design contracts, prerequisites, and the active plan are reconciled for this roadmap.

Historical plans/session notes document how the product arrived here but do not override current roadmap truth.

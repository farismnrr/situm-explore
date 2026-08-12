# Plan 015 — Situm Organization & Alarms Read Integration

Status: planned-later
Branch: `plan/015-situm-organization-alarms-read-integration`
Depends on: UI accepted; earlier read integrations stable

## Goal

Replace the remaining organization/users/groups/alarm dummy context with real read-only Situm data only if those surfaces are still valuable to the POC after UI acceptance.

## Mandatory HTML-first UI reference

Canonical visual/interaction reference:

`design/reference/situm-explore-interactive-prototype.html`

Before implementation, read:

- `#app-organization` for organization summary and permission-boundary composition;
- `#app-users` for users/groups table and group-summary composition;
- `#app-alarms` for filters, table density, status/type pills;
- `#detailDrawer` if real user/resource rows reuse the shared details pattern.

Real Situm metadata must be mapped into these accepted UI contracts. Do not turn the pages into broader admin interfaces just because the API exposes more fields/actions.

## Phases

1. [ ] Re-read `#app-organization`, `#app-users`, `#app-alarms`, and relevant `#detailDrawer` states before defining mappings.
2. [ ] Verify current official users/groups/organization/alarm read APIs and permission requirements.
3. [ ] Keep Situm organization users distinct from Situm Explore application authentication/session users.
4. [ ] Replace organization summary with safe real metadata that does not expose credentials or private configuration while preserving `#app-organization` composition.
5. [ ] Replace users/groups tables with real read-only directory data if POC value justifies it while preserving `#app-users` hierarchy.
6. [ ] Replace alarm rows/status with real read-only data if supported by the current key/API while preserving `#app-alarms` filters/table states.
7. [ ] Do not add acknowledge/resolve/create/edit actions.
8. [ ] Remove only dummy fixtures actually replaced by real data.
9. [ ] Compare all three real-data screens against the canonical HTML after integration.
10. [ ] Validate permission boundary, empty/error states, lint/typecheck/build, manual smoke, phase commits/pushes.

## Non-goals

- Situm user administration;
- app account management;
- alarm acknowledgement/resolution;
- API key management UI;
- Cartography Edition or Read & Write permissions;
- new application DB tables.

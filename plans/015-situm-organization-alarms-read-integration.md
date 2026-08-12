# Plan 015 — Situm Organization & Alarms Read Integration

Status: planned-later
Branch: `plan/015-situm-organization-alarms-read-integration`
Depends on: UI accepted; earlier read integrations stable

## Goal

Replace the remaining organization/users/groups/alarm dummy context with real read-only Situm data only if those surfaces are still valuable to the POC after UI acceptance.

## Phases

1. [ ] Verify current official users/groups/organization/alarm read APIs and permission requirements.
2. [ ] Keep Situm organization users distinct from Situm Explore application authentication/session users.
3. [ ] Replace organization summary with safe real metadata that does not expose credentials or private configuration.
4. [ ] Replace users/groups tables with real read-only directory data if POC value justifies it.
5. [ ] Replace alarm rows/status with real read-only data if supported by the current key/API.
6. [ ] Do not add acknowledge/resolve/create/edit actions.
7. [ ] Remove only dummy fixtures actually replaced by real data.
8. [ ] Validate permission boundary, empty/error states, lint/typecheck/build, manual smoke, phase commits/pushes.

## Non-goals

- Situm user administration;
- app account management;
- alarm acknowledgement/resolution;
- API key management UI;
- Cartography Edition or Read & Write permissions;
- new application DB tables.

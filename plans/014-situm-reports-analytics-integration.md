# Plan 014 — Situm Reports & Analytics Integration

> **Historical document.** Retained for execution/evidence history. It is not current plan authority; consult `.agents/state.md` and `plans/README.md`.


Status: **historical/skipped-unresolved** — retained as evidence only; later analytics work is governed by the integrated Plans 017/027 architecture.
Branch: `plan/014-situm-reports-analytics-integration`
Base: Plan 013 final HEAD `3c3c0af` (explicit stacked execution; not integrated into `main`)
Depends on: Plan 013 complete and available as the stacked parent branch

## Goal

Replace retained Analytics/Dashboard/Home report fixtures with real Situm report data, one report contract at a time.

Plan 010 may remove unsourced metrics before this plan. Do not restore removed metrics merely to match the old prototype.

## Required reading

- `AGENTS.md`
- `ARCHITECTURE.md`
- `design/data-source-matrix.md`
- completed Plan 010 capability mapping
- completed Plans 011–013
- current Analytics/Dashboard/Home implementation
- this plan

## Retained report scope

Implement only reports retained and exactly mapped by Plan 010, expected to include where available/useful:

- visitors;
- geofence stay time/session data;
- positioning time;
- user positions;
- Map Viewer usage;
- heatmap;
- other retained Dashboard/Home aggregates that are direct derivatives of real mapped datasets.

A metric with no real source is removed, not silently kept as fixture data.

## Credential/data path

- Report reads use authenticated Nitro/server access with private Situm credentials.
- No public Read-Write REST credential.
- No report persistence/cache in PostgreSQL for the POC.
- Use direct/small integration helpers; do not create a generic reports framework.

## Per-report workflow

For each retained report:

1. [ ] verify exact current official endpoint and date/filter semantics;
2. [ ] document minimal external response -> UI mapping;
3. [ ] replace only that report fixture;
4. [ ] add truthful loading/empty/error state;
5. [ ] never mix fake and real values in one metric group;
6. [ ] validate before moving to the next report.

## CSV/export

- [ ] Prefer real report output/data for CSV export.
- [ ] Remove local fixture-only export messaging.
- [ ] Do not generate a fake success CSV when the real report fails.

## Execution disposition — 2026-08-13

The installed SDK does not expose the report methods required by this plan, and the official REST documentation currently available to this execution does not provide verified response schemas, filter/date semantics, permissions, or format handling for the retained report families. Plan 010 classified these capabilities `UNRESOLVED`. No report route, fixture replacement, aggregate, or CSV success path was implemented. The plan is explicitly skipped under the evidence gate and may resume only after exact official contracts are captured.

## Dashboard/Home aggregates

- [ ] Derive retained counts/summary cards from already-integrated real domains/reports where practical.
- [ ] Do not create an event/audit backend solely to preserve the old `Recent activity` panel.
- [ ] Do not show capacity percentages unless a real mapped source provides capacity.

## Validation

- [x] all retained report values remain absent where no real source is verified;
- [x] removed/unsupported metrics stay removed;
- [x] no public REST credential;
- [x] no unverified date-range/report claim was added;
- [x] no remote mutation;
- [x] `git diff --check`;
- [x] no code changed, so lint/typecheck/build are not applicable;
- [ ] manual report/export smoke (blocked by unresolved official contracts and unavailable credentials);
- [x] update plan + `.agents/`, commit/push;
- [x] no PR until user authorization.

## Non-goals

- report writes;
- report persistence/background processing;
- synthetic replacement values on API failure;
- restoring UI pruned by Plan 010.

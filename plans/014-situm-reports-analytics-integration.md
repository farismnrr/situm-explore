# Plan 014 — Situm Reports & Analytics Integration

Status: planned-later
Branch: `plan/014-situm-reports-analytics-integration`
Depends on: Plan 013 complete, reviewed, and integrated into `main`

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

## Dashboard/Home aggregates

- [ ] Derive retained counts/summary cards from already-integrated real domains/reports where practical.
- [ ] Do not create an event/audit backend solely to preserve the old `Recent activity` panel.
- [ ] Do not show capacity percentages unless a real mapped source provides capacity.

## Validation

- [ ] all retained report values have real sources;
- [ ] removed/unsupported metrics stay removed;
- [ ] no public REST credential;
- [ ] date ranges are truthful;
- [ ] no remote mutation;
- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] manual report/export smoke;
- [ ] update plan + `.agents/`, commit/push;
- [ ] no PR until user authorization.

## Non-goals

- report writes;
- report persistence/background processing;
- synthetic replacement values on API failure;
- restoring UI pruned by Plan 010.

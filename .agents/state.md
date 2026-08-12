# Current State

_Last reviewed: 2026-08-13_

## Current focus

The UI stage is **closed, accepted by the user after manual correction, and integrated into `main`**.

Automated Plan 009B work was stopped after it regressed the rendered UI. The user completed the difficult UI correction manually, explicitly accepted that result, and then authorized integrating the cumulative UI roadmap into `main`.

Do not reopen Plan 009B, its targeted addendum, or create Plan 009C from old audit findings unless the user explicitly requests new UI work.

## UI roadmap state

- Plan 009A: closed historically with known UI gaps.
- Plan 009B: **closed-manual-accepted**.
- Plan 009B Analytics/Users/Organization/Settings addendum: **closed-manual-accepted**.
- No Plan 009C is active or required.
- Final UI acceptance authority is the user's manual result and explicit acceptance, not the old automated 009B checklists.

## Integrated baseline

`main` is now the canonical cumulative baseline.

Integration PR: `#6` — **Integrate cumulative UI roadmap through Plan 009B**.

Merged `main` commit:

`873253075dfbb79410d4f3c94865759ccac43a02`

The merge contains the cumulative Plan 004–009B history and the user's pushed manual UI revision. Historical `plan/009-ui-conformance-polish` diverged after 009A was created; its late tip was intentionally not merged separately because later work superseded/selectively reimplemented the relevant changes and re-merging it could reintroduce superseded UI.

Treat old plan branches as historical references. New roadmap work must branch from current `main` unless the user explicitly chooses another base.

## Accepted UI preservation contract

For later backend/Situm work:

- treat the manually accepted UI now on `main` as the product presentation contract;
- adapt Situm/API data into the accepted UI rather than redesigning screens around API payloads;
- do not revive old 009B abstractions unless the user explicitly asks;
- make only necessary UI changes for truthful loading/empty/error/runtime states and preserve the accepted composition.

## Runtime/data boundary

Keep real and protected:

- `/api/auth/login`;
- `useUserSession()` / logout / auth middleware;
- `/api/me` and PostgreSQL/Drizzle behavior;
- `/api/situm/status` configuration semantics;
- real Situm Viewer initialization and lifecycle;
- `MAP_IS_READY` / `APP_ERROR` / missing-config behavior.

Product-domain data remains local/dummy until its assigned later integration plan replaces it.

## Backend roadmap gate

**Plan 010 is unblocked and is the next roadmap plan.**

Plan 010 is feasibility/contract mapping only; it must preserve the accepted UI and must not replace dummy datasets yet.

Normal preflight before execution:

1. fetch latest refs;
2. confirm `main` is current and clean;
3. create `plan/010-progressive-situm-data-integration` from current `main`;
4. follow Plan 010 sequentially;
5. do not merge later plan work without explicit user authorization.

## Next action

Start Plan 010 from current `main` when the user requests it.

# Current State

_Last reviewed: 2026-08-13_

## Current focus

The UI stage is **closed and accepted by the user after manual correction**.

Automated Plan 009B work was stopped because it regressed the rendered UI. The user took over the difficult UI work manually, completed it, and explicitly asked to close the UI plans so the roadmap can continue without the UI blocker.

Do not reopen Plan 009B, its targeted addendum, or create Plan 009C from old audit findings unless the user explicitly requests new UI work.

## UI roadmap state

- Plan 009A: closed historically with known UI gaps.
- Plan 009B: **closed-manual-accepted**.
- Plan 009B Analytics/Users/Organization/Settings addendum: **closed-manual-accepted**.
- No Plan 009C is active or required.
- Final UI acceptance authority is the user's manual result and explicit acceptance, not the old automated 009B checklists.

## Branch / baseline rule

Current cumulative UI branch:

`plan/009b-ui-final-fidelity-punch-list`

Before starting Plan 010, confirm the user's final manual UI changes are committed and pushed. Create the Plan 010 branch from that final cumulative UI HEAD, not stale `main` and not an older 009A/009B implementation baseline.

Do not reset, rebase, or rewrite accepted manual UI merely to match old automated plan assumptions.

No PR or merge is implied by UI closure.

## Accepted UI preservation contract

For later backend/Situm work:

- treat the current manually accepted Nuxt UI as the product presentation contract;
- adapt external Situm/API data into the accepted UI rather than redesigning screens around API shapes;
- do not revive old 009B abstractions unless the user explicitly asks;
- small UI changes required for truthful loading/empty/error/runtime states are allowed only when necessary and should preserve the accepted composition.

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

**Plan 010 is now unblocked and may start when the user requests it.**

Plan 010 is feasibility/contract mapping only; it must preserve the accepted UI and must not replace dummy datasets yet.

Normal preflight before execution:

1. fetch latest refs;
2. confirm final manual UI changes are committed/pushed;
3. create `plan/010-progressive-situm-data-integration` from the final cumulative UI HEAD;
4. follow Plan 010 sequentially;
5. do not create a PR or merge unless explicitly authorized.

## Next action

Plan 010 is the next roadmap plan and is ready to start on explicit user instruction.

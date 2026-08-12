# Plan 009B — Final UI Fidelity Punch List

Status: **pending-user-scope**
Branch: `plan/009b-ui-final-fidelity-punch-list`
Depends on: Plan 009A closed baseline from the cumulative UI branch chain
Blocks: Plan 010 and every later backend/Situm integration plan until this plan is completed or explicitly skipped by the user and the final rendered UI is explicitly accepted

## Purpose

Own the remaining UI fidelity issues that the user identifies after manually reviewing the post-009A application.

Plan 009A is intentionally closed and historical. The user has stated that the overall application is safe enough to close 009A, but the UI is **not yet considered 100% final**. Remaining issues must not be silently folded back into 009A.

## Scope status

The concrete punch list is **not defined yet**.

The user is currently identifying which rendered surfaces still have issues. Do not invent a 009B implementation scope from older audit notes, generic visual taste, or assumptions about what the user will want changed.

Wait for the user's concrete issue list before turning this file into an executable implementation checklist.

## Hard boundaries

When scope is later supplied:

- use the user's latest explicit direction first;
- use the canonical HTML reference for any fidelity issue that still targets the approved prototype;
- preserve Nuxt 4 + Vue + Nuxt UI production architecture;
- follow `ARCHITECTURE.md`, SOLID, DRY, KISS, and layered boundaries;
- preserve real authentication, PostgreSQL/Drizzle behavior, and existing Situm Viewer lifecycle;
- keep missing product domains local/dummy until later integration plans;
- do not start new backend/Situm product-domain integration;
- do not create a PR or merge unless the user explicitly authorizes it.

## Execution gate

Do not execute Plan 009B until the user provides enough concrete UI issues to define the punch list.

Once the scope is supplied, update this plan with:

- exact affected route/surface/state;
- expected visual/interaction result;
- reference locator or explicit user direction;
- implementation boundary;
- responsive states that must be checked;
- validation requirements;
- final rendered acceptance checklist.

## Completion boundary

Plan 009B is complete only when:

1. every user-supplied punch-list item is resolved or explicitly waived;
2. lint/typecheck/build and applicable code gates pass;
3. required runtime behavior remains intact;
4. the relevant rendered surfaces are manually reviewed;
5. the user explicitly accepts the final UI baseline.

Only after that acceptance may Plan 010 begin.

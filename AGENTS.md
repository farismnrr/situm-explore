# AGENTS.md

This repository is a persistent agent workspace for Situm Explore.

Keep this file short. It is a router, not the knowledge base.

## Mandatory read order

At minimum every conversation reads:

1. `.agents/identity.md`
2. `.agents/state.md`
3. `.agents/protocols/chat-lifecycle.md`

For plan execution or repository changes also read:

4. `.agents/protocols/git-workflow.md`
5. `.agents/memory/decisions.md` when roadmap/product boundaries matter
6. `ARCHITECTURE.md`
7. `plans/README.md`
8. `design/data-source-matrix.md` when Situm/product capability scope matters
9. the active/follow-up plan

For UI/UX/presentation work also read:

10. `DESIGN.md`
11. `design/IMPLEMENTATION.md`
12. canonical visual references only as evidence

Historical plans/sessions are evidence only and must not override current state/contracts.

## Current roadmap truth

The current stacked feature lineage has completed Plans 017, 018, and 019.

The user explicitly inserted Plan 019A before Plan 020:

```text
Plan 017 — Analytics & Reports with local ClickHouse           [complete]
-> Plan 018 — Groups & Alarms read-only                        [complete]
-> Plan 019 — Realtime Viewer overlay                          [complete]
-> Plan 019A — Static Directions Foundation & Runtime Proof    [ACTIVE]
-> Plan 020 — Static Directions Product Completion             [queued]
```

Active branch:

`plan/019a-situm-static-directions-foundation`

Plan 019A starts from final Plan 019 HEAD `513f65e820635e05a22a54270f3bf21f5925e6c8`.

The earlier pre-019A `plan/020-situm-static-directions` branch is superseded as an execution base. Do not merge/cherry-pick it into 019A. Historical Phase 0 evidence may be consulted only where still accurate. After 019A completes, Plan 020 starts from the exact final pushed Plan 019A HEAD.

Read `.agents/state.md` for exact current evidence, branch chain, runtime-smoke requirements, and next action.

## No-hallucination external integration rule

For Situm behavior, model memory is not evidence.

Before implementation, verify exact current contracts from official Situm documentation/source and the installed SDK version where relevant.

Do not invent endpoint paths, SDK/Viewer methods, payload/event fields, permissions/auth behavior, web/native availability, browser/server ownership, or fake fallback values.

If exact evidence is incomplete, keep the capability `UNRESOLVED`/absent instead of guessing.

## Architecture boundary

Use the current Nuxt 4 structure under `app/`, `server/`, and optional `shared/`.

Prefer KISS. Do not introduce speculative services, repositories, stores, event buses, generic API clients, caches, background workers, or parallel design systems.

Situm uses exactly two credential boundaries unless a future concrete requirement changes that decision:

- `NUXT_PUBLIC_SITUM_API_KEY` for the browser Viewer;
- `NUXT_SITUM_API_KEY` for private Nitro Situm operations.

Protected server Situm routes require the application session. Native indoor positioning/bluedot and movement-aware handset navigation remain outside the Nuxt web roadmap.

Plan 017 added ClickHouse only as a server-side analytics store using the user's existing local instance. PostgreSQL/Drizzle remains the relational application store.

Plan 019A static directions remain Viewer-owned static routes between known real POIs. No `startNavigation`, current-location routing, live rerouting, synthetic route details, raw Viewer exposure, or generic invoke escape hatch.

## Git workflow

- one plan = one dedicated plan branch;
- never implement directly on `main`;
- no linked worktrees unless explicitly requested;
- complete phases with plan/state updates, validation, commit, and push;
- never merge without explicit user authorization;
- PR creation/review is user-gated;
- current exception: the user explicitly authorized this stacked feature lineage;
- each successor starts from the preceding plan's exact final validated/pushed HEAD;
- do not create a PR or merge during this run;
- implementation/fixes for each implementation phase must be delegated specifically to the configured `worker` subagent;
- if that worker profile cannot be spawned, stop rather than substituting another agent/model.

## Mandatory closeout

Before finishing a conversation, follow `.agents/protocols/persistence.md`.

Update current state/session evidence and revise durable memory/knowledge/decisions only when something durable changed.

Never persist credentials, API keys, JWTs, passwords, ClickHouse credentials, session cookies, or unnecessary sensitive payloads.

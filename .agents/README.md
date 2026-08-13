# Agent Context System

`.agents/` is the persistent context layer for Situm Explore.

Root `AGENTS.md` is intentionally a router. Architecture/design truth lives in root contracts; `.agents/` stores current state, durable decisions, operating protocols, verified knowledge, lessons, and concise history.

## Directory map

| Path | Purpose |
| --- | --- |
| `identity.md` | Mission, behavior, and stable agent principles. |
| `state.md` | Current focus, blockers, canonical/working branch, and next action. |
| `protocols/chat-lifecycle.md` | Conversation workflow. |
| `protocols/persistence.md` | What must be persisted after a conversation. |
| `protocols/git-workflow.md` | Plan branch, validation, commit/push, stacked-branch exception, and PR gates. |
| `memory/` | Durable user/project decisions and preferences. |
| `knowledge/` | Reusable verified domain knowledge. |
| `reflections/` | Reusable lessons about process/agent behavior. |
| `sessions/` | Chronological evidence; may become stale. |

## Mandatory read order for implementation

1. `AGENTS.md`.
2. `.agents/identity.md`.
3. `.agents/state.md`.
4. `.agents/protocols/chat-lifecycle.md`.
5. `.agents/protocols/git-workflow.md`.
6. `.agents/memory/decisions.md` when roadmap/product boundaries matter.
7. `ARCHITECTURE.md`.
8. `plans/README.md`.
9. `design/data-source-matrix.md` when Situm/product capability scope matters.
10. active/follow-up plan.
11. `DESIGN.md` and `design/IMPLEMENTATION.md` for UI/presentation changes.

Historical plans/session notes are evidence, not current authority.

## Truth hierarchy

When guidance conflicts, prefer:

1. user's latest explicit instruction;
2. current `.agents/state.md` and durable decisions;
3. current root architecture/design contracts;
4. active plan + current capability/data matrix;
5. current source/runtime behavior;
6. historical plans/session notes;
7. agent inference.

Never silently promote inference above current explicit instructions.

## Evidence rule

For external Situm behavior, memory is not implementation evidence.

Before implementation, verify the exact current contract using official Situm documentation/source and the installed SDK version where relevant.

Do not invent endpoint paths, SDK methods, payload fields, permissions, browser/server ownership, native/web ownership, or fake fallback values.

If a required capability is not verified, keep it `UNRESOLVED`/absent rather than guessing.

## Persistence model

Session notes answer **what happened?** and may become stale.

Durable files answer **what is still true?** They must be revised when newer decisions supersede older wording.

Before a completed implementation-phase commit:

1. update active plan/checklist;
2. update `.agents/state.md`;
3. update durable decisions/knowledge only when changed;
4. append/update current session evidence;
5. run required validation;
6. commit and push the plan branch.

Never store credentials, API keys, JWTs, passwords, ClickHouse credentials, or sensitive payloads.

## Current scope

Plans 017, 018, 019, 019A, and 020 in the completed stacked feature lineage are integrated into `main`. The feature branches are historical and are being removed after the successful PR #12 merge.

Current chain:

```text
Plan 017 — Analytics & Reports with existing local ClickHouse   [complete/integrated]
-> Plan 018 — Groups & Alarms read-only                        [complete/integrated]
-> Plan 019 — Realtime Viewer overlay                          [complete/integrated]
-> Plan 019A — Static Directions Foundation & Runtime Proof    [complete/integrated]
-> Plan 020 — Static Directions Product Completion             [complete/integrated]
```

Canonical branch:

`main`

PR #12 integrated the completed cumulative branch `plan/020-situm-static-directions-v2` into `main` at merge commit `5163af2a71c92441b01bccb81faac44933a91d1c`.

The pre-019A `plan/020-situm-static-directions` branch and all intermediate plan/roadmap branches are historical/superseded and must not be revived or replayed.

There is no active Plan 017–020 execution branch. The canonical execution baseline is `main`.

Read `.agents/state.md` for the exact current truth, evidence boundaries, branch chain, and next action.

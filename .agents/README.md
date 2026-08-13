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

Plans 017, 018, and 019 in the current stacked feature lineage are complete. The user explicitly inserted Plan 019A before Plan 020.

Current chain:

```text
Plan 017 — Analytics & Reports with existing local ClickHouse   [complete]
-> Plan 018 — Groups & Alarms read-only                        [complete]
-> Plan 019 — Realtime Viewer overlay                          [complete]
-> Plan 019A — Static Directions Foundation & Runtime Proof    [ACTIVE]
-> Plan 020 — Static Directions Product Completion             [queued]
```

Active branch:

`plan/019a-situm-static-directions-foundation`

Plan 019A starts from final Plan 019 HEAD `513f65e820635e05a22a54270f3bf21f5925e6c8`.

The pre-019A `plan/020-situm-static-directions` branch is superseded as an execution base. Keep it only as historical evidence; do not merge/cherry-pick it into 019A. After 019A completes, Plan 020 starts from the exact final Plan 019A HEAD.

Implementation/testing for each implementation phase remains delegated specifically to the configured `worker` subagent. The parent owns review, state/plan/session persistence, commits, pushes, and phase transitions. No PR or merge during this stacked run.

Read `.agents/state.md` for the exact current truth, evidence boundaries, branch chain, and next action.

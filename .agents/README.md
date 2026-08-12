# Agent Context System

`.agents/` is the persistent context layer for Situm Explore.

The root `AGENTS.md` is intentionally small. This directory contains the operating rules and durable context that Codex should read and maintain across conversations.

## Directory map

| Path | Purpose |
| --- | --- |
| `identity.md` | Mission, behavior, and stable agent principles. |
| `state.md` | Current focus, open loops, blockers, and next actions. |
| `protocols/chat-lifecycle.md` | What to read and do during each conversation. |
| `protocols/persistence.md` | Rules for deciding what gets written after a chat. |
| `protocols/git-workflow.md` | Mandatory plan-branch, phase commit/push, lint, and PR-gate workflow. |
| `design/` | Persistent design principles, UI implementation guide, and reference protocol for UI/UX work. |
| `memory/` | Durable context about the user: profile, preferences, goals, decisions. |
| `knowledge/` | Reusable external/domain knowledge and frameworks. |
| `reflections/` | Lessons that should improve future agent behavior. |
| `sessions/` | Concise chronological records of conversations. |

## Read order

At the start of a conversation:

1. Read `identity.md`.
2. Read `state.md`.
3. Read `protocols/chat-lifecycle.md`.
4. If executing a plan or changing repository implementation, read `protocols/git-workflow.md` before editing.
5. If doing UI/UX/styling/layout/component-composition work, read root `DESIGN.md` and relevant `design/` guidance before editing.
6. Read only the memory, knowledge, reflection, plan, and session files relevant to the task.
7. If the conversation references prior work and the durable stores are insufficient, inspect recent session notes.

Do not load the entire directory blindly when it becomes large. Use indexes and targeted search.

## Write model

There are two persistence layers:

### 1. Session history

Every conversation gets a concise session entry in `sessions/YYYY-MM-DD.md`.

Session notes answer: **what happened?**

They are chronological and may include context that later becomes stale.

### 2. Durable context

Memory, knowledge, reflections, decisions, design guidance, and state are updated only when there is a meaningful durable change.

Durable context answers: **what should still matter later?**

It should be compact, deduplicated, and revised when newer information supersedes older information.

For plan implementation, persistence is also a **pre-commit checkpoint**: relevant `.agents/` files and the active plan checklist must be updated before each completed phase is committed and pushed.

## Truth hierarchy

When information conflicts, prefer:

1. The user's latest explicit statement.
2. Current durable files under `.agents/` and root routers such as `DESIGN.md`.
3. Recent session notes.
4. Agent inference.

Never silently promote inference above explicit user statements.

## Maintenance principles

- Keep information atomic and easy to edit.
- Prefer replacing stale facts to appending contradictory history.
- Keep raw transcripts out of durable memory.
- Add timestamps when recency matters.
- Keep provenance clear: `user-stated`, `observed`, or `inferred`.
- If confidence is low, say so in the stored entry.
- Never persist secrets or credentials.
- Keep each plan isolated on its own branch and preserve a reviewable phase-by-phase Git history.
- Use the normal repository working directory; linked Git worktrees are optional only when explicitly requested.
- For UI work, use the persistent design context rather than inventing a new visual direction in each session.

## Current scope

The Nuxt web foundation and foundation hardening are complete. The active next step is `plans/003-ui-ux-refresh.md`: refresh the existing login/dashboard into a clean minimalist SaaS, light-only interface while preserving current auth, database, and Situm behavior. Native/mobile, CI, and unit-test infrastructure remain deferred until requirements justify them or the user explicitly asks for them.

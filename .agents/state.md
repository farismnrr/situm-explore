# Current State

_Last reviewed: 2026-08-12_

## Current focus

Build the repo-native foundation for a persistent self-improvement agent that works well with Codex.

## Phase

**Phase 0 — Agent foundation**

## Active decisions

- Root `AGENTS.md` acts as a short router into `.agents/`.
- `.agents/` is the source of truth for persistent agent context.
- Every conversation creates a concise session entry.
- Durable stores are updated only when the conversation produces durable changes.
- Product/application implementation is intentionally deferred.

## Open loops

- Validate the lifecycle through real conversations.
- Adjust memory categories if real usage reveals missing or noisy stores.
- Decide later whether automation/scripts are needed for persistence validation.

## Next likely action

Use the repository in normal Codex chats and observe whether the agent consistently reads context and performs the end-of-chat persistence pass.

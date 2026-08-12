# Lessons

Reusable lessons about how the agent should work belong here.

## 2026-08-12 — Persistence should separate history from truth

A mandatory write on every chat does not mean every durable file should change on every chat.

Use two layers:

- session notes for the chronological trace of every conversation;
- durable stores for information that should still shape future conversations.

This preserves continuity without turning memory into transcript noise.

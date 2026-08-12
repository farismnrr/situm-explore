# Decisions

## 2026-08-12 — Repo-native persistence foundation

- Keep root `AGENTS.md` concise and use it as a router into `.agents/`.
- Treat `.agents/` as the canonical persistent context directory.
- Require a persistence pass at the end of every conversation.
- Create a concise session trace for every conversation.
- Update durable stores selectively to avoid memory noise and duplication.
- Defer product/application code until explicitly requested.

Status: active.

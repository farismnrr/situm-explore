# Preferences

## Workspace preferences

- Wants the Codex-facing root `AGENTS.md` to stay concise and route durable context into `.agents/`. `(source: user-stated)`
- Wants conversations and implementation phases to keep relevant repository-native context updated rather than relying on chat-only memory. `(source: user-stated)`
- Prefers pragmatic SOLID/DRY/KISS and lightweight layered architecture that follows Nuxt conventions without ceremonial abstractions. `(source: user-stated)`
- Prefers one normal repository working directory with one dedicated branch per plan; do not create linked Git worktrees unless explicitly requested. `(source: user-stated)`
- Plans should be executed sequentially and remain independently reviewable; a dependent plan should start only after the previous plan is integrated into `main`, unless the user explicitly requests stacked branches. `(source: user-stated)`
- UI implementation should read the single approved HTML reference first, but production code must translate it into Nuxt/Vue/Nuxt UI rather than copy its HTML/CSS/JS implementation. `(source: user-stated)`
- For the POC, finish the complete UI with typed dummy/local data first for missing domains; add backend/Situm integrations only in later dedicated plans after the UI is accepted. `(source: user-stated)`
- Optimize the POC for delivery speed and simplicity while keeping existing working auth/database/Situm Viewer behavior intact. `(source: user-stated)`

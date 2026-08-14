# Preferences

## Repository / agent workflow

- Keep root `AGENTS.md` concise and route durable context into `.agents/`. `(source: user-stated)`
- Keep repository-native state and decisions current instead of relying on chat-only memory. `(source: user-stated)`
- Use one normal working directory and one dedicated branch per plan; no linked worktrees unless explicitly requested. `(source: user-stated)`
- Execute dependent plans sequentially from updated `main` after the preceding plan is integrated, unless stacking is explicitly authorized. `(source: user-stated)`
- Parent agent owns orchestration, review, state/plan persistence, commits, pushes, and transitions; implementation/fixes go to the configured `worker` subagent. `(source: user-stated)`
- PR creation, merge, force-push, and destructive history rewriting require the appropriate explicit gate. `(source: user-stated)`

## Engineering

- Prefer pragmatic SOLID/DRY/KISS and Nuxt-native layered architecture without ceremonial abstractions. `(source: user-stated)`
- Optimize PoC delivery speed without weakening security, capability truthfulness, or accepted behavior. `(source: user-stated)`
- Verify current Situm contracts instead of implementing from model memory or stale plans. `(source: user-stated)`
- Runtime acceptance uses `npm run build` plus `npm run preview`, not Nuxt dev mode. `(source: user-stated)`
- Temporary Situm smoke-test keys remain available for bounded Plan 025 remediation/retest and are revoked only after final acceptance passes; never persist or expose them. `(source: user-stated, 2026-08-14)`

## Plans 021–025

- Real email/password registration/login must work; Google OAuth is prepared but runtime testing remains manual/user-owned for now. `(source: user-stated)`
- One application user may own many private, single-owner workspaces; no invite/member model in this roadmap. `(source: user-stated)`
- Situm configuration is workspace-owned server data and must use secure encrypted persistence. `(source: user-stated)`
- Permission UX must truthfully distinguish view-only from read/write behavior and handle forbidden actions cleanly. `(source: user-stated)`
- Reuse the user's existing observability stack after local inspection; do not provision a duplicate stack by assumption. `(source: user-stated)`
- Add end-to-end correlation/tracing and keep critical/internal diagnostics out of client responses. `(source: user-stated)`

## Presentation

- The approved HTML reference remains visual guidance, but production translates it into Nuxt/Vue/Nuxt UI rather than copying raw HTML/CSS/JS. `(source: user-stated)`
- Preserve the accepted clean, minimal SaaS presentation unless the user explicitly requests a redesign. `(source: project history)`

## Historical note

Earlier UI-first fixture sequencing and preserving env-defined auth/Situm configuration were valid for earlier PoC phases. They are historical constraints and do not override Plans 021–025.

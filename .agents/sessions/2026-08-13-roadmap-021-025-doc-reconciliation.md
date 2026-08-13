# Plans 021–025 Documentation Reconciliation — 2026-08-13

Scope: documentation-only cleanup on `roadmap/021-025-backend-refactor` before any blocker/config execution.

## Reconciled current authority

- root/agent routers now point to one current read hierarchy;
- durable decisions no longer treat the previous env-defined user/global Situm model as the final target;
- active goals/preferences/knowledge reflect Plans 021–025;
- `ARCHITECTURE.md`, `DESIGN.md`, `design/IMPLEMENTATION.md`, and `design/data-source-matrix.md` describe the approved transition directly;
- temporary roadmap override documentation was removed after current contracts were reconciled;
- roadmap/prerequisite/Plan 021–025 docs distinguish current baseline from future target ownership;
- Plan 022 is explicitly foundation-only; Plan 024 owns the retained Situm/Viewer/analytics cutover.

## Historical evidence policy

Completed plans and older session notes were intentionally not rewritten. Current routers classify them as historical evidence, not current execution authority.

## External contract spot-check

Current official `nuxt-auth-utils` documentation confirms the Google OAuth environment-variable naming pattern recorded by Plan 021/prerequisites.

Current official Situm documentation confirms JWT authentication surfaces, API-key permission levels, JS SDK auth-session/permission surfaces, and `Viewer.setAuth(jwt)`; implementation still must verify the installed package/runtime before relying on those capabilities.

## Validation intent

Final audit should confirm:

- no `.next.md` staging files remain;
- no deleted transition-override file remains referenced;
- roadmap branch differs from `main` only in Markdown documentation;
- no implementation/config/migration file changed during this cleanup.

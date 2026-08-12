# Plan 003 — UI/UX Refresh — Historical Record

Status: complete / historical
Original branch: `plan/003-ui-ux-refresh`
Integration: merged through PR #5 on 2026-08-12

## Historical outcome

Plan 003 implemented an earlier light minimalist refresh of the then-small login/dashboard application while preserving the existing auth, PostgreSQL, and Situm Viewer behavior.

The plan was technically completed and merged, but the user later clarified that its rendered UI was **too far from expectation**. Closing/merging Plan 003 did **not** accept its visual direction as the product design target.

## Do not execute this plan

This file is retained only as concise implementation history.

Do not use it as current guidance and do not restore any paths, design docs, component structure, or visual assumptions that existed only for Plan 003.

In particular:

- the old `.agents/design/` tree was intentionally deleted;
- the earlier top-bar-only/no-sidebar composition is not authoritative;
- old root Vue paths are being superseded by the Nuxt 4 architecture migration in Plan 004;
- old credential/environment naming may have been superseded;
- Plan 003's rendered UI is not the reference for future work.

## Current authorities

For current work read, in order as applicable:

1. `AGENTS.md`
2. `.agents/state.md`
3. `.agents/protocols/git-workflow.md`
4. `plans/README.md`
5. `ARCHITECTURE.md`
6. `DESIGN.md`
7. `design/IMPLEMENTATION.md`
8. `design/data-source-matrix.md`
9. the active plan
10. the user-populated canonical HTML at `design/reference/situm-explore-interactive-prototype.html` for visual/interaction intent

Plans 004+ replace Plan 003 as the active product roadmap.

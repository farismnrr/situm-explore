# Design / Capability Transition Override — Plans 021–025

Status: active while Plans 021–025 execute.

This file prevents legacy design/capability documentation from conflicting with the approved backend-refactor roadmap while preserving those files as evidence of the current pre-refactor runtime.

Authority order for this roadmap remains: latest user instruction -> .agents/state.md + .agents/memory/roadmap-021-025.md -> this transition override + active plan -> existing architecture/design evidence where not superseded.

## Authentication override

Legacy statements in design/IMPLEMENTATION.md saying /register is removed or that a real registration backend must not be added are superseded for Plan 021.

Approved target:
- real database-backed application users;
- working email/password registration/login;
- Google OAuth prepared with manual runtime acceptance deferred.

## Situm configuration override

Legacy statements in ARCHITECTURE.md, README.md, design/IMPLEMENTATION.md, design/data-source-matrix.md, completed plans, or sessions that call the two global Situm env keys the final credential model describe the current/pre-refactor runtime only.

Approved target:
- workspace-managed Situm configuration;
- encrypted server-side persistence;
- no long-lived workspace Situm API key in public runtime config/browser code;
- no process-global Situm building/account authority after migration;
- VIEW_ONLY and VIEW_WRITE product modes with upstream permission authoritative.

## Capability matrix interpretation

Plans 017–020 are complete/integrated. FOLLOW-UP labels in older matrix rows that point to Plans 017–020 are historical implementation ownership, not evidence those plans are still active.

Plans 021–025 primarily change app identity, workspace scoping, credential ownership, observability/error handling, and permission-aware UX. They do not authorize new native positioning/navigation capabilities or speculative Situm features.

## Final reconciliation

Plan 025 owns rewriting durable architecture/design/data-source docs to the final post-refactor state and removing the need for this temporary override.

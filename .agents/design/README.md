# Design Context

This directory is the persistent design context for Situm Explore. It exists so UI work remains coherent across Codex sessions instead of being redesigned from scratch each time.

## Read order for UI work

1. `design-principles.md` — product-level visual and interaction principles.
2. `ui-guide.md` — implementation-oriented layout, component, state, responsive, and accessibility rules.
3. `references.md` — reference products and exactly which qualities to borrow or avoid.
4. Active `plans/*.md` — scope and acceptance criteria for the current implementation.

## Authority order

When guidance conflicts, prefer:

1. User's latest explicit direction.
2. `DESIGN.md` and `design-principles.md`.
3. `ui-guide.md`.
4. Active plan.
5. Reference products.
6. Agent taste/inference.

Reference products are inspiration only. They never override project requirements.

## AI design workflow

Before coding a UI phase, the agent should:

1. Inspect the existing page/component and preserve working behavior.
2. Identify the primary user task and information hierarchy for that surface.
3. Choose the smallest Nuxt UI primitives that support the task.
4. Apply semantic tokens and shared spacing/radius rules before adding one-off classes.
5. Implement responsive and interaction states with the happy path, not afterward as cleanup.
6. Validate keyboard/focus, loading, error, empty, and success states where applicable.
7. Compare the result against the principles, not against a screenshot clone.
8. Run the normal lint/typecheck/build gates and persist meaningful design decisions before committing.

Do not browse random design galleries simply to add novelty. Use official Nuxt UI documentation first for implementation patterns; use product references only to clarify visual qualities.

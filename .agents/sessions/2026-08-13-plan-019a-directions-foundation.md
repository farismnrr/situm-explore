# Session — Insert Plan 019A static-directions foundation

Date: 2026-08-13

- User asked to prepare the static-directions feature in a new Plan 019A and perform its real browser test inside the same plan before continuing Plan 020.
- Confirmed final pushed Plan 019 HEAD is `513f65e820635e05a22a54270f3bf21f5925e6c8`; hydrated Playwright realtime smoke is already reconciled there.
- Created `plan/019a-situm-static-directions-foundation` directly from that exact Plan 019 HEAD.
- Added `plans/019a-situm-static-directions-foundation.md`.
- Plan 019A resolves the original Plan 020 sequencing blocker by allowing only already-evidenced minimal production wiring first, followed by real hydrated Playwright route proof in the same plan.
- Frozen pre-implementation evidence: installed `@situm/sdk-js@0.25.0` exposes static directions start/cancel methods; configured cartography has at least two real POIs with numeric IDs; current `/app/map` Route tab is scaffold-only; current `SitumViewer` exposes no directions commands; no reliable route-result/details event payload is evidenced.
- Plan 019A core will wire numeric POI IDs to typed Viewer start/cancel commands, connect the existing Route tab, then smoke valid route start, replacement where possible, cancel/clear, invalid-input prevention, navigation cleanup, mobile non-mount, and credential safety with local Playwright/Chrome.
- Revised `plans/020-situm-static-directions.md` on the 019A lineage so Plan 020 becomes post-proof product completion/polish rather than the first runtime proof.
- The earlier remote `plan/020-situm-static-directions` branch created before 019A is superseded as an execution base. It is not deleted and must not be merged/cherry-picked into 019A; its evidence is historical only where still accurate.
- Updated `.agents/state.md`, `.agents/README.md`, `.agents/memory/decisions.md`, root `AGENTS.md`, and `plans/README.md` to the new branch chain:

```text
017 complete -> 018 complete -> 019 complete -> 019A active -> 020 queued
```

- No application/runtime code was intentionally changed in this planning session.
- No PR or merge was created.

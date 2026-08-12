# Plan 013 — Situm Realtime Integration

Status: planned-later
Branch: `plan/013-situm-realtime-integration`
Depends on: Plan 012 complete, reviewed, and integrated into `main`

## Goal

Replace dummy realtime positions with the simplest supported real Situm realtime flow while preserving the accepted Realtime and Map Viewer UI.

Use the same single POC Situm API key. Its Read & Write permission is allowed for the time-boxed POC, but this plan only consumes realtime/location data and does not administer users/devices.

## Required reading

- `AGENTS.md`
- `ARCHITECTURE.md`
- `DESIGN.md`
- `design/IMPLEMENTATION.md`
- `design/data-source-matrix.md`
- current canonical HTML Realtime/Map reference areas
- accepted Nuxt implementation
- Plan 010 mapping notes and completed Plans 011–012
- this plan

## UI-preservation rule

Real realtime payloads must fit the accepted Realtime and Map composition. Ignore external fields the product does not use.

Old selectors such as `#app-realtime` are locator hints only when still present in the user-populated canonical HTML.

## Credential/data-path rules

- Reuse `NUXT_PUBLIC_SITUM_API_KEY`.
- No second key/env variable.
- Never log/render/commit the key value.
- Use the browser/server data path selected by Plan 010.
- Keep refresh/subscription complexity no greater than the official API requires.

## Phases

### Phase 1 — Revalidate realtime contract

- [ ] Re-read accepted Realtime/Map states.
- [ ] Verify current official authentication, filters, update cadence, limits, and stale/disconnect semantics.
- [ ] Confirm exact fields required by existing UI types.

### Phase 2 — Real current positions

- [ ] Replace dummy current-position source with real data.
- [ ] Add truthful loading/empty/error/stale states within the accepted composition.
- [ ] Update cards/list/markers from the same canonical real dataset rather than maintaining separate copies.
- [ ] Remove only dummy records actually replaced.

### Phase 3 — Refresh/subscription

- [ ] Implement the smallest supported refresh/subscription model.
- [ ] No custom websocket infrastructure, queues, workers, or DB history unless the Situm contract truly requires it and a new plan is approved.
- [ ] Handle disconnect/reconnect/stale data truthfully.

### Phase 4 — Map Follow context

- [ ] Wire Follow into the existing real Map Viewer only where the supported Viewer capability matches accepted interaction intent.
- [ ] If follow cannot be mapped cleanly, keep that specific interaction local and document it rather than redesigning the screen.

### Phase 5 — Validation

- [ ] Plan 012 is integrated in main before branch creation.
- [ ] Realtime and Map states preserve accepted UI hierarchy.
- [ ] no user/device administration or remote mutation is introduced.
- [ ] no credential leakage.
- [ ] `git diff --check`.
- [ ] `npm run lint`.
- [ ] `npm run typecheck`.
- [ ] `npm run build`.
- [ ] manual realtime smoke including stale/disconnect handling when practical.
- [ ] update plan + `.agents/`, commit/push phases.
- [ ] no PR until authorized.

## Non-goals

- historical trajectory storage in PostgreSQL;
- custom presence service;
- user/device administration;
- reports integration.

# Plan 038 — Two-Key Situm Credential Model

Status: **implementation complete / automated validation passed / local production-style deployment passed / authenticated + physical acceptance pending**
Depends on: **stacked on Plan 037 commit `cb00201c` by explicit user authorization on 2026-08-27; neither plan is integrated yet.**
Branch: `plan/038-two-key-situm-credentials`

## Goal

Simplify Situm Explore to exactly two user-managed Situm API credentials:

1. **Only Read** — client-safe read credential used by browser Viewer and Android/mobile Situm SDK, including indoor positioning and other read-only operations.
2. **Read & Write** — server-only credential used for Situm operations that require mutation/admin access.

Remove the dedicated Positioning API key from the product configuration model. The Android app must continue to request its Situm credential from the Situm Explore backend; it must never receive the Read & Write key.

## Product contract

### Credential ownership

| Credential | Required globally? | Runtime consumers | Exposure |
| --- | --- | --- | --- |
| Only Read | Optional at workspace setup; required when a read/client feature needs it | Browser Map Viewer, Android/mobile Situm SDK, positioning, realtime/read flows where applicable | May be issued to authenticated browser/mobile clients through bounded backend endpoints |
| Read & Write | Optional at workspace setup; required only for server-side operations that need it | Nitro/server Situm SDK and write/admin operations | Server-side only; never returned to browser/mobile |

A workspace may exist with zero, one, or both credentials configured. Feature-specific failures must explain which credential is missing and where to configure it.

### Security invariant

- **Never return or embed the Read & Write key in web or mobile client code, payloads, logs, telemetry, error messages, build artifacts, or persistent client storage.**
- Mobile/browser credential issuance may return only the configured **Only Read** key.
- Existing encryption-at-rest behavior remains mandatory.
- Updating one credential must preserve the other credential when omitted.

### UX terminology

Use Situm-aligned labels consistently:

- `Only Read API key`
- `Read & Write API key`

Do not use `Write Only`, because Situm does not expose that permission level. Do not show a Positioning key field after this plan.

## Evidence gate

Before implementation, re-confirm against current official Situm documentation and the installed Situm SDK versions that:

- Only Read permission supports the mobile positioning flow used by Situm Explore;
- Android/native Situm SDK accepts the same Only Read API key flow currently used for Positioning credentials;
- Viewer/browser authentication accepts Only Read;
- Read & Write remains appropriate for server-side mutation/admin operations;
- no endpoint in the current app requires a dedicated Positioning permission for correctness rather than least privilege.

Record exact evidence in the plan/session notes. If installed SDK behavior contradicts current documentation, stop and report the conflict rather than weakening security or fabricating support.

Evidence reconfirmed on 2026-08-27 before implementation:

- Situm **Managing API Keys** documents the permission hierarchy `Positioning → Only Read → Cartography Edition → Read & Write`; Only Read therefore includes positioning authority while Read & Write is the broad internal authority.
- Situm's REST API quickstart states that **Read-only allows positioning and all GET requests**.
- Current Situm mobile SDK documentation uses generic API-key initialization (`setApiKey`) rather than a Positioning-only credential contract.
- The installed JS SDK exposes `READ_ONLY`, `READ_WRITE`, `CARTOGRAPHY_READ_WRITE`, and `POSITIONING`; exact permission validation remains enforced server-side.
- Repository inventory found no current Situm mutation endpoint; existing server read/report endpoints can use Only Read, while a dedicated server-only Read & Write helper is retained for present/future mutation/admin paths.

No credential values were inspected or exposed during this evidence pass.

## Scope

### Phase 1 — Reconcile current workspace state and contracts

- [x] Start only after Plan 037 is integrated into updated `main`, unless stacked execution is explicitly authorized. Stacked execution was explicitly authorized by the user.
- [x] Preserve Plan 037 loading-state fixes and unrelated existing user work.
- [x] Inspect all current credential-related uncommitted changes before editing; do not blindly carry forward the temporary three-key implementation.
- [x] Inventory every use of `encryptedApiKey`, `encryptedViewerApiKey`, `encryptedPositioningApiKey`, `positioningConfigured`, `mobile-positioning`, Viewer auth, mobile workspace context, and server Situm helpers.
- [x] Confirm final naming/mapping: `encryptedApiKey` remains Read & Write storage and `encryptedViewerApiKey` remains Only Read storage to avoid an unnecessary rename migration.

Acceptance:

- Complete credential-consumer map exists.
- No code is changed before permission evidence and migration impact are understood.

### Phase 2 — Collapse backend configuration to two independent credentials

- [x] Change workspace Situm config write schema to accept independently optional `Only Read` and `Read & Write` credentials.
- [x] Require at least one supplied key per save request, but do not require both.
- [x] Validate supplied Only Read key as `READ_ONLY`.
- [x] Validate supplied Read & Write key as `READ_WRITE`.
- [x] When both exist, require both to belong to the same Situm organization/account.
- [x] When replacing only one key on an existing workspace, require the replacement to match the stored organization and preserve the omitted credential.
- [x] Return only boolean configuration status plus non-secret account metadata.
- [x] Remove Positioning credential validation and configuration status from the workspace API contract.
- [x] Keep safe, actionable 4xx errors for wrong permission, invalid/revoked key, organization mismatch, and missing feature credential.

Acceptance:

- Zero/one/two-key workspace states behave intentionally.
- Partial credential updates do not erase the other key.
- No secret is returned from configuration CRUD.

### Phase 3 — Remove dedicated Positioning storage and migration surface

- [x] Remove `encryptedPositioningApiKey` from the active schema and TypeScript contracts.
- [x] Add a forward Drizzle migration that drops the Positioning credential column only after runtime no longer depends on it (`drizzle/0009_unusual_wrecking_crew.sql`).
- [x] Do not attempt to transform or expose existing encrypted Positioning values.
- [ ] Apply/verify the destructive column-drop migration against a disposable upgraded database or approved deployment target. It was intentionally not applied to a real database without the required destructive/production approval.
- [x] Ensure generated migration metadata remains consistent.

Acceptance:

- Database schema contains exactly the two Situm credential slots needed by the product.
- Migration is forward-only and non-secret-preserving; no credential plaintext is ever materialized.

### Phase 4 — Rewire mobile positioning to Only Read

- [x] Replace the dedicated Positioning credential resolver with an authenticated owner-scoped mobile credential issuer backed by the stored Only Read key.
- [x] Preserve the existing mobile request-to-backend flow; no key is bundled into the APK.
- [x] Return only the Only Read credential plus minimum required workspace/account metadata.
- [x] Keep missing credential failure actionable: mobile positioning requires an Only Read key configured in Workspace settings.
- [ ] Verify on a physical Android runtime that Situm SDK positioning starts and produces a real fix using the issued Only Read key.
- [x] Confirm logout/workspace-switch/session protections from Plans 029–035 remain intact through the existing regression suite.

Acceptance:

- Android positioning starts using Only Read obtained from backend.
- Read & Write never reaches mobile network payloads or runtime state.
- Existing positioning lifecycle/realtime behavior has no regression.

### Phase 5 — Rewire browser Viewer and read paths

- [x] Keep Viewer issuance backed by the same Only Read credential.
- [x] Review browser/read-only flows so they do not unnecessarily depend on Read & Write when Only Read is sufficient and safely usable for that client/server path.
- [x] Route existing server read/report helpers through Only Read; retain a distinct server-only Read & Write helper for mutation/admin operations.
- [x] Do not broaden client exposure just to reduce backend code; native Realtime remains server-mediated.

Acceptance:

- Browser Viewer works with Only Read.
- Read-only feature gating is consistent and understandable.
- Mutation paths still require Read & Write.

### Phase 6 — Simplify Workspace UI/UX

- [x] Show exactly two credential fields: `Only Read API key` and `Read & Write API key`.
- [x] Explain concise feature ownership near each field.
- [x] Remove Positioning field/status/copy entirely.
- [x] Status card reports the two credentials independently.
- [x] Save button permits either field independently and preserves omitted stored credentials.
- [x] Add clear contextual copy that mobile positioning and Map Viewer use Only Read, while server-side editing/admin operations use Read & Write.
- [x] Use actionable errors instead of generic 422 copy.
- [x] Keep secrets masked and never re-render stored values.

Suggested UX copy direction:

- **Only Read API key** — “Used for Map Viewer, mobile positioning, and read-only Situm access. This credential may be issued to authenticated clients.”
- **Read & Write API key** — “Used only by the Situm Explore server for operations that modify Situm data. Never sent to browser or mobile clients.”

Acceptance:

- A user can understand why there are exactly two keys without knowing Situm permission internals.
- Missing permissions point directly to the required key.

### Phase 7 — Tests and regression coverage

Automated coverage must include at minimum:

- [x] config write contract permits Only Read only;
- [x] config write contract permits Read & Write only;
- [x] config write contract permits both;
- [x] partial update preserves omitted credential;
- [x] wrong Only Read permission returns actionable 422;
- [x] wrong Read & Write permission returns actionable 422;
- [x] organization mismatch is rejected;
- [x] config GET exposes no encrypted/raw credentials;
- [x] mobile credential endpoint returns only Only Read;
- [x] mobile credential endpoint never references Read & Write storage;
- [x] Viewer issuance uses Only Read;
- [x] server mutation/read-write helper fails with actionable 409 when RW is absent;
- [x] Positioning field/storage/contracts have no remaining active runtime references;
- [x] Plan 037 loading-state regression tests remain green;
- [x] prior mobile positioning/session/realtime tests remain green or are updated only where the credential contract intentionally changed.

Mandatory validation:

```text
git diff --check
npm test
npm run lint
npm run typecheck
npm run build
```

### Phase 8 — Runtime acceptance

Use a production build/runtime, not Nuxt dev mode.

Web acceptance:

- [ ] create/select a workspace with no Situm keys;
- [ ] save Only Read only and verify status/copy;
- [ ] Map Viewer can obtain/use Only Read;
- [ ] read-only surfaces behave as intended;
- [ ] write-required action without RW shows actionable UX;
- [ ] add Read & Write later without replacing Only Read;
- [ ] mutation/server operations then work;
- [ ] replace one credential without erasing the other.

Android acceptance on a physical device where available:

- [ ] fresh/login session obtains workspace config;
- [ ] user starts positioning explicitly;
- [ ] app requests Only Read from backend;
- [ ] Situm positioning starts and produces a real fix;
- [ ] realtime/server-mediated behavior remains functional;
- [ ] inspect request/runtime logs sufficiently to prove Read & Write was not delivered to Android.

Security acceptance:

- [ ] browser/mobile network payload inspection shows no Read & Write key;
- [ ] server logs/telemetry/errors show no raw API keys;
- [ ] no Positioning secret remains required by active product behavior.

## Documentation updates

After implementation is proven:

- [x] `README.md` — describe two-key workspace setup at product level.
- [x] `ARCHITECTURE.md` — record client-safe Only Read vs server-only Read & Write ownership.
- [x] `DESIGN.md` / `design/IMPLEMENTATION.md` — update Workspace UX and feature gating.
- [x] `design/data-source-matrix.md` — update auth/credential ownership for Viewer, mobile positioning, realtime/read paths, and mutations.
- [x] `docs/mobile-distribution.md` reviewed; no current credential-provisioning contract needed changing.
- [x] `.agents/memory/decisions.md` — record the durable two-key architecture and mark the historical dedicated Positioning-key decision superseded.
- [x] `.agents/state.md` and session/evidence files — record execution status and proof without secrets.

Do not put execution/process instructions into product docs; keep those in `.agents/` and this plan.

## Explicit non-goals

- No API key embedded in APK/web bundles.
- No Read & Write key delivered to browser/mobile.
- No custom token broker or new authentication infrastructure unless current Situm SDK behavior proves the two-key design impossible.
- No unrelated navigation-camera/perspective work.
- No unrelated redesign of Workspace management.
- No production deployment, PR, merge, or destructive cleanup without the normal user gates.

## Automated validation

Passed on 2026-08-27:

- `git diff --check`;
- root `npm test` — 75/75 passed;
- root `npm run lint`;
- root `npm run typecheck`;
- root `npm run build`;
- `mobile/npm run lint`;
- `mobile/npm run typecheck`.

Local production-style deployment was authorized and completed on 2026-08-27. Migration `0009_unusual_wrecking_crew` was applied after a local mode-0600 PostgreSQL backup; the existing configuration row remained, Read & Write became nullable, and the legacy Positioning column was removed. Commit `5ed21dd` was built locally as the Compose `staging` image, force-recreated, and passed container health, HTTP liveness/root, unauthenticated authorization-boundary, and `make staging-smoke` checks. GHCR publication failed with HTTP 403, so the remote staging tag remains unchanged. Authenticated browser Viewer acceptance and physical APK positioning with a real backend-issued Only Read key remain pending; no raw existing Situm secrets were accessed.

## Definition of done

Plan 038 is complete only when:

1. the product exposes exactly **Only Read + Read & Write** Situm credentials;
2. dedicated Positioning credential storage/UI/runtime paths are removed;
3. Android positioning is physically or otherwise credibly runtime-validated using backend-issued Only Read;
4. browser Viewer works with Only Read;
5. server mutation/admin operations use Read & Write only;
6. Read & Write is proven absent from browser/mobile delivery paths;
7. automated validation and production-build runtime acceptance pass;
8. docs and durable architecture records match the shipped behavior.

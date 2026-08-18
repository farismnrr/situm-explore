# Plan 034 acceptance-discovered remediation — Positioning credential provisioning UI

Workspace:

`/home/farismnrr/Projects/situm-explore`

Active branch:

`plan/034-full-e2e-acceptance`

Parent plan:

`/home/farismnrr/Projects/situm-explore/plans/034-full-e2e-acceptance.md`

This is **not a new roadmap plan**. It is a bounded correctness remediation discovered during Plan 034 Phase 0 physical-E2E readiness.

## Why this remediation exists

Plan 034 physical positioning/navigation requires a dedicated Situm Positioning API key for the selected workspace. The backend/data model/runtime already support this boundary correctly:

- `situm_explore.workspace_situm_configs.encrypted_positioning_api_key` exists after migration `0008_glorious_metal_master.sql`;
- workspace Situm config PUT accepts optional `positioningApiKey`;
- backend validates that the positioning credential has `POSITIONING` permission and belongs to the same organization as the Read & Write primary credential;
- backend encrypts the positioning key at rest;
- native fetches the dedicated positioning credential only through authenticated/owner-authorized `GET /api/workspaces/:workspaceId/mobile-positioning`;
- native does not need and must never receive the primary Read & Write credential;
- native Realtime remains server-mediated and must not reuse/widen the Positioning credential.

The gap is that the current web Workspace Settings UI only provisions the primary Read & Write and Read-only Viewer keys. It does not expose the already-supported `positioningApiKey` field, leaving the server/mobile flow impossible to configure through the product UI.

This remediation connects the existing approved backend contract to the existing web configuration surface.

---

## Required reading

Before editing, read:

1. `/home/farismnrr/Projects/situm-explore/AGENTS.md`
2. `/home/farismnrr/Projects/situm-explore/.agents/state.md`
3. `/home/farismnrr/Projects/situm-explore/.agents/protocols/git-workflow.md`
4. `/home/farismnrr/Projects/situm-explore/plans/034-full-e2e-acceptance.md`
5. this remediation brief
6. `/home/farismnrr/Projects/situm-explore/server/db/schema.ts`
7. `/home/farismnrr/Projects/situm-explore/drizzle/0008_glorious_metal_master.sql`
8. `/home/farismnrr/Projects/situm-explore/server/api/workspaces/[...workspacePath].ts`
9. `/home/farismnrr/Projects/situm-explore/server/api/workspaces/[workspaceId]/mobile-positioning.get.ts`
10. `/home/farismnrr/Projects/situm-explore/server/utils/mobile-positioning.ts`
11. `/home/farismnrr/Projects/situm-explore/mobile/src/workspaces/context.ts`
12. `/home/farismnrr/Projects/situm-explore/app/pages/app/workspaces.vue`
13. relevant credential/security tests from Plans 022/025/028–030.

Verify branch and clean state first:

```bash
cd /home/farismnrr/Projects/situm-explore
git status --short
git branch --show-current
git fetch origin
```

Required branch: `plan/034-full-e2e-acceptance`.

Do not create a separate remediation branch.

---

# Security/product contract — non-negotiable

The intended credential split remains:

1. **Read & Write primary key**
   - server-only;
   - used to authorize/manage workspace Situm context;
   - never returned to browser/native after submission;
   - never delivered to mobile.

2. **Read-only Viewer key**
   - dedicated least-privilege Viewer credential;
   - encrypted at rest;
   - issued only through the already-approved owner/session-gated Viewer path;
   - browser exposure is limited to the sanctioned Viewer use case.

3. **Positioning key**
   - dedicated least-privilege `POSITIONING` credential;
   - encrypted at rest;
   - never displayed again after save;
   - delivered only to authenticated native owner context through `/mobile-positioning`;
   - must match the same Situm organization as the primary credential.

Do not:

- expose the primary key to native or client logs;
- return stored credential values in GET config responses;
- persist plaintext keys in repo, logs, evidence, screenshots or analytics;
- reuse the Viewer key as the positioning credential;
- reuse primary Read & Write authority as a shortcut for mobile positioning;
- add broader Situm permissions;
- add a new backend or credential store;
- add new auth/session semantics;
- change Realtime authority;
- introduce background location;
- create a new roadmap plan.

---

# Remediation scope

## 1. Web Workspace Settings UI

Primary file:

`/home/farismnrr/Projects/situm-explore/app/pages/app/workspaces.vue`

Add a **Positioning API key** write-only input alongside the existing primary and Viewer credential fields.

Requirements:

- input must use `type="password"`;
- use a separate reactive state value, e.g. `positioningApiKey`;
- clear the plaintext state immediately after a successful save;
- never prepopulate the field from server data;
- label/hint must explain that this is the dedicated mobile positioning credential, not the primary key;
- do not render the actual stored value anywhere;
- existing primary + Viewer requirements must remain intact;
- preserve current error sanitization and loading behavior.

Recommended user-facing hierarchy:

- `Read & Write API key` — server authority / existing behavior;
- `Read-only Viewer API key` — browser Viewer;
- `Positioning API key` — native indoor positioning only.

Avoid implementation jargon beyond what is necessary to distinguish credential purpose.

## 2. Save behavior

Current save request only sends:

```ts
{ apiKey, viewerApiKey }
```

Change it to send `positioningApiKey` when the user provides one:

```ts
{
  apiKey,
  viewerApiKey,
  ...(positioningApiKey ? { positioningApiKey } : {})
}
```

Important compatibility rule:

- an empty positioning field must **not erase** an already configured positioning credential;
- the backend's existing optional-field update semantics intentionally preserve the old encrypted positioning key when omitted;
- do not change this to send empty string/null unless explicit removal semantics are separately approved.

## 3. Configuration status

The existing backend GET returns `positioningConfigured`.

Expose this truthfully in the workspace configuration UI if the page already shows credential/configuration status.

Acceptable wording:

- `Positioning: Configured`
- `Positioning: Not configured`

Do not imply the key is valid beyond the last successful server verification. Do not display its value.

If the UI currently has a generic configured-status section, integrate into that rather than creating a large new card solely for this field.

## 4. Server behavior

The existing server validation is the authority:

`/home/farismnrr/Projects/situm-explore/server/api/workspaces/[...workspacePath].ts`

It already checks:

- primary = `READ_WRITE`;
- Viewer = `READ_ONLY`;
- Viewer organization matches primary;
- Positioning, when supplied = `POSITIONING`;
- Positioning organization matches primary;
- encryption before persistence.

Do not rewrite this without a concrete defect.

One permitted correctness improvement: if the current sanitized 422 message says only "Both Situm credentials" despite there now being a third optional credential, adjust the message to a generic statement such as:

`The Situm credentials could not be verified with the required permissions.`

Do not reveal which secret failed, raw upstream errors, organization IDs or credentials.

## 5. Credential removal

Do **not** invent positioning-key removal semantics in this remediation unless an existing approved product contract already exists.

Reason: the current PUT contract deliberately preserves the encrypted positioning credential when `positioningApiKey` is omitted. A separate explicit removal mechanism would be new behavior and requires its own authority.

For Plan 034, provisioning/update is sufficient.

---

# Regression coverage

Add focused tests using the repository's existing test approach. No new framework.

At minimum prove:

1. workspace config validation accepts a valid optional Positioning credential only when permission/org checks pass, using pure/extracted logic where practical or bounded source-contract testing if the upstream SDK is unsuitable for deterministic tests;
2. an omitted positioning key does not produce an empty/null overwrite in the UI request contract;
3. web Workspace Settings contains a distinct write-only Positioning input and sends `positioningApiKey` conditionally;
4. config UI can expose `positioningConfigured` without exposing the key;
5. `/mobile-positioning` remains owner-scoped and returns only the dedicated positioning credential path;
6. no primary/Viewer credential is accidentally returned through the mobile positioning response;
7. existing tests for Plans 029/030 security remain passing.

Do not write tests that assert secret literal values.

---

# Plan 034 acceptance follow-up

After implementation and static validation, this remediation is not complete until the physical-E2E blocker is rechecked.

## Provision through the product UI

Use the local web app for the real owner workspace.

The user should paste a real Situm Positioning API key into the new field. Do not request the secret in chat and do not echo it in terminal output.

Expected behavior:

1. user opens Workspace Settings in web;
2. enters primary Read & Write, read-only Viewer, and dedicated Positioning key as required by current save contract;
3. backend verifies all supplied permissions/org relationships;
4. backend stores Positioning key encrypted;
5. GET workspace config shows `positioningConfigured: true` but returns no secret;
6. DB contains a non-null encrypted positioning value, but evidence must record only the boolean/non-secret state;
7. native authenticated request to `/api/workspaces/:workspaceId/mobile-positioning` succeeds for the owner;
8. unauthorized/unowned workspace request still fails closed;
9. native receives no primary or Viewer credential.

If the current product UI forces re-entry of primary+Viewer solely to add a Positioning key, that is acceptable for this bounded remediation because those existing fields are already write-only replacement semantics. Do not silently bypass credential verification via direct DB writes for final acceptance.

## Resume physical Plan 034

Once `positioningConfigured === true`, resume:

- Phase 2 native auth/session/deep-link acceptance;
- Phase 3 physical Map/positioning/navigation;
- Phase 4 Realtime/lifecycle;
- Phase 5 cross-feature security/failure sequences;
- Phase 6 full regression/closeout.

No physical PASS may be claimed solely from the provisioning endpoint.

---

# Validation gates for the remediation

Run at minimum:

```bash
cd /home/farismnrr/Projects/situm-explore
npm test
npm run lint
npm run typecheck
npm run build

git diff --check

cd /home/farismnrr/Projects/situm-explore/mobile
npm run security:test
npm run lint
npm run typecheck
```

If server/web source changed, run a production-preview smoke against the built Nitro bundle and verify:

- root loads;
- unauthenticated protected API remains 401;
- security headers remain present;
- no secret value appears in normal logs.

Do not rerun full Android build solely for the web input change unless another native/generated change requires it. However, physical Plan 034 acceptance after provisioning still uses the already-installed/current native build and must prove the runtime credential retrieval path.

---

# Persistence/evidence

Update Plan 034 evidence/state truthfully.

At minimum record:

- Phase 0 discovered missing product provisioning surface, not missing backend capability;
- backend schema/endpoint already supported encrypted Positioning credentials;
- exact remediation performed;
- static validation results;
- whether real product-UI provisioning was completed;
- whether `/mobile-positioning` was physically/runtime proven;
- which Plan 034 checks remain unpassed.

Update `.agents/state.md` because the current file is stale and still describes Plan 033/security remediation as active/unintegrated.

Do not persist credential values.

---

# Commit discipline

This remediation belongs on:

`plan/034-full-e2e-acceptance`

Use one scoped commit after validation, for example:

`fix: expose workspace positioning provisioning`

Push the Plan 034 branch after the remediation checkpoint.

Do not open a PR or merge Plan 034.

---

# Definition of Done

This remediation is complete only when all applicable items below are true:

- [ ] Workspace Settings exposes a dedicated write-only Positioning API key field.
- [ ] Save request sends `positioningApiKey` only when supplied.
- [ ] Omitting the field preserves an existing positioning credential.
- [ ] Successful save clears all plaintext credential input state, including Positioning.
- [ ] UI exposes only `positioningConfigured` boolean/status, never the stored value.
- [ ] Server still validates `POSITIONING` permission and matching organization.
- [ ] Server persists Positioning credential encrypted at rest.
- [ ] `/mobile-positioning` remains owner/session gated.
- [ ] Native gets only the dedicated Positioning credential from that endpoint.
- [ ] Primary Read & Write credential remains server-only.
- [ ] Viewer authority remains separate.
- [ ] Realtime authority remains server-mediated.
- [ ] Focused regression coverage is added/passing.
- [ ] Root tests/lint/typecheck/build pass.
- [ ] Mobile security test/lint/typecheck pass.
- [ ] `git diff --check` passes.
- [ ] No credential appears in repo/log/evidence.
- [ ] Real web UI provisioning is exercised with a real Positioning key.
- [ ] Workspace config reports Positioning configured without exposing the key.
- [ ] Authenticated native `/mobile-positioning` retrieval succeeds on the real Plan 034 path.
- [ ] Plan 034 physical positioning/navigation acceptance resumes afterward; no false roadmap closeout is claimed here.

If the Positioning key itself is unavailable, finish the code remediation and mark runtime provisioning as BLOCKED rather than bypassing the product boundary.

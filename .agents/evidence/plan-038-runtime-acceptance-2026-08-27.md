# Plan 038 Runtime Acceptance Evidence — 2026-08-27

This file records the Plan 038 closeout state without storing or reproducing any Situm API key, password, session token, cookie, request body, or other secret.

## Scope and source

- Branch: `plan/038-two-key-situm-credentials`
- Implementation commits exercised: `ccb8e0a` (Node runtime hardening) and `1a18aa8` (mounted Viewer initialization fix); the final closeout image was built from `bddd72889135429df9f6fac5880e15e1795badac` (docs-only closeout commit on top of the tested implementation).
- Product contract: exactly two workspace-managed Situm credentials — **Only Read** and **Read & Write**. Only Read is the client-safe credential; Read & Write is server-only.
- Dedicated Positioning credential storage/UI/runtime contract is absent from active source and client artifacts.

## Database migration and runtime state

- A pre-migration PostgreSQL custom-format backup was created during the authorized preflight at `/tmp/situm-explore-plan038-pre-migration-20260827-134152.dump` with mode `0600`; the final closeout check found that temporary path missing, likely because `/tmp` was cleaned. The file's retention is therefore not claimed, and no post-migration dump is mislabeled as a pre-migration backup.
- Drizzle migration `0009_unusual_wrecking_crew` is applied in the runtime database. Its migration journal entry matches the repository migration timestamp/hash metadata.
- Runtime `situm_explore.workspace_situm_configs` columns are exactly: `id`, `workspace_id`, `situm_account_id`, `encrypted_api_key`, `created_at`, `updated_at`, and `encrypted_viewer_api_key`.
- Secret-free row checks: one configuration row exists; the encrypted Read & Write slot is populated in one row; the encrypted Only Read slot is populated in one row; no legacy Positioning column exists.

## Image and deployment

- Docker base/runtime stages use `node:22.22.0-bookworm-slim`, satisfying the current Nuxt engine requirement without a Node 24 major upgrade.
- Clean image build completed without the prior Node engine mismatch warning. Remaining build messages are informational plugin-timing/system-user-UID warnings.
- GHCR publication succeeded with normal repository authentication. `ghcr.io/farismnrr/situm-explore:staging` and the immutable commit tag resolve to digest `sha256:75739ca6d557fc9c5098879cc668284581ee77b61a1d9889df5376ad2b0b6f58`.
- `deploy-situm-explore-1` was pulled and force-recreated from that image only. It reports image revision `bddd72889135429df9f6fac5880e15e1795badac`, Node `v22.22.0`, `running`, `healthy`, and restart count `0`.
- Runtime checks: root `200`, unauthenticated `/api/workspaces` `401`, `make staging-smoke` `ok`.
- Recent application logs contained no raw credentials or error output; the inspected window had no application log lines after the final recreate.

## Authenticated browser acceptance

An existing authenticated owner browser session was used through `https://situm.farismunir.my.id`, which tunnels to the local port-3005 runtime. No password, cookie, token, or API key was read or entered.

- Workspace settings for the configured workspace displayed independent `Only Read` and `Read & Write` configured statuses and exactly the two corresponding API-key inputs.
- Settings copy states that Read & Write remains server-side and that authenticated clients receive Only Read when a client-side Situm SDK needs it.
- No Positioning API key field, status, copy, or client contract appeared.
- The workspace with no Situm configuration showed the expected unresolved/no-configuration state without changing data.
- A first Map acceptance exposed a real lifecycle defect: the immediate prop watcher could run before the Viewer host ref existed. The fix adds an `onMounted` retry and a regression assertion in `test/web-loading-states.test.ts`.
- After final image recreate, authenticated Map acceptance rendered the Situm Viewer iframe/content rather than remaining on the skeleton. Cartography loaded one available building (`PT Berjaya Inovasi Global`) and two floors.
- Authenticated route probes for Buildings & floors, Points of interest, Geofences, Paths, Users & groups, Groups, Realtime, Analytics & reports, Alarms, and Organization reached their expected headings without browser error alerts. Empty upstream data was not treated as an error.
- The Viewer and mobile credential issuance implementations both decrypt/use only `encrypted_viewer_api_key`; Read & Write remains behind the server-only helper and was not included in the client-facing payload contract.

Credential-bearing save/replace forms were not replayed in the browser because doing so would require transmitting a raw secret through the browser. Independent update preservation, permission validation, organization matching, secret-free config GETs, missing-RW behavior, and workspace scoping are covered by the automated contract suite; the existing configured row was left unchanged.

## Server Read & Write path

- `server/utils/workspace-situm.ts` contains a distinct owner/workspace-scoped `getWorkspaceSitumReadWriteClient` that decrypts only the Read & Write storage slot and returns an actionable `409` when that slot is absent.
- Current application routes expose Situm reads, Viewer/mobile credential issuance, configuration validation, and analytics sync; no current application route invokes the mutation helper, so no disposable Situm mutation was invented or run against production data.
- Automated tests prove the helper separation and the missing-Read-&-Write failure path.

## Android acceptance

- Release build passed with `EXPO_PUBLIC_APP_VERSION=1.0.2`, Android `versionCode=3`, staging HTTPS API base, arm64 architecture.
- Artifact: `mobile/dist/situm-explore-v1.0.2-android-arm64.apk`
- SHA-256: `039497c87767b4ae2df6da1ecdffac76b2498671586275e7b1648816c967a7f8`
- `adb devices -l` returned an empty device list. Therefore install/login/permission/real sensor position fix/realtime physical acceptance is **not claimed**. The user explicitly waived this physical E2E on 2026-08-27 to close the plan under time pressure.
- The APK string scan contained no `positioningApiKey`, `positioningConfigured`, or `encryptedPositioningApiKey` identifiers. No raw credential was written to the APK, logs, evidence, or docs.

## Security and automated validation

- Active source scan (`app`, `server`, `shared`, `mobile`) found no `positioningApiKey`, `positioningConfigured`, or `encryptedPositioningApiKey` contract.
- Public web output scan found no encrypted credential storage names or active legacy Positioning identifiers.
- `git diff --check`: pass.
- `npm test`: 75/75 pass.
- `npm run lint`: pass.
- `npm run typecheck`: pass.
- `npm run build`: pass.
- `mobile/npm run lint`: pass.
- `mobile/npm run typecheck`: pass.
- `mobile/npm run security:test`: pass.
- `mobile/npm run test:login-keyboard`: pass.
- `mobile/npm run test:android-update`: pass.

## Gate decision

Everything available in the current environment passed, including GHCR publication, immutable staging recreate, authenticated browser Workspace/Map acceptance, database schema verification, security scans, and Android release compilation. One evidence-retention caveat remains: the pre-migration dump was created before migration but its `/tmp` path was not retained through final closeout. On 2026-08-27 the user explicitly waived the remaining physical Android E2E and raw-secret browser form replay to close the plan under time pressure; those items remain documented as not executed, never as PASS. The plan is therefore closed by explicit waiver and proceeds through the normal PR/merge workflow.

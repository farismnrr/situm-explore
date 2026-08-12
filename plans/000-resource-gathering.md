# Plan 000 — Resource Gathering

Status: blocked pending local `DATABASE_URL`
Scope: collect and normalize inputs before implementation  
Principle: gather what we already have, discover what the APIs/database can tell us, and avoid blocking on information Codex can inspect itself.

## Goal

Prepare the minimum local resources needed to execute `plans/001-web-foundation.md` without prematurely building product features.

This phase is complete when Codex has local access to the building floorplan assets, Situm credentials through `.env`, PostgreSQL access through `.env`, and enough Situm/database metadata to start the web foundation safely.

---

## 1. Building image intake

The user currently has these source files on the local development machine:

```text
/home/farismnrr/Downloads/lt 1-1422.jpeg
/home/farismnrr/Downloads/lt 2-1422.jpeg
```

- [x] Confirm both source files exist before touching them.
- [ ] Create a repository-local resource directory:

```text
resources/
└── buildings/
    └── building-1422/
        └── source/
```

- [x] **Copy** the source files into the repository rather than deleting/moving the originals from `~/Downloads`.
- [x] Normalize filenames while copying:

```text
resources/buildings/building-1422/source/floor-1.jpeg
resources/buildings/building-1422/source/floor-2.jpeg
```

- [x] Preserve the files without recompressing or resizing during intake.
- [x] Record original pixel dimensions and file sizes in `resources/buildings/building-1422/README.md`.
- [x] Add a short mapping in that README from original filename to normalized filename.
- [x] Do not assume `1422` is a Situm building identifier; treat it only as a local resource slug until Situm metadata confirms the actual building identifier.
- [x] Do not place the source files directly under `public/` yet. Decide later whether the application needs a public/optimized derivative.

### Image questions Codex should inspect, not ask prematurely

- [x] Determine whether the two images correspond to floor 1 and floor 2 as implied by the filenames.
- [x] Inspect orientation and whether either image needs rotation for display.
- [x] Determine whether these are canonical floorplans already present in Situm or merely local reference/export images.
- [x] If Situm already owns the canonical floorplans, do not duplicate upload flows just because local copies exist.

---

## 2. Situm credentials

The user already has a Situm API key locally.

- [ ] Never commit the real API key.
- [ ] Put the real value only in the developer's local `.env` when the Nuxt project is initialized.
- [ ] Keep only a placeholder in `.env.example`.
- [ ] Verify the current Situm JS SDK / REST authentication requirements during implementation.
- [ ] Treat the API key as a secret credential unless Situm documentation explicitly provides a browser-safe mechanism for the intended integration.
- [ ] Prefer server-side API calls for discovery/administrative metadata when possible.

Candidate environment input:

```dotenv
SITUM_API_KEY=
```

The final environment variable name may be adjusted during implementation if the chosen integration has a clearer convention.

---

## 3. Discover Situm building metadata

Do not require the user to manually type metadata that Codex can retrieve using the existing Situm account/API access.

Once local credentials are configured:

- [x] List buildings accessible to the Situm account.
- [x] Identify the intended building from returned names/metadata.
- [x] Record the actual Situm building identifier in local configuration or application-owned data as appropriate; do not confuse it with the local `building-1422` slug.
- [x] Fetch floors for the selected building.
- [x] Record floor identifiers, names/numbers, order, and other metadata needed by the web viewer.
- [x] Check whether floorplan/cartography is already configured in Situm.
- [ ] Check whether POIs, geofences, paths, or map configuration already exist, but do not import/model them in our database yet unless the first web slice requires them.
- [ ] Save reusable non-secret discoveries in `.agents/knowledge/` when they materially affect implementation.

### Resource we likely do **not** need from the user yet

If the Situm API key can list the target building and floors, Codex should discover building/floor identifiers itself instead of asking the user for IDs.

---

## 4. Existing PostgreSQL access

The database already exists and will be reused with a dedicated application schema.

Needed locally:

```dotenv
DATABASE_URL=
DB_SCHEMA=situm_explore
```

- [ ] User supplies/maintains the real `DATABASE_URL` locally; never commit it.
- [ ] Codex connects read-first and inventories existing schemas.
- [ ] Confirm `DB_SCHEMA` does not collide with an unrelated schema.
- [ ] Do not create or alter anything until the existing database layout has been inspected.
- [ ] Record only non-sensitive architectural discoveries.

No database dump is required for resource gathering unless connectivity is unavailable and the user explicitly chooses to provide one.

---

## 5. Auth resource check

Authentication implementation remains part of `plans/001-web-foundation.md`.

For resource gathering only:

- [ ] Prefer an auth approach that does not require unnecessary third-party infrastructure.
- [ ] If the selected maintained Nuxt auth integration needs an `AUTH_SECRET`, generate it locally during setup and never commit it.
- [ ] If an OAuth provider is eventually selected, add its client ID/secret placeholders to `.env.example` only when actually needed.
- [ ] Do not block resource gathering on OAuth credentials.

---

## 6. Optional product/design resources

These are useful later but **not blockers** for the web foundation:

- [ ] Product logo/icon, if one already exists.
- [ ] Preferred app name/branding copy beyond `Situm Explore`.
- [ ] Building display name if it cannot be unambiguously discovered from Situm.
- [ ] Any preferred floor labels if Situm metadata is not human-friendly.
- [ ] Reference screenshots for the desired map/dashboard UX.

Do not stop implementation just because these optional resources are absent.

---

## 7. Local resource manifest

After gathering resources, create/update:

```text
resources/README.md
resources/buildings/building-1422/README.md
```

The manifest should contain only:

- what the local resource is;
- its normalized repository path;
- original filename/source location for provenance;
- basic non-sensitive metadata;
- whether it is canonical, reference-only, or pending confirmation.

Never copy secrets into resource manifests.

---

# Ready-for-implementation checklist

Before starting `plans/001-web-foundation.md`:

- [x] Both building images are copied into `resources/buildings/building-1422/source/` and originals remain untouched.
- [x] Resource manifest exists.
- [x] Situm API key is available locally, not in git.
- [x] Situm building/floor metadata can be discovered or there is a clear reason it cannot.
- [ ] `DATABASE_URL` is available locally, not in git.
- [ ] Existing PostgreSQL schemas can be inspected safely.
- [ ] No additional credentials are being requested without a concrete implementation need.

### Current blocker

The local environment did not provide `DATABASE_URL`, so existing PostgreSQL schemas could not be inspected read-first. No database changes were made. Resume this plan when the local connection configuration is available.

## Definition of done

Resource gathering is complete when Codex can begin the Nuxt web foundation with local floorplan assets, Situm access, and PostgreSQL access while keeping all credentials out of the repository.

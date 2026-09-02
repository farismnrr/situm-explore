# Android OTA Release Evidence — 1.0.2 — 2026-08-28

This file records the public Android release evidence without storing or reproducing MinIO credentials, signing material, keystores, session tokens, passwords, or other secrets.

## Scope and previous release

- User-requested target: app version `1.0.2`, Android `versionCode 3`, staging environment, canonical HTTPS API base, and `arm64-v8a` only.
- Release branch: `release/android-v1.0.2`.
- Source revision used for the release build: `845b437ee7872aff6fd40f42bf105304e46662a0`.
- The public versioned `1.0.1` manifest and stable manifest both reported version `1.0.1`, `versionCode 2`, immutable download URL, and SHA-256 `6ccdbbac284dc3436ed55d378f49d43f38670ba947c86a230db50b2d054bc74c` before this release.
- The public `1.0.1` APK was downloaded and its SHA-256 matched that published checksum before the OTA upgrade test.

## Build and artifact verification

- Ran the repository release helper from `mobile/` with `EXPO_PUBLIC_APP_VERSION=1.0.2`, `EXPO_PUBLIC_ANDROID_VERSION_CODE=3`, `EXPO_PUBLIC_ENVIRONMENT=staging`, and `EXPO_PUBLIC_API_BASE_URL=https://situm.farismunir.my.id`.
- Expo prebuild and Gradle `assembleRelease -PreactNativeArchitectures=arm64-v8a` completed successfully.
- Generated artifacts:
  - `mobile/dist/situm-explore-v1.0.2-android-arm64.apk`
  - `mobile/dist/situm-explore-v1.0.2-android-arm64.apk.sha256`
  - `mobile/dist/situm-explore-v1.0.2-android-arm64.json`
  - `mobile/dist/situm-explore-latest-android.json`
- APK SHA-256: `3bc1c0b46deb20111c58e36f9dba5cc5f769f4585b6af9e8b79893d2a877568c`.
- APK inspection reported package `com.situm.explore`, label `Situm Explore`, version name `1.0.2`, and version code `3`.
- APK native-library inspection reported only `arm64-v8a`.
- The canonical API URL `https://situm.farismunir.my.id` is embedded in the release bundle.
- Exact development backend markers `localhost:3000`, `127.0.0.1:3000`, `http://localhost`, `http://127.0.0.1`, and `0.0.0.0:3000` are absent. The bundle retains generic React Native Metro diagnostic text referring to `localhost:8081`; this is library error/help text, not the configured application backend endpoint.

## Automated validation

- Root tests: `83/83` passed.
- Root lint: passed.
- Root typecheck: passed.
- Root production build: passed.
- Mobile lint: passed.
- Mobile typecheck: passed.
- Mobile Android update tests: passed.
- Mobile login-keyboard strategy test: passed.
- Mobile dependency regression/security test: passed.
- Android release build: passed.
- Local checksum file verification: passed.
- `git diff --check`: recorded at closeout after evidence changes.

## MinIO publication and public verification

The existing MinIO deployment was used through its authenticated client, under the existing `situm-explore/android/` path. No web container was recreated.

1. Uploaded immutable `1.0.2` APK, checksum, and versioned JSON manifest.
2. Verified each immutable object publicly returned HTTP 200.
3. Downloaded the public immutable APK; its SHA-256 matched the local artifact exactly.
4. Copied the verified immutable APK and checksum to the stable arm64 aliases.
5. Verified the stable APK returned HTTP 200 and was byte-identical to the immutable APK.
6. Uploaded `situm-explore-latest-android.json` last.
7. Verified the stable manifest returned HTTP 200.

Final public URLs:

- Versioned APK: `https://minio.farismunir.my.id/situm-explore/android/situm-explore-v1.0.2-android-arm64.apk`
- Stable APK: `https://minio.farismunir.my.id/situm-explore/android/situm-explore-latest-android-arm64.apk`
- Versioned manifest: `https://minio.farismunir.my.id/situm-explore/android/situm-explore-v1.0.2-android-arm64.json`
- Stable OTA manifest: `https://minio.farismunir.my.id/situm-explore/android/situm-explore-latest-android.json`

Both APK URLs returned HTTP 200 with `application/vnd.android.package-archive` and `36,942,561` bytes. Both manifest URLs returned HTTP 200 with `application/json` and `329` bytes. The versioned checksum object and stable checksum alias returned HTTP 200 with `text/plain` and the release SHA-256.

The versioned and stable manifests both contain:

```json
{
  "version": "1.0.2",
  "versionCode": 3,
  "downloadUrl": "https://minio.farismunir.my.id/situm-explore/android/situm-explore-v1.0.2-android-arm64.apk",
  "sha256": "3bc1c0b46deb20111c58e36f9dba5cc5f769f4585b6af9e8b79893d2a877568c"
}
```

## Connected-device smoke and OTA upgrade

- A connected Android POS device was available.
- The exact public `1.0.1` APK installed successfully with the controlled downgrade flag and launched without fatal/runtime errors.
- On `1.0.1 (2)`, the app discovered the live stable manifest and displayed `A newer Situm Explore is ready`, `Version 1.0.2 is available`, and the `Download update` action.
- Invoking `Download update` opened Android’s package installer. The installer identified `Situm Explore`, confirmed the update would preserve existing data, and reported `App installed` after confirmation.
- The upgraded app reported version `1.0.2`, `versionCode 3`, resumed `com.situm.explore/.MainActivity`, and rendered `Situm Explore`, `Workspace ready`, `Explore`, `Realtime`, and `Signed in`.
- The upgraded cold start produced no `FATAL EXCEPTION`, `Unable to load script`, `Unable to instantiate application`, JavaScript `Error`/`Exception`/`TypeError`/`ReferenceError`, `FileUriExposedException`, or `INSTALL_FAILED` log entries.
- No update modal appeared after the device reached `versionCode 3`.
- This verifies install, app identity, startup without Metro, preservation of the existing signed-in state, OTA discovery, and the in-app OTA upgrade path. A fresh credential-entry login was not replayed because the device already had a valid signed-in session and no credential was accessed or persisted.

## Gate decision

The `1.0.2 (3)` arm64 Android OTA release is publicly live and externally verified. Immutable artifacts were published and verified before stable aliases; the stable OTA manifest was published last and its version, version code, immutable download URL, and SHA-256 match the public APK.

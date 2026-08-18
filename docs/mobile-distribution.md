# Situm Explore Mobile distribution

This document defines the Android release, naming, branding, publishing, and web-download contract for Situm Explore Mobile.

## Installed application identity

The Android application must present a single stable product identity:

- App name: `Situm Explore`
- Android package: `com.situm.explore`
- Expo slug: `situm-explore`
- Primary app icon: `mobile/assets/icon.png`
- Android adaptive foreground icon: `mobile/assets/adaptive-icon.png`
- Splash artwork: `mobile/assets/splash-icon.png`
- Splash background: `#111827`

`mobile/app.config.ts` is the source of truth for those values. The release script runs Expo prebuild before Gradle so native Android resources stay synchronized with the Expo config on every release.

## Version policy

Each release has two Android version values:

- `EXPO_PUBLIC_APP_VERSION`: user-visible semantic version, for example `1.2.0`.
- `EXPO_PUBLIC_ANDROID_VERSION_CODE`: positive integer that must increase for every Android release, for example `12`.

Example release environment:

```text
EXPO_PUBLIC_APP_VERSION=1.2.0
EXPO_PUBLIC_ANDROID_VERSION_CODE=12
EXPO_PUBLIC_ENVIRONMENT=staging
EXPO_PUBLIC_API_BASE_URL=https://situm.farismunir.my.id
```

Do not reuse an Android version code for a different published build.

## Canonical Android artifact names

Release APKs use a deterministic, human-readable name:

```text
situm-explore-v<semver>-android-arm64.apk
```

Example:

```text
situm-explore-v1.2.0-android-arm64.apk
situm-explore-v1.2.0-android-arm64.apk.sha256
```

The public web download uses a stable alias:

```text
situm-explore-latest-android-arm64.apk
```

This gives us both properties we want:

- versioned objects remain auditable and easy to identify;
- the website can keep one stable download URL across releases.

Do not use Git SHAs in customer-facing APK filenames. Git commits remain release metadata, not part of the install filename.

## Build the Android release

From `mobile/`:

```bash
EXPO_PUBLIC_APP_VERSION=1.2.0 \
EXPO_PUBLIC_ANDROID_VERSION_CODE=12 \
EXPO_PUBLIC_ENVIRONMENT=staging \
EXPO_PUBLIC_API_BASE_URL=https://situm.farismunir.my.id \
npm run build:android:release
```

The script performs these steps:

1. validates semver, Android version code, API URL, and public Android release base URL;
2. runs Expo Android prebuild so app metadata, launcher icon, adaptive icon, splash, and native resources are current;
3. builds a release APK for `arm64-v8a` only;
4. copies the APK into `mobile/dist/` using the canonical release name;
5. generates a matching SHA-256 file;
6. generates a versioned update manifest plus the stable `situm-explore-latest-android.json` manifest used by installed Android apps.

Expected output:

```text
mobile/dist/situm-explore-v1.2.0-android-arm64.apk
mobile/dist/situm-explore-v1.2.0-android-arm64.apk.sha256
mobile/dist/situm-explore-v1.2.0-android-arm64.json
mobile/dist/situm-explore-latest-android.json
```

`mobile/dist/` is intentionally ignored by Git.

## Required release verification

Before publishing an APK, verify all of the following:

```bash
cd mobile
npm run lint
npm run typecheck
npm run build:android:release
```

Then verify the release artifact:

```bash
sha256sum dist/situm-explore-v1.2.0-android-arm64.apk
unzip -l dist/situm-explore-v1.2.0-android-arm64.apk | grep 'lib/.*\.so' | sed -n 's#.*lib/\([^/]*\)/.*#\1#p' | sort -u
```

The production/staging arm64 APK must contain only `arm64-v8a` native libraries.

Install it on a physical Android target and verify:

- launcher label is `Situm Explore`;
- launcher icon is the Situm Explore icon and is correctly masked by Android;
- cold launch shows the Situm Explore splash artwork on the dark background;
- the app starts without Metro or a development server;
- the embedded API base URL points at the intended HTTPS environment;
- no `127.0.0.1` or local development backend is embedded in the release bundle.

## MinIO publishing layout

Android releases are hosted in the public-read-only bucket path:

```text
situm-explore/android/
```

For release `1.2.0`, publish:

```text
situm-explore/android/situm-explore-v1.2.0-android-arm64.apk
situm-explore/android/situm-explore-v1.2.0-android-arm64.apk.sha256
situm-explore/android/situm-explore-v1.2.0-android-arm64.json
```

After the versioned objects have been uploaded and verified, update the stable aliases from the exact same release:

```text
situm-explore/android/situm-explore-latest-android-arm64.apk
situm-explore/android/situm-explore-latest-android-arm64.apk.sha256
situm-explore/android/situm-explore-latest-android.json
```

Publish the stable JSON manifest **last**. The installed app checks that manifest on startup and again after a successful login, compares its native Android `versionCode` with the manifest `versionCode`, and shows an update modal only when the published build is newer. The manifest points at the immutable versioned APK, not the mutable `latest.apk` alias. Update discovery is fail-open: an unavailable or malformed manifest must never prevent login or normal app use.

The stable aliases are updated only after the versioned artifact is available and its checksum has been verified. This prevents the website or installed app from ever pointing at a partial or missing release.

The bucket policy is anonymous read/download only. Upload, overwrite, policy changes, and object management require authenticated operator credentials and must never be exposed to the browser or committed to the repository.

## Web download contract

The staging web runtime uses:

```text
NUXT_PUBLIC_MOBILE_ANDROID_DOWNLOAD_URL=https://minio.farismunir.my.id/situm-explore/android/situm-explore-latest-android-arm64.apk
```

The direct APK URL must be downloadable without Situm Explore login. Authenticated app pages may also expose the same download action, but the public landing page provides the no-login installation path.

The web runtime also supports these public non-secret values:

```text
NUXT_PUBLIC_MOBILE_APP_SCHEME=situm-explore
NUXT_PUBLIC_MOBILE_UNIVERSAL_LINK_BASE_URL=https://<published-mobile-link-host>
NUXT_PUBLIC_MOBILE_ANDROID_STORE_URL=<published-Play-URL>
NUXT_PUBLIC_MOBILE_IOS_STORE_URL=<published-App-Store-URL>
NUXT_PUBLIC_MOBILE_ANDROID_DOWNLOAD_URL=<published-direct-Android-URL>
NUXT_PUBLIC_MOBILE_IOS_DOWNLOAD_URL=<published-direct-iOS-URL>
```

Leave a store/download destination empty until it is real. The app link and QR may contain only non-secret routing context.

## Release sequence

Use this order for every Android release:

1. choose the new semver and increment Android version code;
2. run root/mobile tests, lint, and typecheck;
3. run `npm run build:android:release` from `mobile/`;
4. verify ABI, checksum, embedded production/staging URL, app label, launcher icon, and cold-start splash;
5. install and smoke the APK on a physical Android target;
6. upload the versioned APK, checksum, and versioned JSON manifest to MinIO;
7. verify the public versioned APK returns HTTP 200 and the downloaded SHA-256 matches locally;
8. update the `situm-explore-latest-android-arm64.apk` aliases from the verified versioned release;
9. upload `situm-explore-latest-android.json` **last**, then verify it returns HTTP 200 and its `downloadUrl`, `versionCode`, and SHA-256 match the versioned APK;
10. install the previous APK and smoke the in-app update modal against the newly published manifest, both before login and immediately after login;
11. rebuild/recreate staging web only when its runtime configuration or web UI changed;
12. smoke the public landing download without login and the authenticated mobile-install action;
13. record release evidence and commit source/docs changes.

Never claim a release is published before both the versioned object and stable alias pass public checksum verification.

## Signing and secrets

Signing credentials, keystores, MinIO write credentials, store credentials, certificates, and private provisioning material are external operator inputs. They must not be committed, copied into public runtime config, or printed in logs.

The website and APK may contain only intentionally public configuration such as HTTPS API hosts, app schemes, store URLs, and download URLs.

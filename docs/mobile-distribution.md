# Situm Explore Mobile distribution

Plan 032 establishes configuration and release boundaries; it does not publish a store artifact or signing credential.

## Public configuration

The web runtime reads these public, non-secret values from deployment environment configuration:

```text
NUXT_PUBLIC_MOBILE_APP_SCHEME=situm-explore
NUXT_PUBLIC_MOBILE_UNIVERSAL_LINK_BASE_URL=https://<published-mobile-link-host>
NUXT_PUBLIC_MOBILE_ANDROID_STORE_URL=<published-Play-URL>
NUXT_PUBLIC_MOBILE_IOS_STORE_URL=<published-App-Store-URL>
NUXT_PUBLIC_MOBILE_ANDROID_DOWNLOAD_URL=<published-direct-Android-URL>
NUXT_PUBLIC_MOBILE_IOS_DOWNLOAD_URL=<published-direct-iOS-URL>
```

Leave store/download values empty until the destination is real. The web gate then shows a truthful unavailable state. The app link and QR contain only `map`/`realtime` plus optional validated workspace/building identifiers.

The native build optionally reads `EXPO_PUBLIC_UNIVERSAL_LINK_HOST` to emit iOS Associated Domains and Android App Links intent filters. The host must publish the matching HTTPS association files before claiming Universal/App Link behavior. App schemes remain environment-specific: `situm-explore-dev`, `situm-explore-staging`, and production `situm-explore`.

## Version/build policy

- `EXPO_PUBLIC_APP_VERSION` is the user-visible semver version and defaults to `1.0.0`.
- `EXPO_PUBLIC_ANDROID_VERSION_CODE` is a positive monotonically increasing integer.
- `EXPO_PUBLIC_IOS_BUILD_NUMBER` is a monotonically increasing build identifier.
- Every published release updates the web store/download destinations only after the corresponding artifact and association host are available.

## Environment and artifacts

Development, staging, and production mobile builds use separate `EXPO_PUBLIC_API_BASE_URL` values. The web deployment uses its matching Nitro public mobile configuration; no session, Situm key, signing secret, or private store credential belongs in either public configuration.

Run the local development-build workflow from `mobile/` with the frozen Expo/RN versions, `expo prebuild`, and the repository's Android Gradle build command. Release signing, provisioning profiles, keystores, certificates, store accounts, and private download hosting remain external operator inputs and ignored files. EAS/CI/App Store automation is not selected.

Keep release artifacts, source maps, symbol files, and upload credentials in the external release system. Do not commit them, include them in web configuration, or print them in build logs. When a release changes its public app-link or install destination, update deployment environment values and association files, then rebuild only if the native link host or app metadata changed.

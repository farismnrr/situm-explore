# Security dependency remediation evidence

Date: 2026-08-18
Branch: `chore/security-dependency-remediation`
Base: `origin/main` at `35bcf99cd456e48661bce8b5f2538fb901a189fb`

## Starting inventory

The root application had 0 npm audit findings. The mobile lockfile had 18 aggregated npm audit findings (11 high, 7 moderate), reducing to three underlying GitHub Dependabot advisories:

| Advisory | Package/path | Starting version | Published advisory state |
| --- | --- | --- | --- |
| GHSA-w3rx-r6r6-pgpr / CVE-2025-71330 | `expo@57.0.13` -> `@expo/metro@56.0.0` -> `metro@0.84.4` -> `image-size@1.2.1` | 1.2.1 | high, `<=2.0.2`, no patched release |
| GHSA-5p2g-fcmc-qvqq / CVE-2025-71329 | same path | 1.2.1 | high, `<=2.0.2`, no patched release |
| GHSA-w5hq-g745-h8pq / CVE-2026-41907 | `expo@57.0.13` -> `@expo/config-plugins@57.0.8` -> `xcode@3.0.1` -> `uuid@7.0.3` | 7.0.3 | medium, `<11.1.1`, patched in 11.1.1 |

The authoritative GitHub advisory API was queried on this date. It still reports no `first_patched_version` for either `image-size` advisory. The UUID advisory describes unsafe caller-provided buffer writes in `v3`, `v5`, and `v6`; `xcode@3.0.1` calls only `uuid.v4()` in `generateUuid`, which is API-compatible with UUID 11 and does not use the affected API.

## Remediation

UUID was remediated with the narrow npm override below; no direct application dependency was added:

```json
"overrides": {
  "xcode": {
    "uuid": "11.1.1"
  }
}
```

The resolved path is now `xcode@3.0.1 -> uuid@11.1.1 overridden`. Expo, React Native, Situm, Metro, and their frozen compatibility versions were not downgraded or migrated.

For `image-size`, registry latest remains 2.0.2 and both advisories still cover `<=2.0.2`, so a version bump alone was rejected. The maintainer-owned upstream commit [8994131c7c3ee8da1699e04700c95e0e683a0c68](https://github.com/image-size/image-size/commit/8994131c7c3ee8da1699e04700c95e0e683a0c68) contains the zero-size box-loop fix used by the JXL/HEIF path; the installed 1.2.1 distribution already contains that guard. The published ICNS path still advanced by an attacker-controlled zero entry length and remained demonstrably unbounded.

The repository is archived, has no released version after 2.0.2, and has no newer maintainer-owned ICNS fix. A minimal `patch-package` patch therefore changes only both ICNS offset increments to advance by at least the 8-byte entry header when the declared entry length is zero. It is reproducible from `mobile/package.json`, `mobile/package-lock.json`, `mobile/patches/image-size+1.2.1.patch`, and the `postinstall` hook. This repairs the vulnerable behavior without falsifying the package version or suppressing audit output.

Alternatives rejected: npm's proposed Expo 53 / React Native 0.72 downgrades (incompatible and unrelated to the frozen stack); `image-size@2.0.2` alone (still covered by both advisory ranges); arbitrary forks/floating branches; Dependabot dismissal; audit configuration changes; and `npm audit fix --force`.

## Clean-install and graph proof

- Root `npm ci`: passed; root `npm audit`: 0 total.
- Mobile `npm ci`: passed; `postinstall` reapplied `image-size@1.2.1` patch.
- `npm ls uuid image-size --all`: only `uuid@11.1.1 overridden` and `image-size@1.2.1` on the expected transitive paths; no invalid or extraneous state.
- `npm run security:test`: passed. It exercises a zero-length ICNS entry, a zero-length box traversal, UUID v4 generation, and xcode module loading.
- Mobile `npm audit` and `npm audit --omit=dev`: each report 11 high aggregate findings, all propagating from the two `image-size` advisories. UUID is absent from the final audit findings.

The npm audit residual is not claimed as zero: npm classifies the patched local package by its published 1.2.1 version, and the upstream advisories intentionally have no patched version. The residual is a scanner/version-range residual over a locally repaired parser, not a dismissed alert.

## Validation gates

- Root: 39 tests passed; lint passed; typecheck passed; production build passed.
- Mobile: security regression passed; lint passed; typecheck passed; `npx expo config --type public` passed.
- `npx expo-doctor`: 19/21 checks passed. The only two warnings remain the known `@situm/react-native` New Architecture metadata warning and the frozen patch mismatch (`expo` 57.0.13 vs expected 57.0.14; `expo-build-properties` 57.0.11 vs expected 57.0.12). No dependency change widened or introduced them.
- Clean `npx expo prebuild --clean --no-install`: passed.
- Android `./gradlew assembleDebug` with `/home/farismnrr/Android/Sdk`: passed, using min/compile/target 24/36/36, Kotlin 2.1.20, and the frozen Expo 57 / RN 0.86.2 stack.
- Production smoke on a fresh build: `/` returned 200 with security headers; unauthenticated `/api/me` returned 401 with security headers and no sensitive response data.

## GitHub state

Dependabot was queried without changing alert state. Alerts #4 and #5 for `image-size` remain open because the upstream advisory has no patched release and the committed local patch cannot change GitHub's published-version range. Alert #3 for UUID was still open at query time because this branch is not merged into the default branch; it has a first patched version of 11.1.1 and the new lockfile resolves that version. No alert was dismissed.

## Gate conclusion

UUID has a released, compatible remediation. `image-size` has a minimal, auditable, reproducible local remediation for the exact reachable parser behavior, but GitHub/npm continue to report the upstream advisory residual truthfully. This evidence does not claim zero vulnerabilities. Plan 034 was not started, and no PR was opened or merged.

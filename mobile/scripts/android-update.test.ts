import { DEFAULT_ANDROID_UPDATE_MANIFEST_URL, getAndroidUpdateManifestUrl, isAndroidUpdateAvailable, isSafeAndroidUpdateUrl, parseAndroidReleaseManifest } from '../src/update/androidUpdate'

function equal(actual: unknown, expected: unknown) {
  if (actual !== expected) throw new Error(`expected ${String(expected)}, got ${String(actual)}`)
}

function throws(action: () => unknown) {
  try { action() } catch { return }
  throw new Error('expected function to throw')
}

const manifest = parseAndroidReleaseManifest({
  schemaVersion: 1,
  platform: 'android',
  version: '1.2.0',
  versionCode: 12,
  downloadUrl: 'https://minio.example.test/situm-explore-v1.2.0-android-arm64.apk',
  sha256: 'a'.repeat(64),
  publishedAt: '2026-08-18T12:00:00.000Z',
})

equal(isAndroidUpdateAvailable('11', manifest), true)
equal(isAndroidUpdateAvailable('12', manifest), false)
equal(isAndroidUpdateAvailable('13', manifest), false)
equal(isAndroidUpdateAvailable(null, manifest), false)
throws(() => parseAndroidReleaseManifest({ ...manifest, versionCode: 0 }))
throws(() => parseAndroidReleaseManifest({ ...manifest, schemaVersion: 2 }))
throws(() => parseAndroidReleaseManifest({ ...manifest, platform: 'ios' }))
throws(() => parseAndroidReleaseManifest({ ...manifest, downloadUrl: 'http://example.test/app.apk' }))
throws(() => parseAndroidReleaseManifest({ ...manifest, downloadUrl: 'httpsx://example.test/app.apk' }))
throws(() => parseAndroidReleaseManifest({ ...manifest, downloadUrl: 'https://user:pass@example.test/app.apk' }))
throws(() => parseAndroidReleaseManifest({ ...manifest, sha256: 'not-a-sha' }))
equal(isSafeAndroidUpdateUrl('https://example.test/app.apk'), true)
equal(isSafeAndroidUpdateUrl('https://user:pass@example.test/app.apk'), false)
equal(isSafeAndroidUpdateUrl('intent://example.test/app.apk'), false)
equal(isSafeAndroidUpdateUrl('not a url'), false)

delete process.env.EXPO_PUBLIC_ANDROID_UPDATE_MANIFEST_URL
equal(getAndroidUpdateManifestUrl(), DEFAULT_ANDROID_UPDATE_MANIFEST_URL)
process.env.EXPO_PUBLIC_ANDROID_UPDATE_MANIFEST_URL = 'https://example.test/releases/latest.json'
equal(getAndroidUpdateManifestUrl(), 'https://example.test/releases/latest.json')
process.env.EXPO_PUBLIC_ANDROID_UPDATE_MANIFEST_URL = 'http://example.test/releases/latest.json'
throws(() => getAndroidUpdateManifestUrl())
delete process.env.EXPO_PUBLIC_ANDROID_UPDATE_MANIFEST_URL


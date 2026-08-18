export const DEFAULT_ANDROID_UPDATE_MANIFEST_URL = 'https://minio.farismunir.my.id/situm-explore/android/situm-explore-latest-android.json'

export type AndroidReleaseManifest = {
  schemaVersion: 1
  platform: 'android'
  version: string
  versionCode: number
  downloadUrl: string
  sha256: string
  publishedAt: string
}

export function parseAndroidReleaseManifest(value: unknown): AndroidReleaseManifest {
  if (!value || typeof value !== 'object') throw new Error('Invalid Android update manifest.')
  const manifest = value as Record<string, unknown>
  if (manifest.schemaVersion !== 1 || manifest.platform !== 'android') throw new Error('Unsupported Android update manifest.')
  if (typeof manifest.version !== 'string' || !manifest.version.trim()) throw new Error('Android update manifest is missing version.')
  if (!Number.isSafeInteger(manifest.versionCode) || Number(manifest.versionCode) < 1) throw new Error('Android update manifest has an invalid version code.')
  if (typeof manifest.downloadUrl !== 'string' || !manifest.downloadUrl.startsWith('https://')) throw new Error('Android update manifest has an invalid download URL.')
  if (typeof manifest.sha256 !== 'string' || !/^[a-f0-9]{64}$/i.test(manifest.sha256)) throw new Error('Android update manifest has an invalid checksum.')
  if (typeof manifest.publishedAt !== 'string' || Number.isNaN(Date.parse(manifest.publishedAt))) throw new Error('Android update manifest has an invalid publish date.')
  return manifest as AndroidReleaseManifest
}

export function isAndroidUpdateAvailable(installedBuildVersion: string | null, manifest: AndroidReleaseManifest) {
  const installedVersionCode = Number(installedBuildVersion)
  return Number.isSafeInteger(installedVersionCode) && installedVersionCode > 0 && manifest.versionCode > installedVersionCode
}

export async function fetchAndroidReleaseManifest(url = DEFAULT_ANDROID_UPDATE_MANIFEST_URL, timeoutMs = 5000): Promise<AndroidReleaseManifest> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: controller.signal })
    if (!response.ok) throw new Error(`Android update manifest request failed with ${response.status}.`)
    return parseAndroidReleaseManifest(await response.json())
  } finally {
    clearTimeout(timer)
  }
}

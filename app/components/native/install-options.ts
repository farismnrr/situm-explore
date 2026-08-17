export type NativeInstallPlatform = 'android' | 'ios' | 'unknown'

export interface NativeInstallConfig {
  androidStoreUrl?: string
  iosStoreUrl?: string
  androidDownloadUrl?: string
  iosDownloadUrl?: string
}

export interface NativeInstallOption {
  kind: 'store' | 'download'
  platform: 'android' | 'ios'
  url: string
  label: string
}

export function getNativeInstallOptions(platform: NativeInstallPlatform, config: NativeInstallConfig): NativeInstallOption[] {
  const platforms: Array<'android' | 'ios'> = platform === 'android' ? ['android'] : platform === 'ios' ? ['ios'] : ['android', 'ios']
  return platforms.flatMap((target) => {
    const storeUrl = target === 'android' ? config.androidStoreUrl : config.iosStoreUrl
    const downloadUrl = target === 'android' ? config.androidDownloadUrl : config.iosDownloadUrl
    const label = target === 'android' ? 'Get Android app' : 'Get iOS app'
    return [
      ...(storeUrl ? [{ kind: 'store' as const, platform: target, url: storeUrl, label }] : []),
      ...(downloadUrl ? [{ kind: 'download' as const, platform: target, url: downloadUrl, label: `Download ${target === 'android' ? 'Android' : 'iOS'} build` }] : [])
    ]
  })
}

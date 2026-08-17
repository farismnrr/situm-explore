import type { ExpoConfig } from 'expo/config'

const environment = process.env.EXPO_PUBLIC_ENVIRONMENT || 'dev'
const scheme = environment === 'production' ? 'situm-explore' : `situm-explore-${environment}`
const universalLinkHost = process.env.EXPO_PUBLIC_UNIVERSAL_LINK_HOST?.trim()

const config = {
  name: 'Situm Explore',
  slug: 'situm-explore',
  version: '1.0.0',
  orientation: 'default',
  scheme,
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  ios: { bundleIdentifier: 'com.situm.explore', supportsTablet: true, deploymentTarget: '16.4', ...(universalLinkHost ? { associatedDomains: [`applinks:${universalLinkHost}`] } : {}) },
  android: { package: 'com.situm.explore', adaptiveIcon: { backgroundColor: '#111827' }, ...(universalLinkHost ? { intentFilters: [{ action: 'VIEW', autoVerify: true, category: ['BROWSABLE', 'DEFAULT'], data: [{ scheme: 'https', host: universalLinkHost, pathPrefix: '/' }] }] } : {}) },
  plugins: [
    'expo-secure-store',
    ['expo-build-properties', { android: { minSdkVersion: 24, compileSdkVersion: 36, targetSdkVersion: 36, kotlinVersion: '2.1.20' }, ios: { deploymentTarget: '16.4' } }],
  ],
  extra: { environment, apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || '', universalLinkHost: universalLinkHost || '' },
}

export default config as ExpoConfig

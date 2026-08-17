import type { ExpoConfig } from 'expo/config'

const environment = process.env.EXPO_PUBLIC_ENVIRONMENT || 'dev'
const scheme = environment === 'production' ? 'situm-explore' : `situm-explore-${environment}`

const config = {
  name: 'Situm Explore',
  slug: 'situm-explore',
  version: '1.0.0',
  orientation: 'default',
  scheme,
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  ios: { bundleIdentifier: 'com.situm.explore', supportsTablet: true, deploymentTarget: '16.4' },
  android: { package: 'com.situm.explore', adaptiveIcon: { backgroundColor: '#111827' } },
  plugins: [
    'expo-secure-store',
    ['expo-build-properties', { android: { minSdkVersion: 24, compileSdkVersion: 36, targetSdkVersion: 36, kotlinVersion: '2.1.20' }, ios: { deploymentTarget: '16.4' } }],
  ],
  extra: { environment, apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || '' },
}

export default config as ExpoConfig

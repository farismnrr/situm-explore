import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { nativeDestinationFromLink, parseNativeDeepLink } from '../mobile/src/navigation/deep-link'
import { mapViewerBreakpoint } from '../app/composables/useMapViewerCapability'
import { getNativeInstallOptions } from '../app/components/native/install-options'
import { consumeMapDeepLinkRequest, createMapDeepLinkRequest, type MapDeepLinkRequest } from '../mobile/src/map/deep-link-state'

test('Plan 032 parses only non-secret Map and Realtime routing context', () => {
  assert.deepEqual(parseNativeDeepLink('situm-explore://map?workspaceId=workspace_a&buildingId=42'), { destination: 'map', workspaceId: 'workspace_a', buildingId: 42 })
  assert.deepEqual(parseNativeDeepLink('situm-explore-dev://realtime?workspaceId=workspace_a'), { destination: 'realtime', workspaceId: 'workspace_a' })
  assert.deepEqual(parseNativeDeepLink('https://mobile.example.test/app/map?workspaceId=workspace_a&buildingId=42'), { destination: 'map', workspaceId: 'workspace_a', buildingId: 42 })
  assert.deepEqual(parseNativeDeepLink('situm-explore://map?session=secret&apiKey=secret'), { destination: 'map' })
  assert.deepEqual(parseNativeDeepLink('situm-explore://map?workspaceId=not.allowed'), { destination: 'map' })
  assert.equal(parseNativeDeepLink('https://mobile.example.test/app/settings'), null)
  assert.equal(nativeDestinationFromLink(parseNativeDeepLink('situm-explore://realtime')), 'realtime')
})

test('Plan 032 native lifecycle owns one deep-link listener and rechecks workspace context', () => {
  const app = readFileSync(new URL('../mobile/App.tsx', import.meta.url), 'utf8')
  const context = readFileSync(new URL('../mobile/src/workspaces/context.ts', import.meta.url), 'utf8')
  const parser = readFileSync(new URL('../mobile/src/navigation/deep-link.ts', import.meta.url), 'utf8')
  assert.match(app, /Linking\.getInitialURL\(\)/)
  assert.match(app, /Linking\.addEventListener\('url'/)
  assert.match(app, /linkSubscription\.remove\(\)/)
  assert.match(app, /if \(lifecycle === 'active'\) void checkForUpdate\(\)/)
  assert.match(app, /getContentUriAsync\(uri\)/)
  assert.match(app, /startActivityAsync\('android\.intent\.action\.VIEW'/)
  assert.match(app, /flags: 1/)
  assert.match(context, /if \(link\.workspaceId\) this\.select\(link\.workspaceId\)/)
  assert.match(context, /That workspace is not available to this account/)
  assert.doesNotMatch(parser, /session|apiKey|password|bearer/i)
})

test('Plan 032 shared web gate contains no credential-bearing handoff fields', () => {
  const gate = readFileSync(new URL('../app/components/native/NativeAppGate.vue', import.meta.url), 'utf8')
  const installOptions = readFileSync(new URL('../app/components/native/install-options.ts', import.meta.url), 'utf8')
  assert.match(gate, /QRCode\.toDataURL/)
  assert.match(gate, /Copy app link/)
  assert.match(installOptions, /androidStoreUrl|iosStoreUrl/)
  assert.doesNotMatch(gate, /session|password|apiKey|credential|bearer/i)
})

test('Plan 032 Map capability is geometry-based and gates Viewer work before fetch', () => {
  const map = readFileSync(new URL('../app/pages/app/map.vue', import.meta.url), 'utf8')
  assert.deepEqual(mapViewerBreakpoint, { minWidth: 768, minHeight: 600 })
  assert.match(map, /watch\(\[selectedWorkspaceId, isMapViewerCapable\]/)
  assert.match(map, /if \(workspaceId && capable\) refreshCartography\(\)/)
  assert.match(map, /<NativeAppGate feature="map"/)
  assert.doesNotMatch(map, /useDesktopViewport|Desktop required/)
})

test('Plan 032 all web Realtime entry copy uses the native product policy', () => {
  const realtime = readFileSync(new URL('../app/pages/app/realtime.vue', import.meta.url), 'utf8')
  const home = readFileSync(new URL('../app/pages/app/index.vue', import.meta.url), 'utf8')
  assert.match(realtime, /<NativeAppGate feature="realtime"/)
  assert.match(realtime, /native Situm Explore experience/)
  assert.doesNotMatch(realtime, /Coming soon|Download Android app|web realtime monitoring is not available/i)
  assert.match(home, /to: '\/app\/realtime'/)
  assert.match(home, /Open native workspace positions/)
})

test('Plan 032 distribution fallback has no timer-based app detection', () => {
  const gate = readFileSync(new URL('../app/components/native/NativeAppGate.vue', import.meta.url), 'utf8')
  const config = readFileSync(new URL('../mobile/app.config.ts', import.meta.url), 'utf8')
  assert.match(gate, /QRCode\.toDataURL/)
  assert.doesNotMatch(gate, /setTimeout\([^\n]*location|visibilitychange|blur/i)
  assert.match(config, /associatedDomains/)
  assert.match(config, /intentFilters/)
  assert.match(config, /EXPO_PUBLIC_UNIVERSAL_LINK_HOST/)
})

test('Plan 032 public landing exposes configured Android download without requiring an app route', () => {
  const landing = readFileSync(new URL('../app/pages/index.vue', import.meta.url), 'utf8')
  assert.match(landing, /config\.public\.mobile\.androidDownloadUrl/)
  assert.match(landing, /Download Android/)
  assert.match(landing, /v-if="androidDownloadUrl"/)
})

test('Plan 032 install options use OS for mobile and expose all configured targets elsewhere', () => {
  const config = {
    androidStoreUrl: 'https://play.example/app',
    iosStoreUrl: 'https://apps.example/app',
    androidDownloadUrl: 'https://download.example/android',
    iosDownloadUrl: 'https://download.example/ios'
  }
  assert.deepEqual(getNativeInstallOptions('android', config).map(option => option.platform), ['android', 'android'])
  assert.deepEqual(getNativeInstallOptions('ios', config).map(option => option.platform), ['ios', 'ios'])
  assert.deepEqual(getNativeInstallOptions('unknown', config).map(option => option.platform), ['android', 'android', 'ios', 'ios'])
  assert.deepEqual(getNativeInstallOptions('unknown', { androidStoreUrl: config.androidStoreUrl }).map(option => option.url), [config.androidStoreUrl])
})

test('Plan 032 Map handoff requests are cleared on workspace changes and consumed without remount loops', () => {
  const context = readFileSync(new URL('../mobile/src/workspaces/context.ts', import.meta.url), 'utf8')
  const map = readFileSync(new URL('../mobile/src/map/NativeMapScreen.tsx', import.meta.url), 'utf8')
  const app = readFileSync(new URL('../mobile/App.tsx', import.meta.url), 'utf8')
  assert.match(context, /this\.mapRequest = null/)
  assert.match(context, /createMapDeepLinkRequest\(\+\+this\.mapRequestSequence/)
  assert.match(context, /consumeMapRequest\(requestId: number\)/)
  assert.match(map, /pendingMapRequest = workspaces\.mapRequest/)
  assert.match(map, /handledMapRequestId\.current === pendingMapRequest\.requestId/)
  assert.match(map, /workspaces\.consumeMapRequest\(pendingMapRequest\.requestId\)/)
  assert.match(map, /key=\{`\$\{workspaceId\}:\$\{activeMapRequestId \?\? 'default'\}`\}/)
  assert.doesNotMatch(app, /requestedBuildingId\|\| 'default'/)
})

test('Plan 032 applies sequential same-workspace Map links as distinct one-shot requests', () => {
  const firstRequest: MapDeepLinkRequest = createMapDeepLinkRequest(1, 101)
  assert.deepEqual(firstRequest, { requestId: 1, buildingId: 101 })

  let request: MapDeepLinkRequest | null = consumeMapDeepLinkRequest(firstRequest, firstRequest.requestId)
  assert.equal(request, null)

  const secondRequest: MapDeepLinkRequest = createMapDeepLinkRequest(2, 202)
  request = secondRequest
  assert.deepEqual(secondRequest, { requestId: 2, buildingId: 202 })
  assert.notEqual(secondRequest.requestId, firstRequest.requestId)

  request = consumeMapDeepLinkRequest(request, secondRequest.requestId)
  request = consumeMapDeepLinkRequest(request, secondRequest.requestId)
  assert.equal(request, null)
})

test('Plan 032 Android release artifacts and generated native config stay arm64-only', () => {
  const releaseScript = readFileSync(new URL('../mobile/scripts/build-android-release.cjs', import.meta.url), 'utf8')
  const deviceScript = readFileSync(new URL('../mobile/scripts/build-android-device.cjs', import.meta.url), 'utf8')
  const appConfig = readFileSync(new URL('../mobile/app.config.ts', import.meta.url), 'utf8')
  const distribution = readFileSync(new URL('../docs/mobile-distribution.md', import.meta.url), 'utf8')
  const staging = readFileSync(new URL('../deploy/staging.compose.yml', import.meta.url), 'utf8')
  assert.match(releaseScript, /situm-explore-v\$\{version\}-android-arm64/)
  assert.match(releaseScript, /expo.*prebuild/)
  assert.match(releaseScript, /--no-clean/)
  assert.match(releaseScript, /GRADLE_USER_HOME/)
  assert.match(releaseScript, /--build-cache/)
  assert.match(releaseScript, /reactNativeArchitectures=arm64-v8a/)
  assert.match(deviceScript, /:app:assembleDebug/)
  assert.match(deviceScript, /\['install', '-r', '-d', debugApk\]/)
  assert.doesNotMatch(deviceScript, /:app:installDebug/)
  assert.match(appConfig, /buildArchs: \['arm64-v8a'\]/)
  assert.match(distribution, /situm-explore-v<semver>-android-arm64\.apk/)
  assert.match(distribution, /situm-explore-latest-android-arm64\.apk/)
  assert.match(staging, /situm-explore-latest-android-arm64\.apk/)
})

test('Plan 032 Android release fails closed on local or missing API base URLs', () => {
  const releaseScript = readFileSync(new URL('../mobile/scripts/build-android-release.cjs', import.meta.url), 'utf8')
  assert.match(releaseScript, /EXPO_PUBLIC_API_BASE_URL is required for release builds/)
  assert.match(releaseScript, /Release API base URL must be public HTTPS/)
  assert.match(releaseScript, /localhost.*127\.0\.0\.1.*0\.0\.0\.0/)
})

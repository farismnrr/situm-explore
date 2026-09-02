import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const appConfig = readFileSync(new URL('../mobile/app.config.ts', import.meta.url), 'utf8')
const app = readFileSync(new URL('../mobile/App.tsx', import.meta.url), 'utf8')

test('mobile launch uses the supported Expo splash plugin with the Situm Explore logo', () => {
  assert.match(appConfig, /\['expo-splash-screen', \{ image: '\.\/assets\/splash-icon\.png', imageWidth: 200, resizeMode: 'contain', backgroundColor: '#111827' \}\]/)
  assert.doesNotMatch(appConfig, /\bsplash:\s*\{/)
})

test('mobile launch keeps native splash until the app-owned animated logo layer is ready', () => {
  assert.match(app, /SplashScreen\.preventAutoHideAsync\(\)/)
  assert.match(app, /function AnimatedLaunchSplash/)
  assert.match(app, /requestAnimationFrame\(\(\) => \{\s*SplashScreen\.hide\(\)\s*setNativeReleased\(true\)/s)
  assert.doesNotMatch(app, /onLayout=\{revealAnimatedLayer\}/)
  assert.doesNotMatch(app, /SplashScreen\.hideAsync\(\)/)
  assert.match(app, /SplashScreen\.hide\(\)/)
  assert.match(app, /require\('\.\/assets\/splash-icon\.png'\)/)
  assert.match(app, /if \(!appReady \|\| !animationDone/)
})

test('mobile launch animation stays dependency-light and app-owned', () => {
  assert.match(app, /Animated\.timing\(logoScale/)
  assert.match(app, /Animated\.timing\(haloScale/)
  assert.match(app, /Animated\.timing\(wordmarkOpacity/)
  assert.doesNotMatch(app, /lottie|Lottie/)
})

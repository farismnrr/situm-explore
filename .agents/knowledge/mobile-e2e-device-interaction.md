# Mobile E2E Device Interaction Notes

Reusable operator/agent notes for physical Android smoke/E2E runs of Situm Explore.

## Current observed device geometry

- Observed viewport: `1366x720` landscape.
- Package/activity: `com.situm.explore/.MainActivity`.
- Login-screen bounds observed with keyboard dismissed:
  - Email input (`content-desc="Email"`): `[427,388][939,436]`, center about `(683,412)`.
  - Password input (`content-desc="Password"`): `[427,479][939,527]`, center about `(683,503)`.
  - Sign-in button (`content-desc="Sign in"`): `[427,543][939,589]`, center about `(683,566)`.
- Authenticated Explore navigation observed near the bottom edge:
  - Explore: `[16,656][150,708]`
  - Realtime: `[154,656][288,708]`
  - Recent: `[292,656][426,708]`
  - Settings: `[430,656][564,708]`

These coordinates are evidence, not a permanent contract. Android keyboard resize, orientation, density, safe-area changes, and future UI revisions can move them.

## Stable interaction strategy

Prefer accessibility/UIAutomator bounds over fixed tap coordinates:

1. Dump the current hierarchy with `adb shell uiautomator dump /sdcard/window.xml` and read it with `adb shell cat /sdcard/window.xml`.
2. Locate controls by `content-desc` first (`Email`, `Password`, `Sign in`, tab names).
3. Parse the current `bounds` and tap the center of those bounds.
4. For editable fields, focus the field, clear existing text with key events/select-all as appropriate, then use `adb shell input text ...`.
5. Do not assume password/button Y positions while the soft keyboard is visible. The app uses keyboard resize behavior, so the layout can move.
6. Before tapping Sign in by coordinates, dismiss the keyboard with `adb shell input keyevent KEYCODE_BACK`, dump the hierarchy again, and use the refreshed Sign-in bounds.
7. Prefer submitting through the focused field/IME only when confirmed stable; otherwise use the refreshed accessibility bounds after keyboard dismissal.
8. After submit, verify state from UI hierarchy plus resumed activity and logcat rather than assuming a tap succeeded.

## Runtime setup for dev-bundle smoke tests

When running the installed app against Metro, start Metro with the intended public API origin. A dev JS bundle without `EXPO_PUBLIC_API_BASE_URL` can override the release-configured origin and make login appear broken even though the installed release binary was configured correctly.

Known staging/public origin used by project smoke testing:

`https://situm.farismunir.my.id`

Do not persist login passwords, tokens, cookies, API keys, or other credentials here. Credentials supplied by the user are transient test inputs only.

## Fast Android iteration and build-cache rule

For UI/TypeScript-only E2E changes, a full release Gradle build is the wrong loop. Expo's local-development workflow only requires native compilation for the first shell build or after native dependency/config changes; subsequent JS/TS changes should run through Metro.

1. Verify the physical device ABI with `adb shell getprop ro.product.cpu.abi`. The current POS is `arm64-v8a`.
2. Build/install the native debug shell with `cd mobile && npm run build:android:device`. This script skips Expo Prebuild when `android/` already exists, pins arm64, enables Gradle build-cache reuse, writes `local.properties`, and uses the ignored `.gradle-agent-home` when no external `GRADLE_USER_HOME` is supplied.
3. Start Metro with the intended public API origin and keep it running while changing JS/TS. Do not invoke Gradle again for ordinary map/UI edits.
4. Re-run Expo Prebuild/native compilation only after app config, config plugins, or native dependencies change. Never run `prebuild --clean` as part of the ordinary E2E edit loop because it deletes native build state.
5. Never use `--no-daemon` for iterative builds. If a direct Gradle command is necessary inside MCP, set `GRADLE_USER_HOME=$PWD/.gradle-agent-home` from `mobile/` so wrapper/dependency/build caches survive sandbox calls.
6. A release build is a final acceptance/distribution gate, not the feedback loop for React Native presentation work.

The September 2026 failure mode was measurable: an arm64 release rebuild after regenerated native state took about 8.5 minutes and executed 394/422 Gradle tasks; an earlier four-ABI invocation took about 11 minutes. App-owned JS map code was not the dominant cost—the repeated native/CMake graph was.

## Login smoke-test acceptance

A successful login smoke test should confirm at minimum:

- `com.situm.explore/.MainActivity` remains resumed;
- authenticated Explore UI is present;
- `Locate me` is visible when expected;
- Explore/Realtime/Recent/Settings navigation is present;
- no fatal/crash signal appears in the relevant logcat slice.

## Why this exists

Use this file as the first reference for future physical-device E2E so repeated runs do not rediscover device geometry and keyboard behavior. Re-dump UI bounds at runtime before interacting; update this file only when stable device/UI behavior changes.

## Explore fullscreen smoke test (2026-08-27)

On the 1366x720 POS device in authenticated normal Explore mode, the app-owned fullscreen control was observed as:

- accessibility label: `Enter fullscreen map`
- observed bounds: `[1300,102][1340,142]`
- observed center tap: `(1320,122)`

Always prefer locating it by accessibility label and refreshing bounds before tapping; the coordinates above are only a fallback for this known viewport.

Acceptance behavior:

1. Normal Explore retains the standard Situm Explore shell (rail/topbar/navigation) plus map overlays such as Locate me.
2. Activating `Enter fullscreen map` renders the map without Situm Explore shell/navigation or app-owned map overlays.
3. The fullscreen trigger itself is absent while fullscreen is active.
4. Android `KEYCODE_BACK` exits fullscreen and restores the normal Explore shell without leaving `com.situm.explore/.MainActivity`.

## Android build ABI guardrail (2026-09-02)

The connected POS reports `arm64-v8a`. For routine build/install/E2E on this device, compile **arm64 only**.

- Preferred release command: `cd mobile && npm run build:android:release` with the required release environment values supplied explicitly.
- The release script already passes `-PreactNativeArchitectures=arm64-v8a`.
- `mobile/app.config.ts` pins `expo-build-properties.android.buildArchs` to `['arm64-v8a']`, which keeps generated `android/gradle.properties` on the same single-ABI default after `expo prebuild`.
- A raw Gradle invocation that starts `buildCMake...` for `armeabi-v7a`, `x86`, and `x86_64` in addition to `arm64-v8a` is a configuration/invocation mistake for POS acceptance. Cancel it and fix the ABI selection rather than waiting for all four native builds.
- Always verify `adb shell getprop ro.product.cpu.abi` before assuming the target architecture.

Observed failure mode: an unpinned `./gradlew assembleRelease --no-daemon` compiled all four React Native ABIs and saturated all CPU threads for about eleven minutes. This was build fan-out, not evidence that the custom map renderer itself was expensive to compile.

## Custom-map hot-reload E2E findings (2026-09-02)

For app-owned Explore map work, the validated physical loop is:

1. Keep the installed arm64 debug shell.
2. Run `adb reverse tcp:8081 tcp:8081`.
3. Start Metro with `EXPO_PUBLIC_API_BASE_URL=https://situm.farismunir.my.id npm start -- --host localhost --port 8081` from `mobile/`.
4. Use UIAutomator accessibility labels to drive the POS; do not rebuild Gradle for JS/TS changes.
5. A Fast Refresh/redbox reload can temporarily leave a blank root while the new bundle reconnects. If that happens, `am force-stop` + `am start -n com.situm.explore/.MainActivity` reuses the same debug shell and Metro bundle without a native rebuild.

Physical E2E exposed three durable implementation traps:

- Removing `SitumProvider`/`MapView` also removes their implicit SDK initialization. A headless positioning session must call `SitumPlugin.init()` before `setApiKey` or other native Situm configuration. The native exception is `Situm SDK must be initialized by calling SitumSDK.init(Context)`.
- Updating React state to close POI search does not blur the Android `TextInput`. Dismiss the soft keyboard when a POI is selected/route starts, otherwise taps intended for the destination sheet can hit the keyboard and mutate the search query instead.
- Do not implement fullscreen by returning a different root tree around `NativeMapScreen`; that remounts Explore and loses selected destination/route state. Keep the map component in a stable tree and hide shell chrome with styles/status-bar state.

Validated real-device facts for the current venue during this run:

- building `19866`, location floor `69905` (`lt 2`);
- real indoor fixes arrived with Cartesian x/y, bearing, and roughly 1.4–1.8 m reported accuracy;
- searchable real POIs included `Pintu Masuk`, `Ruang Kerja 3`, `Kitchen`, `Ruang Kerja 2`, `Ruang Kerja 1`, and `Toilet`;
- app-owned route samples produced `20 m` to `Ruang Kerja 3` and `51 m` to `Pintu Masuk`, with the custom guidance HUD active;
- fullscreen + Android Back preserved the active route after the stable-tree fix;
- floor switch `lt 2` → `lt 1` changed the rendered floorplan identity;
- the final bounded logcat slice contained no fatal exception or ReactNativeJS error.

Do not treat the observed POI names, distances, or coordinates as permanent fixtures; they are acceptance evidence for this venue snapshot only.

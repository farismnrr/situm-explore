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

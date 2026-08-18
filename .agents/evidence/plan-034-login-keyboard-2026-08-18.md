# Plan 034 login keyboard remediation evidence

Date: 2026-08-18 (Asia/Jakarta)
Target: `100.113.52.76:35911` / `Pos_System`

## Runtime geometry

- Physical display: `1366×768`; app window content: `1366×720`.
- Vendor IME frame from `dumpsys window`: `[0,388][1366,768]`; keyboard top is `Y=388`.
- The initial failing state was Email `Y=400–448`, matching the previously recorded occlusion.
- With the remediation active, objective UIAutomator bounds while the IME remained open were:
  - Email: `Y=199–247`.
  - Password: `Y=276–324`.
  - Sign in: `Y=324–370`.
- Therefore the focused-field and action bottoms were at least `18px` above the observed IME top; Password had `64px` clearance.

## Interaction cases exercised

- Password focus with IME open: passed; typed password character was present and the field remained visible.
- Email focus with IME open: passed; typed email character/caret remained visible.
- Email → Password → Email: passed without focus loop or jump loop; bounds remained stable.
- Sign in while IME remained open: passed; action bounds remained above `Y=388`.
- Keyboard dismiss: passed; centered non-editing layout returned (Email `Y=400–448`, Password `Y=491–539`, Sign in `Y=555–601`) without a residual spacer.
- Dismiss → reopen: passed; compact editing bounds returned.
- Invalid smoke retry was exercised with non-production placeholder input; the focused form stayed compact and the primary action remained in the visible editing region.

## Validation

- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run test:login-keyboard`: PASS.
- `npx expo config --json`: PASS; `softwareKeyboardLayoutMode` is `resize`, package is `com.situm.explore`, New Architecture is enabled.
- Android manifest: PASS; `android:windowSoftInputMode="adjustResize"`.
- `ANDROID_SDK_ROOT=/home/farismnrr/Android/Sdk ANDROID_HOME=/home/farismnrr/Android/Sdk npm run build:android`: PASS.
- `git diff --check`: PASS.

The final `adb install -r` attempt was retried after restarting the ADB server and hung without returning an install result, despite shell access remaining healthy. This is an ADB install-runtime limitation, not treated as install success. Physical geometry above was captured from the target running the current Metro bundle against the already-installed debug native shell; no credentials or credential-bearing screenshots were written here.

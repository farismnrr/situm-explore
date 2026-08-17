// Safe, broadly-applicable response headers. A strict Content-Security-Policy
// is intentionally NOT set here: the Situm Map Viewer is embedded via
// @situm/sdk-js's own iframe/script/postMessage lifecycle (see
// app/components/situm/SitumViewer.vue and .agents/state.md's Viewer
// building-mismatch investigation), and this repo has no live-verified,
// network-trace-backed allowlist of every origin/script/connect target the
// hosted Viewer release actually requires. Shipping a guessed CSP risks
// silently breaking the Viewer (as already happened once with the
// wait_for_auth/postMessage flow). Per this repo's "no evidence, no
// implementation" rule, this is documented as an open limitation rather
// than a guessed policy.
export default defineEventHandler((event) => {
  setResponseHeader(event, 'X-Content-Type-Options', 'nosniff')
  setResponseHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')
  setResponseHeader(event, 'X-Frame-Options', 'DENY')
  setResponseHeader(event, 'Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()')
})

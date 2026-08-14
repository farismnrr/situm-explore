export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  return { configured: false, serverConfigured: false, viewerConfigured: false, viewerReady: false, authority: 'workspace' }
})

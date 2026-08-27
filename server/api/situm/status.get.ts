export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  return { configured: false, readOnlyConfigured: false, readWriteConfigured: false, authority: 'workspace' }
})

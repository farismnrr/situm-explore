export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const config = useRuntimeConfig()
  const serverConfigured = Boolean(config.situmApiKey && config.public.situmBuildingId)
  const viewerConfigured = Boolean(config.public.situmApiKey && config.public.situmBuildingId)
  return {
    configured: serverConfigured,
    serverConfigured,
    viewerConfigured,
    viewerReady: false,
    buildingId: config.public.situmBuildingId
  }
})

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const config = useRuntimeConfig()
  const readConfigured = Boolean(config.situmReadApiKey && config.public.situmBuildingId)
  const writeConfigured = Boolean(config.situmWriteApiKey && config.public.situmBuildingId)
  const viewerConfigured = Boolean(config.public.situmApiKey && config.public.situmBuildingId)
  return {
    configured: readConfigured,
    readConfigured,
    writeConfigured,
    viewerConfigured,
    viewerReady: false,
    buildingId: config.public.situmBuildingId
  }
})

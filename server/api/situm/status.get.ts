export default defineEventHandler(() => {
  const config = useRuntimeConfig()
  if (!config.public.situmViewerApiKey || !config.public.situmBuildingId) throw createError({ statusCode: 503, statusMessage: 'Situm is not configured. Set NUXT_PUBLIC_SITUM_VIEWER_API_KEY and NUXT_PUBLIC_SITUM_BUILDING_ID.' })
  return { configured: true, viewerReady: false, buildingId: config.public.situmBuildingId }
})

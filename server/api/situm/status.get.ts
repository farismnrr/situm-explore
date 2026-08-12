export default defineEventHandler(() => {
  const config = useRuntimeConfig()
  if (!config.public.situmApiKey || !config.public.situmBuildingId) throw createError({ statusCode: 503, statusMessage: 'Situm is not configured. Set NUXT_PUBLIC_SITUM_API_KEY and NUXT_PUBLIC_SITUM_BUILDING_ID.' })
  return { configured: true, buildingId: config.public.situmBuildingId }
})

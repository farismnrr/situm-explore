import SitumSDK from '@situm/sdk-js'

export function getSitumClient() {
  const config = useRuntimeConfig()
  if (!config.situmApiKey) {
    throw createError({ statusCode: 503, statusMessage: 'Situm server integration is not configured.' })
  }

  return new SitumSDK({ auth: { apiKey: config.situmApiKey }, compact: true })
}

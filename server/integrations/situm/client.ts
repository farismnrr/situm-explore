import type SitumSDK from '@situm/sdk-js'

export function getSitumClient(): SitumSDK {
  throw createError({ statusCode: 410, statusMessage: 'Global Situm authority is disabled; select an owned workspace.' })
}

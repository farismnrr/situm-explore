export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname
  if (path.startsWith('/api/situm/') || path.startsWith('/api/analytics/')) throw createError({ statusCode: 410, statusMessage: 'This legacy endpoint is no longer an active product authority.' })
})

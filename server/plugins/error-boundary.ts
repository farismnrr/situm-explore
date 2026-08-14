import { trace } from '@opentelemetry/api'

const categories: Record<number, { code: string, message: string }> = {
  400: { code: 'VALIDATION_ERROR', message: 'The request could not be accepted.' },
  401: { code: 'UNAUTHENTICATED', message: 'Authentication is required.' },
  403: { code: 'FORBIDDEN', message: 'You do not have access to this resource.' },
  404: { code: 'NOT_FOUND', message: 'The requested resource was not found.' },
  409: { code: 'CONFLICT', message: 'The request conflicts with existing data.' },
  422: { code: 'UPSTREAM_ERROR', message: 'The external service could not validate this request.' },
  429: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' },
  502: { code: 'UPSTREAM_ERROR', message: 'The external service is unavailable.' },
  503: { code: 'SERVICE_UNAVAILABLE', message: 'This service is temporarily unavailable.' },
}

function safeCategory(statusCode: number) {
  return categories[statusCode] || (statusCode >= 500
    ? { code: 'INTERNAL_ERROR', message: 'An unexpected server error occurred.' }
    : { code: 'REQUEST_ERROR', message: 'The request could not be completed.' })
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error, { event }) => {
    const failure = error as Error & { statusCode?: number, statusMessage?: string, data?: unknown }
    const statusCode = typeof failure.statusCode === 'number' ? failure.statusCode : 500
    const category = safeCategory(statusCode)
    const requestId = event?.context.telemetry?.requestId || (event ? getRequestHeader(event, 'x-request-id') : undefined) || 'unavailable'
    if (event) setResponseHeader(event, 'x-request-id', requestId)
    failure.statusCode = statusCode
    failure.statusMessage = category.message
    failure.message = category.message
    failure.data = { code: category.code, requestId }
    if (event?.context.telemetry?.span) {
      const span = event.context.telemetry.span
      span.setAttribute('error.type', category.code)
      span.setAttribute('http.response.status_code', statusCode)
      trace.getActiveSpan()?.setAttribute('error.type', category.code)
    }
  })
})

import { SpanStatusCode, trace } from '@opentelemetry/api'
import { emitTelemetryLog } from '../utils/telemetry-logs'

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

function safeDiagnostic(value: string) {
  return value
    .replace(/(api[_-]?key|authorization|bearer|jwt|password|secret|credential)([\s:=]+)[^\s,;}]+/gi, '$1=[redacted]')
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, '[jwt-redacted]')
    .slice(0, 500)
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error, { event }) => {
    const failure = error as Error & { statusCode?: number, statusMessage?: string, data?: unknown }
    const statusCode = typeof failure.statusCode === 'number' ? failure.statusCode : 500
    const category = safeCategory(statusCode)
    const diagnostic = {
      name: failure.name || 'Error',
      message: safeDiagnostic(failure.message || 'Unknown server error'),
      stack: failure.stack,
    }
    const requestId = event?.context.telemetry?.requestId || (event ? getRequestHeader(event, 'x-request-id') : undefined) || 'unavailable'
    if (event) setResponseHeader(event, 'x-request-id', requestId)
    failure.statusCode = statusCode
    failure.statusMessage = category.message
    failure.message = category.message
    failure.data = { code: category.code, requestId }
    emitTelemetryLog(statusCode >= 500 ? 'ERROR' : 'WARN', 'http.request.failed', {
      'app.request_id': requestId,
      'http.response.status_code': statusCode,
      'error.type': diagnostic.name,
      'error.message': diagnostic.message,
      'url.path': event ? getRequestURL(event).pathname : 'unknown',
    })
    if (event?.context.telemetry?.span) {
      const span = event.context.telemetry.span
      span.setAttribute('error.type', category.code)
      span.setAttribute('http.response.status_code', statusCode)
      span.setAttribute('error.cause_type', diagnostic.name)
      span.setAttribute('error.cause_message', diagnostic.message)
      span.recordException(diagnostic)
      span.setStatus({ code: statusCode >= 500 ? SpanStatusCode.ERROR : SpanStatusCode.UNSET })
      trace.getActiveSpan()?.setAttribute('error.type', category.code)
    }
  })
})

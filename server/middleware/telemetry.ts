import { context, propagation, trace } from '@opentelemetry/api'
import { randomUUID } from 'node:crypto'

export default defineEventHandler((event) => {
  const tracer = trace.getTracer('situm-explore.server')
  const requestId = getRequestHeader(event, 'x-request-id')?.trim() || randomUUID()
  const carrier: Record<string, string> = {}
  const traceparent = getRequestHeader(event, 'traceparent')
  if (traceparent) carrier.traceparent = traceparent
  const extracted = propagation.extract(context.active(), carrier)
  const span = tracer.startSpan('http.request', {
    attributes: {
      'http.request.method': event.method,
      'url.path': getRequestURL(event).pathname,
      'app.request_id': requestId,
    },
  }, extracted)
  const spanContext = trace.setSpan(extracted, span)
  const responseCarrier: Record<string, string> = {}
  propagation.inject(spanContext, responseCarrier)
  setResponseHeader(event, 'x-request-id', requestId)
  if (responseCarrier.traceparent) setResponseHeader(event, 'traceparent', responseCarrier.traceparent)
  event.context.telemetry = { span, requestId }

  let finished = false
  const finish = () => {
    if (finished) return
    finished = true
    span.setAttribute('http.response.status_code', event.node.res.statusCode)
    span.end()
  }
  event.node.res.once('finish', finish)
  event.node.res.once('close', finish)
})

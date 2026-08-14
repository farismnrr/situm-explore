import { context, trace, type Span } from '@opentelemetry/api'
import type { H3Event } from 'h3'

export async function withServerSpan<T>(event: H3Event, name: string, attributes: Record<string, string | number | boolean>, operation: () => Promise<T>) {
  const telemetry = (event.context as H3Event['context'] & { telemetry?: { span: Span } }).telemetry
  const parent = telemetry?.span ? trace.setSpan(context.active(), telemetry.span) : context.active()
  const span = trace.getTracer('situm-explore.server').startSpan(name, { attributes }, parent)
  try {
    return await operation()
  } catch (error) {
    span.setAttribute('error.type', error instanceof Error ? error.name : 'unknown')
    throw error
  } finally {
    span.end()
  }
}

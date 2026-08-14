import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'

export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()
  const endpoint = config.otel.endpoint?.trim()
  if (!endpoint || config.otel.protocol !== 'http/protobuf') return

  const exporter = new OTLPTraceExporter({ url: endpoint.endsWith('/v1/traces') ? endpoint : `${endpoint.replace(/\/$/, '')}/v1/traces` })
  const sdk = new NodeSDK({
    autoDetectResources: false,
    instrumentations: [],
    resource: resourceFromAttributes({ 'service.name': config.otel.serviceName || 'situm-explore' }),
    spanProcessors: [new SimpleSpanProcessor(exporter)],
  })
  try {
    void sdk.start()
  } catch {
    // Telemetry must never prevent the application from starting.
  }
})

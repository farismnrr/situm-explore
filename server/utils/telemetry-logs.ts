type LogLevel = 'INFO' | 'WARN' | 'ERROR'

function endpointForLogs(endpoint: string) {
  const normalized = endpoint.replace(/\/$/, '')
  return normalized.endsWith('/v1/traces') ? `${normalized.slice(0, -'/v1/traces'.length)}/v1/logs` : `${normalized}/v1/logs`
}

export function emitTelemetryLog(level: LogLevel, body: string, attributes: Record<string, string | number | boolean> = {}) {
  const config = useRuntimeConfig()
  const endpoint = config.otel.endpoint?.trim()
  if (!endpoint || config.otel.protocol !== 'http/protobuf') return

  const payload = {
    resourceLogs: [{
      resource: { attributes: [{ key: 'service.name', value: { stringValue: config.otel.serviceName || 'situm-explore' } }] },
      scopeLogs: [{
        scope: { name: 'situm-explore.server' },
        logRecords: [{
          timeUnixNano: String(Date.now() * 1_000_000),
          severityText: level,
          body: { stringValue: body },
          attributes: Object.entries(attributes).map(([key, value]) => ({ key, value: typeof value === 'boolean' ? { boolValue: value } : typeof value === 'number' ? { intValue: String(value) } : { stringValue: value } })),
        }],
      }],
    }],
  }

  void boundedFetch(endpointForLogs(endpoint), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }, 5_000).catch(() => undefined)
}

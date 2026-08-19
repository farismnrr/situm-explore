type DiagnosticFields = Record<string, string | number | boolean>

export function logDiagnostic(level: 'info' | 'warn', event: string, fields: DiagnosticFields) {
  const write = level === 'warn' ? globalThis.console.warn : globalThis.console.info
  write(`[diagnostic] ${event}`, fields)
}

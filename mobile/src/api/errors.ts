export type ProductErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'SERVICE_UNAVAILABLE'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'REQUEST_ERROR'

export class ApiError extends Error {
  readonly code: ProductErrorCode
  readonly status: number | null
  readonly requestId: string | null

  constructor(message: string, options: { code: ProductErrorCode, status?: number | null, requestId?: string | null }) {
    super(message)
    this.name = 'ApiError'
    this.code = options.code
    this.status = options.status ?? null
    this.requestId = options.requestId ?? null
  }
}

export function normalizeApiError(status: number | null, body: unknown, fallback = 'The request could not be completed.') {
  const data = body && typeof body === 'object' ? body as { data?: { code?: string, requestId?: string } } : {}
  const code = data.data?.code
  const mapped: Record<string, ProductErrorCode> = {
    UNAUTHENTICATED: 'UNAUTHENTICATED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    RATE_LIMITED: 'RATE_LIMITED',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  }
  return new ApiError(mapped[code || ''] ? fallback : fallback, {
    code: mapped[code || ''] || (status === 0 ? 'NETWORK_ERROR' : 'REQUEST_ERROR'),
    status,
    requestId: data.data?.requestId,
  })
}

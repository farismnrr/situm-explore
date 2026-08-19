import type { SitumRealtimePosition, SitumRealtimeResponse } from '../../../shared/situm-realtime'

export const realtimePollIntervalMs = 10_000

export class RealtimePollCoordinator {
  private current: { generation: number, controller: AbortController } | null = null
  private generation = 0
  private disposed = false

  constructor(private readonly load: (signal: AbortSignal) => Promise<void>) {}

  poll() {
    if (this.disposed || this.current) return
    const generation = ++this.generation
    const controller = new AbortController()
    this.current = { generation, controller }
    void this.run(generation, controller)
  }

  refresh() {
    if (this.disposed) return
    this.current?.controller.abort()
    this.current = null
    this.poll()
  }

  dispose() {
    this.disposed = true
    this.generation++
    this.current?.controller.abort()
    this.current = null
  }

  private async run(generation: number, controller: AbortController) {
    try { await this.load(controller.signal) } catch { /* the consumer owns visible request-error state */ }
    if (this.current?.generation === generation) this.current = null
  }
}

export type RealtimeLoadState = 'idle' | 'loading' | 'ready' | 'empty' | 'error'
export type RealtimeFilterablePosition = { id: string, deviceId?: string, buildingId: number, floorId: number }

export class RealtimePayloadError extends Error {
  constructor() {
    super('The Realtime service returned invalid position data.')
    this.name = 'RealtimePayloadError'
  }
}

export function isRealtimePosition(value: unknown): value is SitumRealtimePosition {
  if (!value || typeof value !== 'object') return false
  const position = value as Partial<SitumRealtimePosition>
  return typeof position.id === 'string' && position.id.length > 0 && typeof position.time === 'string' && Number.isFinite(Date.parse(position.time)) && typeof position.buildingId === 'number' && Number.isFinite(position.buildingId) && typeof position.floorId === 'number' && Number.isFinite(position.floorId) && typeof position.accuracy === 'number' && Number.isFinite(position.accuracy) && typeof position.lat === 'number' && Number.isFinite(position.lat) && typeof position.lng === 'number' && Number.isFinite(position.lng) && (position.deviceId === undefined || typeof position.deviceId === 'string')
}

export function normalizeRealtimeResponse(value: unknown): SitumRealtimePosition[] {
  if (!value || typeof value !== 'object' || !Array.isArray((value as Partial<SitumRealtimeResponse>).positions)) throw new RealtimePayloadError()
  const positions = (value as SitumRealtimeResponse).positions
  if (!positions.every(isRealtimePosition)) throw new RealtimePayloadError()
  return positions
}

export function filterRealtimePositions<T extends RealtimeFilterablePosition>(positions: T[], buildingId: number | null, query: string): T[] {
  const normalized = query.trim().toLowerCase()
  return positions.filter(position => (buildingId === null || position.buildingId === buildingId) && (!normalized || `${position.deviceId || ''} ${position.id} ${position.buildingId} ${position.floorId}`.toLowerCase().includes(normalized)))
}

export function formatSourceTime(time: string, locale = 'en-US') {
  const sourceTime = Date.parse(time)
  if (!Number.isFinite(sourceTime)) return 'Source time unavailable'
  return new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' }).format(sourceTime)
}

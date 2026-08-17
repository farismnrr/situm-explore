import { buildAnalyticsSyncKey, ensureClickHouseSchema } from '../clickhouse/schema'
import { clickHouseDatabaseName, getClickHouseClient } from '../clickhouse/client'

export type AnalyticsReport = 'visitors' | 'positioning_time' | 'geofencing_stay_time'

type SyncInput = { workspaceId?: string, apiKey?: string, report: AnalyticsReport, fromDate: string, toDate: string, buildingId?: number, buildingIds?: number[], timeZone?: string, grouping?: string }
type ReportResponse = { data?: unknown[], rows?: unknown[] }

const paths: Record<AnalyticsReport, string> = { visitors: 'visitors', positioning_time: 'positioning_time', geofencing_stay_time: 'geofencing_stay_time' }

function errorFor(status: number): never {
  if (status === 401 || status === 403) throw createError({ statusCode: 502, statusMessage: 'Situm analytics authorization failed.' })
  if (status === 429) throw createError({ statusCode: 429, statusMessage: 'Situm analytics rate limit reached.' })
  throw createError({ statusCode: 502, statusMessage: 'Situm analytics source request failed.' })
}

function timeoutError(): never {
  throw createError({ statusCode: 504, statusMessage: 'Situm analytics source request timed out.' })
}

function asRows(body: ReportResponse): Record<string, unknown>[] {
  const rows = body.data ?? body.rows ?? []
  return Array.isArray(rows) ? rows.filter(row => row && typeof row === 'object') as Record<string, unknown>[] : []
}

function number(value: unknown, field: string): number {
  const result = Number(value)
  if (!Number.isFinite(result)) throw createError({ statusCode: 502, statusMessage: `Situm analytics returned an invalid ${field} field.` })
  return result
}

function string(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value) throw createError({ statusCode: 502, statusMessage: `Situm analytics returned an invalid ${field} field.` })
  return value
}

export async function syncSitumReport(input: SyncInput) {
  if (input.workspaceId) await ensureClickHouseSchema()
  const apiKey = input.apiKey
  if (!apiKey) throw createError({ statusCode: 410, statusMessage: 'Global Situm authority is disabled; select an owned workspace.' })
  if (!apiKey) throw createError({ statusCode: 503, statusMessage: 'Situm server integration is not configured.' })
  const scope = input.report === 'geofencing_stay_time' ? (input.buildingIds || []).join(',') : String(input.buildingId)
  const syncKey = buildAnalyticsSyncKey(input.report, input.fromDate, input.toDate, `${input.workspaceId || 'legacy'}:${scope}`)
  const params = new URLSearchParams({ from_date: input.fromDate, to_date: input.toDate })
  if (input.report === 'geofencing_stay_time') params.set('building_ids', (input.buildingIds || []).join(','))
  else if (input.buildingId !== undefined) params.set('building_id', String(input.buildingId))
  if (input.timeZone) params.set('time_zone', input.timeZone)
  if (input.grouping) params.set('grouping', input.grouping)
  const response = await boundedFetch(`https://api.situm.com/api/v1/reports/${paths[input.report]}.json?${params}`, { headers: { 'X-API-KEY': apiKey } }).catch((error) => { if (error instanceof UpstreamTimeoutError) timeoutError(); throw error })
  if (!response.ok) errorFor(response.status)
  const rows = asRows(await response.json() as ReportResponse)
  const client = getClickHouseClient()
  const scoped = Boolean(input.workspaceId)
  const table = scoped ? (input.report === 'visitors' ? 'analytics_workspace_visitors' : input.report === 'positioning_time' ? 'analytics_workspace_positioning_time' : 'analytics_workspace_geofencing_stay') : (input.report === 'visitors' ? 'analytics_visitors' : input.report === 'positioning_time' ? 'analytics_positioning_time' : 'analytics_geofencing_stay')
  const normalized = rows.map(row => input.report === 'visitors'
    ? { ...(scoped ? { workspace_id: input.workspaceId } : {}), source_window_id: syncKey, date: string(row.date, 'date'), visitors: number(row.visitors, 'visitors') }
    : input.report === 'positioning_time'
      ? { ...(scoped ? { workspace_id: input.workspaceId } : {}), source_window_id: syncKey, timestamp: number(row.timestamp, 'timestamp'), total: number(row.total, 'total'), avg: number(row.avg, 'avg'), std: number(row.std, 'std') }
      : { ...(scoped ? { workspace_id: input.workspaceId } : {}), source_window_id: syncKey, timestamp: string(row.timestamp, 'timestamp'), device_id: string(row.device_id, 'device_id'), user_id: typeof row.user_id === 'string' ? row.user_id : '', building_id: number(row.building_id, 'building_id'), floor_id: number(row.floor_id, 'floor_id'), matched_fence_id: string(row.matched_fence_id, 'matched_fence_id'), seconds_in_fence: number(row.seconds_in_fence, 'seconds_in_fence'), stay_time: string(row.stay_time, 'stay_time'), sessions_count: number(row.sessions_count, 'sessions_count') })
  try {
    // ReplacingMergeTree is eventually consistent. Delete the exact validated
    // source window first, and wait for the mutation before inserting its
    // replacement so an explicit re-sync has deterministic contents.
    const database = clickHouseDatabaseName()
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(database) || !/^analytics_(visitors|positioning_time|geofencing_stay|workspace_visitors|workspace_positioning_time|workspace_geofencing_stay)$/.test(table)) throw new Error('Invalid analytics table configuration')
    await client.command({
      query: `ALTER TABLE \`${database}\`.${table} DELETE WHERE source_window_id = {source_window_id:String}${scoped ? ' AND workspace_id = {workspace_id:UUID}' : ''}`,
      query_params: scoped ? { source_window_id: syncKey, workspace_id: input.workspaceId } : { source_window_id: syncKey },
      clickhouse_settings: { mutations_sync: '2' }
    })
    if (normalized.length) await client.insert({ table, values: normalized, format: 'JSONEachRow' })
    const now = new Date().toISOString()
    await client.insert({ table: scoped ? 'analytics_workspace_sync_runs' : 'analytics_sync_runs', values: [{ ...(scoped ? { workspace_id: input.workspaceId } : {}), sync_key: syncKey, report: input.report, from_date: `${input.fromDate}T00:00:00.000Z`, to_date: `${input.toDate}T23:59:59.999Z`, scope, status: 'complete', started_at: now, completed_at: now, updated_at: now }], format: 'JSONEachRow' })
  } catch { throw createError({ statusCode: 503, statusMessage: 'Analytics data could not be written to ClickHouse.' }) }
  return { report: input.report, syncKey, rows: normalized.length, empty: normalized.length === 0 }
}

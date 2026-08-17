import type { SitumAlarm, SitumGroupSummary } from '#shared/situm-groups-alarms'

const baseUrl = 'https://api.situm.com/api/v1'
const alarmTypes = new Set(['BREACH', 'DANGER', 'DEADMAN', 'EMERGENCY', 'STATIONARY', 'GEOFENCE_MAX_STAY_TIME', 'ASSISTANCE_REQUEST'])
const alarmStates = new Set(['OPEN', 'CLOSED', 'CONFIRMED', 'MARKED_FALSE', 'OTHER'])

function upstreamError(status: number, detail = false): never {
  if (detail && status === 404) throw createError({ statusCode: 404, statusMessage: 'Situm alarm was not found.' })
  if (status === 401 || status === 403) throw createError({ statusCode: 502, statusMessage: 'Situm authorization failed.' })
  if (status === 422) throw createError({ statusCode: 502, statusMessage: 'Situm rejected the request.' })
  throw createError({ statusCode: 502, statusMessage: 'Situm source request failed.' })
}

async function request<T>(path: string, params: URLSearchParams, apiKey: string, detail = false): Promise<T> {
  const response = await boundedFetch(`${baseUrl}${path}?${params}`, { headers: { 'X-API-KEY': apiKey } }).catch((error) => {
    if (error instanceof UpstreamTimeoutError) throw createError({ statusCode: 504, statusMessage: 'Situm source request timed out.' })
    throw error
  })
  if (!response.ok) upstreamError(response.status, detail)
  return await response.json() as T
}

export async function getSitumGroups(apiKey?: string | boolean, hasParent?: boolean): Promise<SitumGroupSummary[]> {
  if (typeof apiKey !== 'string') throw createError({ statusCode: 410, statusMessage: 'Global Situm authority is disabled; select an owned workspace.' })
  const params = new URLSearchParams()
  if (hasParent !== undefined) params.set('has_parent', String(hasParent))
  const rows = await request<unknown>('/groups', params, apiKey)
  if (!Array.isArray(rows)) throw createError({ statusCode: 502, statusMessage: 'Situm returned an invalid groups response.' })
  return rows.map((row) => {
    const value = row as Record<string, unknown>
    const id = requiredString(value.id, 'group id')
    const organizationId = requiredString(value.organization_id, 'group organization id')
    const parentGroupId = value.parent_group_id == null ? null : requiredString(value.parent_group_id, 'group parent id')
    return { id, uuid: requiredString(value.uuid, 'group uuid'), name: requiredString(value.name, 'group name'), organizationId, parentGroupId, iconColour: typeof value.icon_colour === 'string' ? value.icon_colour : null, isStaff: value.is_staff === null ? null : requiredBoolean(value.is_staff, 'group staff flag') }
  })
}

export async function getSitumAlarms(apiKey?: string | URLSearchParams, params?: URLSearchParams): Promise<SitumAlarm[]> {
  if (typeof apiKey !== 'string' || !params) throw createError({ statusCode: 410, statusMessage: 'Global Situm authority is disabled; select an owned workspace.' })
  const rows = await request<unknown>('/alarms', params, apiKey)
  if (!Array.isArray(rows)) throw createError({ statusCode: 502, statusMessage: 'Situm returned an invalid alarms response.' })
  return rows.map(normalizeAlarm)
}

export async function getSitumAlarm(apiKey: string, uuid?: string): Promise<SitumAlarm> {
  if (!uuid) throw createError({ statusCode: 410, statusMessage: 'Global Situm authority is disabled; select an owned workspace.' })
  const body = await request<unknown>(`/alarms/${encodeURIComponent(uuid)}`, new URLSearchParams(), apiKey, true)
  if (!body || typeof body !== 'object') throw createError({ statusCode: 502, statusMessage: 'Situm returned an invalid alarm response.' })
  return normalizeAlarm(body)
}

function normalizeAlarm(row: unknown): SitumAlarm {
  const value = row as Record<string, unknown>
  const statusChanges = Array.isArray(value.status_changes) ? value.status_changes.map((change) => {
    const item = change as Record<string, unknown>
    const state = requiredString(item.state, 'alarm status state')
    if (!alarmStates.has(state)) throw invalidUpstream('alarm status state')
    return { state, createdAt: timestamp(item.created_at, 'alarm status timestamp') }
  }) : []
  const type = requiredString(value.type, 'alarm type')
  if (!alarmTypes.has(type)) throw invalidUpstream('alarm type')
  const currentState = requiredString(value.current_state, 'alarm current state')
  if (!alarmStates.has(currentState)) throw invalidUpstream('alarm current state')
  return { uuid: requiredString(value.uuid, 'alarm uuid'), x: finiteNumber(value.x, 'alarm x'), y: finiteNumber(value.y, 'alarm y'), lat: finiteNumber(value.lat, 'alarm latitude'), lng: finiteNumber(value.lng, 'alarm longitude'), buildingId: integer(value.building_id, 'alarm building id'), floorId: integer(value.floor_id, 'alarm floor id'), outside: requiredBoolean(value.outside, 'alarm outside flag'), inside: requiredBoolean(value.inside, 'alarm inside flag'), createdAt: timestamp(value.created_at, 'alarm created timestamp'), updatedAt: timestamp(value.updated_at, 'alarm updated timestamp'), type, statusChanges, active: requiredBoolean(value.active, 'alarm active flag'), currentState, customFields: value.custom_fields && typeof value.custom_fields === 'object' && !Array.isArray(value.custom_fields) ? value.custom_fields as Record<string, unknown> : {} }
}

function invalidUpstream(field: string): never { throw createError({ statusCode: 502, statusMessage: `Situm returned an invalid ${field}.` }) }
function requiredString(value: unknown, field: string): string { if (typeof value !== 'string' || !value) return invalidUpstream(field); return value }
function finiteNumber(value: unknown, field: string): number { const result = typeof value === 'number' ? value : Number(value); if (!Number.isFinite(result)) return invalidUpstream(field); return result }
function integer(value: unknown, field: string): number { const result = finiteNumber(value, field); if (!Number.isInteger(result) || result < 0) return invalidUpstream(field); return result }
function requiredBoolean(value: unknown, field: string): boolean { if (typeof value !== 'boolean') return invalidUpstream(field); return value }
function timestamp(value: unknown, field: string): string { const result = requiredString(value, field); if (!Number.isFinite(Date.parse(result))) return invalidUpstream(field); return result }

export function isSupportedAlarmType(value: string): boolean { return alarmTypes.has(value) }

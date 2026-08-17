// Live regression evidence for Plan 027 Phase 1/2, exercising the real
// production ClickHouse query/deletion code (not a reimplementation) against
// a real local ClickHouse instance. Not part of `npm test` (requires a
// reachable ClickHouse) -- run manually:
//   node --import tsx --env-file=.env test/regression/analytics-clickhouse.regression.ts
import { randomUUID } from 'node:crypto'

;(globalThis as Record<string, unknown>).useRuntimeConfig = () => ({
  clickhouse: {
    url: process.env.CLICKHOUSE_URL || 'http://localhost:8124',
    user: process.env.CLICKHOUSE_USER || '',
    password: process.env.CLICKHOUSE_PASSWORD || '',
    database: process.env.CLICKHOUSE_DB || 'situm_explore_analytics',
  },
})
;(globalThis as Record<string, unknown>).createError = (input: { statusCode: number, statusMessage: string }) => Object.assign(new Error(input.statusMessage), { statusCode: input.statusCode })

const { ensureClickHouseSchema } = await import('../../server/integrations/clickhouse/schema')
const { queryWorkspaceAnalytics, deleteWorkspaceAnalytics } = await import('../../server/integrations/clickhouse/analytics')
const { getClickHouseClient } = await import('../../server/integrations/clickhouse/client')

let failures = 0
function check(label: string, condition: boolean) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`)
  if (!condition) failures++
}

async function main() {
  await ensureClickHouseSchema()
  const client = getClickHouseClient()
  const workspaceA = randomUUID()
  const workspaceB = randomUUID() // unrelated control workspace

  // Two overlapping visitor sync windows for workspace A: a full-month sync
  // and a re-sync of a sub-range with different (updated) numbers, exactly
  // as syncSitumReport would write them (source_window_id embeds
  // report:fromDate:toDate:workspaceId:buildingId).
  const monthWindow = 'visitors:2026-01-01:2026-01-31:' + workspaceA + ':7'
  const subWindow = 'visitors:2026-01-10:2026-01-20:' + workspaceA + ':7'
  await client.insert({
    table: 'analytics_workspace_visitors',
    values: [
      { workspace_id: workspaceA, source_window_id: monthWindow, date: '2026-01-10', visitors: 100 },
      { workspace_id: workspaceA, source_window_id: monthWindow, date: '2026-01-15', visitors: 50 },
      { workspace_id: workspaceA, source_window_id: subWindow, date: '2026-01-10', visitors: 999 }, // re-synced/updated value for the same day, different window key
    ],
    format: 'JSONEachRow',
  })

  // Control workspace B, same date range, must never be included in A's results.
  await client.insert({
    table: 'analytics_workspace_visitors',
    values: [{ workspace_id: workspaceB, source_window_id: 'visitors:2026-01-01:2026-01-31:' + workspaceB + ':9', date: '2026-01-10', visitors: 42 }],
    format: 'JSONEachRow',
  })

  // Positioning + geofencing rows for workspace A, scoped to the month window, plus one out-of-window row that must not leak in.
  await client.insert({
    table: 'analytics_workspace_positioning_time',
    values: [
      { workspace_id: workspaceA, source_window_id: 'positioning_time:2026-01-01:2026-01-31:' + workspaceA + ':7', timestamp: 1, total: 10, avg: 5, std: 1 },
      { workspace_id: workspaceA, source_window_id: 'positioning_time:2025-12-01:2025-12-31:' + workspaceA + ':7', timestamp: 2, total: 999, avg: 999, std: 999 }, // different (unrelated) prior window
    ],
    format: 'JSONEachRow',
  })
  await client.insert({
    table: 'analytics_workspace_geofencing_stay',
    values: [
      { workspace_id: workspaceA, source_window_id: 'geofencing_stay_time:2026-01-01:2026-01-31:' + workspaceA + ':7', timestamp: '2026-01-15 00:00:00.000', device_id: 'd1', user_id: '', building_id: 7, floor_id: 0, matched_fence_id: 'fenceA', seconds_in_fence: 100, stay_time: 'PT100S', sessions_count: 1 },
      { workspace_id: workspaceA, source_window_id: 'geofencing_stay_time:2026-01-01:2026-01-31:' + workspaceA + ':7', timestamp: '2026-01-16 00:00:00.000', device_id: 'd2', user_id: '', building_id: 7, floor_id: 0, matched_fence_id: 'fenceB', seconds_in_fence: 50, sessions_count: 1, stay_time: 'PT50S' },
    ],
    format: 'JSONEachRow',
  })

  const requestedWindow = await queryWorkspaceAnalytics(workspaceA, { fromDate: '2026-01-01', toDate: '2026-01-31' })
  const visitorsByDate = Object.fromEntries((requestedWindow.visitors as { date: string, visitors: string }[]).map(r => [r.date, Number(r.visitors)]))

  check('overlapping windows: month-window row for 2026-01-15 counted exactly once (50)', visitorsByDate['2026-01-15'] === 50)
  check('overlapping windows: querying the month window returns only that window\'s value for 2026-01-10 (100), not summed with the differently-keyed sub-window sync\'s 999', visitorsByDate['2026-01-10'] === 100)
  check('date filtering: positioning excludes the unrelated Dec 2025 sync window', Number((requestedWindow.positioning as { total: string }[])[0]?.total) === 10)

  const workspaceBResult = await queryWorkspaceAnalytics(workspaceB, { fromDate: '2026-01-01', toDate: '2026-01-31' })
  const workspaceBVisitorsByDate = Object.fromEntries((workspaceBResult.visitors as { date: string, visitors: string }[]).map(r => [r.date, Number(r.visitors)]))
  check('workspace isolation: querying workspace B returns only its own row (42), not workspace A\'s rows for the same date range', workspaceBVisitorsByDate['2026-01-10'] === 42 && Object.keys(workspaceBVisitorsByDate).length === 1)
  check('workspace isolation: querying workspace A never returns workspace B\'s value (42) for the shared date', visitorsByDate['2026-01-10'] !== 42)

  const buildingFiltered = await queryWorkspaceAnalytics(workspaceA, { fromDate: '2026-01-01', toDate: '2026-01-31', buildingId: 7 })
  const buildingMismatch = await queryWorkspaceAnalytics(workspaceA, { fromDate: '2026-01-01', toDate: '2026-01-31', buildingId: 999 })
  check('building filter: matching buildingId returns geofencing rows', (buildingFiltered.geofencing as { rows: number }[])[0]?.rows === 2)
  check('building filter: non-matching buildingId returns zero geofencing rows', (buildingMismatch.geofencing as { rows: number }[])[0]?.rows === 0)

  const geofenceFiltered = await queryWorkspaceAnalytics(workspaceA, { fromDate: '2026-01-01', toDate: '2026-01-31', geofenceId: 'fenceA' })
  const geofenceMismatch = await queryWorkspaceAnalytics(workspaceA, { fromDate: '2026-01-01', toDate: '2026-01-31', geofenceId: 'does-not-exist' })
  check('geofence filter: matching geofenceId returns 1 row', (geofenceFiltered.geofencing as { rows: number }[])[0]?.rows === 1)
  check('geofence filter: non-matching geofenceId returns 0 rows', (geofenceMismatch.geofencing as { rows: number }[])[0]?.rows === 0)

  // Phase 2: workspace deletion lifecycle, including the fourth
  // workspace-owned table (analytics_workspace_sync_runs) from the original
  // Plan 027 lifecycle finding.
  await client.insert({
    table: 'analytics_workspace_sync_runs',
    values: [{ workspace_id: workspaceA, sync_key: monthWindow, report: 'visitors', from_date: '2026-01-01 00:00:00.000', to_date: '2026-01-31 00:00:00.000', scope: workspaceA + ':7', status: 'completed', started_at: '2026-01-31 00:00:00.000', completed_at: '2026-01-31 00:00:01.000', updated_at: '2026-01-31 00:00:01.000' }],
    format: 'JSONEachRow',
  })
  await client.insert({
    table: 'analytics_workspace_sync_runs',
    values: [{ workspace_id: workspaceB, sync_key: 'visitors:2026-01-01:2026-01-31:' + workspaceB + ':9', report: 'visitors', from_date: '2026-01-01 00:00:00.000', to_date: '2026-01-31 00:00:00.000', scope: workspaceB + ':9', status: 'completed', started_at: '2026-01-31 00:00:00.000', completed_at: '2026-01-31 00:00:01.000', updated_at: '2026-01-31 00:00:01.000' }],
    format: 'JSONEachRow',
  })

  const beforeA = await client.query({ query: 'SELECT count() AS c FROM `situm_explore_analytics`.analytics_workspace_visitors WHERE workspace_id = {w:UUID}', query_params: { w: workspaceA }, format: 'JSONEachRow' }).then(r => r.json<{ c: string }>())
  check('sanity: workspace A has rows before deletion', Number(beforeA[0]?.c) > 0)
  const syncRunsBeforeA = await client.query({ query: 'SELECT count() AS c FROM `situm_explore_analytics`.analytics_workspace_sync_runs WHERE workspace_id = {w:UUID}', query_params: { w: workspaceA }, format: 'JSONEachRow' }).then(r => r.json<{ c: string }>())
  check('sanity: workspace A has a sync-run row before deletion', Number(syncRunsBeforeA[0]?.c) === 1)

  await deleteWorkspaceAnalytics(workspaceA)

  const afterA = await Promise.all(['analytics_workspace_visitors', 'analytics_workspace_positioning_time', 'analytics_workspace_geofencing_stay', 'analytics_workspace_sync_runs'].map(table =>
    client.query({ query: `SELECT count() AS c FROM \`situm_explore_analytics\`.${table} WHERE workspace_id = {w:UUID}`, query_params: { w: workspaceA }, format: 'JSONEachRow' }).then(r => r.json<{ c: string }>())))
  check('workspace deletion: analytics_workspace_visitors has zero rows for workspace A after deletion', Number(afterA[0]?.[0]?.c) === 0)
  check('workspace deletion: analytics_workspace_positioning_time has zero rows for workspace A after deletion', Number(afterA[1]?.[0]?.c) === 0)
  check('workspace deletion: analytics_workspace_geofencing_stay has zero rows for workspace A after deletion', Number(afterA[2]?.[0]?.c) === 0)
  check('workspace deletion: analytics_workspace_sync_runs has zero rows for workspace A after deletion', Number(afterA[3]?.[0]?.c) === 0)

  const afterB = await client.query({ query: 'SELECT count() AS c FROM `situm_explore_analytics`.analytics_workspace_visitors WHERE workspace_id = {w:UUID}', query_params: { w: workspaceB }, format: 'JSONEachRow' }).then(r => r.json<{ c: string }>())
  check('workspace deletion: unrelated control workspace B is untouched', Number(afterB[0]?.c) === 1)
  const syncRunsAfterB = await client.query({ query: 'SELECT count() AS c FROM `situm_explore_analytics`.analytics_workspace_sync_runs WHERE workspace_id = {w:UUID}', query_params: { w: workspaceB }, format: 'JSONEachRow' }).then(r => r.json<{ c: string }>())
  check('workspace deletion: unrelated control workspace B\'s sync-run row is untouched', Number(syncRunsAfterB[0]?.c) === 1)

  // Cleanup control workspace's synthetic rows.
  await client.command({ query: 'ALTER TABLE `situm_explore_analytics`.analytics_workspace_visitors DELETE WHERE workspace_id = {w:UUID}', query_params: { w: workspaceB }, clickhouse_settings: { mutations_sync: '2' } })
  await client.command({ query: 'ALTER TABLE `situm_explore_analytics`.analytics_workspace_sync_runs DELETE WHERE workspace_id = {w:UUID}', query_params: { w: workspaceB }, clickhouse_settings: { mutations_sync: '2' } })

  console.log(failures === 0 ? '\nAll 17 checks passed.' : `\n${failures} check(s) FAILED.`)
  process.exit(failures === 0 ? 0 : 1)
}

main().catch((error) => { console.error(error); process.exit(1) })

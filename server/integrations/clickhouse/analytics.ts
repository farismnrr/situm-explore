import { clickHouseDatabaseName, getClickHouseClient } from './client'

export type AnalyticsFilters = { fromDate: string, toDate: string, buildingId?: number, geofenceId?: string }

function table(name: string) {
  const database = clickHouseDatabaseName()
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(database) || !/^analytics_(visitors|positioning_time|geofencing_stay|workspace_visitors|workspace_positioning_time|workspace_geofencing_stay)$/.test(name)) throw new Error('Invalid analytics table configuration')
  return `\`${database}\`.${name}`
}

function params(filters: AnalyticsFilters) {
  return { from_date: filters.fromDate, to_date: filters.toDate, source_prefix: '', building_id: filters.buildingId ?? 0, geofence_id: filters.geofenceId ?? '' }
}

function sourceWindow() { return 'startsWith(source_window_id, {source_prefix:String})' }

export async function queryAnalytics(filters: AnalyticsFilters) {
  const client = getClickHouseClient()
  const p = params(filters)
  const prefixes = ['visitors', 'positioning_time', 'geofencing_stay_time'].map(report => `${report}:${filters.fromDate}:${filters.toDate}:`)
  const building = filters.buildingId === undefined ? '' : ' AND endsWith(source_window_id, concat(\':\', toString({building_id:UInt64})))'
  const [visitors, positioning, geofencing] = await Promise.all([
    client.query({ query: `SELECT date, sum(visitors) AS visitors FROM ${table('analytics_visitors')} WHERE ${sourceWindow()} AND date BETWEEN {from_date:Date} AND {to_date:Date}${building} GROUP BY date ORDER BY date`, query_params: { ...p, source_prefix: prefixes[0] }, format: 'JSONEachRow' }).then(r => r.json()),
    client.query({ query: `SELECT sum(total) AS total, avg(avg) AS avg, avg(std) AS std FROM ${table('analytics_positioning_time')} WHERE ${sourceWindow()}${building}`, query_params: { ...p, source_prefix: prefixes[1] }, format: 'JSONEachRow' }).then(r => r.json()),
    client.query({ query: `SELECT sum(seconds_in_fence) AS seconds, sum(sessions_count) AS sessions, count() AS rows FROM ${table('analytics_geofencing_stay')} WHERE ${sourceWindow()} AND timestamp >= {from_date:DateTime} AND timestamp < addDays(toDate({to_date:Date}), 1) AND ({building_id:UInt64} = 0 OR building_id = {building_id:UInt64}) AND ({geofence_id:String} = '' OR matched_fence_id = {geofence_id:String})`, query_params: { ...p, source_prefix: prefixes[2] }, format: 'JSONEachRow' }).then(r => r.json())
  ])
  return { visitors, positioning, geofencing }
}

export async function queryWorkspaceAnalytics(workspaceId: string, filters: AnalyticsFilters) {
  const client = getClickHouseClient()
  const p = { ...params(filters), workspace_id: workspaceId }
  const [visitors, positioning, geofencing] = await Promise.all([
    client.query({ query: `SELECT date, sum(visitors) AS visitors FROM ${table('analytics_workspace_visitors')} WHERE workspace_id = {workspace_id:UUID} AND date BETWEEN {from_date:Date} AND {to_date:Date} GROUP BY date ORDER BY date`, query_params: p, format: 'JSONEachRow' }).then(r => r.json()),
    client.query({ query: `SELECT sum(total) AS total, avg(avg) AS avg, avg(std) AS std FROM ${table('analytics_workspace_positioning_time')} WHERE workspace_id = {workspace_id:UUID}`, query_params: p, format: 'JSONEachRow' }).then(r => r.json()),
    client.query({ query: `SELECT sum(seconds_in_fence) AS seconds, sum(sessions_count) AS sessions, count() AS rows FROM ${table('analytics_workspace_geofencing_stay')} WHERE workspace_id = {workspace_id:UUID} AND timestamp >= {from_date:DateTime} AND timestamp < addDays(toDate({to_date:Date}), 1)`, query_params: p, format: 'JSONEachRow' }).then(r => r.json())
  ])
  return { visitors, positioning, geofencing }
}

export async function exportAnalytics(filters: AnalyticsFilters, report: 'visitors' | 'positioning_time' | 'geofencing_stay_time') {
  const p = params(filters)
  p.source_prefix = `${report}:${filters.fromDate}:${filters.toDate}:`
  const building = filters.buildingId === undefined ? '' : ' AND endsWith(source_window_id, concat(\':\', toString({building_id:UInt64})))'
  const query = report === 'visitors'
    ? `SELECT date, visitors FROM ${table('analytics_visitors')} WHERE ${sourceWindow()} AND date BETWEEN {from_date:Date} AND {to_date:Date}${building} ORDER BY date`
    : report === 'positioning_time'
      ? `SELECT timestamp, total, avg, std FROM ${table('analytics_positioning_time')} WHERE ${sourceWindow()}${building} ORDER BY timestamp`
      : `SELECT timestamp, device_id, user_id, building_id, floor_id, matched_fence_id, seconds_in_fence, stay_time, sessions_count FROM ${table('analytics_geofencing_stay')} WHERE ${sourceWindow()} AND timestamp >= {from_date:DateTime} AND timestamp < addDays(toDate({to_date:Date}), 1) AND ({building_id:UInt64} = 0 OR building_id = {building_id:UInt64}) AND ({geofence_id:String} = '' OR matched_fence_id = {geofence_id:String}) ORDER BY timestamp`
  return getClickHouseClient().query({ query, query_params: p, format: 'CSVWithNames' }).then(r => r.text())
}

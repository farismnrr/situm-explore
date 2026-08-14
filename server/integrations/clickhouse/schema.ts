import { clickHouseDatabaseName, getClickHouseClient } from './client'

export async function ensureClickHouseSchema(): Promise<void> {
  const database = clickHouseDatabaseName()
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(database)) throw new Error('Invalid ClickHouse database name')
  const client = getClickHouseClient('default')
  await client.command({ query: `CREATE DATABASE IF NOT EXISTS \`${database}\`` })
  const positioningTable = await client.query({ query: `SELECT type FROM system.columns WHERE database = {database:String} AND table = 'analytics_positioning_time' AND name = 'timestamp' LIMIT 1`, query_params: { database }, format: 'JSONEachRow' }).then(async result => (await result.json<{ type?: string }>())[0] ?? {})
  if (positioningTable.type?.startsWith('DateTime')) {
    const legacy = `\`${database}\`.analytics_positioning_time_legacy_datetime`
    const migrated = `\`${database}\`.analytics_positioning_time_numeric_migration`
    await client.command({ query: `CREATE TABLE IF NOT EXISTS ${migrated} (source_window_id String, timestamp UInt64, total Float64, avg Float64, std Float64, ingested_at DateTime64(3)) ENGINE = ReplacingMergeTree(ingested_at) ORDER BY (source_window_id, timestamp)` })
    await client.command({ query: `INSERT INTO ${migrated} (source_window_id, timestamp, total, avg, std, ingested_at) SELECT source_window_id, toUInt64(timestamp), total, avg, std, ingested_at FROM \`${database}\`.analytics_positioning_time` })
    await client.command({ query: `RENAME TABLE \`${database}\`.analytics_positioning_time TO ${legacy}, ${migrated} TO \`${database}\`.analytics_positioning_time` })
  }
  for (const query of [
    `CREATE TABLE IF NOT EXISTS \`${database}\`.analytics_visitors (source_window_id String, date Date, visitors UInt64, ingested_at DateTime64(3) DEFAULT now64(3)) ENGINE = ReplacingMergeTree(ingested_at) ORDER BY (source_window_id, date)`,
    `CREATE TABLE IF NOT EXISTS \`${database}\`.analytics_positioning_time (source_window_id String, timestamp UInt64, total Float64, avg Float64, std Float64, ingested_at DateTime64(3) DEFAULT now64(3)) ENGINE = ReplacingMergeTree(ingested_at) ORDER BY (source_window_id, timestamp)`,
    `CREATE TABLE IF NOT EXISTS \`${database}\`.analytics_geofencing_stay (source_window_id String, timestamp DateTime64(3), device_id String, user_id String, building_id UInt64, floor_id UInt64, matched_fence_id String, seconds_in_fence Float64, stay_time String, sessions_count UInt64, ingested_at DateTime64(3) DEFAULT now64(3)) ENGINE = ReplacingMergeTree(ingested_at) ORDER BY (source_window_id, timestamp, device_id, matched_fence_id)`,
    `CREATE TABLE IF NOT EXISTS \`${database}\`.analytics_sync_runs (sync_key String, report String, from_date DateTime64(3), to_date DateTime64(3), scope String, status LowCardinality(String), started_at DateTime64(3), completed_at Nullable(DateTime64(3)), updated_at DateTime64(3)) ENGINE = ReplacingMergeTree(updated_at) ORDER BY sync_key`
  ]) await client.command({ query })
  for (const query of [
    `CREATE TABLE IF NOT EXISTS \`${database}\`.analytics_workspace_visitors (workspace_id UUID, source_window_id String, date Date, visitors UInt64, ingested_at DateTime64(3) DEFAULT now64(3)) ENGINE = ReplacingMergeTree(ingested_at) ORDER BY (workspace_id, source_window_id, date)`,
    `CREATE TABLE IF NOT EXISTS \`${database}\`.analytics_workspace_positioning_time (workspace_id UUID, source_window_id String, timestamp UInt64, total Float64, avg Float64, std Float64, ingested_at DateTime64(3) DEFAULT now64(3)) ENGINE = ReplacingMergeTree(ingested_at) ORDER BY (workspace_id, source_window_id, timestamp)`,
    `CREATE TABLE IF NOT EXISTS \`${database}\`.analytics_workspace_geofencing_stay (workspace_id UUID, source_window_id String, timestamp DateTime64(3), device_id String, user_id String, building_id UInt64, floor_id UInt64, matched_fence_id String, seconds_in_fence Float64, stay_time String, sessions_count UInt64, ingested_at DateTime64(3) DEFAULT now64(3)) ENGINE = ReplacingMergeTree(ingested_at) ORDER BY (workspace_id, source_window_id, timestamp, device_id, matched_fence_id)`,
    `CREATE TABLE IF NOT EXISTS \`${database}\`.analytics_workspace_sync_runs (workspace_id UUID, sync_key String, report String, from_date DateTime64(3), to_date DateTime64(3), scope String, status LowCardinality(String), started_at DateTime64(3), completed_at Nullable(DateTime64(3)), updated_at DateTime64(3)) ENGINE = ReplacingMergeTree(updated_at) ORDER BY (workspace_id, sync_key)`
  ]) await client.command({ query })
}

export function buildAnalyticsSyncKey(report: string, fromDate: string, toDate: string, scope: string): string {
  return `${report}:${fromDate}:${toDate}:${scope}`
}

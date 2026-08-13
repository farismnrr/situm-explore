import { createClient, type ClickHouseClient } from '@clickhouse/client'

type ClickHouseConfig = {
  url?: string
  user?: string
  password?: string
  database?: string
}

const clients = new Map<string, ClickHouseClient>()

function getConfig(): Required<ClickHouseConfig> {
  const config = useRuntimeConfig().clickhouse as ClickHouseConfig
  return {
    url: config.url || 'http://localhost:8124',
    user: config.user || '',
    password: config.password || '',
    database: config.database || 'situm_explore_analytics'
  }
}

export function getClickHouseClient(database = getConfig().database): ClickHouseClient {
  if (!clients.has(database)) {
    const config = getConfig()
    clients.set(database, createClient({ url: config.url, username: config.user, password: config.password, database }))
  }
  return clients.get(database)!
}

export async function checkClickHouseReadiness(): Promise<{ configured: boolean; available: boolean }> {
  const config = getConfig()
  if (!config.url || !config.database) return { configured: false, available: false }
  try {
    await getClickHouseClient().query({ query: 'SELECT 1', format: 'JSONEachRow' }).then(result => result.json())
    return { configured: true, available: true }
  } catch {
    return { configured: true, available: false }
  }
}

export function clickHouseDatabaseName(): string {
  return getConfig().database
}

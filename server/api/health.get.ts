import { checkClickHouseReadiness } from '../integrations/clickhouse/client'
import { ensureClickHouseSchema } from '../integrations/clickhouse/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  let clickhouse = await checkClickHouseReadiness()
  if (clickhouse.configured) {
    try {
      await ensureClickHouseSchema()
      clickhouse = await checkClickHouseReadiness()
    } catch {
      clickhouse = { configured: true, available: false }
    }
  }
  return {
    ok: clickhouse.available,
    situm: { configured: false, authority: 'workspace' },
    clickhouse
  }
})

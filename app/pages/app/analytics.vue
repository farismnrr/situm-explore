<script setup lang="ts">
import type { SitumCartographyResponse } from '#shared/situm-cartography'
import { useWorkspaceContext } from '~/composables/useWorkspaceContext'

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Analytics & reports' })

type AnalyticsResponse = {
  visitors: Array<{ date: string, visitors: number }>
  positioning: Array<{ total: number | string, avg: number | string, std: number | string }>
  geofencing: Array<{ seconds: number | string, sessions: number | string, rows: number | string }>
}

const today = new Date()
const initialTo = today.toISOString().slice(0, 10)
const initialFrom = new Date(today.getTime() - 6 * 86400000).toISOString().slice(0, 10)
const fromDate = ref(initialFrom)
const toDate = ref(initialTo)
const buildingId = ref<string>('')
const geofenceId = ref('')
const syncing = ref(false)
const syncMessage = ref('')
const syncError = ref('')
const { selectedWorkspaceId } = useWorkspaceContext()
const workspaceCartographyUrl = computed(() => selectedWorkspaceId.value ? `/api/workspaces/${selectedWorkspaceId.value}/situm/cartography` : '')
const workspaceAnalyticsUrl = computed(() => selectedWorkspaceId.value ? `/api/workspaces/${selectedWorkspaceId.value}/analytics/summary` : '')

const { data: cartography, refresh: refreshCartography } = await useFetch<SitumCartographyResponse>(workspaceCartographyUrl, { immediate: false })
const buildings = computed(() => cartography.value?.buildings ?? [])
const buildingItems = computed(() => [{ label: 'All buildings', value: '' }, ...buildings.value.map(building => ({ label: building.name, value: String(building.id) }))])
const query = computed(() => ({ fromDate: fromDate.value, toDate: toDate.value, ...(buildingId.value ? { buildingId: buildingId.value } : {}), ...(geofenceId.value.trim() ? { geofenceId: geofenceId.value.trim() } : {}) }))
const { data, error, status, refresh } = await useFetch<AnalyticsResponse>(workspaceAnalyticsUrl, { query, immediate: false })

const hasData = computed(() => Boolean(data.value && (data.value.visitors.length || data.value.positioning.length || data.value.geofencing.length)))
const positioning = computed(() => data.value?.positioning[0] ?? null)
const geofencing = computed(() => data.value?.geofencing[0] ?? null)
const positioningMinutes = computed(() => positioning.value ? formatNumber(Number(positioning.value.total) / 60) : '—')
const geofenceHours = computed(() => geofencing.value ? formatNumber(Number(geofencing.value.seconds) / 3600) : '—')

function formatNumber(value: number) {
  return Number.isFinite(value) ? new Intl.NumberFormat().format(Math.round(value * 10) / 10) : '—'
}

async function loadAnalytics() {
  syncMessage.value = ''
  syncError.value = ''
  if (selectedWorkspaceId.value) { await refreshCartography(); await refresh() }
}

async function syncFromSitum() {
  syncing.value = true
  syncMessage.value = ''
  syncError.value = ''
  try {
    const id = buildingId.value ? Number(buildingId.value) : undefined
    const reports = ['visitors', 'positioning_time', 'geofencing_stay_time'] as const
    for (const report of reports) {
      await $fetch(`/api/workspaces/${selectedWorkspaceId.value}/analytics/sync`, { method: 'POST', body: { report, fromDate: fromDate.value, toDate: toDate.value, ...(report === 'geofencing_stay_time' ? { buildingIds: id ? [id] : buildings.value.map(building => building.id) } : { buildingId: id ?? buildings.value[0]?.id }) } })
    }
    syncMessage.value = 'Analytics synced from Situm.'
    await refresh()
  } catch (cause) {
    syncError.value = cause instanceof Error ? cause.message : 'Analytics could not be synced from Situm.'
  } finally {
    syncing.value = false
  }
}

async function exportReport(report: 'visitors' | 'positioning_time' | 'geofencing_stay_time') {
  void report
  syncError.value = 'Workspace analytics export is not yet available for the isolated data path.'
}

onMounted(loadAnalytics)
</script>

<template>
  <div class="operations-page space-y-6">
    <ProductPageHeader eyebrow="Reports" title="Analytics & reports" description="Situm report data for the selected date range and building.">
      <template #actions><UButton label="Sync from Situm" icon="i-lucide-refresh-cw" :loading="syncing" :disabled="!buildingId || !buildings.length" @click="syncFromSitum" /></template>
    </ProductPageHeader>

    <UCard>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.2fr_auto] lg:items-end">
        <UFormField label="From date"><UInput v-model="fromDate" type="date" aria-label="Analytics start date" /></UFormField>
        <UFormField label="To date"><UInput v-model="toDate" type="date" aria-label="Analytics end date" /></UFormField>
        <UFormField label="Building"><USelect v-model="buildingId" :items="buildingItems" aria-label="Filter by building" /></UFormField>
        <UButton label="Apply filters" icon="i-lucide-filter" color="neutral" variant="outline" :loading="status === 'pending'" @click="loadAnalytics" />
      </div>
      <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <UInput v-model="geofenceId" placeholder="Optional geofence ID" aria-label="Filter by geofence ID" class="w-full sm:w-72" />
        <span class="text-xs text-muted">{{ fromDate }} to {{ toDate }}</span>
      </div>
    </UCard>

    <UAlert v-if="syncMessage" color="success" variant="subtle" :title="syncMessage" />
    <UAlert v-if="syncError" color="error" variant="subtle" title="Sync failed" :description="syncError" />
    <UAlert v-if="error" color="error" variant="subtle" title="Analytics unavailable" description="The protected analytics data could not be read from ClickHouse." />
    <UAlert v-else-if="status === 'pending'" color="neutral" variant="subtle" title="Loading analytics" description="Reading the selected report window from ClickHouse." />
    <UAlert v-else-if="!hasData" color="neutral" variant="subtle" title="No analytics data" description="No synced report rows exist for this date range and filter. Sync from Situm to load the window." />

    <template v-if="hasData">
      <div class="grid gap-4 sm:grid-cols-3">
        <ProductStatCard label="Visitors" :value="formatNumber(data?.visitors.reduce((sum, row) => sum + Number(row.visitors), 0) ?? 0)" note="Reported visitor count" />
        <ProductStatCard label="Positioning time" :value="positioningMinutes" note="Minutes reported" />
        <ProductStatCard label="Geofence stay" :value="geofenceHours" note="Hours in matched fences" />
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <UCard><template #header><div class="flex items-center justify-between"><h2 class="font-semibold text-highlighted">Visitors by date</h2><UButton label="CSV" size="xs" color="neutral" variant="outline" @click="exportReport('visitors')" /></div></template>
          <div class="overflow-x-auto"><table class="table-density w-full text-left text-sm"><thead><tr class="border-b border-default text-xs text-muted"><th class="px-3 py-2">Date</th><th class="px-3 py-2 text-right">Visitors</th></tr></thead><tbody class="divide-y divide-default"><tr v-for="row in data?.visitors" :key="row.date"><td class="px-3 py-2">{{ row.date }}</td><td class="px-3 py-2 text-right font-medium">{{ formatNumber(Number(row.visitors)) }}</td></tr></tbody></table></div>
        </UCard>
        <UCard><template #header><div class="flex items-center justify-between"><h2 class="font-semibold text-highlighted">Positioning time</h2><UButton label="CSV" size="xs" color="neutral" variant="outline" @click="exportReport('positioning_time')" /></div></template>
          <dl v-if="positioning" class="grid grid-cols-3 gap-3"><div class="soft-card p-3"><dt class="text-xs text-muted">Total seconds</dt><dd class="mt-1 font-semibold text-highlighted">{{ formatNumber(Number(positioning.total)) }}</dd></div><div class="soft-card p-3"><dt class="text-xs text-muted">Average</dt><dd class="mt-1 font-semibold text-highlighted">{{ formatNumber(Number(positioning.avg)) }}</dd></div><div class="soft-card p-3"><dt class="text-xs text-muted">Std. deviation</dt><dd class="mt-1 font-semibold text-highlighted">{{ formatNumber(Number(positioning.std)) }}</dd></div></dl>
          <p v-else class="text-sm text-muted">No positioning-time rows in this window.</p>
        </UCard>
      </div>
      <UCard><template #header><div class="flex items-center justify-between"><h2 class="font-semibold text-highlighted">Geofence stay</h2><UButton label="CSV" size="xs" color="neutral" variant="outline" @click="exportReport('geofencing_stay_time')" /></div></template><dl v-if="geofencing" class="grid gap-3 sm:grid-cols-3"><div><dt class="text-xs text-muted">Stay seconds</dt><dd class="mt-1 font-semibold text-highlighted">{{ formatNumber(Number(geofencing.seconds)) }}</dd></div><div><dt class="text-xs text-muted">Sessions</dt><dd class="mt-1 font-semibold text-highlighted">{{ formatNumber(Number(geofencing.sessions)) }}</dd></div><div><dt class="text-xs text-muted">Report rows</dt><dd class="mt-1 font-semibold text-highlighted">{{ formatNumber(Number(geofencing.rows)) }}</dd></div></dl><p v-else class="text-sm text-muted">No geofence-stay rows in this window.</p></UCard>
    </template>
  </div>
</template>

<style scoped>
.operations-page { max-width: 1480px; }
</style>

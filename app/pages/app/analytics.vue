<script setup lang="ts">
import { useWorkspaceContext } from '~/composables/useWorkspaceContext'
import { isWorkspaceRequestLoading } from '~/utils/async-state'

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Analytics & reports' })

type AnalyticsResponse = {
  visitors: Array<{ date: string, visitors: number }>
  positioning: Array<{ total: number | string, avg: number | string, std: number | string }>
  geofencing: Array<{ seconds: number | string, sessions: number | string, rows: number | string }>
}

type BuildingsResponse = {
  buildings: Array<{ id: number, name: string }>
}

const today = new Date()
const initialTo = today.toISOString().slice(0, 10)
const initialFrom = new Date(today.getTime() - 29 * 86400000).toISOString().slice(0, 10)
const fromDate = ref(initialFrom)
const toDate = ref(initialTo)
const allBuildingsValue = '__all__'
const buildingId = ref<string>(allBuildingsValue)
const geofenceId = ref('')
const syncing = ref(false)
const syncMessage = ref('')
const syncError = ref('')
const { selectedWorkspaceId, loaded: workspaceLoaded } = useWorkspaceContext()
const workspaceBuildingsUrl = computed(() => selectedWorkspaceId.value ? `/api/workspaces/${selectedWorkspaceId.value}/situm/buildings` : '')
const workspaceAnalyticsUrl = computed(() => selectedWorkspaceId.value ? `/api/workspaces/${selectedWorkspaceId.value}/analytics/summary` : '')

const { data: buildingData, error: buildingsError, status: buildingsStatus, refresh: refreshBuildings } = await useFetch<BuildingsResponse>(workspaceBuildingsUrl, { immediate: false })
const buildings = computed(() => buildingData.value?.buildings ?? [])
const buildingsLoading = computed(() => isWorkspaceRequestLoading(workspaceLoaded.value, selectedWorkspaceId.value, String(buildingsStatus.value)))
const buildingItems = computed(() => [{ label: 'All buildings', value: allBuildingsValue }, ...buildings.value.map(building => ({ label: building.name, value: String(building.id) }))])
const query = computed(() => ({ fromDate: fromDate.value, toDate: toDate.value, ...(buildingId.value !== allBuildingsValue ? { buildingId: buildingId.value } : {}), ...(geofenceId.value.trim() ? { geofenceId: geofenceId.value.trim() } : {}) }))
const { data, error, status, refresh } = await useFetch<AnalyticsResponse>(workspaceAnalyticsUrl, { query, immediate: false })
const analyticsLoading = computed(() => isWorkspaceRequestLoading(workspaceLoaded.value, selectedWorkspaceId.value, String(status.value)))

const hasData = computed(() => String(status.value) === 'success' && Boolean(data.value && (data.value.visitors.length || data.value.positioning.length || data.value.geofencing.length)))
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
  if (selectedWorkspaceId.value) {
    await refreshBuildings()
    await refresh()
  }
}

watch(selectedWorkspaceId, async (workspaceId) => {
  buildingId.value = allBuildingsValue
  if (workspaceId) await loadAnalytics()
}, { immediate: true })

async function syncFromSitum() {
  syncing.value = true
  syncMessage.value = ''
  syncError.value = ''
  try {
    const selectedBuildingId = buildingId.value !== allBuildingsValue ? Number(buildingId.value) : undefined
    const targetBuildingIds = selectedBuildingId ? [selectedBuildingId] : buildings.value.map(building => building.id)
    if (!selectedWorkspaceId.value || !targetBuildingIds.length) throw new Error('Choose a workspace with at least one Situm building before syncing analytics.')

    for (const report of ['visitors', 'positioning_time'] as const) {
      for (const targetBuildingId of targetBuildingIds) {
        await $fetch(`/api/workspaces/${selectedWorkspaceId.value}/analytics/sync`, {
          method: 'POST',
          body: { report, fromDate: fromDate.value, toDate: toDate.value, buildingId: targetBuildingId }
        })
      }
    }
    await $fetch(`/api/workspaces/${selectedWorkspaceId.value}/analytics/sync`, {
      method: 'POST',
      body: { report: 'geofencing_stay_time', fromDate: fromDate.value, toDate: toDate.value, buildingIds: targetBuildingIds }
    })

    syncMessage.value = `Analytics synced from Situm for ${targetBuildingIds.length} building${targetBuildingIds.length === 1 ? '' : 's'}.`
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
</script>

<template>
  <div class="operations-page space-y-6">
    <ProductPageHeader eyebrow="Reports" title="Analytics & reports" description="Situm operational report data for the selected date range and building. App interactions such as opening directions are not counted as these report metrics.">
      <template #actions><UButton label="Sync from Situm" icon="i-lucide-refresh-cw" :loading="syncing" :disabled="!selectedWorkspaceId || !buildings.length" @click="syncFromSitum" /></template>
    </ProductPageHeader>

    <UCard>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.2fr_auto] lg:items-end">
        <UFormField label="From date"><UInput v-model="fromDate" type="date" aria-label="Analytics start date" /></UFormField>
        <UFormField label="To date"><UInput v-model="toDate" type="date" aria-label="Analytics end date" /></UFormField>
        <UFormField label="Building"><USkeleton v-if="buildingsLoading" class="h-8 w-full" /><USelect v-else v-model="buildingId" :items="buildingItems" aria-label="Filter by building" :disabled="!selectedWorkspaceId" /></UFormField>
        <UButton label="Apply filters" icon="i-lucide-filter" color="neutral" variant="outline" :loading="String(status) === 'pending'" @click="loadAnalytics" />
      </div>
      <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <UInput v-model="geofenceId" placeholder="Optional geofence ID" aria-label="Filter by geofence ID" class="w-full sm:w-72" />
        <span class="text-xs text-muted">{{ fromDate }} to {{ toDate }}</span>
      </div>
    </UCard>

    <UAlert v-if="selectedWorkspaceId && buildingsError" color="error" variant="subtle" title="Buildings unavailable" description="Situm building data could not be loaded for this workspace, so analytics sync is temporarily unavailable." />
    <UAlert v-if="syncMessage" color="success" variant="subtle" :title="syncMessage" />
    <UAlert v-if="syncError" color="error" variant="subtle" title="Sync failed" :description="syncError" />
    <div v-if="analyticsLoading" class="space-y-3" aria-label="Loading analytics" aria-busy="true"><USkeleton class="h-24 w-full" /><div class="grid gap-4 sm:grid-cols-3"><USkeleton class="h-20 w-full" /><USkeleton class="h-20 w-full" /><USkeleton class="h-20 w-full" /></div></div>
    <UAlert v-else-if="!selectedWorkspaceId" color="neutral" variant="subtle" title="No workspace selected" description="Create or select a workspace before loading analytics." />
    <UAlert v-else-if="error" color="error" variant="subtle" title="Analytics unavailable" description="The protected analytics data could not be read from ClickHouse." />
    <UAlert v-else-if="String(status) === 'success' && !hasData" color="neutral" variant="subtle" title="No analytics data" description="No Situm report rows are synced for this date range and filter. Sync the window above; navigation and other client interactions are separate from these operational reports." />

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

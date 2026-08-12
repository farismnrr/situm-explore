<script setup lang="ts">
import { analyticsTabs, positioningBars, positionRecords, stayRecords, visitorBars, viewerUsage, type AnalyticsReport } from '~/data/prototype/analytics'

const activeReport = ref<AnalyticsReport>('visitors')
const dateRange = ref('Last 24 hours')
const exportMessage = ref('')
const { showFeedback } = useExploreFeedback()
const { handleTabKey } = useTabKeyboard()

function exportCsv() {
  const rows = activeReport.value === 'stay'
    ? [['Zone', 'Sessions', 'Average stay', 'Maximum stay'], ...stayRecords.map(row => [row.zone, String(row.sessions), row.average, row.maximum])]
    : activeReport.value === 'positions'
      ? [['User', 'Building', 'Floor', 'Timestamp'], ...positionRecords.map(row => [row.user, row.building, row.floor, row.timestamp])]
      : [['Report', 'Date range', 'Status'], [activeReport.value, dateRange.value, 'Local prototype fixture']]
  const csv = rows.map(row => row.map(value => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n')
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  link.download = `situm-explore-${activeReport.value}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
  exportMessage.value = 'Local CSV downloaded. No report service was contacted.'
  showFeedback('Local CSV downloaded.')
}

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Analytics & reports' })
</script>

<template>
  <div class="operations-page space-y-6">
    <ProductPageHeader eyebrow="Reports" title="Analytics & reports" description="Visitors, geofencing, positioning, trajectories and map viewer usage.">
      <template #actions>
        <USelect v-model="dateRange" :items="['Last 24 hours', 'Last 7 days', 'Last 30 days']" class="w-40" aria-label="Report date range" />
        <UButton label="Export CSV" icon="i-lucide-download" color="neutral" variant="outline" @click="exportCsv" />
      </template>
    </ProductPageHeader>

    <p v-if="exportMessage" class="sr-only" role="status">{{ exportMessage }}</p>

    <div class="analytics-tabs flex gap-1 overflow-x-auto" role="tablist" aria-label="Analytics reports">
          <button v-for="(tab, index) in analyticsTabs" :key="tab.id" :data-report-tab="tab.id" type="button" role="tab" :aria-selected="activeReport === tab.id" :tabindex="activeReport === tab.id ? 0 : -1" class="analytics-tab shrink-0 rounded-lg border px-2.5 py-2 text-[10px] font-medium transition" :class="activeReport === tab.id ? 'border-[var(--explore-ink)] bg-[var(--explore-ink)] text-white' : 'border-default bg-default text-muted hover:text-highlighted'" @keydown="handleTabKey($event, index, analyticsTabs.length, nextIndex => activeReport = analyticsTabs[nextIndex]!.id, '[data-report-tab]')" @click="activeReport = tab.id">{{ tab.label }}</button>
    </div>

    <UCard :ui="{ body: 'p-0' }">
      <div v-if="activeReport === 'visitors' || activeReport === 'positioning'">
        <div class="panel-head"><div><h2 class="font-semibold text-highlighted">{{ activeReport === 'visitors' ? 'Visitors' : 'Positioning time' }}</h2><p class="mt-1 text-[10px] text-muted">{{ activeReport === 'visitors' ? 'Unique indoor visitors' : 'Tracked duration by user' }}</p></div><span class="text-[10px] text-muted">{{ dateRange }}</span></div>
        <div class="analytics-chart" :aria-label="activeReport === 'visitors' ? 'Visitors by time' : 'Positioning time by user'" role="img"><div class="analytics-grid" /><div class="flex h-full items-end justify-between gap-2 px-2 sm:px-5"><div v-for="(bar, index) in (activeReport === 'visitors' ? visitorBars : positioningBars)" :key="bar.label" class="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"><span class="analytics-bar w-full max-w-12 rounded-t-sm" :class="index > 3 ? 'bg-info' : 'bg-info/35'" :style="{ height: `${bar.value}%` }" /><span class="truncate text-[10px] text-muted">{{ bar.label }}</span></div></div></div>
      </div>

      <div v-else-if="activeReport === 'heatmap'"><div class="panel-head"><div><h2 class="font-semibold text-highlighted">Heatmap</h2><p class="mt-1 text-[10px] text-muted">Position density</p></div></div><div class="analytics-heatmap relative mx-4 mb-4 h-80 overflow-hidden rounded-lg border border-default sm:mx-6 sm:mb-6" aria-label="Local position density heatmap" role="img"><span class="heat-spot heat-one" /><span class="heat-spot heat-two" /><span class="heat-spot heat-three" /><span class="heat-spot heat-four" /><span class="absolute bottom-3 left-3 rounded-md border border-default bg-default/90 px-2 py-1 text-[11px] text-muted">Main Building · Floor 1</span></div></div>

      <div v-else-if="activeReport === 'stay'" class="p-4 sm:p-6"><div class="panel-head -mx-4 -mt-4 mb-4 sm:-mx-6 sm:-mt-6"><div><h2 class="font-semibold text-highlighted">Geofencing stay time</h2><p class="mt-1 text-[10px] text-muted">Average duration</p></div></div><div class="overflow-x-auto"><table class="table-density w-full min-w-[520px] text-left"><thead class="border-b border-default text-xs text-muted"><tr><th>Zone</th><th>Sessions</th><th>Avg stay</th><th>Max</th></tr></thead><tbody class="divide-y divide-default"><tr v-for="row in stayRecords" :key="row.zone"><td class="font-semibold text-highlighted">{{ row.zone }}</td><td class="text-muted">{{ row.sessions }}</td><td class="text-muted">{{ row.average }}</td><td class="text-muted">{{ row.maximum }}</td></tr></tbody></table></div></div>

      <div v-else-if="activeReport === 'positions'" class="p-4 sm:p-6"><div class="panel-head -mx-4 -mt-4 mb-4 sm:-mx-6 sm:-mt-6"><div><h2 class="font-semibold text-highlighted">User positions</h2><p class="mt-1 text-[10px] text-muted">Latest report rows</p></div></div><div class="overflow-x-auto"><table class="table-density w-full min-w-[620px] text-left"><thead class="border-b border-default text-xs text-muted"><tr><th>User</th><th>Building</th><th>Floor</th><th>Timestamp</th></tr></thead><tbody class="divide-y divide-default"><tr v-for="row in positionRecords" :key="row.user"><td class="font-semibold text-highlighted">{{ row.user }}</td><td class="text-muted">{{ row.building }}</td><td class="text-muted">{{ row.floor }}</td><td class="text-muted">{{ row.timestamp }}</td></tr></tbody></table></div></div>

      <div v-else class="p-4 sm:p-6"><div class="panel-head -mx-4 -mt-4 mb-4 sm:-mx-6 sm:-mt-6"><div><h2 class="font-semibold text-highlighted">Map viewer usage</h2><p class="mt-1 text-[10px] text-muted">Sessions & interactions</p></div></div><div class="grid gap-3 sm:grid-cols-3"><div v-for="stat in viewerUsage" :key="stat.label" class="soft-card p-3"><p class="text-[10px] text-muted">{{ stat.label }}</p><p class="mt-2 text-2xl font-semibold text-highlighted">{{ stat.value }}</p><p class="mt-1 text-[10px] text-muted">{{ stat.note }}</p></div></div></div>
    </UCard>
  </div>
</template>

<style scoped>
.analytics-chart { position: relative; height: 15.625rem; display: flex; align-items: stretch; }
.analytics-tabs { margin-bottom: 0.75rem; }
.analytics-grid { position: absolute; inset: 0 0 1.5rem; background: repeating-linear-gradient(to bottom, transparent 0, transparent calc(25% - 1px), var(--ui-border) 25%); }
.analytics-bar { position: relative; z-index: 1; max-width: 2rem; border-radius: 0.3rem 0.3rem 0.1rem 0.1rem; background: #dfe3e8; transition: height .2s ease; }
.analytics-bar.bg-info\/35 { background: #dfe3e8; }.analytics-bar.bg-info { background: #9ebcfb; }
.analytics-heatmap { background: repeating-linear-gradient(0deg, #fafbfc 0 27px, #eef1f4 28px), repeating-linear-gradient(90deg, transparent 0 27px, #eef1f4 28px); }
.heat-spot { position: absolute; width: 7rem; height: 7rem; border-radius: 999px; opacity: .75; background: radial-gradient(circle, #ef4444 0 8%, #f59e0b 18%, #facc15 34%, transparent 68%); }
.heat-one { left: 18%; top: 20%; }.heat-two { left: 48%; top: 35%; transform: scale(1.25); }.heat-three { right: 14%; bottom: 14%; transform: scale(.8); }.heat-four { left: 35%; bottom: 5%; transform: scale(.65); }
.operations-page { max-width: 1480px; }
</style>

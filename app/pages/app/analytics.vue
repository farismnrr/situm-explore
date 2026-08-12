<script setup lang="ts">
import { analyticsTabs, positioningBars, positionRecords, stayRecords, visitorBars, viewerUsage, type AnalyticsReport } from '~/data/prototype/analytics'

const activeReport = ref<AnalyticsReport>('visitors')
const dateRange = ref('Last 24 hours')
const exportMessage = ref('')

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
}

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Analytics & reports' })
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div><p class="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Reports</p><h1 class="mt-2 text-2xl font-semibold tracking-tight text-highlighted">Analytics & reports</h1><p class="mt-1 text-sm text-muted">Visitors, geofencing, positioning, trajectories and map viewer usage.</p></div>
      <div class="flex flex-wrap items-center gap-2">
        <UBadge color="neutral" variant="soft">Local prototype data</UBadge>
        <USelect v-model="dateRange" :items="['Last 24 hours', 'Last 7 days', 'Last 30 days']" class="w-40" aria-label="Report date range" />
        <UButton label="Export CSV" icon="i-lucide-download" color="neutral" variant="outline" @click="exportCsv" />
      </div>
    </div>

    <UAlert v-if="exportMessage" color="info" variant="soft" :description="exportMessage" close @update:open="exportMessage = ''" />

    <div class="analytics-tabs flex gap-1 overflow-x-auto border-b border-default" role="tablist" aria-label="Analytics reports">
      <button v-for="tab in analyticsTabs" :key="tab.id" type="button" role="tab" :aria-selected="activeReport === tab.id" class="analytics-tab shrink-0 border-b-2 px-3 py-3 text-sm font-medium transition" :class="activeReport === tab.id ? 'border-primary text-highlighted' : 'border-transparent text-muted hover:text-highlighted'" @click="activeReport = tab.id">{{ tab.label }}</button>
    </div>

    <UCard :ui="{ body: 'p-0' }">
      <div v-if="activeReport === 'visitors' || activeReport === 'positioning'" class="p-4 sm:p-6">
        <div class="mb-5 flex items-start justify-between gap-3"><div><h2 class="text-base font-semibold text-highlighted">{{ activeReport === 'visitors' ? 'Visitors' : 'Positioning time' }}</h2><p class="mt-1 text-xs text-muted">{{ activeReport === 'visitors' ? 'Unique indoor visitors' : 'Tracked duration by user' }}</p></div><span class="text-xs text-muted">{{ dateRange }}</span></div>
        <div class="analytics-chart" :aria-label="activeReport === 'visitors' ? 'Visitors by time' : 'Positioning time by user'" role="img"><div class="analytics-grid" /><div class="flex h-full items-end justify-between gap-2 px-2 sm:px-5"><div v-for="(bar, index) in (activeReport === 'visitors' ? visitorBars : positioningBars)" :key="bar.label" class="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"><span class="analytics-bar w-full max-w-12 rounded-t-sm" :class="index > 3 ? 'bg-primary' : 'bg-primary/35'" :style="{ height: `${bar.value}%` }" /><span class="truncate text-[10px] text-muted">{{ bar.label }}</span></div></div></div>
      </div>

      <div v-else-if="activeReport === 'heatmap'" class="p-4 sm:p-6"><div class="mb-5"><h2 class="text-base font-semibold text-highlighted">Heatmap</h2><p class="mt-1 text-xs text-muted">Position density</p></div><div class="analytics-heatmap relative h-80 overflow-hidden rounded-lg border border-default" aria-label="Local position density heatmap" role="img"><span class="heat-spot heat-one" /><span class="heat-spot heat-two" /><span class="heat-spot heat-three" /><span class="heat-spot heat-four" /><span class="absolute bottom-3 left-3 rounded-md border border-default bg-default/90 px-2 py-1 text-[11px] text-muted">Main Building · Floor 1</span></div></div>

      <div v-else-if="activeReport === 'stay'" class="p-4 sm:p-6"><div class="mb-5"><h2 class="text-base font-semibold text-highlighted">Geofencing stay time</h2><p class="mt-1 text-xs text-muted">Average duration</p></div><div class="overflow-x-auto"><table class="w-full min-w-[520px] text-left text-sm"><thead class="border-b border-default text-xs text-muted"><tr><th class="pb-3 font-medium">Zone</th><th class="pb-3 font-medium">Sessions</th><th class="pb-3 font-medium">Avg stay</th><th class="pb-3 font-medium">Max</th></tr></thead><tbody class="divide-y divide-default"><tr v-for="row in stayRecords" :key="row.zone"><td class="py-4 font-medium text-highlighted">{{ row.zone }}</td><td class="py-4 text-muted">{{ row.sessions }}</td><td class="py-4 text-muted">{{ row.average }}</td><td class="py-4 text-muted">{{ row.maximum }}</td></tr></tbody></table></div></div>

      <div v-else-if="activeReport === 'positions'" class="p-4 sm:p-6"><div class="mb-5"><h2 class="text-base font-semibold text-highlighted">User positions</h2><p class="mt-1 text-xs text-muted">Latest report rows</p></div><div class="overflow-x-auto"><table class="w-full min-w-[620px] text-left text-sm"><thead class="border-b border-default text-xs text-muted"><tr><th class="pb-3 font-medium">User</th><th class="pb-3 font-medium">Building</th><th class="pb-3 font-medium">Floor</th><th class="pb-3 font-medium">Timestamp</th></tr></thead><tbody class="divide-y divide-default"><tr v-for="row in positionRecords" :key="row.user"><td class="py-4 font-medium text-highlighted">{{ row.user }}</td><td class="py-4 text-muted">{{ row.building }}</td><td class="py-4 text-muted">{{ row.floor }}</td><td class="py-4 text-muted">{{ row.timestamp }}</td></tr></tbody></table></div></div>

      <div v-else class="p-4 sm:p-6"><div class="mb-5"><h2 class="text-base font-semibold text-highlighted">Map viewer usage</h2><p class="mt-1 text-xs text-muted">Sessions & interactions</p></div><div class="grid gap-3 sm:grid-cols-3"><div v-for="stat in viewerUsage" :key="stat.label" class="rounded-lg border border-default bg-elevated p-4"><p class="text-xs text-muted">{{ stat.label }}</p><p class="mt-2 text-2xl font-semibold text-highlighted">{{ stat.value }}</p><p class="mt-1 text-[11px] text-muted">{{ stat.note }}</p></div></div></div>
    </UCard>
  </div>
</template>

<style scoped>
.analytics-chart { position: relative; height: 18rem; display: flex; align-items: stretch; }
.analytics-grid { position: absolute; inset: 0 0 1.5rem; background: repeating-linear-gradient(to bottom, transparent 0, transparent calc(25% - 1px), var(--ui-border) 25%); }
.analytics-bar { position: relative; z-index: 1; transition: height .2s ease; }
.analytics-heatmap { background: linear-gradient(135deg, #f8fafc, #eef2f7); }
.heat-spot { position: absolute; width: 10rem; height: 10rem; border-radius: 999px; filter: blur(25px); opacity: .72; }
.heat-one { left: 18%; top: 20%; background: #60a5fa; }.heat-two { left: 48%; top: 35%; background: #fbbf24; }.heat-three { right: 14%; bottom: 14%; background: #f87171; }.heat-four { left: 35%; bottom: 5%; background: #93c5fd; }
</style>

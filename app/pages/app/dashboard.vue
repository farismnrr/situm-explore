<script setup lang="ts">
import { dashboardAlarms, dashboardOccupancy, dashboardStats, dashboardTrend } from '~/data/prototype/dashboard'

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Dashboard' })

const { data: foundation } = await useFetch('/api/me')
const { data: situm } = await useFetch('/api/situm/status')

const databaseLabel = computed(() => foundation.value?.status === 'connected' || foundation.value?.status === 'connected-empty' ? 'Connected' : 'Unavailable')
const databaseColor = computed(() => databaseLabel.value === 'Connected' ? 'success' : 'error')
const situmLabel = computed(() => situm.value?.configured ? 'Configured' : 'Not configured')
const situmColor = computed(() => situm.value?.configured ? 'success' : 'warning')
</script>

<template>
  <div class="dashboard-page">
    <ProductPageHeader eyebrow="Overview" title="Dashboard" description="Operational snapshot of the indoor workspace.">
      <template #actions><UButton to="/app/analytics" color="neutral" variant="outline">Open reports</UButton><UButton to="/app/map">Open map</UButton></template>
    </ProductPageHeader>

    <div class="stat-grid mb-4">
      <ProductStatCard v-for="stat in dashboardStats" :key="stat.label" :label="stat.label" :value="stat.value" :note="stat.note" :positive="stat.positive" />
    </div>

    <div class="content-grid mb-4">
      <UCard :ui="{ body: 'p-0' }"><div class="panel-head"><div><h2 class="font-semibold text-highlighted">Visitor trend</h2><span class="text-xs text-muted">Last 7 days</span></div><UButton to="/app/analytics" color="neutral" variant="ghost" size="sm">Full report <span aria-hidden="true">→</span></UButton></div><div class="trend-chart" aria-label="Visitor trend for the last seven days"><div class="chart-grid" /><div class="chart-bars"><div v-for="point in dashboardTrend" :key="point.day" class="chart-bar-wrap"><span class="chart-bar" :class="{ accent: point.value > 70 }" :style="{ height: `${point.value}%` }" /><span class="chart-label">{{ point.day }}</span></div></div></div></UCard>
      <UCard :ui="{ body: 'p-0' }"><div class="panel-head"><h2 class="font-semibold text-highlighted">System status</h2><span class="text-xs text-muted">Just now</span></div><div class="status-list panel-body"><div><span>Map Viewer</span><UBadge color="neutral" variant="soft">Open map to verify</UBadge></div><div><span>Database</span><UBadge :color="databaseColor" variant="soft">{{ databaseLabel }}</UBadge></div><div><span>Situm configuration</span><UBadge :color="situmColor" variant="soft">{{ situmLabel }}</UBadge></div><div><span>Open alarms</span><UBadge color="warning" variant="soft">2 active</UBadge></div></div></UCard>
    </div>

    <div class="content-grid equal-grid">
      <UCard><div class="panel-head"><h2 class="font-semibold text-highlighted">Occupancy by floor</h2><span class="text-xs text-muted">Realtime</span></div><div class="panel-body occupancy-list"><div v-for="floor in dashboardOccupancy" :key="floor.floor"><div class="flex items-center justify-between text-xs"><span class="text-muted">{{ floor.floor }}</span><strong class="text-highlighted">{{ floor.people }} people</strong></div><div class="mt-2 h-1.5 overflow-hidden rounded-full bg-elevated"><div class="h-full rounded-full bg-primary" :style="{ width: `${(floor.people / floor.capacity) * 100}%` }" /></div></div></div></UCard>
      <UCard><div class="panel-head"><h2 class="font-semibold text-highlighted">Alarm summary</h2><span class="text-xs text-muted">Today</span></div><div class="panel-body activity-list"><div v-for="alarm in dashboardAlarms" :key="alarm.title" class="activity-row"><span class="activity-dot" :class="`tone-${alarm.tone}`" /><div class="min-w-0 flex-1"><strong class="block text-xs font-medium text-highlighted">{{ alarm.title }}</strong><span class="mt-0.5 block text-[10px] text-muted">{{ alarm.detail }}</span></div><time class="text-[10px] text-muted">{{ alarm.time }}</time></div></div></UCard>
    </div>
  </div>
</template>

<style scoped>
.eyebrow { color: var(--ui-text-muted); font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; }
.stat-grid, .content-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.75rem; }
.content-grid { grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.6fr); }
.equal-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.trend-chart { position: relative; height: 15.625rem; padding: 1.25rem 0.75rem 1.75rem 2.625rem; }
.chart-grid { position: absolute; inset: 1.25rem 0.75rem 1.75rem 2.625rem; background: repeating-linear-gradient(to bottom, transparent 0 3rem, var(--explore-border) 3rem 3.0625rem); }
.chart-bars { position: relative; display: flex; height: 100%; align-items: end; justify-content: space-around; gap: 0.75rem; }
.chart-bar-wrap { display: flex; height: 100%; flex: 1; flex-direction: column; align-items: center; justify-content: end; gap: 0.5rem; }
.chart-bar { width: min(2rem, 65%); min-height: 0.5rem; border-radius: 0.35rem 0.35rem 0.15rem 0.15rem; background: #dfe3e8; }
.chart-bar.accent { background: var(--ui-primary); }
.chart-label { color: var(--ui-text-muted); font-size: 0.6875rem; }
.status-list { display: grid; gap: 0.8125rem; }
.status-list > div { display: flex; align-items: center; justify-content: space-between; gap: 1rem; color: var(--ui-text-muted); font-size: 0.8125rem; }
.occupancy-list { display: grid; gap: 1rem; }
.activity-dot { flex: 0 0 auto; width: 0.4375rem; height: 0.4375rem; margin-top: 0.25rem; border-radius: 999px; background: var(--ui-text-muted); }.tone-error { background: #dc2626; }.tone-warning { background: #d97706; }
@media (max-width: 900px) { .stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) { .content-grid, .equal-grid, .stat-grid { grid-template-columns: 1fr; } .trend-chart { height: 12rem; } }
</style>

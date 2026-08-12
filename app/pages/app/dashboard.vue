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
  <div class="dashboard-page mx-auto max-w-6xl">
    <div class="page-head mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p class="eyebrow">Overview</p><h1 class="mt-1 text-2xl font-semibold tracking-tight text-highlighted">Dashboard</h1><p class="mt-2 text-sm text-muted">Operational snapshot of the indoor workspace.</p></div>
      <div class="flex flex-wrap gap-2"><UButton to="/app/analytics" color="neutral" variant="outline">Open reports</UButton><UButton to="/app/map">Open map</UButton></div>
    </div>

    <div class="stat-grid mb-4">
      <UCard v-for="stat in dashboardStats" :key="stat.label" :ui="{ body: 'p-4' }"><span class="text-xs text-muted">{{ stat.label }}</span><strong class="mt-2 block text-2xl tracking-tight text-highlighted">{{ stat.value }}</strong><small class="mt-1 block text-xs" :class="stat.positive ? 'text-success' : 'text-muted'">{{ stat.note }}</small></UCard>
    </div>

    <div class="content-grid mb-4">
      <UCard :ui="{ body: 'p-0' }"><div class="flex items-center justify-between gap-3 border-b border-default p-4"><div><h2 class="font-semibold text-highlighted">Visitor trend</h2><span class="text-xs text-muted">Last 7 days</span></div><UButton to="/app/analytics" color="neutral" variant="ghost" size="sm">Full report <span aria-hidden="true">→</span></UButton></div><div class="trend-chart" aria-label="Visitor trend for the last seven days"><div class="chart-grid" /><div class="chart-bars"><div v-for="point in dashboardTrend" :key="point.day" class="chart-bar-wrap"><span class="chart-bar" :class="{ accent: point.value > 70 }" :style="{ height: `${point.value}%` }" /><span class="chart-label">{{ point.day }}</span></div></div></div></UCard>
      <UCard><div class="flex items-center justify-between border-b border-default pb-4"><h2 class="font-semibold text-highlighted">System status</h2><span class="text-xs text-muted">Just now</span></div><div class="status-list pt-4"><div><span>Map Viewer</span><UBadge color="neutral" variant="soft">Open map to verify</UBadge></div><div><span>Database</span><UBadge :color="databaseColor" variant="soft">{{ databaseLabel }}</UBadge></div><div><span>Situm configuration</span><UBadge :color="situmColor" variant="soft">{{ situmLabel }}</UBadge></div><div><span>Realtime API</span><UBadge color="success" variant="soft">Healthy <span class="dummy-mark">local</span></UBadge></div><div><span>Open alarms</span><UBadge color="warning" variant="soft">2 active</UBadge></div></div></UCard>
    </div>

    <div class="content-grid equal-grid">
      <UCard><div class="flex items-center justify-between border-b border-default pb-4"><h2 class="font-semibold text-highlighted">Occupancy by floor</h2><span class="text-xs text-muted">Realtime · local</span></div><div class="space-y-5 pt-4"><div v-for="floor in dashboardOccupancy" :key="floor.floor"><div class="flex items-center justify-between text-sm"><span class="text-muted">{{ floor.floor }}</span><strong class="text-highlighted">{{ floor.people }} people</strong></div><div class="mt-2 h-2 overflow-hidden rounded-full bg-elevated"><div class="h-full rounded-full bg-primary" :style="{ width: `${(floor.people / floor.capacity) * 100}%` }" /></div></div></div></UCard>
      <UCard><div class="flex items-center justify-between border-b border-default pb-4"><h2 class="font-semibold text-highlighted">Alarm summary</h2><span class="text-xs text-muted">Today</span></div><div class="divide-y divide-default"><div v-for="alarm in dashboardAlarms" :key="alarm.title" class="flex items-start gap-3 py-4 last:pb-0"><span class="activity-dot mt-1.5" :class="`tone-${alarm.tone}`" /><div class="min-w-0 flex-1"><strong class="block text-sm font-medium text-highlighted">{{ alarm.title }}</strong><span class="mt-0.5 block text-xs text-muted">{{ alarm.detail }}</span></div><time class="text-xs text-muted">{{ alarm.time }}</time></div></div></UCard>
    </div>
  </div>
</template>

<style scoped>
.eyebrow { color: var(--ui-text-muted); font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; }
.stat-grid, .content-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }
.content-grid { grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr); }
.equal-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.trend-chart { position: relative; height: 14rem; padding: 1.25rem 1.25rem 2.25rem; }
.chart-grid { position: absolute; inset: 1.25rem 1.25rem 2.25rem; background: repeating-linear-gradient(to bottom, transparent 0 2.7rem, var(--ui-border) 2.7rem 2.75rem); }
.chart-bars { position: relative; display: flex; height: 100%; align-items: end; justify-content: space-around; gap: 0.75rem; }
.chart-bar-wrap { display: flex; height: 100%; flex: 1; flex-direction: column; align-items: center; justify-content: end; gap: 0.5rem; }
.chart-bar { width: min(2rem, 65%); min-height: 0.5rem; border-radius: 0.35rem 0.35rem 0.15rem 0.15rem; background: #9ebcfb; }
.chart-bar.accent { background: var(--ui-primary); }
.chart-label { color: var(--ui-text-muted); font-size: 0.6875rem; }
.status-list { display: grid; gap: 0.8rem; }
.status-list > div { display: flex; align-items: center; justify-content: space-between; gap: 1rem; color: var(--ui-text-muted); font-size: 0.875rem; }
.dummy-mark { margin-left: 0.25rem; opacity: 0.7; }
.activity-dot { flex: 0 0 auto; width: 0.4rem; height: 0.4rem; border-radius: 999px; background: var(--ui-text-muted); }.tone-error { background: #dc2626; }.tone-warning { background: #d97706; }
@media (max-width: 900px) { .stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) { .content-grid, .equal-grid, .stat-grid { grid-template-columns: 1fr; } .trend-chart { height: 12rem; } }
</style>

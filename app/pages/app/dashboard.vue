<script setup lang="ts">

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

    <div class="content-grid mb-4">
      <UCard><UAlert color="neutral" variant="subtle" title="Dashboard metrics remain unresolved" description="Real report summaries are available in Reports. Alarm, user and group totals are not shown here because their source scope and denominator are not equivalent to one another." /></UCard>
      <UCard :ui="{ body: 'p-0' }"><div class="panel-head"><h2 class="font-semibold text-highlighted">System status</h2><span class="text-xs text-muted">Just now</span></div><div class="status-list panel-body"><div><span>Map Viewer</span><ProductStatusBadge label="Open map to verify" /></div><div><span>Database</span><ProductStatusBadge :label="databaseLabel" :tone="databaseColor" /></div><div><span>Situm configuration</span><ProductStatusBadge :label="situmLabel" :tone="situmColor" /></div></div></UCard>
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

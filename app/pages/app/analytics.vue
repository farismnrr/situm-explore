<script setup lang="ts">

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Analytics & reports' })
</script>

<template>
  <div class="operations-page space-y-6">
    <ProductPageHeader eyebrow="Reports" title="Analytics & reports" description="Visitors, geofencing, positioning, trajectories and map viewer usage.">
      <template #actions><ProductStatusBadge label="Plan 014 · not connected" tone="neutral" /></template>
    </ProductPageHeader>

    <UCard><UAlert color="neutral" variant="subtle" title="Reports are not connected" description="Plan 014 will verify each report endpoint, date/filter contract, response mapping and CSV behavior before replacing this empty state." /></UCard>
  </div>
</template>

<style scoped>
.analytics-chart { position: relative; height: 17rem; display: flex; align-items: stretch; }
.analytics-tabs { margin-bottom: 0.75rem; }
.analytics-tab { min-height: 32px; }
.analytics-card :deep(.panel-head) { margin: 0; }
.analytics-card :deep(.panel-body) { padding: 16px; }
.analytics-card :deep(.analytics-chart) { box-sizing: border-box; padding: 16px 16px 28px; }
.analytics-grid { position: absolute; inset: 0 0 1.5rem; background: repeating-linear-gradient(to bottom, transparent 0, transparent calc(25% - 1px), var(--ui-border) 25%); }
.analytics-bar { position: relative; z-index: 1; max-width: 2rem; border-radius: 0.3rem 0.3rem 0.1rem 0.1rem; background: #dfe3e8; transition: height .2s ease; }
.analytics-bar.bg-info\/35 { background: #dfe3e8; }.analytics-bar.bg-info { background: #9ebcfb; }
.analytics-heatmap { background: repeating-linear-gradient(0deg, #fafbfc 0 27px, #eef1f4 28px), repeating-linear-gradient(90deg, transparent 0 27px, #eef1f4 28px); }
.heat-spot { position: absolute; width: 7rem; height: 7rem; border-radius: 999px; opacity: .75; background: radial-gradient(circle, #ef4444 0 8%, #f59e0b 18%, #facc15 34%, transparent 68%); }
.heat-one { left: 18%; top: 20%; }.heat-two { left: 48%; top: 35%; transform: scale(1.25); }.heat-three { right: 14%; bottom: 14%; transform: scale(.8); }
.operations-page { max-width: 1480px; }
</style>

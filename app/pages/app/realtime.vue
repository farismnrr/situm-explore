<script setup lang="ts">
const statusMessage = ref('')

function refreshPositions() {
  statusMessage.value = 'Realtime data is not connected; no remote refresh was requested.'
}

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Realtime' })
</script>

<template>
  <div class="operations-page space-y-6">
    <ProductPageHeader eyebrow="Operations" title="Realtime positions" description="Web monitoring for positions produced by tracked devices; the browser does not perform indoor positioning.">
      <template #actions><ProductStatusBadge label="Plan 013 · not connected" tone="neutral" /><UButton label="Check status" icon="i-lucide-refresh-cw" color="neutral" variant="outline" @click="refreshPositions" /></template>
    </ProductPageHeader>

    <p v-if="statusMessage" class="sr-only" role="status">{{ statusMessage }}</p>

    <div class="realtime-grid grid gap-4 lg:grid-cols-[1.4fr_.6fr]">
      <UCard :ui="{ body: 'p-0' }">
        <div class="flex items-center justify-between gap-3 border-b border-default px-4 py-3">
          <h2 class="text-sm font-semibold text-highlighted">Live map</h2>
          <span class="text-xs text-muted">Awaiting Situm data</span>
        </div>
          <div class="realtime-map relative overflow-hidden border-t border-default" aria-label="Realtime map awaiting Situm data">
          <div class="flex h-full items-center justify-center p-6"><UAlert color="neutral" variant="subtle" title="No realtime source connected" description="Plan 013 will replace this empty state with authenticated Situm positions and truthful stale/offline handling." class="max-w-md" /></div>
        </div>
      </UCard>

      <UCard :ui="{ body: 'p-0' }">
        <div class="flex items-center justify-between gap-3 border-b border-default px-4 py-3">
          <h2 class="text-sm font-semibold text-highlighted">People & devices</h2>
          <span class="text-xs text-muted">Awaiting Situm data</span>
        </div>
        <div class="p-4"><UAlert color="neutral" variant="subtle" title="No people or devices loaded" description="Plan 013 owns the authenticated position list and device context." /></div>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
.operations-page { max-width: 1480px; }
.realtime-map { height: 420px; background: repeating-linear-gradient(0deg,#fafbfc 0 26px,#f0f2f4 27px),repeating-linear-gradient(90deg,transparent 0 26px,#f0f2f4 27px); }
.realtime-floor { position:absolute; inset:12% 10%; border:2px solid #d6dae0; border-radius:18px; background:#fff; transform:rotate(-2deg); }
.realtime-floor::before { content:''; position:absolute; inset:15% 12%; border:1px solid #e0e3e7; border-radius:9px; }
.activity-row strong { font-size: .6875rem; }
.activity-row span { font-size: .625rem; }
@media (max-width: 1023px) { .realtime-grid { grid-template-columns: 1fr; } }
</style>

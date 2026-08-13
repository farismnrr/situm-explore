<script setup lang="ts">
import type { SitumRealtimeResponse } from '#shared/situm-realtime'

const { data, error, status, refresh } = await useFetch<SitumRealtimeResponse>('/api/situm/realtime')
const positions = computed(() => data.value?.positions ?? [])
const statusMessage = ref('')

async function refreshPositions() {
  await refresh()
  statusMessage.value = error.value ? 'Realtime refresh failed.' : `Loaded ${positions.value.length} current positions.`
}

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Realtime' })
</script>

<template>
  <div class="operations-page space-y-6">
    <ProductPageHeader eyebrow="Operations" title="Realtime positions" description="Web monitoring for positions produced by tracked devices; the browser does not perform indoor positioning.">
      <template #actions><ProductStatusBadge :label="error ? 'Unavailable' : `${positions.length} positions`" :tone="error ? 'error' : 'success'" /><UButton label="Refresh" icon="i-lucide-refresh-cw" color="neutral" variant="outline" :loading="status === 'pending'" @click="refreshPositions" /></template>
    </ProductPageHeader>

    <p v-if="statusMessage" class="sr-only" role="status">{{ statusMessage }}</p>

    <div class="realtime-grid grid gap-4 lg:grid-cols-[1.4fr_.6fr]">
      <UCard :ui="{ body: 'p-0' }">
        <div class="flex items-center justify-between gap-3 border-b border-default px-4 py-3">
          <h2 class="text-sm font-semibold text-highlighted">Live map</h2>
          <span class="text-xs text-muted">{{ positions.length }} current positions</span>
        </div>
          <div class="realtime-map relative overflow-hidden border-t border-default" aria-label="Realtime map awaiting Situm data">
          <div class="flex h-full items-center justify-center p-6"><UAlert v-if="error" color="error" variant="subtle" title="Realtime unavailable" description="The authenticated Situm position read failed. No simulated markers are shown." class="max-w-md" /><UAlert v-else-if="positions.length === 0" color="neutral" variant="subtle" title="No current positions" description="Situm returned no current position features." class="max-w-md" /><div v-else class="text-sm text-muted">{{ positions.length }} current device-produced positions received.</div></div>
        </div>
      </UCard>

      <UCard :ui="{ body: 'p-0' }">
        <div class="flex items-center justify-between gap-3 border-b border-default px-4 py-3">
          <h2 class="text-sm font-semibold text-highlighted">People & devices</h2>
          <span class="text-xs text-muted">{{ positions.length }} records</span>
        </div>
        <div class="p-4"><UAlert v-if="error" color="error" variant="subtle" title="Positions unavailable" description="No fixture rows are shown." /><div v-else-if="positions.length === 0" class="text-sm text-muted">No current positions.</div><div v-else class="space-y-2"><div v-for="position in positions" :key="position.id" class="rounded-lg border border-default p-3"><div class="flex items-center justify-between"><strong class="text-sm text-highlighted">{{ position.deviceId || position.id }}</strong><span class="text-xs text-muted">Floor {{ position.floorId }}</span></div><p class="mt-1 text-xs text-muted">Building {{ position.buildingId }} · accuracy {{ position.accuracy }}m · {{ position.time }}</p></div></div></div>
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

<script setup lang="ts">
import { realtimePositions, realtimeStats, type RealtimePosition } from '~/data/prototype/realtime'

const positions = ref<RealtimePosition[]>(realtimePositions.map(position => ({ ...position, marker: { ...position.marker } })))
const updatedAt = ref('just now')
const refreshCount = ref(0)
const statusMessage = ref('')
const { showFeedback } = useExploreFeedback()

function refreshPositions() {
  refreshCount.value += 1
  positions.value = positions.value.map((position, index) => ({
    ...position,
    marker: {
      ...position.marker,
      left: Math.min(84, Math.max(16, position.marker.left + ((refreshCount.value + index) % 3 - 1) * 3)),
      top: Math.min(76, Math.max(20, position.marker.top + ((refreshCount.value + index * 2) % 3 - 1) * 3))
    }
  }))
  updatedAt.value = 'just now'
  statusMessage.value = 'Local demo positions refreshed.'
  showFeedback('Local positions refreshed.')
}

let refreshTimer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  refreshTimer = setInterval(refreshPositions, 5000)
})
onBeforeUnmount(() => {
  if (refreshTimer) clearInterval(refreshTimer)
})

async function follow(position: RealtimePosition) {
  statusMessage.value = `Following ${position.name} in the local map preview.`
  await navigateTo({ path: '/app/map', query: { mode: 'realtime', follow: position.id } })
}

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Realtime' })
</script>

<template>
  <div class="operations-page space-y-6">
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Operations</p>
        <h1 class="mt-2 text-2xl font-semibold tracking-tight text-highlighted">Realtime positions</h1>
        <p class="mt-1 text-sm text-muted">Current user and device locations across the indoor workspace.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <UBadge color="success" variant="soft"><span class="mr-1.5 size-1.5 rounded-full bg-success" />Auto refresh · 5s</UBadge>
        <UButton label="Refresh now" icon="i-lucide-refresh-cw" color="neutral" variant="ghost" @click="refreshPositions" />
      </div>
    </div>

    <p v-if="statusMessage" class="sr-only" role="status">{{ statusMessage }}</p>

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <UCard v-for="stat in realtimeStats" :key="stat.label" :ui="{ body: 'p-4' }">
        <p class="text-xs text-muted">{{ stat.label }}</p>
        <p class="mt-2 text-2xl font-semibold text-highlighted">{{ stat.value }}</p>
        <p class="mt-1 text-[11px] text-muted">{{ stat.note }}</p>
      </UCard>
    </div>

    <div class="grid gap-4 xl:grid-cols-2">
      <UCard :ui="{ body: 'p-0' }">
        <div class="flex items-center justify-between gap-3 border-b border-default px-4 py-3">
          <h2 class="text-sm font-semibold text-highlighted">Live map</h2>
          <span class="text-xs text-muted">Updated {{ updatedAt }}</span>
        </div>
        <div class="realtime-map relative m-3 overflow-hidden rounded-lg border border-default" aria-label="Local realtime map preview">
          <div class="realtime-floor" />
          <span v-for="position in positions" :key="position.id" class="absolute z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm transition-all duration-500" :class="position.status === 'online' ? 'bg-sky-500' : 'bg-gray-400'" :style="{ left: `${position.marker.left}%`, top: `${position.marker.top}%` }" :title="position.name" />
          <div class="absolute bottom-3 left-3 rounded-md border border-default bg-default/90 px-2.5 py-1.5 text-[11px] text-muted shadow-sm">Main Building · local preview</div>
        </div>
      </UCard>

      <UCard :ui="{ body: 'p-0' }">
        <div class="flex items-center justify-between gap-3 border-b border-default px-4 py-3">
          <h2 class="text-sm font-semibold text-highlighted">People & devices</h2>
          <span class="text-xs text-muted">24 total</span>
        </div>
        <div class="divide-y divide-default">
            <div v-for="position in positions" :key="position.id" class="activity-row flex items-center gap-3 px-4 py-3">
            <span class="size-2 shrink-0 rounded-full" :class="position.status === 'online' ? 'bg-success' : 'bg-gray-400'" aria-hidden="true" />
            <div class="min-w-0 flex-1"><strong class="block text-sm text-highlighted">{{ position.name }}</strong><span class="mt-1 block text-xs text-muted">{{ position.status === 'online' ? `${position.floor} · ${position.location}` : position.location }}</span></div>
            <UButton v-if="position.status === 'online'" label="Follow" color="neutral" variant="ghost" size="sm" @click="follow(position)" />
            <UBadge v-else color="neutral" variant="soft">Offline</UBadge>
          </div>
        </div>
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
</style>

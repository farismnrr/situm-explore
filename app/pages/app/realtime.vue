<script setup lang="ts">
import type { SitumCartographyResponse } from '#shared/situm-cartography'
import type { SitumRealtimeResponse } from '#shared/situm-realtime'

type ViewerApi = {
  loadRealtimePositions: (buildingId?: number, refreshRateMs?: number) => Promise<void>
  cleanRealtimePositions: () => Promise<void>
}

const isDesktopViewport = useDesktopViewport()
const viewer = ref<ViewerApi | null>(null)
const viewerState = ref<'loading' | 'ready' | 'error'>('loading')
const overlayEnabled = ref(true)
const overlayState = ref<'idle' | 'loading' | 'active' | 'error'>('idle')
const overlayMessage = ref('')
const selectedBuildingId = ref<number | null>(null)
const statusMessage = ref('')
const { selectedWorkspaceId } = useWorkspaceContext()

const { data: cartography, error: cartographyError, status: cartographyStatus, refresh: refreshCartography } = await useFetch<SitumCartographyResponse>(useWorkspaceEndpoint('/situm/cartography'), { immediate: false })
const { data, error, status, refresh } = await useFetch<SitumRealtimeResponse>(useWorkspaceEndpoint('/situm/realtime'), { immediate: false })
watch(selectedWorkspaceId, (workspaceId) => { if (workspaceId) { refreshCartography(); refresh() } }, { immediate: true })
const positions = computed(() => data.value?.positions ?? [])
const buildings = computed(() => cartography.value?.buildings ?? [])
const searchQuery = ref('')
const selectedBuilding = computed(() => String(cartographyStatus.value) === 'success' ? buildings.value.find(building => building.id === selectedBuildingId.value) ?? buildings.value[0] ?? null : null)
const selectedBuildingForViewer = computed(() => selectedBuilding.value)
const filteredPositions = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase()
  return positions.value.filter((position) => {
    if (selectedBuilding.value && position.buildingId !== selectedBuilding.value.id) return false
    if (!query) return true
    const floor = cartography.value?.floors.find(item => item.id === position.floorId)
    return [
      position.id,
      position.deviceId,
      String(position.buildingId),
      selectedBuilding.value?.name,
      String(position.floorId),
      floor?.name,
    ].filter(Boolean).some(value => String(value).toLocaleLowerCase().includes(query))
  })
})

function formatSourceTime(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'medium' }).format(date)
}

function floorLabel(floorId: number) {
  const floor = cartography.value?.floors.find(item => item.id === floorId)
  return floor ? `${floor.name} (ID ${floorId})` : `ID ${floorId}`
}

watch(buildings, (value) => {
  if (selectedBuildingId.value === null && value[0]) selectedBuildingId.value = value[0].id
}, { immediate: true })

function handleViewerStatus(state: 'loading' | 'ready' | 'error') {
  viewerState.value = state
  if (state === 'ready') void syncOverlay()
  if (state === 'error') {
    overlayState.value = 'idle'
    overlayMessage.value = ''
  }
}

async function cleanOverlay() {
  if (!viewer.value || viewerState.value !== 'ready') return
  await viewer.value.cleanRealtimePositions()
  overlayState.value = 'idle'
}

async function syncOverlay() {
  if (!isDesktopViewport.value || !overlayEnabled.value || viewerState.value !== 'ready' || !selectedBuilding.value) return
  overlayState.value = 'loading'
  overlayMessage.value = ''
  try {
    await viewer.value?.loadRealtimePositions(selectedBuilding.value.id, 10_000)
    overlayState.value = 'active'
  } catch (commandError) {
    overlayState.value = 'error'
    overlayMessage.value = commandError instanceof Error ? commandError.message : 'The realtime overlay could not be started.'
  }
}

async function toggleOverlay(enabled: boolean) {
  overlayEnabled.value = enabled
  if (enabled) await syncOverlay()
  else {
    try { await cleanOverlay() }
    catch (commandError) {
      overlayState.value = 'error'
      overlayMessage.value = commandError instanceof Error ? commandError.message : 'The realtime overlay could not be cleared.'
    }
  }
}

async function changeBuilding(buildingId: number) {
  selectedBuildingId.value = buildingId
  if (overlayEnabled.value) {
    try {
      await cleanOverlay()
      await syncOverlay()
    } catch (commandError) {
      overlayState.value = 'error'
      overlayMessage.value = commandError instanceof Error ? commandError.message : 'The building overlay could not be refreshed.'
    }
  }
}

async function refreshPositions() {
  await refresh()
  statusMessage.value = error.value ? 'Realtime refresh failed.' : `Loaded ${positions.value.length} current positions.`
}

watch(isDesktopViewport, (desktop) => {
  if (!desktop) void cleanOverlay().catch(() => undefined)
  else void syncOverlay()
})
watch(selectedBuilding, () => void syncOverlay())

onBeforeUnmount(() => { void cleanOverlay().catch(() => undefined) })

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Realtime' })
</script>

<template>
  <div class="operations-page space-y-6">
    <ProductPageHeader eyebrow="Operations" title="Realtime positions" description="Web monitoring for positions produced by tracked devices; the browser does not perform indoor positioning.">
      <template #actions><ProductStatusBadge :label="error ? 'Unavailable' : String(status) === 'success' ? `${positions.length} positions` : 'Loading'" :tone="error ? 'error' : String(status) === 'success' ? 'success' : 'neutral'" /><UButton label="Refresh" icon="i-lucide-refresh-cw" color="neutral" variant="outline" :loading="String(status) === 'pending'" @click="refreshPositions" /></template>
    </ProductPageHeader>

    <p v-if="statusMessage" class="sr-only" role="status">{{ statusMessage }}</p>

    <div class="realtime-grid grid gap-4 lg:grid-cols-[1.4fr_.6fr]">
      <UCard :ui="{ body: 'p-0' }">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-default px-4 py-3">
          <div><h2 class="text-sm font-semibold text-highlighted">Live map</h2><p class="mt-1 text-xs text-muted">{{ selectedBuilding?.name || 'No building selected' }}</p></div>
          <div class="flex items-center gap-3"><USelect v-if="buildings.length" :model-value="selectedBuildingId ?? undefined" :items="buildings.map(building => ({ label: building.name, value: building.id }))" aria-label="Realtime building" class="w-44" @update:model-value="changeBuilding(Number($event))" /><USwitch :model-value="overlayEnabled" label="Realtime overlay" :disabled="viewerState !== 'ready' || !selectedBuilding" @update:model-value="toggleOverlay" /></div>
        </div>
        <div v-if="!isDesktopViewport" class="flex h-[420px] items-center justify-center border-t border-default p-6 text-center"><UAlert color="neutral" variant="subtle" title="Desktop Viewer unavailable" description="The realtime Situm Viewer is not mounted on mobile. The current position list remains available below." class="max-w-md" /></div>
        <div v-else class="realtime-map relative overflow-hidden border-t border-default" aria-label="Situm realtime map">
          <SitumViewer ref="viewer" :workspace-id="selectedWorkspaceId || undefined" :building-id="selectedBuildingForViewer?.id" class="h-full" @status="handleViewerStatus" />
          <div v-if="viewerState === 'loading'" class="absolute inset-0 flex items-center justify-center bg-default/70 p-6"><UAlert color="neutral" variant="subtle" title="Loading Viewer" description="Waiting for the Situm map to become ready." class="max-w-md" /></div>
          <div v-else-if="viewerState === 'error'" class="absolute inset-0 flex items-center justify-center bg-default/80 p-6"><UAlert color="error" variant="subtle" title="Viewer unavailable" description="The Situm map could not be loaded. The server position context remains independent." class="max-w-md" /></div>
          <div v-else-if="overlayState === 'loading'" class="absolute left-4 top-4"><UBadge color="warning" variant="soft">Starting realtime overlay…</UBadge></div>
          <div v-else-if="overlayState === 'error'" class="absolute left-4 right-4 top-4"><UAlert color="error" variant="subtle" title="Realtime overlay unavailable" :description="overlayMessage" /></div>
          <div v-else-if="String(status) === 'success' && overlayEnabled && overlayState === 'active' && positions.length === 0" class="absolute inset-0 flex items-center justify-center pointer-events-none p-6"><UAlert color="neutral" variant="subtle" title="No current positions" description="The Viewer is ready, but the server returned no current position records." class="max-w-md" /></div>
        </div>
      </UCard>

      <UCard :ui="{ body: 'p-0' }">
        <div class="flex items-center justify-between gap-3 border-b border-default px-4 py-3"><h2 class="text-sm font-semibold text-highlighted">People & devices</h2><span class="text-xs text-muted">{{ String(status) === 'success' ? `${filteredPositions.length} of ${positions.length} records` : 'Loading' }}</span></div>
        <div class="space-y-4 p-4">
          <UInput v-model="searchQuery" icon="i-lucide-search" placeholder="Search IDs or building/floor context" aria-label="Search realtime positions" />
          <UAlert v-if="error" color="error" variant="subtle" title="Positions unavailable" description="The authenticated Situm position read failed." />
          <div v-else-if="String(status) === 'idle' || String(status) === 'pending'" class="space-y-2" aria-label="Loading positions" aria-busy="true"><USkeleton v-for="row in 5" :key="row" class="h-16 w-full" /></div>
          <UAlert v-else-if="String(status) === 'success' && positions.length === 0" color="neutral" variant="subtle" title="No current positions" description="Situm returned no current position records." />
          <UAlert v-else-if="filteredPositions.length === 0" color="neutral" variant="subtle" title="No matching positions" description="Try another identifier or clear the search and building context." />
          <div v-else class="space-y-2">
            <div v-for="position in filteredPositions" :key="position.id" class="rounded-lg border border-default p-3">
              <div class="flex items-center justify-between gap-3"><strong class="text-sm text-highlighted">{{ position.deviceId ? `Device ID ${position.deviceId}` : `Position ID ${position.id}` }}</strong><span class="text-right text-xs text-muted">{{ floorLabel(position.floorId) }}</span></div>
              <p class="mt-1 text-xs text-muted">Building {{ selectedBuilding?.name || `ID ${position.buildingId}` }} (ID {{ position.buildingId }}) · accuracy {{ position.accuracy }}m</p>
              <p class="mt-1 text-xs text-muted">Location {{ position.lat }}, {{ position.lng }} · last seen {{ formatSourceTime(position.time) }}</p>
            </div>
          </div>
        </div>
      </UCard>
    </div>
    <UAlert v-if="cartographyError" color="error" variant="subtle" title="Building context unavailable" description="The Viewer overlay cannot be scoped until Situm buildings load." />
    <p v-else-if="cartographyStatus === 'pending'" class="text-xs text-muted">Loading building context…</p>
  </div>
</template>

<style scoped>
.operations-page { max-width: 1480px; }
.realtime-map { height: 420px; }
@media (max-width: 1023px) { .realtime-grid { grid-template-columns: 1fr; } }
</style>

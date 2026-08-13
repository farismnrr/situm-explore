<script setup lang="ts">
import type { SitumCartographyPoi, SitumCartographyResponse } from '#shared/situm-cartography'

const activeTab = ref<'explore' | 'route' | 'layers'>('explore')
const viewerState = ref<'loading' | 'ready' | 'error'>('loading')
const poiSearch = ref('')
const showFavorites = ref(false)
const favoritePoiIds = ref<number[]>([])
const selectedPoiId = ref<number | null>(null)
const routeStart = ref('')
const routeDestination = ref('')
const accessibleRoute = ref(false)
const layerState = reactive({ realtime: true, geofence: false, trajectory: false })
const viewerToolStatus = ref('')
const viewer = ref<{ selectBuilding: (id: number) => Promise<void>, selectFloor: (id: number) => Promise<void>, selectPoi: (id: number) => Promise<void> } | null>(null)
const { showFeedback } = useExploreFeedback()
const { data: cartography, error: cartographyError, status: cartographyStatus } = await useFetch<SitumCartographyResponse>('/api/situm/cartography')
const buildings = computed(() => cartography.value?.buildings ?? [])
const floors = computed(() => cartography.value?.floors ?? [])
const pois = computed(() => cartography.value?.pois ?? [])
const selectedBuildingId = ref<number | null>(null)
const selectedFloorId = ref<number | null>(null)
const viewMode = ref<'explore' | 'realtime' | 'trajectory'>('explore')
const zoomLevel = ref(1)
const centerVersion = ref(0)

const activeBuilding = computed(() => buildings.value.find(building => building.id === selectedBuildingId.value) ?? buildings.value[0] ?? null)
const activeFloors = computed(() => floors.value.filter(floor => floor.buildingId === activeBuilding.value?.id))
const selectedBuilding = computed(() => activeBuilding.value?.name ?? 'No building')
const selectedFloor = computed(() => activeFloors.value.find(floor => floor.id === selectedFloorId.value) ?? activeFloors.value[0] ?? null)
const buildingOptions = computed(() => buildings.value.map(building => ({ label: building.name, value: building.id })))

watch([buildings, activeFloors], () => {
  if (selectedBuildingId.value === null && buildings.value[0]) selectedBuildingId.value = buildings.value[0].id
  if (!activeFloors.value.some(floor => floor.id === selectedFloorId.value)) selectedFloorId.value = activeFloors.value[0]?.id ?? null
}, { immediate: true })

async function selectBuilding(buildingId: number) {
  selectedBuildingId.value = buildingId
  selectedFloorId.value = floors.value.find(floor => floor.buildingId === buildingId)?.id ?? null
  try {
    await viewer.value?.selectBuilding(buildingId)
    showViewerToolStatus(`${buildings.value.find(building => building.id === buildingId)?.name ?? 'Building'} selected.`)
  } catch (error) {
    showViewerToolStatus(error instanceof Error ? error.message : 'The building could not be selected in the viewer.')
  }
}

async function selectFloor(floorId: number) {
  selectedFloorId.value = floorId
  try {
    await viewer.value?.selectFloor(floorId)
    showViewerToolStatus(`${floors.value.find(floor => floor.id === floorId)?.name ?? 'Floor'} selected.`)
  } catch (error) {
    showViewerToolStatus(error instanceof Error ? error.message : 'The floor could not be selected in the viewer.')
  }
}

function selectViewMode(mode: 'explore' | 'realtime' | 'trajectory') {
  viewMode.value = mode
  showViewerToolStatus(`${mode.charAt(0).toUpperCase() + mode.slice(1)} mode selected locally.`)
}

function adjustZoom(delta: number) {
  zoomLevel.value = Math.min(4, Math.max(0, zoomLevel.value + delta))
  showViewerToolStatus(`Local zoom ${zoomLevel.value === 0 ? 'minimum' : zoomLevel.value === 4 ? 'maximum' : `level ${zoomLevel.value}`}.`)
}

function centerMap() {
  centerVersion.value += 1
  showViewerToolStatus(`Map center reset locally (view ${centerVersion.value}).`)
}

const routeOptions = computed(() => pois.value.map(poi => poi.name))

const filteredPois = computed(() => pois.value.filter((poi) => {
  const query = poiSearch.value.trim().toLowerCase()
  const matchesSearch = !query || [poi.name, poi.categoryName, poi.info].some(value => value.toLowerCase().includes(query))
  return matchesSearch && (!showFavorites.value || favoritePoiIds.value.includes(poi.id))
}))

const selectedPoi = computed(() => pois.value.find(poi => poi.id === selectedPoiId.value) ?? null)

async function selectPoi(poi: SitumCartographyPoi) {
  selectedPoiId.value = poi.id
  try {
    await viewer.value?.selectPoi(poi.id)
    showViewerToolStatus(`${poi.name} selected.`)
  } catch (error) {
    showViewerToolStatus(error instanceof Error ? error.message : 'The POI could not be selected in the viewer.')
  }
}

function openDirections(poiName: string) {
  routeDestination.value = poiName
  activeTab.value = 'route'
  showFeedback('Destination selected. Static directions will be enabled in Plan 012.')
}

function toggleFavorite(id: number) {
  favoritePoiIds.value = favoritePoiIds.value.includes(id)
    ? favoritePoiIds.value.filter(poiId => poiId !== id)
    : [...favoritePoiIds.value, id]
}

function isFavorite(id: number) {
  return favoritePoiIds.value.includes(id)
}

function showViewerToolStatus(message: string) {
  viewerToolStatus.value = message
  showFeedback(message)
}

function toggleLayer(key: keyof typeof layerState) {
  layerState[key] = !layerState[key]
  showViewerToolStatus(`${key === 'geofence' ? 'Geofences' : key.charAt(0).toUpperCase() + key.slice(1)} ${layerState[key] ? 'shown' : 'hidden'} locally.`)
}

const tabItems = [
  { label: 'Explore', value: 'explore' as const },
  { label: 'Route', value: 'route' as const },
  { label: 'Layers', value: 'layers' as const }
]

const { handleTabKey } = useTabKeyboard()

function handleViewerStatus(state: 'loading' | 'ready' | 'error') {
  viewerState.value = state
}

const viewerStatus = computed(() => ({
  loading: { label: 'Loading', color: 'warning' as const },
  ready: { label: 'Ready', color: 'success' as const },
  error: { label: 'Unavailable', color: 'error' as const }
}[viewerState.value]))

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Map' })
</script>

<template>
  <div class="map-workspace -m-4 flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden border border-default bg-default sm:-m-6 lg:-m-8 lg:min-h-[calc(100vh-4rem)] lg:flex-row">
    <aside class="flex w-full shrink-0 flex-col border-b border-default bg-default lg:w-80 lg:border-b-0 lg:border-r">
      <div class="border-b border-default p-4">
        <div class="mb-3 flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-highlighted">Indoor map</p>
            <p class="mt-1 text-xs text-muted">Main building · live viewer</p>
          </div>
          <UBadge :color="viewerStatus.color" variant="soft" class="shrink-0">
            <span class="mr-1.5 size-1.5 rounded-full bg-current" aria-hidden="true" />
            {{ viewerStatus.label }}
          </UBadge>
        </div>
        <div class="grid grid-cols-3 gap-1 rounded-lg bg-elevated p-1" role="tablist" aria-label="Map tools">
          <button
            v-for="(tab, index) in tabItems"
            :key="tab.value"
            :data-map-tab="tab.value"
            type="button"
            role="tab"
            :aria-selected="activeTab === tab.value"
            :tabindex="activeTab === tab.value ? 0 : -1"
            class="rounded-md px-2 py-2 text-xs font-medium text-muted transition hover:text-highlighted"
            :class="activeTab === tab.value ? 'bg-default text-highlighted shadow-xs' : ''"
            @keydown="handleTabKey($event, index, tabItems.length, nextIndex => activeTab = tabItems[nextIndex]!.value, '[data-map-tab]')"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="min-h-0 flex-1 overflow-auto p-4">
        <div v-if="activeTab === 'explore'" role="tabpanel">
          <UAlert v-if="cartographyError" color="error" variant="subtle" title="Map cartography unavailable" description="No fixture buildings or POIs are shown." />
          <UAlert v-else-if="cartographyStatus === 'pending'" color="neutral" variant="subtle" title="Loading map data" description="Reading buildings, floors and POIs from Situm." />
          <UInput v-model="poiSearch" icon="i-lucide-search" placeholder="Search POIs or categories…" aria-label="Search POIs or categories" />
          <div class="mt-3 space-y-2">
            <button v-for="poi in filteredPois" :key="poi.id" type="button" class="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition hover:bg-elevated" :class="selectedPoiId === poi.id ? 'border-primary bg-elevated' : 'border-default'" :aria-pressed="selectedPoiId === poi.id" @click="selectPoi(poi)">
              <span class="grid size-8 shrink-0 place-items-center rounded-lg bg-elevated text-xs font-semibold text-highlighted" aria-hidden="true">{{ poi.name[0] }}</span>
              <span class="min-w-0 flex-1"><strong class="block truncate text-xs text-highlighted">{{ poi.name }}</strong><span class="mt-1 block text-[11px] text-muted">{{ poi.categoryName || 'Uncategorized' }} · Floor {{ poi.floorId }}</span></span>
              <UIcon v-if="isFavorite(poi.id)" name="i-lucide-star" class="size-3.5 text-warning" aria-label="Favorite" /><span class="text-muted" aria-hidden="true">›</span>
            </button>
            <p v-if="filteredPois.length === 0" class="py-4 text-center text-xs text-muted">No POIs match this filter.</p>
          </div>
          <div class="my-4 border-t border-default" />
          <div class="flex items-center justify-between text-xs"><span class="text-muted">Favorite POIs</span><UButton :label="showFavorites ? 'Show all POIs' : 'Show favorites'" color="neutral" variant="ghost" size="xs" @click="showFavorites = !showFavorites" /></div>
        </div>

        <div v-else-if="activeTab === 'route'" role="tabpanel" class="space-y-4">
          <UFormField label="Start"><USelect v-model="routeStart" :items="routeOptions" class="w-full" /></UFormField>
          <UFormField label="Destination"><USelect v-model="routeDestination" :items="routeOptions" class="w-full" /></UFormField>
          <UCheckbox v-model="accessibleRoute" label="Prefer accessible floor changes" />
          <UAlert color="neutral" variant="subtle" title="Static directions are planned" description="The viewer supports verified static directions; Plan 012 will connect this selection to the single Viewer instance." />
        </div>

        <div v-else role="tabpanel" class="space-y-1">
          <p class="mb-3 text-xs text-muted">Viewer overlays and tools</p>
          <div v-for="item in [{ key: 'realtime', label: 'Realtime positions', hint: 'Live people/device overlay' }, { key: 'geofence', label: 'Geofences', hint: 'Spatial zones and boundaries' }, { key: 'trajectory', label: 'Trajectory', hint: 'Playback a recent route' }]" :key="item.key" class="flex items-center justify-between gap-3 border-b border-default py-3 last:border-0">
            <span><strong class="block text-xs text-highlighted">{{ item.label }}</strong><span class="mt-1 block text-[11px] text-muted">{{ item.hint }}</span></span>
            <USwitch :model-value="layerState[item.key as keyof typeof layerState]" :aria-label="item.label" @update:model-value="toggleLayer(item.key as keyof typeof layerState)" />
          </div>
          <UAlert class="mt-3" color="neutral" variant="subtle" title="Additional Viewer commands are planned" description="Plan 016 owns verified location-picker, search, camera and accessibility commands. No local success state is shown here." />
          <p v-if="viewerToolStatus" class="map-feedback" role="status">{{ viewerToolStatus }}</p>
        </div>
      </div>
    </aside>

    <section class="relative min-h-[34rem] min-w-0 flex-1 bg-elevated sm:min-h-[38rem] lg:min-h-0">
      <div class="absolute left-3 right-3 top-3 z-10 flex flex-wrap items-center justify-between gap-2 sm:left-6 sm:right-6 sm:top-4">
        <div class="flex min-w-0 max-w-full flex-wrap items-center gap-1 rounded-lg border border-default bg-default/95 p-1 shadow-sm backdrop-blur">
          <USelect :model-value="selectedBuildingId ?? undefined" :items="buildingOptions" value-key="value" label-key="label" aria-label="Building" class="w-36 sm:w-44" size="sm" @update:model-value="selectBuilding" />
          <div class="flex max-w-full overflow-x-auto rounded-md bg-elevated p-0.5">
            <UButton v-for="floor in activeFloors" :key="floor.id" :label="floor.name" :color="selectedFloor?.id === floor.id ? 'primary' : 'neutral'" :variant="selectedFloor?.id === floor.id ? 'soft' : 'ghost'" size="xs" @click="selectFloor(floor.id)" />
          </div>
        </div>
        <div class="flex max-w-full overflow-x-auto rounded-lg border border-default bg-default/95 p-1 shadow-sm backdrop-blur">
          <UButton v-for="mode in (['explore', 'realtime', 'trajectory'] as const)" :key="mode" :label="mode.charAt(0).toUpperCase() + mode.slice(1)" :color="viewMode === mode ? 'primary' : 'neutral'" :variant="viewMode === mode ? 'soft' : 'ghost'" size="xs" @click="selectViewMode(mode)" />
        </div>
      </div>
      <div class="h-full min-h-[34rem] p-2 sm:min-h-[38rem] sm:p-3 lg:min-h-0">
        <SitumViewer ref="viewer" class="h-full" @status="handleViewerStatus" />
      </div>
      <div class="absolute bottom-6 right-6 z-10 flex flex-col overflow-hidden rounded-lg border border-default bg-default/95 shadow-sm backdrop-blur">
          <UButton icon="i-lucide-locate-fixed" aria-label="Reset map view locally" color="neutral" variant="ghost" @click="centerMap" />
        <UButton label="+" aria-label="Zoom in locally" color="neutral" variant="ghost" :disabled="zoomLevel === 4" @click="adjustZoom(1)" />
        <UButton label="−" aria-label="Zoom out locally" color="neutral" variant="ghost" :disabled="zoomLevel === 0" @click="adjustZoom(-1)" />
      </div>
      <UCard v-if="selectedPoi" class="absolute right-6 top-20 z-10 w-60 shadow-lg" :ui="{ body: 'p-3' }">
        <div class="flex items-start justify-between gap-3">
          <div><p class="font-semibold text-highlighted">{{ selectedPoi.name }}</p><p class="mt-1 text-xs text-muted">{{ selectedPoi.categoryName || 'Uncategorized' }} · Floor {{ selectedPoi.floorId }} · {{ selectedBuilding }}</p></div>
          <UButton icon="i-lucide-x" aria-label="Close POI details" color="neutral" variant="ghost" size="xs" @click="selectedPoiId = null" />
        </div>
        <p class="mt-3 text-xs text-muted">{{ selectedPoi.info || 'No additional information provided.' }}</p>
        <div class="mt-4 flex flex-wrap gap-2"><UButton label="Directions" color="info" size="sm" @click="openDirections(selectedPoi.name)" /><UButton :label="isFavorite(selectedPoi.id) ? '★ Favorited' : '☆ Favorite'" color="neutral" variant="soft" size="sm" @click="toggleFavorite(selectedPoi.id)" /></div>
      </UCard>
    </section>
  </div>
</template>

<style scoped>
.map-workspace { min-height: calc(100vh - 6.5rem); border-radius: 1rem; }
.map-workspace > aside { width: 320px; }
.map-workspace > section { min-height: calc(100vh - 6.5rem); }
.map-feedback { margin-top: 0.75rem; border-radius: 0.625rem; background: var(--explore-foreground); color: #fff; padding: 0.625rem 0.75rem; font-size: 0.6875rem; line-height: 1.4; }
.map-workspace [role='tablist'] button { min-height: 2rem; font-size: 0.6875rem; }
.map-workspace .map-poi-row { min-height: 3.125rem; }
@media (max-width: 1100px) {
  .map-workspace > aside { width: 280px; }
}
@media (max-width: 1023px) {
  .map-workspace { min-height: calc(100vh - 5rem); border-radius: 0; }
  .map-workspace > aside, .map-workspace > section { width: 100%; min-height: 0; }
  .map-workspace > aside { max-height: 25rem; }
  .map-workspace > section { min-height: 34rem; }
}
@media (max-width: 639px) {
  .map-workspace > aside { max-height: none; }
  .map-workspace > section { min-height: 31rem; }
}
</style>

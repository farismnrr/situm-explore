<script setup lang="ts">
import type { SitumCartographyPoi, SitumCartographyResponse } from '#shared/situm-cartography'
import { RouteType } from '@situm/sdk-js'

const activeTab = ref<'explore' | 'route' | 'layers'>('explore')
const sidebarCollapsed = ref(false)
const isDesktopViewport = useDesktopViewport()
const viewerState = ref<'loading' | 'ready' | 'error'>('loading')
const poiSearch = ref('')
const showFavorites = ref(false)
const favoritePoiIds = ref<number[]>([])
const selectedPoiId = ref<number | null>(null)
const routeStart = ref<number | undefined>(undefined)
const routeDestination = ref<number | undefined>(undefined)
const accessibleRoute = ref(false)
const routeFeedback = ref('')
const routeRequestPending = ref(false)
const routeRequested = ref(false)
const layerState = reactive({ realtime: true, geofence: false, trajectory: false })
const viewerToolStatus = ref('')
const viewer = ref<{
  selectBuilding: (id: number) => Promise<void>
  selectFloor: (id: number) => Promise<void>
  selectPoi: (id: number) => Promise<void>
  startDirections: (from: number, to: number, routeType?: RouteType) => Promise<void>
  cancelDirections: () => Promise<void>
} | null>(null)
const { showFeedback } = useExploreFeedback()
const { data: cartography, error: cartographyError, status: cartographyStatus } = await useFetch<SitumCartographyResponse>('/api/situm/cartography')
const buildings = computed(() => cartography.value?.buildings ?? [])
const floors = computed(() => cartography.value?.floors ?? [])
const pois = computed(() => cartography.value?.pois ?? [])
const selectedBuildingId = ref<number | null>(null)
const selectedFloorId = ref<number | null>(null)

const activeBuilding = computed(() => buildings.value.find(building => building.id === selectedBuildingId.value) ?? buildings.value[0] ?? null)
const activeFloors = computed(() => floors.value.filter(floor => floor.buildingId === activeBuilding.value?.id))
const selectedBuilding = computed(() => activeBuilding.value?.name ?? 'No building')

watch([buildings, activeFloors], () => {
  if (selectedBuildingId.value === null && buildings.value[0]) selectedBuildingId.value = buildings.value[0].id
  if (!activeFloors.value.some(floor => floor.id === selectedFloorId.value)) selectedFloorId.value = activeFloors.value[0]?.id ?? null
}, { immediate: true })

const routePois = computed(() => pois.value.filter(poi => poi.buildingId === activeBuilding.value?.id))
const routeOptions = computed(() => routePois.value.map(poi => ({ label: poi.name, value: poi.id })))

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

function openDirections(poiId: number) {
  routeDestination.value = poiId
  activeTab.value = 'route'
  routeFeedback.value = ''
}

async function startRoute() {
  if (routeRequestPending.value) return
  if (viewerState.value !== 'ready' || !viewer.value) {
    routeFeedback.value = 'The map viewer is not ready.'
    return
  }
  if (routeStart.value === undefined || routeDestination.value === undefined) {
    routeFeedback.value = 'Select a start and destination POI.'
    return
  }
  if (routeStart.value === routeDestination.value) {
    routeFeedback.value = 'Choose different start and destination POIs.'
    return
  }

  const from = routeStart.value
  const to = routeDestination.value
  routeRequestPending.value = true
  routeFeedback.value = routeRequested.value ? 'Replacing directions…' : 'Requesting directions…'
  try {
    await viewer.value.startDirections(from, to, accessibleRoute.value ? RouteType.ONLY_ACCESSIBLE : undefined)
    routeRequested.value = true
    routeFeedback.value = 'Directions request sent to the map viewer. Route availability depends on the map data.'
  } catch (error) {
    routeFeedback.value = error instanceof Error ? error.message : 'Directions could not be requested.'
  } finally {
    routeRequestPending.value = false
  }
}

async function clearRoute() {
  if (routeRequestPending.value) return
  if (viewerState.value !== 'ready' || !viewer.value) {
    routeFeedback.value = 'The map viewer is not ready.'
    return
  }
  try {
    await viewer.value.cancelDirections()
    routeRequested.value = false
    routeFeedback.value = 'Directions cleared.'
  } catch (error) {
    routeFeedback.value = error instanceof Error ? error.message : 'Directions could not be cleared.'
  }
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

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Map', fullWidth: true })
</script>

<template>
  <div v-if="!isDesktopViewport" class="map-desktop-required -m-4 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 border border-default bg-default p-8 text-center sm:-m-6 lg:-m-8">
    <UIcon name="i-lucide-monitor" class="size-9 text-muted" aria-hidden="true" />
    <div>
      <p class="text-sm font-semibold text-highlighted">Desktop required</p>
      <p class="mt-1.5 max-w-xs text-xs leading-5 text-muted">The Map Viewer needs more screen space than a mobile device can offer. Please open this page on a desktop or a tablet in landscape mode.</p>
    </div>
    <UButton to="/app" label="Back to home" color="neutral" variant="outline" size="sm" />
  </div>

  <div v-else class="map-workspace -m-4 flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden border border-default bg-default sm:-m-6 lg:-m-8 lg:min-h-[calc(100vh-4rem)] lg:flex-row">
    <aside v-show="!sidebarCollapsed" class="flex w-full shrink-0 flex-col border-b border-default bg-default lg:w-80 lg:border-b-0 lg:border-r">
      <div class="border-b border-default p-4">
        <div class="mb-3 flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-highlighted">Indoor map</p>
            <p class="mt-1 text-xs text-muted">Main building · live viewer</p>
          </div>
          <div class="flex shrink-0 items-center gap-1.5">
            <UBadge :color="viewerStatus.color" variant="soft" class="shrink-0">
              <span class="mr-1.5 size-1.5 rounded-full bg-current" aria-hidden="true" />
              {{ viewerStatus.label }}
            </UBadge>
            <UButton icon="i-lucide-panel-left-close" aria-label="Hide sidebar" color="neutral" variant="ghost" size="xs" class="hidden lg:inline-flex" @click="sidebarCollapsed = true" />
          </div>
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
          <UInput v-model="poiSearch" icon="i-lucide-search" placeholder="Search POIs or categories…" aria-label="Search POIs or categories" class="w-full" />
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
          <UCheckbox v-model="accessibleRoute" label="Use accessible floor changes only" :disabled="routeRequestPending" />
          <p class="text-[11px] leading-4 text-muted">Uses the verified accessible route type. A route is not guaranteed if the map cannot estimate one.</p>
          <div class="flex flex-wrap gap-2">
            <UButton :label="routeRequestPending ? 'Requesting…' : routeRequested ? 'Replace route' : 'Request directions'" icon="i-lucide-navigation" color="primary" :loading="routeRequestPending" :disabled="viewerState !== 'ready' || routeRequestPending" @click="startRoute" />
            <UButton label="Cancel directions" color="neutral" variant="soft" :disabled="viewerState !== 'ready' || routeRequestPending" @click="clearRoute" />
          </div>
          <p v-if="routeFeedback" class="map-feedback" role="status" aria-live="polite">{{ routeFeedback }}</p>
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

    <section class="relative flex min-h-[34rem] min-w-0 flex-1 flex-col bg-elevated sm:min-h-[38rem] lg:min-h-0">
      <UButton v-if="sidebarCollapsed" icon="i-lucide-panel-left-open" aria-label="Show sidebar" color="neutral" variant="solid" size="sm" class="absolute left-3 top-3 z-10 hidden shadow-sm lg:inline-flex" @click="sidebarCollapsed = false" />
      <div class="min-h-0 flex-1 p-2 sm:p-3">
        <SitumViewer ref="viewer" class="h-full" @status="handleViewerStatus" />
      </div>
      <UCard v-if="selectedPoi" class="absolute right-6 top-6 z-10 w-64 shadow-lg" :ui="{ body: 'p-4' }">
        <div class="flex items-start justify-between gap-3">
          <div><p class="font-semibold text-highlighted">{{ selectedPoi.name }}</p><p class="mt-1 text-xs text-muted">{{ selectedPoi.categoryName || 'Uncategorized' }} · Floor {{ selectedPoi.floorId }} · {{ selectedBuilding }}</p></div>
          <UButton icon="i-lucide-x" aria-label="Close POI details" color="neutral" variant="ghost" size="xs" @click="selectedPoiId = null" />
        </div>
        <p class="mt-3 text-xs text-muted">{{ selectedPoi.info || 'No additional information provided.' }}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <UButton label="Directions" icon="i-lucide-navigation" color="info" size="sm" @click="openDirections(selectedPoi.id)" />
          <UButton :label="isFavorite(selectedPoi.id) ? 'Favorited' : 'Favorite'" :icon="isFavorite(selectedPoi.id) ? 'i-lucide-star' : 'i-lucide-star-off'" color="neutral" variant="soft" size="sm" @click="toggleFavorite(selectedPoi.id)" />
        </div>
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

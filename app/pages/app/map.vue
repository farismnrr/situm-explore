<script setup lang="ts">
import { homeBuilding, homePois } from '~/data/prototype/home'

const activeTab = ref<'explore' | 'route' | 'layers'>('explore')
const viewerState = ref<'loading' | 'ready' | 'error'>('loading')
const poiSearch = ref('')
const showFavorites = ref(false)
const favoritePoiIds = ref<string[]>(['reception'])
const selectedPoiId = ref<string | null>('reception')
const routeStart = ref('Reception')
const routeDestination = ref('Meeting Room A')
const accessibleRoute = ref(false)
const routeCalculated = ref(false)
const routeStatus = ref('')
const layerState = reactive({ realtime: true, geofence: false, trajectory: false, follow: false })
const locationPickerOpen = ref(false)
const viewerSettingsOpen = ref(false)
const accessibleNavigation = ref(false)
const largeInterfaceText = ref(false)
const highContrastCues = ref(false)
const viewerToolStatus = ref('')
const mapSearchFilter = ref(false)
const savedCar = ref(false)

const routeOptions = computed(() => ['My location', ...homePois.map(poi => poi.name)])
const routeSteps = computed(() => accessibleRoute.value
  ? ['Walk straight past reception for 28 m', 'Take the lift at the workspace corridor', `${routeDestination.value} is on your left`]
  : ['Walk straight past reception for 28 m', 'Turn right at the workspace corridor', `${routeDestination.value} is on your left`])

const filteredPois = computed(() => homePois.filter((poi) => {
  const query = poiSearch.value.trim().toLowerCase()
  const matchesSearch = !query || [poi.name, poi.category, poi.floor].some(value => value.toLowerCase().includes(query))
  return matchesSearch && (!showFavorites.value || favoritePoiIds.value.includes(poi.id))
}))

const selectedPoi = computed(() => homePois.find(poi => poi.id === selectedPoiId.value) ?? null)

function selectPoi(id: string) {
  selectedPoiId.value = id
}

function toggleFavorite(id: string) {
  favoritePoiIds.value = favoritePoiIds.value.includes(id)
    ? favoritePoiIds.value.filter(poiId => poiId !== id)
    : [...favoritePoiIds.value, id]
}

function isFavorite(id: string) {
  return favoritePoiIds.value.includes(id)
}

function calculateRoute() {
  routeCalculated.value = true
  routeStatus.value = 'Local route preview generated; no navigation service was contacted.'
}

function startLocalNavigation() {
  routeStatus.value = 'Navigation is a local preview only; no live directions were started.'
}

function showViewerToolStatus(message: string) {
  viewerToolStatus.value = message
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
            v-for="tab in tabItems"
            :key="tab.value"
            type="button"
            role="tab"
            :aria-selected="activeTab === tab.value"
            class="rounded-md px-2 py-2 text-xs font-medium text-muted transition hover:text-highlighted"
            :class="activeTab === tab.value ? 'bg-default text-highlighted shadow-xs' : ''"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="min-h-0 flex-1 overflow-auto p-4">
        <div v-if="activeTab === 'explore'" role="tabpanel">
          <UInput v-model="poiSearch" icon="i-lucide-search" placeholder="Search POIs or categories…" aria-label="Search POIs or categories" />
          <div class="mt-3 space-y-2">
            <button v-for="poi in filteredPois" :key="poi.id" type="button" class="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition hover:bg-elevated" :class="selectedPoiId === poi.id ? 'border-primary bg-elevated' : 'border-default'" :aria-pressed="selectedPoiId === poi.id" @click="selectPoi(poi.id)">
              <span class="grid size-8 shrink-0 place-items-center rounded-lg bg-elevated text-xs font-semibold text-highlighted" aria-hidden="true">{{ poi.name[0] }}</span>
              <span class="min-w-0 flex-1"><strong class="block truncate text-xs text-highlighted">{{ poi.name }}</strong><span class="mt-1 block text-[11px] text-muted">{{ poi.category }} · {{ poi.floor }}</span></span>
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
          <UButton label="Calculate route" block @click="calculateRoute" />

          <UAlert v-if="routeStatus" color="info" variant="soft" :description="routeStatus" />
          <UCard v-if="routeCalculated" :ui="{ body: 'p-3' }">
            <div class="flex items-center justify-between gap-3">
              <strong class="text-xs text-highlighted">Local preview · 4 min · 86 m</strong>
              <UBadge color="info" variant="soft">{{ accessibleRoute ? 'Accessible preview' : 'Shortest preview' }}</UBadge>
            </div>
            <p class="mt-2 text-[11px] text-muted">{{ routeStart }} → {{ routeDestination }} · dummy route data</p>
            <div class="mt-3 space-y-2">
              <div v-for="(step, index) in routeSteps" :key="step" class="grid grid-cols-[18px_1fr] gap-2 text-[11px] text-muted">
                <span class="grid size-[18px] place-items-center rounded-full bg-elevated text-[10px] font-semibold text-highlighted">{{ index + 1 }}</span>
                <span>{{ step }}</span>
              </div>
            </div>
            <UButton class="mt-3 w-full" label="Start local preview" color="neutral" variant="soft" size="sm" @click="startLocalNavigation" />
          </UCard>
        </div>

        <div v-else role="tabpanel" class="space-y-1">
          <p class="mb-3 text-xs text-muted">Viewer overlays and tools</p>
          <div v-for="item in [{ key: 'realtime', label: 'Realtime positions', hint: 'Live people/device overlay' }, { key: 'geofence', label: 'Geofences', hint: 'Spatial zones and boundaries' }, { key: 'trajectory', label: 'Trajectory', hint: 'Playback a recent route' }, { key: 'follow', label: 'Follow user', hint: 'Keep selected user centered' }]" :key="item.key" class="flex items-center justify-between gap-3 border-b border-default py-3 last:border-0">
            <span><strong class="block text-xs text-highlighted">{{ item.label }}</strong><span class="mt-1 block text-[11px] text-muted">{{ item.hint }}</span></span>
            <USwitch :model-value="layerState[item.key as keyof typeof layerState]" :aria-label="item.label" @update:model-value="toggleLayer(item.key as keyof typeof layerState)" />
          </div>
          <UButton label="Open location picker" block color="neutral" variant="soft" size="sm" class="mt-3" @click="locationPickerOpen = true" />
          <UButton label="Viewer accessibility settings" block color="neutral" variant="soft" size="sm" class="mt-2" @click="viewerSettingsOpen = true" />
          <div class="my-3 border-t border-default" />
          <p class="mb-2 text-[11px] text-muted">More viewer tools</p>
          <div class="grid grid-cols-2 gap-2">
            <UButton label="Save car" color="neutral" variant="soft" size="sm" @click="savedCar = true; showViewerToolStatus('Car position saved locally.')" />
            <UButton label="Navigate to car" color="neutral" variant="soft" size="sm" :disabled="!savedCar" @click="showViewerToolStatus('Dummy navigation to the saved car started locally.')" />
            <UButton label="Select flight" color="neutral" variant="soft" size="sm" @click="showViewerToolStatus('Flight selection opened locally.')" />
            <UButton :label="mapSearchFilter ? 'Clear filter' : 'Search filter'" color="neutral" variant="soft" size="sm" @click="mapSearchFilter = !mapSearchFilter; showViewerToolStatus(mapSearchFilter ? 'Local search filter applied.' : 'Local search filter cleared.')" />
            <UButton :label="largeInterfaceText ? 'Font size −' : 'Font size + '" color="neutral" variant="soft" size="sm" @click="largeInterfaceText = !largeInterfaceText; showViewerToolStatus('Viewer font size preference changed locally.')" />
            <UButton label="Set user location" color="neutral" variant="soft" size="sm" @click="showViewerToolStatus('User location updated locally.')" />
          </div>
          <UAlert v-if="viewerToolStatus" class="mt-3" color="info" variant="soft" :description="viewerToolStatus" />
        </div>
      </div>
    </aside>

    <section class="relative min-h-[34rem] min-w-0 flex-1 bg-elevated sm:min-h-[38rem] lg:min-h-0">
      <div class="absolute left-4 right-4 top-4 z-10 flex flex-wrap items-center justify-between gap-2 sm:left-6 sm:right-6">
        <div class="flex items-center gap-2 rounded-lg border border-default bg-default/95 p-1 shadow-sm backdrop-blur">
          <USelect :items="['Main Building', 'Warehouse', 'Demo Venue']" model-value="Main Building" aria-label="Building" class="w-36" size="sm" />
          <div class="flex rounded-md bg-elevated p-0.5"><UButton label="Floor 1" color="primary" variant="soft" size="xs" /><UButton label="Floor 2" color="neutral" variant="ghost" size="xs" /></div>
        </div>
        <div class="flex rounded-lg border border-default bg-default/95 p-1 shadow-sm backdrop-blur"><UButton label="Explore" color="primary" variant="soft" size="xs" /><UButton label="Realtime" color="neutral" variant="ghost" size="xs" /><UButton label="Trajectory" color="neutral" variant="ghost" size="xs" /></div>
      </div>
      <div class="h-full min-h-[34rem] p-2 sm:min-h-[38rem] sm:p-3 lg:min-h-0">
        <SitumViewer class="h-full" @status="handleViewerStatus" />
      </div>
      <div class="absolute bottom-6 left-6 z-10 flex flex-col overflow-hidden rounded-lg border border-default bg-default/95 shadow-sm backdrop-blur"><UButton icon="i-lucide-locate-fixed" aria-label="Center map" color="neutral" variant="ghost" /><UButton label="+" aria-label="Zoom in" color="neutral" variant="ghost" /><UButton label="−" aria-label="Zoom out" color="neutral" variant="ghost" /></div>
      <UCard v-if="selectedPoi" class="absolute bottom-6 right-6 z-10 w-72 shadow-lg" :ui="{ body: 'p-4' }">
        <div class="flex items-start justify-between gap-3">
          <div><p class="font-semibold text-highlighted">{{ selectedPoi.name }}</p><p class="mt-1 text-xs text-muted">{{ selectedPoi.category }} · {{ selectedPoi.floor }} · {{ homeBuilding.name }}</p></div>
          <UButton icon="i-lucide-x" aria-label="Close POI details" color="neutral" variant="ghost" size="xs" @click="selectedPoiId = null" />
        </div>
        <p class="mt-3 text-xs text-muted">{{ selectedPoi.description }}</p>
        <div class="mt-4 flex gap-2"><UButton label="Directions" color="primary" size="sm" /><UButton :label="isFavorite(selectedPoi.id) ? '★ Favorited' : '☆ Favorite'" color="neutral" variant="soft" size="sm" @click="toggleFavorite(selectedPoi.id)" /></div>
      </UCard>
      <UCard v-if="locationPickerOpen" class="absolute left-1/2 top-1/2 z-20 w-72 -translate-x-1/2 -translate-y-1/2 shadow-lg" :ui="{ body: 'p-4' }">
        <div class="flex items-start justify-between gap-3"><div><p class="font-semibold text-highlighted">Location picker</p><p class="mt-1 text-xs text-muted">Choose a local preview point on Floor 1.</p></div><UButton icon="i-lucide-x" aria-label="Close location picker" color="neutral" variant="ghost" size="xs" @click="locationPickerOpen = false" /></div>
        <div class="mt-4 rounded-lg border border-dashed border-primary bg-elevated p-4 text-center text-xs text-muted">Local map point · 41.387, 2.169</div>
        <UButton class="mt-3 w-full" label="Use this location" size="sm" @click="locationPickerOpen = false; showViewerToolStatus('Selected map location stored locally.')" />
      </UCard>
    </section>
  <UModal v-model:open="viewerSettingsOpen" title="Viewer accessibility settings">
    <template #body>
      <div class="space-y-4">
        <UCheckbox v-model="accessibleNavigation" label="Accessible navigation" description="Prefer lifts and accessible floor changes in local previews." />
        <UCheckbox v-model="largeInterfaceText" label="Large interface text" description="Increase viewer text size locally." />
        <UCheckbox v-model="highContrastCues" label="High contrast cues" description="Increase local control distinction." />
      </div>
    </template>
    <template #footer><UButton label="Done" class="ml-auto" @click="viewerSettingsOpen = false; showViewerToolStatus('Viewer preferences saved locally.')" /></template>
  </UModal>
  </div>
</template>

<script setup lang="ts">
import { cartographyBuildings, cartographyPois, type PrototypePoi } from '~/data/prototype/cartography'

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Points of interest' })

const query = ref('')
const categoryFilter = ref<'All categories' | PrototypePoi['category']>('All categories')
const selectedPoi = ref<PrototypePoi | null>(null)
const drawerOpen = ref(false)
const favoriteIds = ref(new Set(cartographyPois.filter(poi => poi.favorite).map(poi => poi.id)))

const categoryOptions = ['All categories', 'Services', 'Rooms', 'Workspace', 'Access']
const buildingNames = new Map(cartographyBuildings.map(building => [building.id, building.name]))

const filteredPois = computed(() => {
  const search = query.value.trim().toLowerCase()
  return cartographyPois.filter((poi) => {
    const matchesSearch = !search || [poi.name, poi.category, poi.floor, poi.externalId].some(value => value.toLowerCase().includes(search))
    const matchesCategory = categoryFilter.value === 'All categories' || poi.category === categoryFilter.value
    return matchesSearch && matchesCategory
  })
})

function openDetails(poi: PrototypePoi) {
  selectedPoi.value = poi
  drawerOpen.value = true
}

function toggleFavorite(poi: PrototypePoi) {
  const next = new Set(favoriteIds.value)
  if (next.has(poi.id)) next.delete(poi.id)
  else next.add(poi.id)
  favoriteIds.value = next
}

function closeDetails() {
  drawerOpen.value = false
}
</script>

<template>
  <div class="mx-auto max-w-6xl">
    <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p class="eyebrow">Cartography</p>
        <h1 class="mt-1 text-2xl font-semibold tracking-tight text-highlighted">Points of interest</h1>
        <p class="mt-2 text-sm text-muted">Search destinations, categories and floor placement.</p>
      </div>
      <UButton to="/app/map" icon="i-lucide-map" class="w-fit">View on map</UButton>
    </div>

    <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-col gap-2 sm:flex-row">
        <UInput v-model="query" icon="i-lucide-search" placeholder="Search POIs…" aria-label="Search POIs" class="w-full sm:w-72" />
        <USelect v-model="categoryFilter" :items="categoryOptions" aria-label="Filter by category" class="w-full sm:w-44" />
      </div>
      <div class="flex items-center gap-2 text-xs text-muted"><UBadge color="neutral" variant="soft">{{ filteredPois.length }} of {{ cartographyPois.length }} POIs</UBadge><span class="hidden sm:inline">Local fixture · read only</span></div>
    </div>

    <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
      <div class="hidden overflow-x-auto md:block">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-default bg-elevated/40 text-xs text-muted"><tr><th class="px-5 py-3 font-medium">Name</th><th class="px-4 py-3 font-medium">Category</th><th class="px-4 py-3 font-medium">Building</th><th class="px-4 py-3 font-medium">Floor</th><th class="px-4 py-3 font-medium">External ID</th><th class="w-14 px-4 py-3 text-center">Favorite</th></tr></thead>
          <tbody class="divide-y divide-default">
            <tr v-for="poi in filteredPois" :key="poi.id" class="group transition hover:bg-elevated/40">
              <td class="px-5 py-3.5"><button class="text-left font-medium text-highlighted hover:text-primary" @click="openDetails(poi)">{{ poi.name }}<span class="mt-0.5 block text-xs font-normal text-muted">{{ poi.description }}</span></button></td>
              <td class="px-4 py-3.5"><UBadge color="neutral" variant="soft">{{ poi.category }}</UBadge></td><td class="px-4 py-3.5 text-muted">{{ buildingNames.get(poi.buildingId) }}</td><td class="px-4 py-3.5 text-muted">{{ poi.floor }}</td><td class="px-4 py-3.5 font-mono text-xs text-muted">{{ poi.externalId }}</td>
              <td class="px-4 py-3.5 text-center"><UButton :icon="favoriteIds.has(poi.id) ? 'i-lucide-star' : 'i-lucide-star-off'" :color="favoriteIds.has(poi.id) ? 'warning' : 'neutral'" variant="ghost" size="xs" :aria-label="favoriteIds.has(poi.id) ? `Remove ${poi.name} from favorites` : `Add ${poi.name} to favorites`" @click="toggleFavorite(poi)" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="divide-y divide-default md:hidden">
        <div v-for="poi in filteredPois" :key="poi.id" class="flex items-center gap-3 p-4">
          <button class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary" :aria-label="`Open ${poi.name} details`" @click="openDetails(poi)"><UIcon name="i-lucide-map-pin" /></button>
          <button class="min-w-0 flex-1 text-left" @click="openDetails(poi)"><strong class="block truncate text-sm text-highlighted">{{ poi.name }}</strong><span class="mt-1 block truncate text-xs text-muted">{{ poi.category }} · {{ poi.floor }}</span></button>
          <UButton :icon="favoriteIds.has(poi.id) ? 'i-lucide-star' : 'i-lucide-star-off'" :color="favoriteIds.has(poi.id) ? 'warning' : 'neutral'" variant="ghost" size="xs" :aria-label="favoriteIds.has(poi.id) ? `Remove ${poi.name} from favorites` : `Add ${poi.name} to favorites`" @click="toggleFavorite(poi)" />
        </div>
      </div>
      <p v-if="filteredPois.length === 0" class="px-5 py-10 text-center text-sm text-muted">No POIs match your filters.</p>
    </UCard>

    <USlideover v-model:open="drawerOpen" title="POI details" description="Local cartography fixture details." :ui="{ content: 'sm:max-w-md' }">
      <template #body>
        <div v-if="selectedPoi" class="space-y-6">
          <div><UBadge color="neutral" variant="soft">{{ selectedPoi.category }}</UBadge><h2 class="mt-3 text-xl font-semibold text-highlighted">{{ selectedPoi.name }}</h2><p class="mt-1 text-sm text-muted">{{ selectedPoi.description }}</p></div>
          <dl class="divide-y divide-default border-y border-default text-sm"><div class="flex justify-between gap-4 py-3"><dt class="text-muted">Identifier</dt><dd class="font-mono text-xs text-highlighted">{{ selectedPoi.id }}</dd></div><div class="flex justify-between gap-4 py-3"><dt class="text-muted">Building</dt><dd class="text-right text-highlighted">{{ buildingNames.get(selectedPoi.buildingId) }}</dd></div><div class="flex justify-between gap-4 py-3"><dt class="text-muted">Floor</dt><dd class="text-highlighted">{{ selectedPoi.floor }}</dd></div><div class="flex justify-between gap-4 py-3"><dt class="text-muted">External ID</dt><dd class="font-mono text-xs text-highlighted">{{ selectedPoi.externalId }}</dd></div><div class="flex justify-between gap-4 py-3"><dt class="text-muted">Access</dt><dd><UBadge color="neutral" variant="soft">Read only</UBadge></dd></div></dl>
          <UButton to="/app/map" block @click="closeDetails">View on map</UButton>
        </div>
      </template>
    </USlideover>
  </div>
</template>

<style scoped>
.eyebrow { color: var(--ui-text-muted); font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; }
</style>

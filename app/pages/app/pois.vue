<script setup lang="ts">
import type { SitumCartographyPoi, SitumCartographyResponse } from '#shared/situm-cartography'

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Points of interest' })

const query = ref('')
const categoryFilter = ref('All categories')
const selectedPoi = ref<SitumCartographyPoi | null>(null)
const drawerOpen = ref(false)
const { data, error, status, refresh } = await useFetch<SitumCartographyResponse>(useWorkspaceEndpoint('/situm/cartography'), { immediate: false })
onMounted(() => { if (useWorkspaceContext().selectedWorkspaceId.value) refresh() })

const pois = computed(() => data.value?.pois ?? [])
const categories = computed(() => ['All categories', ...(data.value?.categories ?? []).map(category => category.name)])
const buildingNames = computed(() => new Map((data.value?.buildings ?? []).map(building => [building.id, building.name])))
const floorNames = computed(() => new Map((data.value?.floors ?? []).map(floor => [floor.id, floor.name])))
const filteredPois = computed(() => {
  const search = query.value.trim().toLowerCase()
  return pois.value.filter(poi => {
    const matchesSearch = !search || [poi.name, poi.categoryName, poi.info, String(poi.id)].some(value => value.toLowerCase().includes(search))
    const matchesCategory = categoryFilter.value === 'All categories' || poi.categoryName === categoryFilter.value
    return matchesSearch && matchesCategory
  })
})

function openDetails(poi: SitumCartographyPoi) {
  selectedPoi.value = poi
  drawerOpen.value = true
}
</script>

<template>
  <div class="cartography-page">
    <ProductPageHeader eyebrow="Cartography" title="Points of interest" description="Search real Situm destinations, categories and floor placement.">
      <template #actions><UButton to="/app/map" icon="i-lucide-map">View on map</UButton></template>
    </ProductPageHeader>

    <UAlert v-if="error" class="mb-4" color="error" variant="subtle" title="POIs unavailable" description="The authenticated Situm cartography read could not be loaded. No fixture POIs are shown." />
    <UAlert v-else-if="status === 'pending'" class="mb-4" color="neutral" variant="subtle" title="Loading POIs" description="Reading POIs and categories from Situm." />

    <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-col gap-2 sm:flex-row"><UInput v-model="query" icon="i-lucide-search" placeholder="Search POIs…" aria-label="Search POIs" class="w-full sm:w-72" /><USelect v-model="categoryFilter" :items="categories" aria-label="Filter by category" class="w-full sm:w-48" /></div>
      <UBadge color="neutral" variant="soft">{{ filteredPois.length }} POIs</UBadge>
    </div>

    <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
      <div class="hidden overflow-x-auto md:block"><table class="table-density w-full text-left"><thead class="border-b border-default bg-elevated/40 text-xs text-muted"><tr><th class="px-5 py-3 font-medium">Name</th><th class="px-4 py-3 font-medium">Category</th><th class="px-4 py-3 font-medium">Building</th><th class="px-4 py-3 font-medium">Floor</th><th class="px-4 py-3 font-medium">ID</th></tr></thead><tbody class="divide-y divide-default"><tr v-for="poi in filteredPois" :key="poi.id" class="group transition hover:bg-elevated/40"><td><button class="text-left font-semibold text-highlighted hover:text-info" @click="openDetails(poi)">{{ poi.name }}<span v-if="poi.info" class="mt-0.5 block text-[10px] font-normal text-muted">{{ poi.info }}</span></button></td><td class="text-muted">{{ poi.categoryName || 'Uncategorized' }}</td><td class="text-muted">{{ buildingNames.get(poi.buildingId) ?? poi.buildingId }}</td><td class="text-muted">{{ floorNames.get(poi.floorId) ?? poi.floorId }}</td><td class="font-mono text-[10px] text-muted">{{ poi.id }}</td></tr></tbody></table></div>
      <div class="divide-y divide-default md:hidden"><button v-for="poi in filteredPois" :key="poi.id" class="flex w-full items-center gap-3 p-4 text-left" @click="openDetails(poi)"><span class="grid size-9 shrink-0 place-items-center rounded-lg bg-info/10 text-info"><UIcon name="i-lucide-map-pin" /></span><span class="min-w-0 flex-1"><strong class="block truncate text-sm text-highlighted">{{ poi.name }}</strong><span class="mt-1 block truncate text-xs text-muted">{{ poi.categoryName || 'Uncategorized' }} · {{ floorNames.get(poi.floorId) ?? poi.floorId }}</span></span><UIcon name="i-lucide-chevron-right" class="text-muted" /></button></div>
      <p v-if="status !== 'pending' && filteredPois.length === 0" class="px-5 py-10 text-center text-sm text-muted">No real POIs match your filters.</p>
    </UCard>

    <CartographyDetailsDrawer v-if="selectedPoi" v-model:open="drawerOpen" title="POI details" :type="selectedPoi.categoryName || 'POI'" :name="selectedPoi.name" :subtitle="selectedPoi.info || 'Situm point of interest'" map-to="/app/map" :details="[{ label: 'Identifier', value: String(selectedPoi.id) }, { label: 'Building', value: buildingNames.get(selectedPoi.buildingId) ?? String(selectedPoi.buildingId) }, { label: 'Floor', value: floorNames.get(selectedPoi.floorId) ?? String(selectedPoi.floorId) }, { label: 'Type', value: selectedPoi.type }]" />
  </div>
</template>

<style scoped>
.eyebrow { color: var(--ui-text-muted); font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; }
.cartography-page { max-width: 1480px; }
</style>

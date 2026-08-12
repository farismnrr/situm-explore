<script setup lang="ts">
import { cartographyBuildings, type PrototypeBuilding } from '~/data/prototype/cartography'

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Buildings & floors' })

const query = ref('')
const statusFilter = ref<'All statuses' | PrototypeBuilding['status']>('All statuses')
const selectedBuilding = ref<PrototypeBuilding | null>(null)
const drawerOpen = ref(false)

const filteredBuildings = computed(() => {
  const search = query.value.trim().toLowerCase()
  return cartographyBuildings.filter((building) => {
    const matchesSearch = !search || [building.name, building.id, building.organization].some(value => value.toLowerCase().includes(search))
    const matchesStatus = statusFilter.value === 'All statuses' || building.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const coverageBuilding = computed(() => selectedBuilding.value ?? cartographyBuildings[0]!)
const floorCount = computed(() => cartographyBuildings.reduce((total, building) => total + building.floors.length, 0))
const statusOptions = ['All statuses', 'Ready', 'Partial']

function openDetails(building: PrototypeBuilding) {
  selectedBuilding.value = building
  drawerOpen.value = true
}

</script>

<template>
  <div class="cartography-page">
    <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p class="eyebrow">Cartography</p>
        <h1 class="mt-1 text-2xl font-semibold tracking-tight text-highlighted">Buildings &amp; floors</h1>
        <p class="mt-2 text-sm text-muted">Local inventory of venue and floor metadata.</p>
      </div>
    </div>

    <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-col gap-2 sm:flex-row">
        <UInput v-model="query" icon="i-lucide-search" placeholder="Search buildings…" aria-label="Search buildings" class="w-full sm:w-72" />
        <USelect v-model="statusFilter" :items="statusOptions" aria-label="Filter by map status" class="w-full sm:w-40" />
      </div>
      <span class="text-xs text-muted">{{ filteredBuildings.length }} of {{ cartographyBuildings.length }} buildings · {{ floorCount }} floors</span>
    </div>

    <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
      <div class="hidden overflow-x-auto md:block">
        <table class="table-density w-full text-left">
          <thead class="border-b border-default bg-elevated/40 text-xs text-muted">
            <tr><th class="px-5 py-3 font-medium">Building</th><th class="px-4 py-3 font-medium">ID</th><th class="px-4 py-3 font-medium">Floors</th><th class="px-4 py-3 font-medium">Map status</th><th class="px-4 py-3 font-medium">POIs</th><th class="w-12 px-4 py-3" /></tr>
          </thead>
          <tbody class="divide-y divide-default">
            <tr v-for="building in filteredBuildings" :key="building.id" class="group transition hover:bg-elevated/40">
              <td><button class="text-left font-semibold text-highlighted hover:text-primary" @click="openDetails(building)">{{ building.name }}<span class="mt-0.5 block text-[10px] font-normal text-muted">{{ building.organization }}</span></button></td>
              <td class="font-mono text-[10px] text-muted">{{ building.id }}</td><td class="text-muted">{{ building.floors.length }}</td>
              <td><UBadge :color="building.status === 'Ready' ? 'success' : 'warning'" variant="soft">{{ building.status }}</UBadge></td>
              <td class="text-muted">{{ building.poiCount }}</td><td><UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" size="xs" aria-label="Open building details" @click="openDetails(building)" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="divide-y divide-default md:hidden">
        <button v-for="building in filteredBuildings" :key="building.id" class="flex w-full items-center gap-3 p-4 text-left transition hover:bg-elevated/40" @click="openDetails(building)">
          <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><UIcon name="i-lucide-building-2" /></span><span class="min-w-0 flex-1"><strong class="block truncate text-sm text-highlighted">{{ building.name }}</strong><span class="mt-1 block text-xs text-muted">{{ building.floors.length }} floors · {{ building.poiCount }} POIs</span></span><UBadge :color="building.status === 'Ready' ? 'success' : 'warning'" variant="soft">{{ building.status }}</UBadge><UIcon name="i-lucide-chevron-right" class="text-muted" />
        </button>
      </div>
      <p v-if="filteredBuildings.length === 0" class="px-5 py-10 text-center text-sm text-muted">No buildings match your filters.</p>
    </UCard>

    <div class="mt-4 grid gap-4 lg:grid-cols-2">
      <UCard :ui="{ body: 'p-0 sm:p-0' }">
        <div class="flex items-center justify-between border-b border-default px-5 py-4"><div><h2 class="font-semibold text-highlighted">Floor coverage</h2><span class="text-xs text-muted">{{ coverageBuilding.name }}</span></div><UBadge color="neutral" variant="soft">{{ coverageBuilding.floors.length }} floors</UBadge></div>
        <div class="divide-y divide-default"><div v-for="floor in coverageBuilding.floors" :key="floor.id" class="flex items-center gap-3 px-5 py-3"><span class="size-2 rounded-full" :class="floor.mapStatus === 'Ready' ? 'bg-success' : 'bg-warning'" /><div class="min-w-0 flex-1"><strong class="block text-sm text-highlighted">{{ floor.name }} · {{ floor.id }}</strong><span class="block text-xs text-muted">{{ floor.floorplan }} floorplan · {{ floor.poiCount }} POIs · {{ floor.geofenceCount }} geofences</span></div><UBadge :color="floor.mapStatus === 'Ready' ? 'success' : 'warning'" variant="soft" size="sm">{{ floor.mapStatus }}</UBadge></div></div>
      </UCard>
      <UCard>
        <div class="flex items-center justify-between border-b border-default pb-4"><h2 class="font-semibold text-highlighted">Cartography resources</h2><span class="text-xs text-muted">Local context</span></div>
        <div class="divide-y divide-default text-sm"><div class="flex items-center justify-between py-3"><span class="text-muted">Vector map</span><UBadge :color="coverageBuilding.resources.vectorMap === 'Available' ? 'success' : 'warning'" variant="soft">{{ coverageBuilding.resources.vectorMap }}</UBadge></div><div class="flex items-center justify-between py-3"><span class="text-muted">Map style</span><strong class="text-highlighted">{{ coverageBuilding.resources.mapStyle }}</strong></div><div class="flex items-center justify-between pt-3"><span class="text-muted">Raster tiles</span><UBadge :color="coverageBuilding.resources.rasterTiles === 'Available' ? 'success' : 'warning'" variant="soft">{{ coverageBuilding.resources.rasterTiles }}</UBadge></div></div>
      </UCard>
    </div>

    <CartographyDetailsDrawer v-if="selectedBuilding" v-model:open="drawerOpen" title="Building details" type="Building" :name="selectedBuilding.name" :subtitle="selectedBuilding.organization" :map-to="'/app/map'" :details="[{ label: 'Identifier', value: selectedBuilding.id }, { label: 'Map status', value: selectedBuilding.status }, { label: 'Floors', value: String(selectedBuilding.floors.length) }, { label: 'Points of interest', value: String(selectedBuilding.poiCount) }]">
      <div><h3 class="mb-3 text-sm font-semibold text-highlighted">Floor inventory</h3><div class="space-y-2"><div v-for="floor in selectedBuilding.floors" :key="floor.id" class="rounded-lg border border-default p-3"><div class="flex items-center justify-between"><strong class="text-sm text-highlighted">{{ floor.name }}</strong><UBadge :color="floor.mapStatus === 'Ready' ? 'success' : 'warning'" variant="soft" size="sm">{{ floor.mapStatus }}</UBadge></div><p class="mt-1 text-xs text-muted">{{ floor.poiCount }} POIs · {{ floor.geofenceCount }} geofences</p></div></div></div>
    </CartographyDetailsDrawer>
  </div>
</template>

<style scoped>
.eyebrow { color: var(--ui-text-muted); font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; }
.cartography-page { max-width: 1480px; }
</style>

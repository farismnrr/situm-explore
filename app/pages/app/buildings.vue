<script setup lang="ts">
import type { SitumCartographyBuilding, SitumCartographyResponse } from '#shared/situm-cartography'

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Buildings & floors' })

const query = ref('')
const selectedBuilding = ref<SitumCartographyBuilding | null>(null)
const drawerOpen = ref(false)
const { data, error, status } = await useFetch<SitumCartographyResponse>('/api/situm/cartography')

const buildings = computed(() => data.value?.buildings ?? [])
const floors = computed(() => data.value?.floors ?? [])
const filteredBuildings = computed(() => {
  const search = query.value.trim().toLowerCase()
  return buildings.value.filter(building => !search || [building.name, String(building.id), building.description].some(value => value.toLowerCase().includes(search)))
})
const floorsFor = (buildingId: number) => floors.value.filter(floor => floor.buildingId === buildingId)

function openDetails(building: SitumCartographyBuilding) {
  selectedBuilding.value = building
  drawerOpen.value = true
}
</script>

<template>
  <div class="cartography-page">
    <ProductPageHeader eyebrow="Cartography" title="Buildings & floors" description="Live Situm venue and floor metadata." />

    <UAlert v-if="error" class="mb-4" color="error" variant="subtle" title="Buildings unavailable" description="The authenticated Situm cartography read could not be loaded. No fixture buildings are shown." />
    <UAlert v-else-if="status === 'pending'" class="mb-4" color="neutral" variant="subtle" title="Loading buildings" description="Reading buildings and floors from Situm." />

    <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <UInput v-model="query" icon="i-lucide-search" placeholder="Search buildings…" aria-label="Search buildings" class="w-full sm:w-72" />
      <span class="text-xs text-muted">{{ filteredBuildings.length }} buildings · {{ floors.length }} floors</span>
    </div>

    <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
      <div class="hidden overflow-x-auto md:block">
        <table class="table-density w-full text-left">
          <thead class="border-b border-default bg-elevated/40 text-xs text-muted"><tr><th class="px-5 py-3 font-medium">Building</th><th class="px-4 py-3 font-medium">ID</th><th class="px-4 py-3 font-medium">Floors</th><th class="w-12 px-4 py-3" /></tr></thead>
          <tbody class="divide-y divide-default">
            <tr v-for="building in filteredBuildings" :key="building.id" class="group transition hover:bg-elevated/40">
              <td><button class="text-left font-semibold text-highlighted hover:text-info" @click="openDetails(building)">{{ building.name }}<span v-if="building.description" class="mt-0.5 block text-[10px] font-normal text-muted">{{ building.description }}</span></button></td>
              <td class="font-mono text-[10px] text-muted">{{ building.id }}</td><td class="text-muted">{{ floorsFor(building.id).length }}</td>
              <td><UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" size="xs" aria-label="Open building details" @click="openDetails(building)" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="divide-y divide-default md:hidden">
        <button v-for="building in filteredBuildings" :key="building.id" class="flex w-full items-center gap-3 p-4 text-left transition hover:bg-elevated/40" @click="openDetails(building)">
          <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-info/10 text-info"><UIcon name="i-lucide-building-2" /></span><span class="min-w-0 flex-1"><strong class="block truncate text-sm text-highlighted">{{ building.name }}</strong><span class="mt-1 block text-xs text-muted">{{ floorsFor(building.id).length }} floors</span></span><UIcon name="i-lucide-chevron-right" class="text-muted" />
        </button>
      </div>
      <p v-if="status !== 'pending' && filteredBuildings.length === 0" class="px-5 py-10 text-center text-sm text-muted">No real buildings match your filter.</p>
    </UCard>

    <CartographyDetailsDrawer v-if="selectedBuilding" v-model:open="drawerOpen" title="Building details" type="Building" :name="selectedBuilding.name" :subtitle="selectedBuilding.description || 'Situm building'" :map-to="`/app/map?buildingId=${selectedBuilding.id}`" :details="[{ label: 'Identifier', value: String(selectedBuilding.id) }, { label: 'Floors', value: String(floorsFor(selectedBuilding.id).length) }, { label: 'Latitude', value: String(selectedBuilding.location.lat) }, { label: 'Longitude', value: String(selectedBuilding.location.lng) }]">
      <div><h3 class="mb-3 text-sm font-semibold text-highlighted">Floor inventory</h3><div class="space-y-2"><div v-for="floor in floorsFor(selectedBuilding.id)" :key="floor.id" class="soft-card p-3"><div class="flex items-center justify-between"><strong class="text-sm text-highlighted">{{ floor.name }}</strong><span class="text-xs text-muted">Level {{ floor.level }}</span></div><p class="mt-1 text-xs text-muted">Floor ID {{ floor.id }}</p></div></div></div>
    </CartographyDetailsDrawer>
  </div>
</template>

<style scoped>
.eyebrow { color: var(--ui-text-muted); font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; }
.cartography-page { max-width: 1480px; }
</style>

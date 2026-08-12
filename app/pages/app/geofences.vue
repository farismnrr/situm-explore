<script setup lang="ts">
import { cartographyBuildings, cartographyGeofences, type PrototypeGeofence } from '~/data/prototype/cartography'

const search = ref('')
const typeFilter = ref<'All types' | PrototypeGeofence['type']>('All types')
const selectedGeofenceId = ref<string | null>(null)

const filteredGeofences = computed(() => {
  const query = search.value.trim().toLowerCase()

  return cartographyGeofences.filter((geofence) => {
    const matchesSearch = !query || [geofence.name, geofence.floor, geofence.type].some(value => value.toLowerCase().includes(query))
    const matchesType = typeFilter.value === 'All types' || geofence.type === typeFilter.value
    return matchesSearch && matchesType
  })
})

const selectedGeofence = computed(() => cartographyGeofences.find(geofence => geofence.id === selectedGeofenceId.value) ?? null)
const longestStay = computed(() => cartographyGeofences.reduce((longest, geofence) => Number.parseInt(geofence.averageStay) > Number.parseInt(longest.averageStay) ? geofence : longest, cartographyGeofences[0]!))
const activeBuildingCount = computed(() => new Set(cartographyGeofences.filter(geofence => geofence.status === 'Active').map(geofence => geofence.buildingId)).size)

function openDetails(geofence: PrototypeGeofence) {
  selectedGeofenceId.value = geofence.id
}

function closeDetails() {
  selectedGeofenceId.value = null
}

function buildingName(buildingId: string) {
  return cartographyBuildings.find(building => building.id === buildingId)?.name ?? 'Unknown building'
}

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Geofences' })
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div>
        <p class="eyebrow">Cartography</p>
        <h1 class="mt-2 text-2xl font-semibold tracking-tight text-highlighted">Geofences</h1>
        <p class="mt-1 max-w-2xl text-sm text-muted">Spatial zones used for occupancy, visit and stay-time context.</p>
      </div>
      <UButton to="/app/map?overlay=geofences" icon="i-lucide-map" label="Show on map" class="shrink-0" />
    </div>

    <div class="grid gap-4 sm:grid-cols-3">
      <UCard><p class="text-sm text-muted">Active zones</p><p class="mt-2 text-2xl font-semibold text-highlighted">{{ cartographyGeofences.filter(geofence => geofence.status === 'Active').length }}</p><p class="mt-1 text-xs text-muted">across {{ activeBuildingCount }} buildings</p></UCard>
      <UCard><p class="text-sm text-muted">Sessions today</p><p class="mt-2 text-2xl font-semibold text-highlighted">214</p><p class="mt-1 text-xs text-muted">enter / exit matches · dummy</p></UCard>
      <UCard><p class="text-sm text-muted">Longest avg. stay</p><p class="mt-2 text-2xl font-semibold text-highlighted">{{ longestStay.averageStay }}</p><p class="mt-1 text-xs text-muted">{{ longestStay.name }}</p></UCard>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-col gap-2 sm:flex-row">
        <UInput v-model="search" icon="i-lucide-search" placeholder="Search geofences…" aria-label="Search geofences" class="sm:w-64" />
        <USelect v-model="typeFilter" :items="['All types', 'Workspace', 'Room']" aria-label="Filter by geofence type" class="sm:w-40" />
      </div>
      <UBadge color="neutral" variant="soft">{{ filteredGeofences.length }} of {{ cartographyGeofences.length }} zones</UBadge>
    </div>

    <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
      <div class="hidden overflow-x-auto md:block">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-default bg-elevated/40 text-xs text-muted"><tr><th class="px-5 py-3 font-medium">Geofence</th><th class="px-4 py-3 font-medium">Building</th><th class="px-4 py-3 font-medium">Floor</th><th class="px-4 py-3 font-medium">Type</th><th class="px-4 py-3 font-medium">Avg. stay</th><th class="px-4 py-3 font-medium">Status</th><th class="w-10 px-4 py-3" /></tr></thead>
          <tbody class="divide-y divide-default">
            <tr v-for="geofence in filteredGeofences" :key="geofence.id" class="transition hover:bg-elevated/40">
              <td class="px-5 py-4"><button type="button" class="text-left font-medium text-highlighted hover:text-primary" @click="openDetails(geofence)">{{ geofence.name }}<span class="mt-0.5 block font-mono text-xs font-normal text-muted">{{ geofence.id }}</span></button></td>
              <td class="px-4 py-4 text-muted">{{ buildingName(geofence.buildingId) }}</td><td class="px-4 py-4 text-muted">{{ geofence.floor }}</td><td class="px-4 py-4 text-muted">{{ geofence.type }}</td><td class="px-4 py-4 text-muted">{{ geofence.averageStay }}</td><td class="px-4 py-4"><UBadge :color="geofence.status === 'Active' ? 'success' : 'neutral'" variant="soft">{{ geofence.status }}</UBadge></td><td class="px-4 py-4"><UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" size="xs" aria-label="Open geofence details" @click="openDetails(geofence)" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="divide-y divide-default md:hidden">
        <button v-for="geofence in filteredGeofences" :key="geofence.id" type="button" class="flex w-full items-center gap-3 p-4 text-left transition hover:bg-elevated/40" @click="openDetails(geofence)"><span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><UIcon name="i-lucide-map-pin" /></span><span class="min-w-0 flex-1"><strong class="block truncate text-sm text-highlighted">{{ geofence.name }}</strong><span class="mt-1 block text-xs text-muted">{{ geofence.floor }} · {{ geofence.type }} · {{ geofence.averageStay }}</span></span><UBadge color="success" variant="soft">{{ geofence.status }}</UBadge><UIcon name="i-lucide-chevron-right" class="text-muted" /></button>
      </div>
      <p v-if="filteredGeofences.length === 0" class="px-5 py-10 text-center text-sm text-muted">No geofences match your filters.</p>
    </UCard>

    <CartographyDetailsDrawer v-if="selectedGeofence" :open="true" title="Geofence details" :type="selectedGeofence.type" :name="selectedGeofence.name" :subtitle="`${buildingName(selectedGeofence.buildingId)} · ${selectedGeofence.floor}`" map-to="/app/map?overlay=geofences" :details="[{ label: 'Identifier', value: selectedGeofence.id }, { label: 'Average stay', value: selectedGeofence.averageStay }, { label: 'Status', value: selectedGeofence.status }]" @update:open="closeDetails">
      <UAlert color="info" variant="soft" title="Dummy data" description="Session and stay-time context is local fixture data for this UI preview." />
    </CartographyDetailsDrawer>
  </div>
</template>

<style scoped>
.eyebrow { color: var(--ui-text-muted); font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; }
</style>

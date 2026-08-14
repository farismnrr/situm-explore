<script setup lang="ts">
import type { SitumGeofencesResponse, SitumGeofence } from '#shared/situm-geofences'

const selectedGeofenceId = ref<string | null>(null)
const { selectedWorkspaceId } = useWorkspaceContext()
const { data, error, status, refresh } = await useFetch<SitumGeofencesResponse>(useWorkspaceEndpoint('/situm/geofences'), { immediate: false })
watch(selectedWorkspaceId, (workspaceId) => { if (workspaceId) refresh() }, { immediate: true })
const geofences = computed(() => data.value?.geofences ?? [])

const filteredGeofences = computed(() => geofences.value)

const selectedGeofence = computed(() => geofences.value.find(geofence => geofence.id === selectedGeofenceId.value) ?? null)
const activeBuildingCount = computed(() => new Set(geofences.value.map(geofence => geofence.buildingId)).size)

function openDetails(geofence: SitumGeofence) {
  selectedGeofenceId.value = geofence.id
}

function closeDetails() {
  selectedGeofenceId.value = null
}

function buildingName(buildingId: string) { return buildingId }

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Geofences' })
</script>

<template>
  <div class="cartography-page space-y-6">
    <ProductPageHeader eyebrow="Cartography" title="Geofences" description="Spatial zones used for occupancy, visit and stay-time context.">
      <template #actions><UButton to="/app/map?overlay=geofences" icon="i-lucide-map" label="Show on map" /></template>
    </ProductPageHeader>
    <UAlert v-if="error" color="error" variant="subtle" title="Geofences unavailable" description="The authenticated Situm geofence read failed. No fixture zones are shown." />
    <div v-else-if="String(status) === 'pending'" class="space-y-2" aria-label="Loading geofences" aria-busy="true"><USkeleton class="h-4 w-44" /><USkeleton class="h-3 w-72" /></div>

    <div class="grid gap-4 sm:grid-cols-2">
      <ProductStatCard label="Geofences" :value="geofences.length" :note="`across ${activeBuildingCount} buildings`" />
    </div>

    <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
      <div class="hidden overflow-x-auto md:block">
        <table class="table-density w-full text-left">
          <thead class="border-b border-default bg-elevated/40 text-xs text-muted"><tr><th class="px-5 py-3 font-medium">Geofence</th><th class="px-4 py-3 font-medium">Building</th><th class="px-4 py-3 font-medium">Floor</th><th class="px-4 py-3 font-medium">Type</th><th class="px-4 py-3 font-medium">Status</th><th class="w-10 px-4 py-3" /></tr></thead>
          <tbody class="divide-y divide-default">
            <tr v-for="geofence in filteredGeofences" :key="geofence.id" class="transition hover:bg-elevated/40">
              <td class="px-5 py-4"><button type="button" class="text-left font-medium text-highlighted hover:text-info" @click="openDetails(geofence)">{{ geofence.name }}<span class="mt-0.5 block font-mono text-xs font-normal text-muted">{{ geofence.id }}</span></button></td>
              <td class="px-4 py-4 text-muted">{{ buildingName(geofence.buildingId) }}</td><td class="px-4 py-4 text-muted">{{ geofence.floorId }}</td><td class="px-4 py-4 text-muted">{{ geofence.type }}</td><td class="px-4 py-4"><ProductStatusBadge label="Available" tone="success" /></td><td class="px-4 py-4"><UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" size="xs" aria-label="Open geofence details" @click="openDetails(geofence)" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="divide-y divide-default md:hidden">
        <button v-for="geofence in filteredGeofences" :key="geofence.id" type="button" class="flex w-full items-center gap-3 p-4 text-left transition hover:bg-elevated/40" @click="openDetails(geofence)"><span class="grid size-9 shrink-0 place-items-center rounded-lg bg-info/10 text-info"><UIcon name="i-lucide-map-pin" /></span><span class="min-w-0 flex-1"><strong class="block truncate text-sm text-highlighted">{{ geofence.name }}</strong><span class="mt-1 block text-xs text-muted">Floor {{ geofence.floorId }} · {{ geofence.type }}</span></span><ProductStatusBadge label="Available" tone="success" /><UIcon name="i-lucide-chevron-right" class="text-muted" /></button>
      </div>
      <p v-if="String(status) === 'success' && filteredGeofences.length === 0" class="px-5 py-10 text-center text-sm text-muted">No geofences match your filters.</p>
    </UCard>

    <CartographyDetailsDrawer v-if="selectedGeofence" :open="true" title="Geofence details" :type="selectedGeofence.type" :name="selectedGeofence.name" :subtitle="`${buildingName(selectedGeofence.buildingId)} · Floor ${selectedGeofence.floorId}`" map-to="/app/map?overlay=geofences" :details="[{ label: 'Identifier', value: selectedGeofence.id }, { label: 'Type', value: selectedGeofence.type }]" @update:open="closeDetails" />
  </div>
</template>

<style scoped>
.eyebrow { color: var(--ui-text-muted); font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; }
.cartography-page { max-width: 1480px; }
</style>

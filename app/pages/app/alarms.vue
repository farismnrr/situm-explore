<script setup lang="ts">
import type { SitumCartographyResponse } from '#shared/situm-cartography'
import type { SitumAlarm, SitumAlarmResponse, SitumAlarmsResponse } from '#shared/situm-groups-alarms'

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Alarms' })

type ActiveFilter = 'all' | 'true' | 'false'

const buildingId = ref('')
const active = ref<ActiveFilter>('all')
const type = ref('')
const selectedAlarm = ref<SitumAlarm | null>(null)
const detailOpen = ref(false)

const { selectedWorkspaceId } = useWorkspaceContext()
const { data: cartography, error: buildingsError, refresh: refreshCartography } = await useFetch<SitumCartographyResponse>(useWorkspaceEndpoint('/situm/cartography'), { immediate: false })
const buildings = computed(() => cartography.value?.buildings ?? [])
const buildingItems = computed(() => buildings.value.map(building => ({ label: `${building.name} · ${building.id}`, value: String(building.id) })))
const buildingNames = computed(() => new Map(buildings.value.map(building => [building.id, building.name])))
const floorNames = computed(() => new Map((cartography.value?.floors ?? []).map(floor => [floor.id, floor.name])))
const alarmTypes = ['BREACH', 'DANGER', 'DEADMAN', 'EMERGENCY', 'STATIONARY', 'GEOFENCE_MAX_STAY_TIME', 'ASSISTANCE_REQUEST']
const typeItems = computed(() => [{ label: 'All types', value: '' }, ...alarmTypes.map(value => ({ label: value, value }))])
const query = computed(() => ({ building_id: buildingId.value, ...(active.value !== 'all' ? { active: active.value } : {}), ...(type.value ? { type: type.value } : {}) }))
const { data, error, status, refresh } = await useFetch<SitumAlarmsResponse>(useWorkspaceEndpoint('/situm/alarms'), { query, immediate: false })
watch(selectedWorkspaceId, (workspaceId) => { if (workspaceId) refreshCartography() }, { immediate: true })
const alarms = computed(() => data.value?.alarms ?? [])

watch(buildings, (value) => {
  if (!buildingId.value && value[0]) {
    buildingId.value = String(value[0].id)
    refresh()
  }
}, { immediate: true })

function buildingName(id: number) { return buildingNames.value.get(id) ?? String(id) }
function floorName(id: number) { return floorNames.value.get(id) ?? String(id) }
function openDetails(alarm: SitumAlarm) {
  selectedAlarm.value = alarm
  detailOpen.value = true
}
async function loadAlarms() {
  if (buildingId.value) await refresh()
}
async function loadDetail(alarm: SitumAlarm) {
  openDetails(alarm)
  try {
  const response = await $fetch<SitumAlarmResponse>(`${useWorkspaceEndpoint('/situm/alarms').value}/${encodeURIComponent(alarm.uuid)}`)
    selectedAlarm.value = response.alarm
  } catch {
    // Keep the verified list row available if its detail is no longer readable.
  }
}
</script>

<template>
  <div class="operations-page space-y-6">
    <ProductPageHeader eyebrow="Operations" title="Alarms" description="Read-only operational alarm context from Situm.">
      <template #actions><ProductStatusBadge :label="error ? 'Unavailable' : `${alarms.length} alarms`" :tone="error ? 'error' : 'success'" /></template>
    </ProductPageHeader>

    <UCard>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-end">
        <UFormField label="Building" required><USelect v-model="buildingId" :items="buildingItems" value-key="value" aria-label="Required alarm building filter" :disabled="!buildingItems.length" /></UFormField>
        <UFormField label="Active"><USelect v-model="active" :items="[{ label: 'All alarms', value: 'all' }, { label: 'Active only', value: 'true' }, { label: 'Inactive only', value: 'false' }]" value-key="value" aria-label="Filter alarms by active state" /></UFormField>
        <UFormField label="Type"><USelect v-model="type" :items="typeItems" value-key="value" aria-label="Filter alarms by type" /></UFormField>
        <UButton label="Apply filters" icon="i-lucide-filter" color="neutral" variant="outline" :loading="String(status) === 'pending'" :disabled="!buildingId" @click="loadAlarms" />
      </div>
    </UCard>

    <UAlert v-if="buildingsError" color="error" variant="subtle" title="Buildings unavailable" description="The required building filter could not be loaded." />
    <UAlert v-else-if="status === 'pending'" color="neutral" variant="subtle" title="Loading alarms" description="Reading alarms for the selected building from Situm." />
    <UAlert v-else-if="error" color="error" variant="subtle" title="Alarms unavailable" description="The protected Situm alarms read failed. No fixture rows are shown." />
    <UAlert v-else-if="!buildingId" color="neutral" variant="subtle" title="Select a building" description="A building is required before alarms can be read." />

    <UCard v-else :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
      <div class="hidden overflow-x-auto md:block">
        <table class="table-density w-full text-left">
          <thead class="border-b border-default bg-elevated/40 text-xs text-muted"><tr><th class="px-5 py-3 font-medium">Type</th><th class="px-4 py-3 font-medium">Current state</th><th class="px-4 py-3 font-medium">Active</th><th class="px-4 py-3 font-medium">Created</th><th class="px-4 py-3 font-medium">Context</th><th class="w-12 px-4 py-3" /></tr></thead>
          <tbody class="divide-y divide-default">
            <tr v-for="alarm in alarms" :key="alarm.uuid" class="transition hover:bg-elevated/40">
              <td class="px-5 py-4 font-medium text-highlighted">{{ alarm.type }}<span class="mt-1 block font-mono text-[10px] font-normal text-muted">{{ alarm.uuid }}</span></td><td class="px-4 py-4"><ProductStatusBadge :label="alarm.currentState" :tone="alarm.active ? 'warning' : 'neutral'" /></td><td class="px-4 py-4 text-muted">{{ alarm.active ? 'true' : 'false' }}</td><td class="px-4 py-4 font-mono text-xs text-muted">{{ alarm.createdAt }}</td><td class="px-4 py-4 text-muted">{{ buildingName(alarm.buildingId) }} · {{ floorName(alarm.floorId) }}<span class="mt-1 block text-xs">{{ alarm.inside ? 'Inside' : alarm.outside ? 'Outside' : 'Location flags unavailable' }}</span></td><td class="px-4 py-4"><UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" size="xs" aria-label="Open alarm details" @click="loadDetail(alarm)" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="divide-y divide-default md:hidden"><button v-for="alarm in alarms" :key="alarm.uuid" class="flex w-full items-start gap-3 p-4 text-left" @click="loadDetail(alarm)"><span class="grid size-9 shrink-0 place-items-center rounded-lg bg-warning/10 text-warning"><UIcon name="i-lucide-triangle-alert" /></span><span class="min-w-0 flex-1"><strong class="block text-sm text-highlighted">{{ alarm.type }}</strong><span class="mt-1 block text-xs text-muted">{{ alarm.currentState }} · {{ alarm.active ? 'Active' : 'Inactive' }}</span><span class="mt-1 block text-xs text-muted">{{ buildingName(alarm.buildingId) }} · {{ floorName(alarm.floorId) }}</span></span><UIcon name="i-lucide-chevron-right" class="text-muted" /></button></div>
      <p v-if="String(status) !== 'pending' && !error && alarms.length === 0" class="px-5 py-10 text-center text-sm text-muted">No Situm alarms match the selected building and filters.</p>
    </UCard>

    <CartographyDetailsDrawer v-if="selectedAlarm" v-model:open="detailOpen" title="Alarm details" :type="selectedAlarm.type" :name="selectedAlarm.currentState" :subtitle="selectedAlarm.active ? 'Active alarm' : 'Inactive alarm'" :map-to="`/app/map?buildingId=${selectedAlarm.buildingId}&floorId=${selectedAlarm.floorId}`" :details="[{ label: 'Identifier', value: selectedAlarm.uuid }, { label: 'Building', value: buildingName(selectedAlarm.buildingId) }, { label: 'Floor', value: floorName(selectedAlarm.floorId) }, { label: 'Created', value: selectedAlarm.createdAt }, { label: 'Updated', value: selectedAlarm.updatedAt }, { label: 'Coordinates', value: `${selectedAlarm.lat}, ${selectedAlarm.lng}` }, { label: 'Inside', value: String(selectedAlarm.inside) }, { label: 'Outside', value: String(selectedAlarm.outside) }]">
      <div><h3 class="mb-3 text-sm font-semibold text-highlighted">Status changes</h3><div v-if="selectedAlarm.statusChanges.length" class="space-y-2"><div v-for="change in selectedAlarm.statusChanges" :key="`${change.state}-${change.createdAt}`" class="soft-card p-3"><strong class="text-sm text-highlighted">{{ change.state }}</strong><p class="mt-1 font-mono text-xs text-muted">{{ change.createdAt }}</p></div></div><p v-else class="text-sm text-muted">No status changes were returned.</p></div>
    </CartographyDetailsDrawer>
  </div>
</template>

<style scoped>.operations-page { max-width: 1480px; }</style>

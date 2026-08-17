<script setup lang="ts">
import type { SitumCartographyResponse } from '#shared/situm-cartography'

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Home' })

const { user } = useUserSession()
const firstName = computed(() => user.value?.email?.split('@')[0]?.split(/[._-]/)[0] || 'there')

const { selectedWorkspaceId } = useWorkspaceContext()
const { data: cartography, error: cartographyError, status: cartographyStatus, refresh: refreshCartography } = await useFetch<SitumCartographyResponse>(useWorkspaceEndpoint('/situm/cartography'), { immediate: false })
watch(selectedWorkspaceId, (workspaceId) => { if (workspaceId) refreshCartography() }, { immediate: true })
const previewBuildingId = computed(() => cartography.value?.buildings[0]?.id)
const previewBuilding = computed(() => cartography.value?.buildings[0] ?? null)
const previewFloors = computed(() => (cartography.value?.floors ?? [])
  .filter(floor => floor.buildingId === previewBuildingId.value)
  .sort((a, b) => a.level - b.level))
const selectedPreviewFloorId = ref<number | null>(null)

watch(previewFloors, (floors) => {
  if (!floors.some(floor => floor.id === selectedPreviewFloorId.value)) selectedPreviewFloorId.value = floors[0]?.id ?? null
}, { immediate: true })

const previewFloorMapUrl = computed(() => previewFloors.value.find(floor => floor.id === selectedPreviewFloorId.value)?.mapUrl || '')
const homeExplore = [
  { icon: 'i-lucide-building-2', title: 'Buildings & floors', detail: 'Browse venue and floor metadata.', to: '/app/buildings' },
  { icon: 'i-lucide-map-pin', title: 'POIs', detail: 'Search destinations and categories.', to: '/app/pois' },
  { icon: 'i-lucide-radio', title: 'Realtime', detail: 'Open native workspace positions.', to: '/app/realtime' },
  { icon: 'i-lucide-route', title: 'Directions', detail: 'Preview routes and accessibility.', to: '/app/paths' },
  { icon: 'i-lucide-bar-chart-3', title: 'Reports', detail: 'Visitors, heatmaps and stay time.', to: '/app/analytics' }
]
</script>

<template>
  <div class="home-page">
    <UCard class="welcome-card mb-4" :ui="{ body: 'p-5 sm:p-6' }">
      <div class="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p class="eyebrow">Good afternoon</p>
          <h1 class="mt-1 text-2xl font-semibold tracking-tight text-highlighted">Welcome back, {{ firstName }}.</h1>
          <p class="mt-2 max-w-xl text-sm leading-6 text-muted">{{ cartographyError ? 'Workspace data is temporarily unavailable.' : 'Explore your indoor workspace, check live positions, or browse cartography.' }}</p>
        </div>
        <div class="flex shrink-0 flex-wrap gap-2">
          <UButton to="/app/realtime" color="neutral" variant="outline">View realtime</UButton>
          <UButton to="/app/map">Open map <span aria-hidden="true">→</span></UButton>
        </div>
      </div>
    </UCard>

    <UAlert v-if="cartographyError" class="mb-4" color="error" variant="subtle" title="Workspace preview unavailable" description="The selected workspace cartography could not be loaded." />
    <div v-else-if="String(cartographyStatus) === 'pending' || !selectedWorkspaceId" class="content-grid mb-4" aria-label="Loading workspace preview" aria-busy="true">
      <UCard :ui="{ body: 'p-0' }" class="overflow-hidden"><USkeleton class="h-[15.3125rem] w-full" /></UCard>
      <UCard><div class="space-y-3"><USkeleton class="h-4 w-32" /><USkeleton class="h-3 w-full" /><USkeleton class="h-3 w-4/5" /></div></UCard>
    </div>
    <UAlert v-else-if="String(cartographyStatus) !== 'pending' && !previewBuilding" class="mb-4" color="neutral" variant="subtle" title="No building data" description="The selected workspace has not returned any buildings to preview." />

    <div v-if="String(cartographyStatus) !== 'pending' && !cartographyError && previewBuilding" class="content-grid mb-4">
      <UCard :ui="{ body: 'p-0' }" class="overflow-hidden">
        <div class="panel-head flex items-start justify-between gap-3 p-4 pb-3">
          <div><h2 class="font-semibold text-highlighted">{{ previewBuilding.name }}</h2><p class="mt-1 text-xs text-muted">{{ previewBuilding.description || 'Situm building' }}<span v-if="previewFloors[0]"> · {{ previewFloors[0].name }}</span></p></div>
          <UButton to="/app/map" size="sm" color="neutral" variant="outline">Open viewer</UButton>
        </div>
        <div class="building-preview" aria-label="Static top-down preview of the main building floor plan">
          <div v-if="previewFloors.length > 1" class="floor-switch" role="group" aria-label="Preview floor">
            <button v-for="floor in previewFloors" :key="floor.id" type="button" class="floor-switch-btn" :class="{ 'is-active': floor.id === selectedPreviewFloorId }" @click="selectedPreviewFloorId = floor.id">{{ floor.name }}</button>
          </div>
          <img v-if="previewFloorMapUrl" :src="previewFloorMapUrl" alt="" class="building-plan" draggable="false">
          <div v-else class="flex h-full items-center justify-center text-sm text-muted">No floor map image was returned.</div>
          <span class="preview-tag">Layout preview · not interactive</span>
        </div>
      </UCard>

      <UCard><div class="flex h-full items-center"><UAlert color="neutral" variant="subtle" title="Activity feed is not connected" description="The product will add report-backed activity only when a later integration provides an exact source." /></div></UCard>
    </div>

    <UCard :ui="{ body: 'p-0' }">
      <div class="panel-head"><div><h2 class="font-semibold text-highlighted">Quick explore</h2><p class="mt-1 text-xs text-muted">Common Situm web surfaces</p></div></div>
      <div class="quick-grid p-4">
        <NuxtLink v-for="item in homeExplore" :key="item.to" :to="item.to" class="quick-card soft-card p-4 transition hover:border-primary hover:bg-elevated">
          <span class="mb-4 grid size-9 place-items-center rounded-lg border border-default bg-elevated text-highlighted" aria-hidden="true"><UIcon :name="item.icon" class="size-4" /></span><strong class="block text-sm text-highlighted">{{ item.title }}</strong><span class="mt-1 block text-xs leading-5 text-muted">{{ item.detail }}</span>
        </NuxtLink>
      </div>
    </UCard>
  </div>
</template>

<style scoped>
.eyebrow { color: var(--ui-text-muted); font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; }
.welcome-card { background: linear-gradient(135deg, var(--ui-bg) 0%, var(--ui-bg-elevated) 100%); }
.stat-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.75rem; }
.content-grid { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.6fr); gap: 0.875rem; }
.building-preview { position: relative; height: 15.3125rem; overflow: hidden; user-select: none; background: var(--explore-surface-subtle); }
.building-plan { display: block; width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
.preview-tag { position: absolute; left: 0.75rem; bottom: 0.75rem; border-radius: 999px; background: var(--explore-surface); border: 1px solid var(--explore-border); padding: 0.1875rem 0.5625rem; font-size: 0.625rem; color: var(--explore-foreground-subtle); box-shadow: var(--explore-shadow-xs); }
.floor-switch { position: absolute; right: 0.75rem; top: 0.75rem; z-index: 1; display: flex; gap: 0.1875rem; border-radius: 0.5rem; background: var(--explore-surface); border: 1px solid var(--explore-border); padding: 0.1875rem; box-shadow: var(--explore-shadow-xs); }
.floor-switch-btn { border-radius: 0.375rem; padding: 0.1875rem 0.5rem; font-size: 0.6875rem; font-weight: 600; color: var(--explore-foreground-subtle); }
.floor-switch-btn.is-active { background: var(--explore-foreground); color: #fff; }
.quick-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.625rem; }
.activity-list { display: grid; }
.activity-row { display: grid; grid-template-columns: 0.5rem 1fr auto; gap: 0.5625rem; align-items: start; padding: 0.6875rem 0; border-bottom: 1px solid var(--explore-border); }
.activity-row:last-child { border-bottom: 0; }
.activity-dot { flex: 0 0 auto; width: 0.4rem; height: 0.4rem; border-radius: 999px; background: var(--ui-text-muted); }.tone-success { background: #168754; }.tone-info { background: #2563eb; }.tone-warning { background: #d97706; }
@media (max-width: 900px) { .stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) { .content-grid, .quick-grid { grid-template-columns: 1fr; } .stat-grid { grid-template-columns: 1fr; } .building-preview { padding: 0 0.75rem; } }
</style>

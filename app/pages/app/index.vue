<script setup lang="ts">
import type { SitumCartographyResponse } from '#shared/situm-cartography'
import { homeBuilding, homeExplore } from '~/data/prototype/home'

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Home' })

const { user } = useUserSession()
const firstName = computed(() => user.value?.email?.split('@')[0]?.split(/[._-]/)[0] || 'there')

const { data: cartography, refresh: refreshCartography } = await useFetch<SitumCartographyResponse>(useWorkspaceEndpoint('/situm/cartography'), { immediate: false })
onMounted(() => { if (useWorkspaceContext().selectedWorkspaceId.value) refreshCartography() })
const previewBuildingId = computed(() => cartography.value?.buildings[0]?.id)
const previewFloors = computed(() => (cartography.value?.floors ?? [])
  .filter(floor => floor.buildingId === previewBuildingId.value)
  .sort((a, b) => a.level - b.level))
const selectedPreviewFloorId = ref<number | null>(null)

watch(previewFloors, (floors) => {
  if (!floors.some(floor => floor.id === selectedPreviewFloorId.value)) selectedPreviewFloorId.value = floors[0]?.id ?? null
}, { immediate: true })

const previewFloorMapUrl = computed(() => previewFloors.value.find(floor => floor.id === selectedPreviewFloorId.value)?.mapUrl || '')
</script>

<template>
  <div class="home-page">
    <UCard class="welcome-card mb-4" :ui="{ body: 'p-5 sm:p-6' }">
      <div class="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p class="eyebrow">Good afternoon</p>
          <h1 class="mt-1 text-2xl font-semibold tracking-tight text-highlighted">Welcome back, {{ firstName }}.</h1>
          <p class="mt-2 max-w-xl text-sm leading-6 text-muted">Your indoor workspace is healthy. Pick up from the map, check live positions, or explore cartography.</p>
        </div>
        <div class="flex shrink-0 flex-wrap gap-2">
          <UButton to="/app/realtime" color="neutral" variant="outline">View realtime</UButton>
          <UButton to="/app/map">Open map <span aria-hidden="true">→</span></UButton>
        </div>
      </div>
    </UCard>

    <div class="content-grid mb-4">
      <UCard :ui="{ body: 'p-0' }" class="overflow-hidden">
        <div class="panel-head flex items-start justify-between gap-3 p-4 pb-3">
          <div><h2 class="font-semibold text-highlighted">{{ homeBuilding.name }}</h2><p class="mt-1 text-xs text-muted">{{ homeBuilding.organization }} · {{ homeBuilding.floor }}</p></div>
          <UButton to="/app/map" size="sm" color="neutral" variant="outline">Open viewer</UButton>
        </div>
        <div class="building-preview" aria-label="Static top-down preview of the main building floor plan">
          <div v-if="previewFloors.length > 1" class="floor-switch" role="group" aria-label="Preview floor">
            <button v-for="floor in previewFloors" :key="floor.id" type="button" class="floor-switch-btn" :class="{ 'is-active': floor.id === selectedPreviewFloorId }" @click="selectedPreviewFloorId = floor.id">{{ floor.name }}</button>
          </div>
          <img v-if="previewFloorMapUrl" :src="previewFloorMapUrl" alt="" class="building-plan" draggable="false">
          <svg v-else class="building-plan" viewBox="0 0 400 246" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <rect x="0" y="0" width="400" height="246" fill="var(--explore-surface-subtle)" />
            <g stroke="var(--explore-border-strong)" stroke-width="1">
              <line x1="0" y1="30" x2="400" y2="30" /><line x1="0" y1="70" x2="400" y2="70" /><line x1="0" y1="110" x2="400" y2="110" /><line x1="0" y1="150" x2="400" y2="150" /><line x1="0" y1="190" x2="400" y2="190" />
              <line x1="40" y1="0" x2="40" y2="246" /><line x1="100" y1="0" x2="100" y2="246" /><line x1="160" y1="0" x2="160" y2="246" /><line x1="220" y1="0" x2="220" y2="246" /><line x1="280" y1="0" x2="280" y2="246" /><line x1="340" y1="0" x2="340" y2="246" />
            </g>
            <rect x="26" y="24" width="348" height="198" rx="14" fill="#ffffff" stroke="var(--explore-border-strong)" stroke-width="2" />
            <g stroke="var(--explore-border)" stroke-width="1.5" fill="none">
              <rect x="46" y="44" width="110" height="72" rx="6" />
              <rect x="46" y="128" width="110" height="74" rx="6" />
              <rect x="168" y="44" width="90" height="158" rx="6" />
              <rect x="270" y="44" width="84" height="72" rx="6" />
              <rect x="270" y="128" width="84" height="74" rx="6" />
            </g>
            <g stroke="var(--explore-border)" stroke-width="1" stroke-dasharray="4 3">
              <line x1="160" y1="24" x2="160" y2="222" /><line x1="264" y1="24" x2="264" y2="222" />
            </g>
            <g>
              <circle cx="112" cy="80" r="6" fill="#2563eb" /><circle cx="112" cy="80" r="11" fill="#2563eb" fill-opacity="0.15" />
              <circle cx="212" cy="150" r="6" fill="#168754" /><circle cx="212" cy="150" r="11" fill="#168754" fill-opacity="0.15" />
              <circle cx="312" cy="90" r="6" fill="#7c3aed" /><circle cx="312" cy="90" r="11" fill="#7c3aed" fill-opacity="0.15" />
            </g>
          </svg>
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

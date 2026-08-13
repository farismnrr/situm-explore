<script setup lang="ts">
import { cartographyBuildings, cartographyPaths, cartographyPois } from '~/data/prototype/cartography'

const routeStart = ref('Reception')
const routeDestination = ref('Training Area')
const accessibleOnly = ref(false)

const routePoints = computed(() => cartographyPois.map(poi => poi.name))
const path = cartographyPaths[0]!
const building = cartographyBuildings.find(item => item.id === path.buildingId)!

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Paths & routing' })
</script>

<template>
  <div class="cartography-page space-y-6">
    <ProductPageHeader eyebrow="Routing" title="Paths & directions" description="Inspect walkable networks and preview shortest or accessible routes.">
      <template #actions><UButton to="/app/map?tab=route" icon="i-lucide-route" label="Open route planner" /></template>
    </ProductPageHeader>

    <div class="grid gap-4 lg:grid-cols-[1.4fr_.6fr]">
      <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
        <div class="flex items-center justify-between gap-3 border-b border-default px-5 py-4">
          <h2 class="text-sm font-semibold text-highlighted">Path network</h2>
          <span class="text-xs text-muted">{{ building.name }}</span>
        </div>
        <div class="flex min-h-[360px] items-center justify-center bg-elevated/30 p-6 text-center"><UAlert color="neutral" variant="subtle" title="Path visualization is planned" description="Plan 012 will use verified Situm path metadata and the real Viewer. No synthetic path network is shown here." class="max-w-md" /></div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between gap-3 border-b border-default pb-4">
          <h2 class="text-sm font-semibold text-highlighted">Route preview</h2>
          <span class="text-xs text-muted">Directions</span>
        </div>
        <div class="mt-5 space-y-4">
          <UFormField label="From"><USelect v-model="routeStart" :items="routePoints" class="w-full" /></UFormField>
          <UFormField label="To"><USelect v-model="routeDestination" :items="routePoints" class="w-full" /></UFormField>
          <UCheckbox v-model="accessibleOnly" label="Only accessible floor changes" />
          <UAlert color="neutral" variant="subtle" title="Static directions are planned" description="The installed Viewer supports static directions, but this UI will not display fixture duration or steps before Plan 012 wires the verified command." />
        </div>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
.eyebrow { color: var(--ui-text-muted); font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; }
.cartography-page { max-width: 1480px; }
</style>

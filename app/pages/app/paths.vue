<script setup lang="ts">
import { cartographyBuildings, cartographyPaths, cartographyPois, cartographyRoutePreview } from '~/data/prototype/cartography'

const routeStart = ref('Reception')
const routeDestination = ref('Training Area')
const accessibleOnly = ref(false)
const previewVisible = ref(false)

const routePoints = computed(() => ['My location', ...cartographyPois.map(poi => poi.name)])
const path = cartographyPaths[0]!
const building = cartographyBuildings.find(item => item.id === path.buildingId)!

function previewRoute() {
  previewVisible.value = true
}

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
        <div class="network-canvas" role="img" aria-label="Local path network diagram for Main Building">
          <div class="network-floor"><span class="network-line network-line--horizontal" /><span class="network-line network-line--vertical" /><span class="network-line network-line--diagonal-one" /><span class="network-line network-line--diagonal-two" /><i class="network-pin network-pin--one" /><i class="network-pin network-pin--two" /><i class="network-pin network-pin--three" /></div>
          <span class="network-caption">{{ path.name }} · {{ path.accessible ? 'Accessible network' : 'Standard network' }}</span>
        </div>
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
          <UButton block icon="i-lucide-navigation" label="Preview shortest route" @click="previewRoute" />

          <div v-if="previewVisible" class="rounded-lg border border-default bg-elevated/40 p-4" aria-live="polite">
            <div class="flex items-center justify-between gap-3">
              <strong class="text-sm text-highlighted">{{ cartographyRoutePreview.duration }} · {{ cartographyRoutePreview.distance }}</strong>
              <UBadge :color="accessibleOnly || cartographyRoutePreview.accessible ? 'info' : 'neutral'" variant="soft">{{ accessibleOnly || cartographyRoutePreview.accessible ? 'Accessible' : 'Shortest' }}</UBadge>
            </div>
            <ol class="mt-4 space-y-3">
              <li v-for="(step, index) in cartographyRoutePreview.steps" :key="step" class="flex items-start gap-3 text-sm text-muted">
                <span class="grid size-6 shrink-0 place-items-center rounded-full bg-info/10 text-xs font-semibold text-info">{{ index + 1 }}</span>
                <span class="pt-0.5">{{ step }}</span>
              </li>
            </ol>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
.eyebrow { color: var(--ui-text-muted); font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; }
.cartography-page { max-width: 1480px; }
.network-canvas { position: relative; height: 360px; overflow: hidden; background: repeating-linear-gradient(0deg,#fafbfc 0 26px,#f0f2f4 27px),repeating-linear-gradient(90deg,transparent 0 26px,#f0f2f4 27px); }
.network-floor { position: absolute; inset: 14% 13%; border: 2px solid #d6dae0; border-radius: 18px; background: #fff; transform: rotate(-2deg); }
.network-floor::before { content: ''; position: absolute; inset: 15% 12%; border: 1px solid #e0e3e7; border-radius: 9px; }
.network-line { position: absolute; z-index: 1; display: block; height: 3px; border-radius: 999px; background: #aab2bc; transform-origin: left center; }
.network-line--horizontal { left: 24%; top: 51%; width: 52%; }
.network-line--vertical { left: 51%; top: 25%; width: 3px; height: 53%; transform: none; }
.network-line--diagonal-one { left: 51%; top: 51%; width: 30%; transform: rotate(-38deg); }
.network-line--diagonal-two { left: 51%; top: 51%; width: 28%; transform: rotate(38deg); }
.network-pin { position: absolute; z-index: 2; width: 10px; height: 10px; border-radius: 999px; background: #2563eb; box-shadow: 0 0 0 4px #2563eb1f; }
.network-pin--one { left: 35%; top: 48%; }.network-pin--two { left: 51%; top: 48%; background: #7c8794; }.network-pin--three { left: 69%; top: 65%; background: #168754; }
.network-caption { position: absolute; bottom: 1rem; left: 1.25rem; font-size: 0.6875rem; color: var(--ui-text-muted); }
</style>

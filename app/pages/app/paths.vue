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
  <div class="space-y-6">
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div>
        <p class="eyebrow">Routing</p>
        <h1 class="mt-2 text-2xl font-semibold tracking-tight text-highlighted">Paths &amp; directions</h1>
        <p class="mt-1 max-w-2xl text-sm text-muted">Inspect walkable networks and preview shortest or accessible routes.</p>
      </div>
      <UButton to="/app/map?tab=route" icon="i-lucide-route" label="Open route planner" class="shrink-0" />
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
        <div class="flex items-center justify-between gap-3 border-b border-default px-5 py-4">
          <h2 class="text-sm font-semibold text-highlighted">Path network</h2>
          <span class="text-xs text-muted">{{ building.name }}</span>
        </div>
        <div class="network-canvas" role="img" aria-label="Local path network diagram for Main Building">
          <svg viewBox="0 0 520 360" class="size-full" aria-hidden="true">
            <path class="network-room" d="M76 70h150v90H76zM276 70h168v90H276zM76 218h170v76H76zM296 218h148v76H296z" />
            <path class="network-line" d="M110 182h300M258 64v242M110 182l70-64M258 182l92-70M258 182l-95 70M258 182l88 72" />
            <circle class="network-node network-node--start" cx="110" cy="182" r="9" /><circle class="network-node network-node--middle" cx="258" cy="182" r="9" /><circle class="network-node network-node--end" cx="346" cy="254" r="9" />
            <text x="91" y="52">Reception</text><text x="318" y="316">Training Area</text>
          </svg>
          <span class="network-caption">{{ path.name }} · {{ path.accessible ? 'Accessible network' : 'Standard network' }}</span>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between gap-3 border-b border-default pb-4">
          <h2 class="text-sm font-semibold text-highlighted">Route preview</h2>
          <span class="text-xs text-muted">Local directions</span>
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
                <span class="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{{ index + 1 }}</span>
                <span class="pt-0.5">{{ step }}</span>
              </li>
            </ol>
            <p class="mt-4 text-xs text-muted">Preview uses local fixture data; no directions service was contacted.</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
.eyebrow { color: var(--ui-text-muted); font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; }
.network-canvas { position: relative; height: 360px; background: radial-gradient(circle at 50% 45%, rgb(248 250 252), rgb(241 245 249)); }
.network-canvas svg { padding: 2.5rem 1.5rem; }
.network-room { fill: rgb(255 255 255 / 0.8); stroke: var(--ui-border); stroke-width: 2; }
.network-line { fill: none; stroke: rgb(148 163 184); stroke-linecap: round; stroke-linejoin: round; stroke-width: 5; }
.network-node { stroke: white; stroke-width: 4; }
.network-node--start { fill: rgb(14 165 233); }
.network-node--middle { fill: rgb(100 116 139); }
.network-node--end { fill: rgb(16 185 129); }
.network-canvas text { fill: var(--ui-text-muted); font-size: 12px; font-weight: 600; }
.network-caption { position: absolute; bottom: 1rem; left: 1.25rem; font-size: 0.6875rem; color: var(--ui-text-muted); }
</style>

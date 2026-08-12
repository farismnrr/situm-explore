<script setup lang="ts">
const activeTab = ref<'explore' | 'route' | 'layers'>('explore')
const viewerState = ref<'loading' | 'ready' | 'error'>('loading')

const tabItems = [
  { label: 'Explore', value: 'explore' as const },
  { label: 'Route', value: 'route' as const },
  { label: 'Layers', value: 'layers' as const }
]

function handleViewerStatus(state: 'loading' | 'ready' | 'error') {
  viewerState.value = state
}

const viewerStatus = computed(() => ({
  loading: { label: 'Loading', color: 'warning' as const },
  ready: { label: 'Ready', color: 'success' as const },
  error: { label: 'Unavailable', color: 'error' as const }
}[viewerState.value]))

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Map' })
</script>

<template>
  <div class="map-workspace -m-4 flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden border border-default bg-default sm:-m-6 lg:-m-8 lg:min-h-[calc(100vh-4rem)] lg:flex-row">
    <aside class="flex w-full shrink-0 flex-col border-b border-default bg-default lg:w-80 lg:border-b-0 lg:border-r">
      <div class="border-b border-default p-4">
        <div class="mb-3 flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-highlighted">Indoor map</p>
            <p class="mt-1 text-xs text-muted">Main building · live viewer</p>
          </div>
          <UBadge :color="viewerStatus.color" variant="soft" class="shrink-0">
            <span class="mr-1.5 size-1.5 rounded-full bg-current" aria-hidden="true" />
            {{ viewerStatus.label }}
          </UBadge>
        </div>
        <div class="grid grid-cols-3 gap-1 rounded-lg bg-elevated p-1" role="tablist" aria-label="Map tools">
          <button
            v-for="tab in tabItems"
            :key="tab.value"
            type="button"
            role="tab"
            :aria-selected="activeTab === tab.value"
            class="rounded-md px-2 py-2 text-xs font-medium text-muted transition hover:text-highlighted"
            :class="activeTab === tab.value ? 'bg-default text-highlighted shadow-xs' : ''"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="min-h-0 flex-1 overflow-auto p-4">
        <div v-if="activeTab === 'explore'" role="tabpanel">
          <UInput icon="i-lucide-search" placeholder="Search POIs or categories…" aria-label="Search POIs or categories" />
          <div class="mt-3 space-y-2">
            <button v-for="item in ['Reception', 'Meeting Room A', 'Training Area', 'Lift Lobby']" :key="item" type="button" class="flex w-full items-center gap-3 rounded-lg border border-default p-3 text-left transition hover:bg-elevated">
              <span class="grid size-8 shrink-0 place-items-center rounded-lg bg-elevated text-xs font-semibold text-highlighted" aria-hidden="true">{{ item[0] }}</span>
              <span class="min-w-0 flex-1"><strong class="block truncate text-xs text-highlighted">{{ item }}</strong><span class="mt-1 block text-[11px] text-muted">{{ item === 'Training Area' ? 'Workspace · Floor 2' : 'Main building · Floor 1' }}</span></span>
              <span class="text-muted" aria-hidden="true">›</span>
            </button>
          </div>
          <div class="my-4 border-t border-default" />
          <div class="flex items-center justify-between text-xs"><span class="text-muted">Favorite POIs</span><UButton label="Show favorites" color="neutral" variant="ghost" size="xs" /></div>
        </div>

        <div v-else-if="activeTab === 'route'" role="tabpanel" class="space-y-4">
          <UFormField label="Start"><USelect :items="['Reception', 'My location', 'Lift Lobby']" model-value="Reception" class="w-full" /></UFormField>
          <UFormField label="Destination"><USelect :items="['Meeting Room A', 'Training Area', 'Lift Lobby']" model-value="Meeting Room A" class="w-full" /></UFormField>
          <UCheckbox label="Prefer accessible floor changes" />
          <UButton label="Calculate route" block disabled />
        </div>

        <div v-else role="tabpanel" class="space-y-1">
          <p class="mb-3 text-xs text-muted">Viewer overlays and tools</p>
          <div v-for="item in ['Realtime positions', 'Geofences', 'Trajectory', 'Follow user']" :key="item" class="flex items-center justify-between gap-3 border-b border-default py-3 last:border-0">
            <span><strong class="block text-xs text-highlighted">{{ item }}</strong><span class="mt-1 block text-[11px] text-muted">Local workspace control</span></span>
            <USwitch :aria-label="item" :default-value="item === 'Realtime positions'" disabled />
          </div>
        </div>
      </div>
    </aside>

    <section class="relative min-h-[34rem] min-w-0 flex-1 bg-elevated sm:min-h-[38rem] lg:min-h-0">
      <div class="absolute left-4 right-4 top-4 z-10 flex flex-wrap items-center justify-between gap-2 sm:left-6 sm:right-6">
        <div class="flex items-center gap-2 rounded-lg border border-default bg-default/95 p-1 shadow-sm backdrop-blur">
          <USelect :items="['Main Building', 'Warehouse', 'Demo Venue']" model-value="Main Building" aria-label="Building" class="w-36" size="sm" />
          <div class="flex rounded-md bg-elevated p-0.5"><UButton label="Floor 1" color="primary" variant="soft" size="xs" /><UButton label="Floor 2" color="neutral" variant="ghost" size="xs" /></div>
        </div>
        <div class="flex rounded-lg border border-default bg-default/95 p-1 shadow-sm backdrop-blur"><UButton label="Explore" color="primary" variant="soft" size="xs" /><UButton label="Realtime" color="neutral" variant="ghost" size="xs" /><UButton label="Trajectory" color="neutral" variant="ghost" size="xs" /></div>
      </div>
      <div class="h-full min-h-[34rem] p-2 sm:min-h-[38rem] sm:p-3 lg:min-h-0">
        <SitumViewer class="h-full" @status="handleViewerStatus" />
      </div>
      <div class="absolute bottom-6 left-6 z-10 flex flex-col overflow-hidden rounded-lg border border-default bg-default/95 shadow-sm backdrop-blur"><UButton icon="i-lucide-locate-fixed" aria-label="Center map" color="neutral" variant="ghost" /><UButton label="+" aria-label="Zoom in" color="neutral" variant="ghost" /><UButton label="−" aria-label="Zoom out" color="neutral" variant="ghost" /></div>
    </section>
  </div>
</template>

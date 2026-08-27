<script setup lang="ts">
import type { SitumCartographyResponse } from '#shared/situm-cartography'
import { isWorkspaceRequestLoading } from '~/utils/async-state'

const isMapViewerCapable = useMapViewerCapability()
const viewerState = ref<'loading' | 'ready' | 'error'>('loading')
const viewer = ref<{ showUserSettings: (visible: boolean) => Promise<void> } | null>(null)
const actionMessage = ref('')
const { selectedWorkspaceId, loaded: workspaceLoaded } = useWorkspaceContext()
const { data: cartography, error: cartographyError, status: cartographyStatus, refresh: refreshCartography } = await useFetch<SitumCartographyResponse>(useWorkspaceEndpoint('/situm/cartography'), { immediate: false })
watch([selectedWorkspaceId, isMapViewerCapable], ([workspaceId, capable]) => { if (workspaceId && capable) refreshCartography() }, { immediate: true })
const cartographyLoading = computed(() => isWorkspaceRequestLoading(workspaceLoaded.value, selectedWorkspaceId.value, String(cartographyStatus.value)))
const activeBuildingId = computed(() => cartography.value?.buildings[0]?.id)
const viewerAvailable = computed(() => Boolean(selectedWorkspaceId.value && activeBuildingId.value && !cartographyError.value && !cartographyLoading.value))

watch([selectedWorkspaceId, activeBuildingId], () => {
  viewerState.value = 'loading'
  actionMessage.value = ''
})

function handleViewerStatus(state: 'loading' | 'ready' | 'error') {
  viewerState.value = state
}

async function openSettings() {
  if (viewerState.value !== 'ready') {
    actionMessage.value = 'The viewer is not ready yet, so this command has no effect.'
    return
  }
  try {
    await viewer.value!.showUserSettings(true)
    actionMessage.value = ''
  } catch (error) {
    actionMessage.value = error instanceof Error ? error.message : 'The command could not be applied to the viewer.'
  }
}

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Map', fullWidth: true })
</script>

<template>
  <div v-if="!workspaceLoaded" class="map-workspace relative -m-4 h-[calc(100vh-4rem)] min-h-0 overflow-hidden border border-default bg-default sm:-m-6 lg:-m-8" aria-label="Loading map workspace" aria-busy="true">
    <USkeleton class="h-full w-full rounded-none" />
  </div>

  <div v-else-if="!isMapViewerCapable" class="map-native-required -m-4 flex min-h-[calc(100vh-4rem)] flex-col justify-center gap-4 bg-default p-4 sm:-m-6 lg:-m-8">
    <NativeAppGate feature="map" :workspace-id="selectedWorkspaceId" :building-id="activeBuildingId" title="Take the Map with you" description="The mobile app provides the native Map, positioning, and navigation experience on phone-sized layouts."
    />
  </div>

  <div v-else class="map-workspace relative -m-4 flex h-[calc(100vh-4rem)] min-h-0 flex-col overflow-hidden border border-default bg-default sm:-m-6 lg:-m-8">
    <UAlert v-if="actionMessage" color="warning" variant="subtle" :description="actionMessage" class="m-3" />
    <div class="map-viewer-slot relative min-h-0 min-w-0 flex-1">
      <USkeleton v-if="cartographyLoading" class="h-full w-full rounded-none" aria-label="Loading map cartography" aria-busy="true" />
      <div v-else-if="!selectedWorkspaceId" class="absolute inset-0 flex items-center justify-center bg-default px-6"><UAlert color="neutral" variant="subtle" title="No workspace selected" description="Create or select a workspace before opening the Map Viewer." class="max-w-md" /></div>
      <div v-else-if="cartographyError" class="absolute inset-0 flex items-center justify-center bg-default px-6"><UAlert color="error" variant="subtle" title="Map cartography unavailable" description="The selected workspace cartography could not be loaded." class="max-w-md" /></div>
      <div v-else-if="String(cartographyStatus) === 'success' && !activeBuildingId" class="absolute inset-0 flex items-center justify-center bg-default px-6"><UAlert color="neutral" variant="subtle" title="No building data" description="The selected workspace did not return a Situm building for the Viewer." class="max-w-md" /></div>
      <SitumViewer v-else-if="viewerAvailable" ref="viewer" :workspace-id="selectedWorkspaceId || undefined" :building-id="activeBuildingId" class="h-full w-full" @status="handleViewerStatus" />
    </div>
    <UButton v-if="viewerAvailable" icon="i-lucide-sliders-horizontal" aria-label="Open accessibility settings" label="Accessibility" color="neutral" variant="solid" size="lg" class="absolute bottom-6 left-6 z-10 rounded-full shadow-lg" :disabled="viewerState !== 'ready'" @click="openSettings" />
  </div>
</template>

<style scoped>
.map-workspace { border-radius: 1rem; }
.map-viewer-slot { height: 100%; }
</style>

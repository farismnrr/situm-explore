<script setup lang="ts">
import type { SitumCartographyResponse } from '#shared/situm-cartography'

const isMapViewerCapable = useMapViewerCapability()
const viewerState = ref<'loading' | 'ready' | 'error'>('loading')
const viewer = ref<{ showUserSettings: (visible: boolean) => Promise<void> } | null>(null)
const actionMessage = ref('')
const { selectedWorkspaceId } = useWorkspaceContext()
const { data: cartography, error: cartographyError, status: cartographyStatus, refresh: refreshCartography } = await useFetch<SitumCartographyResponse>(useWorkspaceEndpoint('/situm/cartography'), { immediate: false })
watch([selectedWorkspaceId, isMapViewerCapable], ([workspaceId, capable]) => { if (workspaceId && capable) refreshCartography() }, { immediate: true })
const activeBuildingId = computed(() => cartography.value?.buildings[0]?.id)

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
  <div v-if="!isMapViewerCapable" class="map-native-required -m-4 flex min-h-[calc(100vh-4rem)] flex-col justify-center gap-4 bg-default p-4 sm:-m-6 lg:-m-8">
    <NativeAppGate feature="map" :workspace-id="selectedWorkspaceId" :building-id="activeBuildingId" title="Take the Map with you" description="The mobile app provides the native Map, positioning, and navigation experience on phone-sized layouts."
    />
  </div>

  <div v-else class="map-workspace relative -m-4 flex h-[calc(100vh-4rem)] min-h-0 flex-col overflow-hidden border border-default bg-default sm:-m-6 lg:-m-8">
    <UAlert v-if="cartographyError" color="error" variant="subtle" title="Map cartography unavailable" class="m-3" />
    <UAlert v-else-if="actionMessage" color="warning" variant="subtle" :description="actionMessage" class="m-3" />
    <div class="map-viewer-slot min-h-0 min-w-0 flex-1">
      <SitumViewer ref="viewer" :workspace-id="selectedWorkspaceId || undefined" :building-id="activeBuildingId" class="h-full w-full" @status="handleViewerStatus" />
    </div>
    <UButton icon="i-lucide-sliders-horizontal" aria-label="Open accessibility settings" label="Accessibility" color="neutral" variant="solid" size="lg" class="absolute bottom-6 left-6 z-10 rounded-full shadow-lg" :disabled="viewerState !== 'ready' || cartographyStatus === 'pending'" @click="openSettings" />
  </div>
</template>

<style scoped>
.map-workspace { border-radius: 1rem; }
.map-viewer-slot { height: 100%; }
</style>

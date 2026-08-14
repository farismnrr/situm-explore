<script setup lang="ts">
import type { SitumCartographyResponse } from '#shared/situm-cartography'

const isDesktopViewport = useDesktopViewport()
const viewerState = ref<'loading' | 'ready' | 'error'>('loading')
const viewer = ref<{ showUserSettings: (visible: boolean) => Promise<void> } | null>(null)
const actionMessage = ref('')
const { selectedWorkspaceId } = useWorkspaceContext()
const { data: cartography, error: cartographyError, status: cartographyStatus, refresh: refreshCartography } = await useFetch<SitumCartographyResponse>(useWorkspaceEndpoint('/situm/cartography'), { immediate: false })
watch(selectedWorkspaceId, (workspaceId) => { if (workspaceId) refreshCartography() }, { immediate: true })
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
  <div v-if="!isDesktopViewport" class="map-desktop-required -m-4 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 border border-default bg-default p-8 text-center sm:-m-6 lg:-m-8">
    <UIcon name="i-lucide-monitor" class="size-9 text-muted" aria-hidden="true" />
    <div>
      <p class="text-sm font-semibold text-highlighted">Desktop required</p>
      <p class="mt-1.5 max-w-xs text-xs leading-5 text-muted">The Map Viewer needs more screen space than a mobile device can offer. Please open this page on a desktop or a tablet in landscape mode.</p>
    </div>
    <UButton to="/app" label="Back to home" color="neutral" variant="outline" size="sm" />
  </div>

  <div v-else class="map-workspace relative -m-4 flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden border border-default bg-default sm:-m-6 lg:-m-8 lg:min-h-[calc(100vh-4rem)]">
    <UAlert v-if="cartographyError" color="error" variant="subtle" title="Map cartography unavailable" class="m-3" />
    <UAlert v-else-if="actionMessage" color="warning" variant="subtle" :description="actionMessage" class="m-3" />
    <div class="min-h-0 flex-1 p-2 sm:p-3">
      <SitumViewer ref="viewer" :workspace-id="selectedWorkspaceId || undefined" :building-id="activeBuildingId" class="h-full" @status="handleViewerStatus" />
    </div>
    <UButton icon="i-lucide-sliders-horizontal" aria-label="Open accessibility settings" label="Accessibility" color="neutral" variant="solid" size="lg" class="absolute bottom-6 left-6 z-10 rounded-full shadow-lg" :disabled="viewerState !== 'ready' || cartographyStatus === 'pending'" @click="openSettings" />
  </div>
</template>

<style scoped>
.map-workspace { min-height: calc(100vh - 6.5rem); border-radius: 1rem; }
.map-workspace > div:first-of-type { min-height: calc(100vh - 6.5rem); }
</style>

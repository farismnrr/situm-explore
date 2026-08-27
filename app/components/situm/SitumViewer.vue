<script setup lang="ts">
import SitumSDK, { ViewerEventType, type RouteType, type Viewer } from '@situm/sdk-js'

const props = defineProps<{ workspaceId?: string; buildingId?: number }>()
const root = ref<HTMLElement | null>(null)
const viewer = shallowRef<Viewer | null>(null)
const buildingConfirmed = ref(false)
const viewerError = ref(false)

const emit = defineEmits<{ status: [state: 'loading' | 'ready' | 'error', message?: string] }>()
const message = 'Select a configured workspace and building to open the read-only Viewer.'
const fallbackTitle = 'Map unavailable'
const fallbackMessage = 'Situm Viewer could not load the selected building. The interactive map has been hidden to avoid showing incorrect cartography.'
let initializationToken = 0
async function run<T>(action: () => Promise<T>) { if (!viewer.value) throw new Error('The Viewer is not ready.'); return action() }
const selectBuilding = (id: number) => run(() => viewer.value!.selectBuilding(id))
const selectFloor = (id: number) => run(() => viewer.value!.selectFloor(id))
const selectPoi = (id: number) => run(() => viewer.value!.selectPoiById(id))
const setLanguage = (language: string) => run(() => viewer.value!.setLanguage(language as never))
const showUserSettings = (visible: boolean) => run(() => viewer.value!.showUserSettings(visible as never))
const updateFontSize = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl') => run(() => viewer.value!.updateFontSize({ size } as never))
const openLocationPicker = () => run(() => viewer.value!.openLocationPicker())
const loadRealtimePositions = (buildingId?: number, refreshRateMs?: number) => run(() => viewer.value!.loadRealtimePositions({ filter: buildingId ? { buildingIds: [buildingId] } : {}, refreshRateMs }))
const cleanRealtimePositions = () => run(() => viewer.value!.cleanRealtimePositions())
const startDirections = (from: number, to: number, routeType?: RouteType) => run(() => viewer.value!.startDirections({ navigationFrom: from, navigationTo: to, routeType } as never))
const cancelDirections = () => run(() => viewer.value!.cancelDirections())
defineExpose({ selectBuilding, selectFloor, selectPoi, setLanguage, showUserSettings, updateFontSize, openLocationPicker, loadRealtimePositions, cleanRealtimePositions, startDirections, cancelDirections })
const BUILDING_CONFIRM_TIMEOUT_MS = 12000
let confirmTimer: ReturnType<typeof setTimeout> | null = null
function clearConfirmTimer() {
  if (confirmTimer) clearTimeout(confirmTimer)
  confirmTimer = null
}
async function initialize() {
  const token = ++initializationToken
  if (!props.workspaceId || !props.buildingId || !root.value || viewer.value) return
  viewerError.value = false
  emit('status', 'loading')
  try {
    const { apiKey } = await $fetch<{ apiKey: string }>(`/api/workspaces/${encodeURIComponent(props.workspaceId)}/viewer-auth`)
    if (token !== initializationToken || props.workspaceId === undefined || props.buildingId === undefined) return
    const targetBuildingId = props.buildingId
    const sdk = new SitumSDK({ auth: { apiKey }, compact: true })
    const instance = sdk.viewer.create({ domElement: root.value, buildingId: targetBuildingId })
    confirmTimer = setTimeout(() => {
      confirmTimer = null
      if (token !== initializationToken || buildingConfirmed.value) return
      viewerError.value = true
      emit('status', 'error', fallbackMessage)
    }, BUILDING_CONFIRM_TIMEOUT_MS)
    instance.on(ViewerEventType.APP_ERROR, () => {
      if (token !== initializationToken) return
      clearConfirmTimer()
      viewerError.value = true
      emit('status', 'error', fallbackMessage)
    })
    instance.on(ViewerEventType.BUILDING_SELECTED, (payload) => {
      if (token !== initializationToken) return
      if (payload?.identifier !== targetBuildingId) return
      clearConfirmTimer()
      buildingConfirmed.value = true
      emit('status', 'ready')
    })
    viewer.value = instance
  } catch {
    viewerError.value = true
    emit('status', 'error', props.workspaceId ? fallbackMessage : message)
  }
}
function resetViewer() {
  initializationToken++
  clearConfirmTimer()
  buildingConfirmed.value = false
  viewerError.value = false
  viewer.value = null
  if (root.value) root.value.replaceChildren()
}
function retry() {
  resetViewer()
  void initialize()
}
watch(() => [props.workspaceId, props.buildingId], ([workspaceId, buildingId], previous) => {
  if (workspaceId !== previous?.[0] || buildingId !== previous?.[1]) resetViewer()
  void initialize()
}, { immediate: true })
onBeforeUnmount(resetViewer)
</script>

<template>
  <UCard class="situm-viewer-card" :ui="{ root: 'h-full min-h-0 flex flex-col', body: 'h-full min-h-0 flex-1 p-0 sm:p-0' }">
    <div class="situm-viewer-container relative h-full min-h-0 w-full overflow-hidden rounded-lg bg-muted">
      <div ref="root" class="absolute inset-0" :class="buildingConfirmed ? '' : 'invisible opacity-0'" />
      <div v-if="!props.workspaceId || !props.buildingId" class="absolute inset-0 flex items-center justify-center bg-default px-6"><UAlert color="warning" variant="subtle" title="Map Viewer unavailable" :description="message" class="max-w-md" /></div>
      <div v-else-if="viewerError" class="absolute inset-0 flex items-center justify-center bg-default px-6"><UAlert color="error" variant="subtle" :title="fallbackTitle" :description="fallbackMessage" :actions="[{ label: 'Retry', color: 'error', variant: 'subtle', onClick: retry }]" class="max-w-md" /></div>
      <USkeleton v-else-if="!buildingConfirmed" class="absolute inset-0 h-full w-full rounded-none" aria-label="Loading map viewer" aria-busy="true" />
    </div>
  </UCard>
</template>

<style scoped>
.situm-viewer-card,
.situm-viewer-card :deep(> div),
.situm-viewer-card :deep(> div > div) {
  height: 100%;
  min-height: 0;
}

.situm-viewer-container :deep(iframe) {
  width: 100% !important;
  height: 100% !important;
  min-height: 0 !important;
  display: block;
}
</style>

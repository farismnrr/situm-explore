<script setup lang="ts">
import SitumSDK, { ViewerEventType, type RouteType, type Viewer } from '@situm/sdk-js'

const props = defineProps<{ workspaceId?: string; buildingId?: number }>()
const root = ref<HTMLElement | null>(null)
const viewer = shallowRef<Viewer | null>(null)

const emit = defineEmits<{ status: [state: 'loading' | 'ready' | 'error', message?: string] }>()
const message = 'Select a configured workspace and building to open the read-only Viewer.'
const fallbackMessage = 'The read-only Viewer could not be authenticated. Configure a verified read-only Viewer credential in workspace settings.'
let cancelFallback = () => undefined
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
async function initialize() {
  if (!props.workspaceId || !props.buildingId || !root.value || viewer.value) return
  emit('status', 'loading')
  try {
    const { jwt } = await $fetch<{ jwt: string }>(`/api/workspaces/${encodeURIComponent(props.workspaceId)}/viewer-auth`)
    const sdk = new SitumSDK({ auth: { jwt }, compact: true })
    const instance = sdk.viewer.create({ domElement: root.value, buildingId: props.buildingId })
    let authSent = false
    let authCompleted = false
    let iframeLoaded = false
    let readyEmitted = false
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined
    const runtimeInstance = instance as unknown as { iframe?: HTMLIFrameElement }
    const markReady = () => {
      if (!readyEmitted) {
        readyEmitted = true
        emit('status', 'ready')
      }
    }
    const markFallbackReady = () => {
      if (authCompleted && (iframeLoaded || runtimeInstance.iframe)) markReady()
    }
    const sendAuth = () => {
      if (authSent) return
      authSent = true
      void instance.setAuth(jwt).then(() => {
        authCompleted = true
        markFallbackReady()
      }).catch(() => emit('status', 'error', fallbackMessage))
    }
    instance.on(ViewerEventType.MAP_IS_READY, markReady)
    instance.on(ViewerEventType.APP_ERROR, () => emit('status', 'error', fallbackMessage))
    instance.on(ViewerEventType.READY_FOR_AUTH, sendAuth)
    let attempts = 0
    let iframe: HTMLIFrameElement | undefined
    const bindIframeFallback = () => {
      if (authSent) return
      iframe = runtimeInstance.iframe
      if (iframe) {
        iframe.addEventListener('load', () => {
          iframeLoaded = true
          sendAuth()
          markFallbackReady()
        }, { once: true })
        fallbackTimer = setTimeout(sendAuth, 1000)
        setTimeout(markFallbackReady, 1500)
        return
      }
      if (++attempts < 10) fallbackTimer = setTimeout(bindIframeFallback, 250)
      else emit('status', 'error', fallbackMessage)
    }
    cancelFallback = () => {
      if (fallbackTimer) clearTimeout(fallbackTimer)
      iframe?.removeEventListener('load', sendAuth)
    }
    bindIframeFallback()
    viewer.value = instance
  } catch { emit('status', 'error', props.workspaceId ? fallbackMessage : message) }
}
watch(() => [props.workspaceId, props.buildingId], initialize, { immediate: true })
onBeforeUnmount(() => { cancelFallback(); viewer.value = null })
</script>

<template>
  <UCard :ui="{ root: 'h-full flex flex-col', body: 'h-full flex-1 p-0 sm:p-0' }">
    <div class="relative min-h-[22rem] h-full w-full overflow-hidden rounded-lg bg-muted">
      <div ref="root" class="absolute inset-0" />
      <div v-if="!props.workspaceId || !props.buildingId" class="absolute inset-0 flex items-center justify-center bg-default px-6"><UAlert color="warning" variant="subtle" title="Map Viewer unavailable" :description="message" class="max-w-md" /></div>
    </div>
  </UCard>
</template>

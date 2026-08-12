<script setup lang="ts">
import SitumSDK, { ViewerEventType } from '@situm/sdk-js'

const config = useRuntimeConfig()
const container = ref<HTMLElement | null>(null)
const state = ref<'loading' | 'ready' | 'error'>('loading')
const message = ref('')

onMounted(() => {
  if (!config.public.situmViewerApiKey || !config.public.situmBuildingId) {
    state.value = 'error'
    message.value = 'Missing NUXT_PUBLIC_SITUM_VIEWER_API_KEY or NUXT_PUBLIC_SITUM_BUILDING_ID.'
    return
  }
  try {
    const sdk = new SitumSDK({ auth: { apiKey: config.public.situmViewerApiKey } })
    const viewer = sdk.viewer.create({ domElement: container.value!, buildingId: Number(config.public.situmBuildingId) })
    viewer.on(ViewerEventType.MAP_IS_READY, () => {
      state.value = 'ready'
    })
    viewer.on(ViewerEventType.APP_ERROR, (payload) => {
      state.value = 'error'
      message.value = payload.message || 'Situm Map Viewer reported a runtime error.'
    })
  } catch (error: unknown) {
    state.value = 'error'
    message.value = error instanceof Error ? error.message : 'Situm Map Viewer failed to initialize.'
  }
})
</script>

<template>
  <UCard class="overflow-hidden">
    <h2 class="mb-3 font-semibold">Map</h2>
    <UAlert v-if="state === 'error'" color="error" :description="message" />
    <div v-show="state !== 'error'" ref="container" class="min-h-[22rem] h-[min(70vh,48rem)] w-full overflow-hidden rounded" />
    <p v-if="state === 'loading'" class="mt-2">Loading Situm Map Viewer…</p>
  </UCard>
</template>

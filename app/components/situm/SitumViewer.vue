<script setup lang="ts">
import SitumSDK, { ViewerEventType } from '@situm/sdk-js'

const config = useRuntimeConfig()
const container = ref<HTMLElement | null>(null)
const state = ref<'loading' | 'ready' | 'error'>('loading')
const message = ref('')

onMounted(() => {
  if (!config.public.situmApiKey || !config.public.situmBuildingId) {
    state.value = 'error'
    message.value = 'The map viewer is not configured.'
    return
  }
  try {
    const sdk = new SitumSDK({ auth: { apiKey: config.public.situmApiKey } })
    const viewer = sdk.viewer.create({ domElement: container.value!, buildingId: Number(config.public.situmBuildingId) })
    viewer.on(ViewerEventType.MAP_IS_READY, () => {
      state.value = 'ready'
    })
    viewer.on(ViewerEventType.APP_ERROR, (payload) => {
      state.value = 'error'
      message.value = payload.message ? 'The map viewer could not finish loading.' : 'The map viewer encountered an error.'
    })
  } catch (error: unknown) {
    state.value = 'error'
    message.value = error instanceof Error ? 'The map viewer could not be initialized.' : 'The map viewer encountered an error.'
  }
})
</script>

<template>
  <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden rounded-lg border border-default bg-default">
    <div class="relative min-h-[22rem] h-[min(70vh,48rem)] w-full overflow-hidden rounded-lg bg-muted">
      <div ref="container" class="h-full w-full" />

      <div
        v-if="state === 'loading'"
        class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-default/90 px-6 text-center"
        role="status"
        aria-live="polite"
      >
        <div class="h-10 w-10 animate-pulse motion-reduce:animate-none rounded-full bg-primary/15" aria-hidden="true" />
        <p class="text-sm text-muted">Loading map…</p>
      </div>

      <div v-else-if="state === 'error'" class="absolute inset-0 flex items-center justify-center bg-default px-6">
        <UAlert color="error" variant="subtle" title="Map unavailable" :description="message" class="max-w-md" />
      </div>
    </div>
  </UCard>
</template>

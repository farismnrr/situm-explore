<script setup lang="ts">
import SitumSDK, { ViewerEventType } from '@situm/sdk-js'

const emit = defineEmits<{
  status: [state: 'loading' | 'ready' | 'error', message?: string]
}>()

const config = useRuntimeConfig()
const container = ref<HTMLElement | null>(null)
const state = ref<'loading' | 'ready' | 'error'>('loading')
const message = ref('')

onMounted(() => {
  if (!config.public.situmApiKey || !config.public.situmBuildingId) {
    state.value = 'error'
    message.value = 'The map viewer is not configured.'
    emit('status', state.value, message.value)
    return
  }
  try {
    const sdk = new SitumSDK({ auth: { apiKey: config.public.situmApiKey } })
    const viewer = sdk.viewer.create({ domElement: container.value!, buildingId: Number(config.public.situmBuildingId) })
    viewer.on(ViewerEventType.MAP_IS_READY, () => {
      state.value = 'ready'
      emit('status', state.value)
    })
    viewer.on(ViewerEventType.APP_ERROR, (payload) => {
      state.value = 'error'
      message.value = payload.message ? 'The map viewer could not finish loading.' : 'The map viewer encountered an error.'
      emit('status', state.value, message.value)
    })
  } catch (error: unknown) {
    state.value = 'error'
    message.value = error instanceof Error ? 'The map viewer could not be initialized.' : 'The map viewer encountered an error.'
    emit('status', state.value, message.value)
  }
})
</script>

<template>
  <UCard :ui="{ body: 'p-0 sm:p-0' }">
    <div class="relative min-h-[22rem] h-[min(70vh,48rem)] w-full overflow-hidden rounded-lg bg-muted">
      <div ref="container" class="h-full w-full" />

      <div
        v-if="state === 'loading'"
        class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-default/90 px-6 text-center"
        role="status"
        aria-live="polite"
      >
        <div class="h-10 w-10 animate-pulse motion-reduce:animate-none rounded-full bg-info/15" aria-hidden="true" />
        <p class="text-sm text-muted">Loading map…</p>
      </div>

      <div v-else-if="state === 'error'" class="absolute inset-0 flex items-center justify-center bg-default px-6">
        <UAlert color="error" variant="subtle" title="Map unavailable" :description="message" class="max-w-md" />
      </div>
    </div>
  </UCard>
</template>

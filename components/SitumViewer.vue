<script setup lang="ts">
import SitumSDK from '@situm/sdk-js'

const config = useRuntimeConfig()
const container = ref<HTMLElement | null>(null)
const state = ref<'loading' | 'ready' | 'error'>('loading')
const message = ref('')

onMounted(() => {
  if (!config.public.situmApiKey || !config.public.situmBuildingId) {
    state.value = 'error'
    message.value = 'Missing NUXT_PUBLIC_SITUM_API_KEY or NUXT_PUBLIC_SITUM_BUILDING_ID.'
    return
  }
  try {
    const sdk = new SitumSDK({ auth: { apiKey: config.public.situmApiKey } })
    sdk.viewer.create({ domElement: container.value!, buildingId: Number(config.public.situmBuildingId) })
    state.value = 'ready'
  } catch (error: unknown) {
    state.value = 'error'
    message.value = error instanceof Error ? error.message : 'Situm Map Viewer failed to initialize.'
  }
})
</script>

<template>
  <UCard>
    <h2 class="mb-3 font-semibold">Situm web integration</h2>
    <UAlert v-if="state === 'error'" color="error" :description="message" />
    <div v-show="state !== 'error'" ref="container" class="h-80 w-full overflow-hidden rounded" />
    <p v-if="state === 'loading'" class="mt-2">Loading Situm Map Viewer…</p>
  </UCard>
</template>

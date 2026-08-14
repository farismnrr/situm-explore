<script setup lang="ts">
const isDownloadModalOpen = ref(false)

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Realtime' })
</script>

<template>
  <div class="operations-page space-y-6">
    <ProductPageHeader eyebrow="Operations" title="Realtime positions" description="Web realtime monitoring is not available in this application.">
      <template #actions>
        <ProductStatusBadge label="Unavailable" tone="neutral" />
      </template>
    </ProductPageHeader>

    <UCard>
      <div class="flex min-h-[360px] items-center justify-center p-6 text-center">
        <UAlert
          color="warning"
          variant="subtle"
          icon="i-lucide-smartphone"
          title="Realtime tracking is mobile-only"
          description="This web app does not display live maps or device positions. Indoor positioning is produced by the native mobile app, and web realtime monitoring is not currently available."
          class="w-full max-w-xl"
        >
          <template #actions>
            <UButton label="Download Android app" @click="isDownloadModalOpen = true" />
          </template>
        </UAlert>
      </div>
    </UCard>

    <UModal v-model:open="isDownloadModalOpen" title="Coming soon">
      <template #body>
        <p class="text-sm text-muted">The Android app is coming soon. There is no app download available yet.</p>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
.operations-page { max-width: 1480px; }
</style>

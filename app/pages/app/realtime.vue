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

    <section class="rounded-xl border border-default bg-default/50 px-6 py-8 sm:px-8 sm:py-10" aria-labelledby="realtime-info-title">
      <div class="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
        <div class="flex items-start gap-4">
          <div class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning" aria-hidden="true">
            <UIcon name="i-lucide-smartphone" class="size-5" />
          </div>
          <div class="max-w-2xl space-y-2">
            <h2 id="realtime-info-title" class="text-base font-semibold text-highlighted">Realtime tracking is mobile-only</h2>
            <p class="text-sm leading-6 text-muted">This web app does not display live maps or device positions. Indoor positioning is produced by the native mobile app, and web realtime monitoring is not currently available.</p>
          </div>
        </div>
        <UButton label="Download Android app" class="shrink-0" @click="isDownloadModalOpen = true" />
      </div>
    </section>

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

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'app', title: 'Viewer settings' })
</script>

<template>
  <div class="operations-page space-y-6">
    <ProductPageHeader eyebrow="Viewer" title="Viewer settings" description="Verified web-safe Viewer configuration and accessibility controls.">
      <template #actions><ProductStatusBadge label="Plan 016 · not connected" tone="neutral" /></template>
    </ProductPageHeader>
    <UCard><UAlert color="neutral" variant="subtle" title="Viewer settings are not connected" description="Plan 016 owns the verified Viewer command surface for language, search, location picker, camera and accessibility settings. No local success state is shown here." /></UCard>
  </div>
</template>

<style scoped>.operations-page { max-width: 1480px; }</style>

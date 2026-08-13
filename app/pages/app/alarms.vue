<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'app', title: 'Alarms' })
</script>

<template>
  <div class="operations-page space-y-6">
    <ProductPageHeader eyebrow="Operations" title="Alarms" description="Read-only operational alarm context from Situm.">
      <template #actions><ProductStatusBadge label="Plan 015 · not connected" tone="neutral" /></template>
    </ProductPageHeader>
    <UCard><UAlert color="neutral" variant="subtle" title="Alarms are not connected" description="Plan 015 will verify the authenticated read contract and truthful empty/error states. No fixture alarms are shown as current events." /></UCard>
  </div>
</template>

<style scoped>.operations-page { max-width: 1480px; }</style>

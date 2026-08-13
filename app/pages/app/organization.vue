<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'app', title: 'Organization' })
</script>

<template>
  <div class="operations-page space-y-6">
    <ProductPageHeader eyebrow="Organization" title="Organization" description="Account context, current permission boundary and available resources." />

    <UAlert color="neutral" variant="subtle" title="Organization data is not connected" description="Plan 015 will use verified Situm organization and user contracts. No fixture organization, permission, or device counts are shown as current data." />
  </div>
</template>

<style scoped>.operations-page { max-width: 1480px; }</style>

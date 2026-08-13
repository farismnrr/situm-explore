<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'app', title: 'Users & groups' })
</script>

<template>
  <div class="operations-page space-y-6">
    <ProductPageHeader eyebrow="Organization" title="Users & groups" description="Read-only directory context for people and device grouping.">
      <template #actions><ProductStatusBadge label="Plan 015 · not connected" tone="neutral" /></template>
    </ProductPageHeader>
    <UCard><UAlert color="neutral" variant="subtle" title="Users and groups are not connected" description="Plan 015 will verify read-only directory contracts and keep Situm identities separate from the Situm Explore app session." /></UCard>
  </div>
</template>

<style scoped>.operations-page { max-width: 1480px; }</style>

<script setup lang="ts">
import type { SitumPathsResponse } from '#shared/situm-paths'

const { data, error, status } = await useFetch<SitumPathsResponse>('/api/situm/paths')
const paths = computed(() => data.value?.paths ?? [])
const pathSummary = computed(() => paths.value.map(path => `${path.nodes.length} nodes · ${path.links.length} links`))

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Paths & routing' })
</script>

<template>
  <div class="cartography-page space-y-6">
    <ProductPageHeader eyebrow="Routing" title="Paths & directions" description="Inspect verified Situm path metadata and preview static directions between known points." />
    <UAlert v-if="error" color="error" variant="subtle" title="Paths unavailable" description="The authenticated Situm path read failed. No fixture network is shown." />
    <UAlert v-else-if="status === 'pending'" color="neutral" variant="subtle" title="Loading paths" description="Reading path metadata from Situm." />
    <UCard v-for="(summary, index) in pathSummary" :key="index"><p class="text-sm font-semibold text-highlighted">Path network {{ index + 1 }}</p><p class="mt-1 text-xs text-muted">{{ summary }}</p></UCard>
    <UCard v-if="status !== 'pending' && paths.length === 0"><p class="py-8 text-center text-sm text-muted">No real path networks are available.</p></UCard>
    <UAlert color="neutral" variant="subtle" title="Static directions remain evidence-gated" description="The Viewer contract supports starting a static route, but route-result fields, accessible constraints and step-by-step display are not implemented until their exact product mapping is verified." />
  </div>
</template>

<style scoped>
.cartography-page { max-width: 1480px; }
</style>

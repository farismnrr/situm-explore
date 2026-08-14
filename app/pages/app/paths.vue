<script setup lang="ts">
import type { SitumPathsResponse } from '#shared/situm-paths'

const { data, error, status, refresh } = await useFetch<SitumPathsResponse>(useWorkspaceEndpoint('/situm/paths'), { immediate: false })
onMounted(() => { if (useWorkspaceContext().selectedWorkspaceId.value) refresh() })
const paths = computed(() => data.value?.paths ?? [])
const pathSummary = computed(() => paths.value.map(path => `${path.nodes.length} nodes · ${path.links.length} links`))

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Paths & routing' })
</script>

<template>
  <div class="cartography-page space-y-6">
    <ProductPageHeader eyebrow="Routing" title="Paths" description="Inspect verified Situm path and cartography metadata." />
    <UAlert v-if="error" color="error" variant="subtle" title="Paths unavailable" description="The authenticated Situm path read failed. No fixture network is shown." />
    <UAlert v-else-if="status === 'pending'" color="neutral" variant="subtle" title="Loading paths" description="Reading path metadata from Situm." />
    <UCard v-for="(summary, index) in pathSummary" :key="index"><p class="text-sm font-semibold text-highlighted">Path network {{ index + 1 }}</p><p class="mt-1 text-xs text-muted">{{ summary }}</p></UCard>
    <UCard v-if="status !== 'pending' && paths.length === 0"><p class="py-8 text-center text-sm text-muted">No real path networks are available.</p></UCard>
    <UAlert color="neutral" variant="subtle" title="Static directions" description="Route requests are available from the Map Route tab. This page shows path metadata, not computed route results; route details and steps remain absent unless verified." />
  </div>
</template>

<style scoped>
.cartography-page { max-width: 1480px; }
</style>

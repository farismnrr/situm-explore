<script setup lang="ts">
import type { SitumOrganizationResponse } from '#shared/situm-organization'

const { selectedWorkspaceId } = useWorkspaceContext()
const { data, error, status, refresh } = await useFetch<SitumOrganizationResponse>(useWorkspaceEndpoint('/situm/organization'), { immediate: false })
watch(selectedWorkspaceId, (workspaceId) => { if (workspaceId) refresh() }, { immediate: true })
definePageMeta({ middleware: 'auth', layout: 'app', title: 'Organization' })
</script>

<template>
  <div class="operations-page space-y-6">
    <ProductPageHeader eyebrow="Organization" title="Organization" description="Account context, current permission boundary and available resources." />

    <UAlert v-if="error" color="error" variant="subtle" title="Organization unavailable" description="The authenticated organization read failed. No fixture summary is shown." />
    <div v-else-if="String(status) === 'pending'" class="space-y-2" aria-label="Loading organization" aria-busy="true"><USkeleton class="h-5 w-48" /><USkeleton class="h-3 w-64" /></div>
    <UCard v-else-if="String(status) === 'success' && data"><p class="text-sm font-semibold text-highlighted">{{ data.organization.name }}</p><p class="mt-1 text-xs text-muted">Organization ID {{ data.organization.id }}</p><p v-if="data.organization.supportEmail" class="mt-2 text-xs text-muted">Support: {{ data.organization.supportEmail }}</p></UCard>
  </div>
</template>

<style scoped>.operations-page { max-width: 1480px; }</style>

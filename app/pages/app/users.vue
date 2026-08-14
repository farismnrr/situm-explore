<script setup lang="ts">
import type { SitumUsersResponse } from '#shared/situm-users'

const { selectedWorkspaceId } = useWorkspaceContext()
const { data, error, status, refresh } = await useFetch<SitumUsersResponse>(useWorkspaceEndpoint('/situm/users'), { immediate: false })
watch(selectedWorkspaceId, (workspaceId) => { if (workspaceId) refresh() }, { immediate: true })
const users = computed(() => data.value?.users ?? [])
definePageMeta({ middleware: 'auth', layout: 'app', title: 'Users & groups' })
</script>

<template>
  <div class="operations-page space-y-6">
    <ProductPageHeader eyebrow="Organization" title="Users & groups" description="Read-only directory context for people and device grouping.">
      <template #actions><ProductStatusBadge :label="`${users.length} users`" :tone="error ? 'error' : 'success'" /></template>
    </ProductPageHeader>
    <UAlert v-if="error" color="error" variant="subtle" title="Users unavailable" description="The authenticated Situm user read failed. No fixture rows are shown." />
    <UAlert v-else-if="status === 'pending'" color="neutral" variant="subtle" title="Loading users" description="Reading the Situm directory." />
    <UCard v-else><div v-if="users.length" class="divide-y divide-default"><div v-for="user in users" :key="user.id" class="flex items-center justify-between gap-3 py-3"><div><strong class="text-sm text-highlighted">{{ user.fullName || user.email }}</strong><p class="text-xs text-muted">{{ user.email }}</p></div><span class="text-xs text-muted">{{ user.role }}</span></div></div><p v-else class="py-8 text-center text-sm text-muted">No Situm users returned.</p></UCard>
  </div>
</template>

<style scoped>.operations-page { max-width: 1480px; }</style>

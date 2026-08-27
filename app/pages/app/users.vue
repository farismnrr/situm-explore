<script setup lang="ts">
import type { SitumUsersResponse } from '#shared/situm-users'
import { isWorkspaceRequestLoading } from '~/utils/async-state'

const { selectedWorkspaceId, loaded: workspaceLoaded } = useWorkspaceContext()
const { data, error, status, refresh } = await useFetch<SitumUsersResponse>(useWorkspaceEndpoint('/situm/users'), { immediate: false })
watch(selectedWorkspaceId, (workspaceId) => { if (workspaceId) refresh() }, { immediate: true })
const users = computed(() => data.value?.users ?? [])
const loading = computed(() => isWorkspaceRequestLoading(workspaceLoaded.value, selectedWorkspaceId.value, String(status.value)))
definePageMeta({ middleware: 'auth', layout: 'app', title: 'Users & groups' })
</script>

<template>
  <div class="operations-page space-y-6">
    <ProductPageHeader eyebrow="Organization" title="Users & groups" description="Read-only directory context for people and device grouping.">
      <template #actions>
        <USkeleton v-if="loading" class="h-6 w-20 rounded-full" />
        <ProductStatusBadge v-else-if="selectedWorkspaceId" :label="error ? 'Unavailable' : `${users.length} users`" :tone="error ? 'error' : 'success'" />
      </template>
    </ProductPageHeader>
    <div v-if="loading" class="space-y-2" aria-label="Loading users" aria-busy="true"><USkeleton v-for="row in 5" :key="row" class="h-12 w-full" /></div>
    <UAlert v-else-if="!selectedWorkspaceId" color="neutral" variant="subtle" title="No workspace selected" description="Create or select a workspace before loading users." />
    <UAlert v-else-if="error" color="error" variant="subtle" title="Users unavailable" description="The authenticated Situm user read failed. No fixture rows are shown." />
    <UCard v-else-if="String(status) === 'success'"><div v-if="users.length" class="divide-y divide-default"><div v-for="user in users" :key="user.id" class="flex items-center justify-between gap-3 py-3"><div><strong class="text-sm text-highlighted">{{ user.fullName || user.email }}</strong><p class="text-xs text-muted">{{ user.email }}</p></div><span class="text-xs text-muted">{{ user.role }}</span></div></div><p v-else class="py-8 text-center text-sm text-muted">No Situm users returned.</p></UCard>
  </div>
</template>

<style scoped>.operations-page { max-width: 1480px; }</style>

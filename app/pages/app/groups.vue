<script setup lang="ts">
import type { SitumGroupsResponse } from '#shared/situm-groups-alarms'

type ParentFilter = 'all' | 'parents' | 'children'

const search = ref('')
const parentFilter = ref<ParentFilter>('all')
const query = computed(() => parentFilter.value === 'all' ? {} : { has_parent: parentFilter.value === 'parents' })
const { data, error, status, refresh } = await useFetch<SitumGroupsResponse>(useWorkspaceEndpoint('/situm/groups'), { query, immediate: false })
onMounted(() => { if (useWorkspaceContext().selectedWorkspaceId.value) refresh() })
const groups = computed(() => data.value?.groups ?? [])
const filteredGroups = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return groups.value
  return groups.value.filter(group => `${group.name} ${group.id} ${group.uuid}`.toLowerCase().includes(term))
})

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Groups' })
</script>

<template>
  <div class="organization-page space-y-6">
    <ProductPageHeader eyebrow="Organization" title="Groups" description="Read-only group directory from Situm.">
      <template #actions><ProductStatusBadge :label="error ? 'Unavailable' : `${groups.length} groups`" :tone="error ? 'error' : 'success'" /></template>
    </ProductPageHeader>

    <UAlert v-if="error" color="error" variant="subtle" title="Groups unavailable" description="The authenticated Situm groups read failed. No fixture rows are shown." />
    <UAlert v-else-if="status === 'pending'" color="neutral" variant="subtle" title="Loading groups" description="Reading group metadata from Situm." />

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <UInput v-model="search" icon="i-lucide-search" placeholder="Search groups or identifiers" aria-label="Search groups" class="w-full sm:max-w-sm" />
      <USelect v-model="parentFilter" :items="[{ label: 'All groups', value: 'all' }, { label: 'With a parent', value: 'parents' }, { label: 'Without a parent', value: 'children' }]" value-key="value" aria-label="Filter groups by parent" class="w-full sm:w-48" />
    </div>

    <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
      <div class="hidden overflow-x-auto md:block">
        <table class="table-density w-full text-left">
          <thead class="border-b border-default bg-elevated/40 text-xs text-muted"><tr><th class="px-5 py-3 font-medium">Group</th><th class="px-4 py-3 font-medium">Identifier</th><th class="px-4 py-3 font-medium">Parent group</th></tr></thead>
          <tbody class="divide-y divide-default">
            <tr v-for="group in filteredGroups" :key="group.uuid" class="transition hover:bg-elevated/40">
              <td class="px-5 py-4 font-medium text-highlighted">{{ group.name }}</td><td class="px-4 py-4 font-mono text-xs text-muted">{{ group.uuid }}<span class="mt-1 block font-sans">ID {{ group.id }}</span></td><td class="px-4 py-4 text-muted">{{ group.parentGroupId === null ? 'None' : group.parentGroupId }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="divide-y divide-default md:hidden">
        <div v-for="group in filteredGroups" :key="group.uuid" class="p-4"><strong class="block text-sm text-highlighted">{{ group.name }}</strong><span class="mt-1 block break-all font-mono text-xs text-muted">{{ group.uuid }}</span><span class="mt-2 block text-xs text-muted">ID {{ group.id }} · Parent {{ group.parentGroupId === null ? 'none' : group.parentGroupId }}</span></div>
      </div>
      <p v-if="status !== 'pending' && !error && filteredGroups.length === 0" class="px-5 py-10 text-center text-sm text-muted">{{ groups.length ? 'No groups match your filters.' : 'No Situm groups returned.' }}</p>
    </UCard>
  </div>
</template>

<style scoped>.organization-page { max-width: 1480px; }</style>

<script setup lang="ts">
import { prototypeDirectoryGroups, prototypeDirectoryUsers, type PrototypeDirectoryUser } from '~/data/prototype/users'

const selectedUser = ref<PrototypeDirectoryUser | null>(null)
const drawerOpen = computed({ get: () => selectedUser.value !== null, set: (open) => { if (!open) selectedUser.value = null } })

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Users & groups' })
</script>

<template>
  <div class="operations-page space-y-6">
    <ProductPageHeader eyebrow="Organization" title="Users & groups" description="Read-only directory context for people and device grouping.">
      <template #actions><ProductStatusBadge label="Only Read" tone="info" /></template>
    </ProductPageHeader>

    <div class="grid gap-[14px] lg:grid-cols-2">
      <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
        <ProductPanelHeader title="Users" :meta="`${prototypeDirectoryUsers.length} members`" />
        <div class="hidden overflow-x-auto md:block">
          <table class="table-density w-full min-w-[620px] text-left">
            <thead class="border-b border-default bg-elevated/40"><tr><th class="font-medium">Name</th><th class="font-medium">Role</th><th class="font-medium">Groups</th><th class="font-medium">Status</th></tr></thead>
            <tbody class="divide-y divide-default"><tr v-for="user in prototypeDirectoryUsers" :key="user.id" class="transition hover:bg-elevated/40"><td><button class="text-left font-medium text-highlighted hover:underline" @click="selectedUser = user">{{ user.name }}</button></td><td class="text-muted">{{ user.role }}</td><td class="text-muted">{{ user.groups.join(', ') }}</td><td><ProductStatusBadge :label="user.status" :tone="user.status === 'Active' ? 'success' : 'neutral'" /></td></tr></tbody>
          </table>
        </div>
        <div class="divide-y divide-default md:hidden"><article v-for="user in prototypeDirectoryUsers" :key="user.id" class="space-y-2 p-3"><div class="flex items-start justify-between gap-3"><div class="min-w-0"><button class="truncate text-left font-medium text-highlighted hover:underline" @click="selectedUser = user">{{ user.name }}</button><p class="mt-0.5 truncate text-[10px] text-muted">{{ user.email }}</p></div><ProductStatusBadge :label="user.status" :tone="user.status === 'Active' ? 'success' : 'neutral'" /></div><p class="text-[10px] text-muted">{{ user.role }} · {{ user.groups.join(', ') }}</p></article></div>
      </UCard>

      <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
        <ProductPanelHeader title="Groups" :meta="`${prototypeDirectoryGroups.length} groups`" />
        <div class="panel-body activity-list"><ProductActivityRow v-for="group in prototypeDirectoryGroups" :key="group.id" :title="group.name" :meta="`${group.userCount} users · ${group.deviceCount} devices`" :dot-tone="group.color">
          <template #trailing><UIcon name="i-lucide-chevron-right" class="mt-0.5 size-3.5 text-muted" aria-hidden="true" /></template>
        </ProductActivityRow></div>
      </UCard>
    </div>

    <CartographyDetailsDrawer v-if="selectedUser" v-model:open="drawerOpen" title="Directory user" type="Situm directory user" :name="selectedUser.name" :subtitle="selectedUser.email" map-to="/app/realtime" :details="[{ label: 'Role', value: selectedUser.role }, { label: 'Groups', value: selectedUser.groups.join(', ') }, { label: 'Status', value: selectedUser.status }, { label: 'Last seen', value: selectedUser.lastSeen }, { label: 'Identity boundary', value: 'Directory fixture, not app session' }]" />
  </div>
</template>

<style scoped>
.operations-page { max-width: 1480px; }
</style>

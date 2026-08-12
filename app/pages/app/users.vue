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

    <div class="grid gap-4 lg:grid-cols-2">
      <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
        <div class="flex items-center justify-between gap-3 border-b border-default px-5 py-4">
          <div><h2 class="font-semibold text-highlighted">Users</h2><p class="mt-1 text-xs text-muted">{{ prototypeDirectoryUsers.length }} members</p></div>
        </div>
        <div class="hidden overflow-x-auto md:block">
          <table class="table-density w-full min-w-[620px] text-left">
            <thead class="border-b border-default bg-elevated/40 text-xs text-muted"><tr><th class="px-5 py-3 font-medium">Name</th><th class="px-4 py-3 font-medium">Role</th><th class="px-4 py-3 font-medium">Groups</th><th class="px-4 py-3 font-medium">Status</th></tr></thead>
            <tbody class="divide-y divide-default"><tr v-for="user in prototypeDirectoryUsers" :key="user.id" class="transition hover:bg-elevated/40"><td class="px-5 py-4"><button class="text-left font-medium text-info hover:underline" @click="selectedUser = user">{{ user.name }}</button><p class="mt-1 text-xs text-muted">{{ user.email }}</p></td><td class="px-4 py-4 text-muted">{{ user.role }}</td><td class="px-4 py-4 text-muted">{{ user.groups.join(', ') }}</td><td class="px-4 py-4"><ProductStatusBadge :label="user.status" :tone="user.status === 'Active' ? 'success' : 'neutral'" /></td></tr></tbody>
          </table>
        </div>
        <div class="divide-y divide-default md:hidden"><article v-for="user in prototypeDirectoryUsers" :key="user.id" class="space-y-3 p-4"><div class="flex items-start justify-between gap-3"><div><button class="text-left font-medium text-info hover:underline" @click="selectedUser = user">{{ user.name }}</button><p class="mt-1 text-xs text-muted">{{ user.email }}</p></div><ProductStatusBadge :label="user.status" :tone="user.status === 'Active' ? 'success' : 'neutral'" /></div><p class="text-xs text-muted">{{ user.role }} · {{ user.groups.join(', ') }}</p></article></div>
      </UCard>

      <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
        <div class="flex items-center justify-between gap-3 border-b border-default px-5 py-4"><div><h2 class="font-semibold text-highlighted">Groups</h2><p class="mt-1 text-xs text-muted">{{ prototypeDirectoryGroups.length }} groups</p></div></div>
        <div class="panel-body activity-list"><article v-for="group in prototypeDirectoryGroups" :key="group.id" class="activity-row flex items-start gap-3"><span class="mt-1 size-2 shrink-0 rounded-full" :class="group.color === 'info' ? 'bg-info' : group.color === 'success' ? 'bg-success' : 'bg-neutral'" /><div class="min-w-0"><h3 class="text-xs font-medium text-highlighted">{{ group.name }}</h3><p class="mt-1 text-[10px] text-muted">{{ group.userCount }} users · {{ group.deviceCount }} devices</p><p class="mt-1 text-[10px] text-muted">{{ group.description }}</p></div></article></div>
      </UCard>
    </div>

    <CartographyDetailsDrawer v-if="selectedUser" v-model:open="drawerOpen" title="Directory user" type="Situm directory user" :name="selectedUser.name" :subtitle="selectedUser.email" map-to="/app/realtime" :details="[{ label: 'Role', value: selectedUser.role }, { label: 'Groups', value: selectedUser.groups.join(', ') }, { label: 'Status', value: selectedUser.status }, { label: 'Last seen', value: selectedUser.lastSeen }, { label: 'Identity boundary', value: 'Directory fixture, not app session' }]" />
  </div>
</template>

<style scoped>
.operations-page { max-width: 1480px; }
</style>

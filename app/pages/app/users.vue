<script setup lang="ts">
import { prototypeDirectoryGroups, prototypeDirectoryUsers, type PrototypeDirectoryUser } from '~/data/prototype/users'

const selectedUser = ref<PrototypeDirectoryUser | null>(null)
const drawerOpen = computed({ get: () => selectedUser.value !== null, set: (open) => { if (!open) selectedUser.value = null } })

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Users & groups' })
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Organization</p>
        <h1 class="mt-2 text-2xl font-semibold tracking-tight text-highlighted">Users &amp; groups</h1>
        <p class="mt-1 max-w-2xl text-sm text-muted">Read-only directory context for people and device grouping.</p>
      </div>
      <UBadge color="info" variant="soft" class="w-fit">Read only</UBadge>
    </div>

    <UAlert color="info" variant="soft" title="Situm directory context" description="These synthetic directory records are separate from the signed-in Situm Explore app session. Changes are not persisted." />

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
      <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
        <div class="flex items-center justify-between gap-3 border-b border-default px-5 py-4">
          <div><h2 class="font-semibold text-highlighted">Users</h2><p class="mt-1 text-xs text-muted">{{ prototypeDirectoryUsers.length }} visible sample members</p></div>
          <UBadge color="neutral" variant="soft">Directory</UBadge>
        </div>
        <div class="hidden overflow-x-auto md:block">
          <table class="w-full min-w-[620px] text-left text-sm">
            <thead class="border-b border-default bg-elevated/40 text-xs text-muted"><tr><th class="px-5 py-3 font-medium">Name</th><th class="px-4 py-3 font-medium">Role</th><th class="px-4 py-3 font-medium">Groups</th><th class="px-4 py-3 font-medium">Status</th></tr></thead>
            <tbody class="divide-y divide-default"><tr v-for="user in prototypeDirectoryUsers" :key="user.id" class="transition hover:bg-elevated/40"><td class="px-5 py-4"><button class="text-left font-medium text-primary hover:underline" @click="selectedUser = user">{{ user.name }}</button><p class="mt-1 text-xs text-muted">{{ user.email }}</p></td><td class="px-4 py-4 text-muted">{{ user.role }}</td><td class="px-4 py-4 text-muted">{{ user.groups.join(', ') }}</td><td class="px-4 py-4"><UBadge :color="user.status === 'Active' ? 'success' : 'neutral'" variant="soft">{{ user.status }}</UBadge></td></tr></tbody>
          </table>
        </div>
        <div class="divide-y divide-default md:hidden"><article v-for="user in prototypeDirectoryUsers" :key="user.id" class="space-y-3 p-4"><div class="flex items-start justify-between gap-3"><div><button class="text-left font-medium text-primary hover:underline" @click="selectedUser = user">{{ user.name }}</button><p class="mt-1 text-xs text-muted">{{ user.email }}</p></div><UBadge :color="user.status === 'Active' ? 'success' : 'neutral'" variant="soft">{{ user.status }}</UBadge></div><p class="text-xs text-muted">{{ user.role }} · {{ user.groups.join(', ') }}</p></article></div>
      </UCard>

      <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
        <div class="flex items-center justify-between gap-3 border-b border-default px-5 py-4"><div><h2 class="font-semibold text-highlighted">Groups</h2><p class="mt-1 text-xs text-muted">{{ prototypeDirectoryGroups.length }} local sample groups</p></div><UBadge color="neutral" variant="soft">Read only</UBadge></div>
        <div class="divide-y divide-default"><article v-for="group in prototypeDirectoryGroups" :key="group.id" class="flex items-start gap-3 p-4"><span class="mt-1.5 size-2.5 shrink-0 rounded-full" :class="group.color === 'info' ? 'bg-info' : group.color === 'success' ? 'bg-success' : 'bg-neutral'" /><div class="min-w-0"><h3 class="font-medium text-highlighted">{{ group.name }}</h3><p class="mt-1 text-xs text-muted">{{ group.userCount }} users · {{ group.deviceCount }} devices</p><p class="mt-2 text-xs text-muted">{{ group.description }}</p></div></article></div>
      </UCard>
    </div>

    <p class="text-xs text-muted">Local prototype fixtures · no user, group, account, or Situm organization changes are available.</p>
    <CartographyDetailsDrawer v-if="selectedUser" v-model:open="drawerOpen" title="Directory user" type="Situm directory user" :name="selectedUser.name" :subtitle="selectedUser.email" map-to="/app/realtime" :details="[{ label: 'Role', value: selectedUser.role }, { label: 'Groups', value: selectedUser.groups.join(', ') }, { label: 'Status', value: selectedUser.status }, { label: 'Last seen', value: selectedUser.lastSeen }, { label: 'Identity boundary', value: 'Directory fixture, not app session' }]" />
  </div>
</template>

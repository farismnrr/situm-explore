<script setup lang="ts">
import { alarmStatuses, alarmTypes, prototypeAlarms, type AlarmStatus, type AlarmType } from '~/data/prototype/alarms'

const typeFilter = ref<'All types' | AlarmType>('All types')
const statusFilter = ref<'All statuses' | AlarmStatus>('All statuses')

const filteredAlarms = computed(() => prototypeAlarms.filter((alarm) => {
  const matchesType = typeFilter.value === 'All types' || alarm.type === typeFilter.value
  const matchesStatus = statusFilter.value === 'All statuses' || alarm.status === statusFilter.value
  return matchesType && matchesStatus
}))

const openCount = computed(() => prototypeAlarms.filter(alarm => alarm.status === 'Open').length)

function alarmTypeColor(type: AlarmType) {
  return type === 'Assistance request' || type === 'Danger' ? 'error' : 'warning'
}

function statusColor(status: AlarmStatus) {
  return status === 'Open' ? 'warning' : 'success'
}

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Alarms' })
</script>

<template>
  <div class="operations-page space-y-6">
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Operations</p>
        <h1 class="mt-2 text-2xl font-semibold tracking-tight text-highlighted">Alarms</h1>
        <p class="mt-1 text-sm text-muted">Read-only view of operational alarms associated with tracked users and spaces.</p>
      </div>
      <UBadge color="warning" variant="soft" class="w-fit">{{ openCount }} open</UBadge>
    </div>

    <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
      <USelect v-model="typeFilter" :items="alarmTypes" aria-label="Filter alarms by type" class="w-full sm:w-52" />
      <USelect v-model="statusFilter" :items="alarmStatuses" aria-label="Filter alarms by status" class="w-full sm:w-44" />
    </div>

    <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
      <div class="hidden overflow-x-auto md:block">
        <table class="table-density w-full min-w-[680px] text-left">
          <thead class="border-b border-default bg-elevated/40 text-xs text-muted">
            <tr><th class="px-5 py-3 font-medium">Type</th><th class="px-4 py-3 font-medium">User</th><th class="px-4 py-3 font-medium">Location</th><th class="px-4 py-3 font-medium">Triggered</th><th class="px-4 py-3 font-medium">Status</th></tr>
          </thead>
          <tbody class="divide-y divide-default">
            <tr v-for="alarm in filteredAlarms" :key="alarm.id" class="transition hover:bg-elevated/40">
              <td class="px-5 py-4"><UBadge :color="alarmTypeColor(alarm.type)" variant="soft">{{ alarm.type }}</UBadge></td>
              <td class="px-4 py-4 font-medium text-highlighted">{{ alarm.user }}</td>
              <td class="px-4 py-4 text-muted">{{ alarm.location }}</td>
              <td class="px-4 py-4 text-muted">{{ alarm.triggered }}</td>
              <td class="px-4 py-4"><UBadge :color="statusColor(alarm.status)" variant="soft">{{ alarm.status }}</UBadge></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="divide-y divide-default md:hidden">
        <article v-for="alarm in filteredAlarms" :key="alarm.id" class="space-y-3 p-4">
          <div class="flex items-start justify-between gap-3"><UBadge :color="alarmTypeColor(alarm.type)" variant="soft">{{ alarm.type }}</UBadge><UBadge :color="statusColor(alarm.status)" variant="soft">{{ alarm.status }}</UBadge></div>
          <div><p class="text-sm font-medium text-highlighted">{{ alarm.user }}</p><p class="mt-1 text-xs text-muted">{{ alarm.location }}</p></div>
          <p class="text-xs text-muted">Triggered {{ alarm.triggered }}</p>
        </article>
      </div>
      <p v-if="filteredAlarms.length === 0" class="px-5 py-10 text-center text-sm text-muted">No alarms match your filters.</p>
    </UCard>

  </div>
</template>

<style scoped>
.operations-page { max-width: 1480px; }
</style>

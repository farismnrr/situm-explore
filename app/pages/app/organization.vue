<script setup lang="ts">
const organization = {
  name: 'POC Organization',
  id: 'org-demo-001',
  permission: 'Read & Write (POC)',
  buildings: 3,
  users: 8,
  devices: 13,
}

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Organization' })
</script>

<template>
  <div class="operations-page space-y-6">
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Organization</p>
      <h1 class="mt-2 text-2xl font-semibold tracking-tight text-highlighted">Organization</h1>
      <p class="mt-1 max-w-2xl text-sm text-muted">Account context, current permission boundary and available resources.</p>
    </div>

    <div class="grid gap-4 lg:grid-cols-[1.4fr_.6fr]">
      <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
        <div class="panel-head">
          <div>
            <h2 class="font-semibold text-highlighted">Situm organization</h2>
            <p class="mt-1 text-xs text-muted">Current organization</p>
          </div>
          <UBadge color="neutral" variant="soft">POC context</UBadge>
        </div>
        <dl class="detail-list divide-y divide-default">
          <div class="detail-row"><dt class="text-muted">Name</dt><dd class="font-medium text-highlighted">{{ organization.name }}</dd></div>
          <div class="detail-row"><dt class="text-muted">Organization ID</dt><dd class="font-medium text-highlighted">{{ organization.id }}</dd></div>
          <div class="detail-row"><dt class="text-muted">API permission</dt><dd><UBadge color="info" variant="soft">{{ organization.permission }}</UBadge></dd></div>
          <div class="detail-row"><dt class="text-muted">Buildings</dt><dd class="font-medium text-highlighted">{{ organization.buildings }}</dd></div>
          <div class="detail-row"><dt class="text-muted">Users</dt><dd class="font-medium text-highlighted">{{ organization.users }}</dd></div>
          <div class="detail-row"><dt class="text-muted">Devices</dt><dd class="font-medium text-highlighted">{{ organization.devices }}</dd></div>
        </dl>
      </UCard>

      <UCard>
        <div class="panel-head">
          <div><h2 class="font-semibold text-highlighted">POC credential boundary</h2><p class="mt-1 text-xs text-muted">Prototype rule</p></div>
          <UBadge color="success" variant="soft">Configured</UBadge>
        </div>
        <div class="soft-card mt-4 p-3">
          <div class="flex items-center justify-between gap-3"><strong class="text-sm text-highlighted">Browser viewer credential</strong><UBadge color="info" variant="soft">{{ organization.permission }}</UBadge></div>
          <p class="mt-3 text-xs leading-relaxed text-muted">The time-boxed POC credential is represented only by its permission context. Its value is never shown, stored in fixtures, or written to logs.</p>
        </div>
        <div class="my-5 border-t border-default" />
        <p class="text-xs text-muted">This screen is product context only. No account, organization, cartography, or credential-management actions are available.</p>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
.operations-page { max-width: 1480px; }
.detail-list { font-size: .6875rem; }
.detail-row { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:.6875rem 0; }
.detail-row dt { font-size:.6875rem; }.detail-row dd { text-align:right; }
</style>

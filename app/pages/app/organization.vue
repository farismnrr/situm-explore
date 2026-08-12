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
    <ProductPageHeader eyebrow="Organization" title="Organization" description="Account context, current permission boundary and available resources." />

    <div class="grid gap-4 lg:grid-cols-[1.4fr_.6fr]">
      <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
        <div class="panel-head">
          <div>
            <h2 class="font-semibold text-highlighted">Situm organization</h2>
            <p class="mt-1 text-xs text-muted">Current organization</p>
          </div>
          <ProductStatusBadge label="POC context" />
        </div>
        <dl class="detail-list divide-y divide-default">
          <div class="detail-row"><dt class="text-muted">Name</dt><dd class="font-medium text-highlighted">{{ organization.name }}</dd></div>
          <div class="detail-row"><dt class="text-muted">Organization ID</dt><dd class="font-medium text-highlighted">{{ organization.id }}</dd></div>
          <div class="detail-row"><dt class="text-muted">API permission</dt><dd><ProductStatusBadge :label="organization.permission" tone="info" /></dd></div>
          <div class="detail-row"><dt class="text-muted">Buildings</dt><dd class="font-medium text-highlighted">{{ organization.buildings }}</dd></div>
          <div class="detail-row"><dt class="text-muted">Users</dt><dd class="font-medium text-highlighted">{{ organization.users }}</dd></div>
          <div class="detail-row"><dt class="text-muted">Devices</dt><dd class="font-medium text-highlighted">{{ organization.devices }}</dd></div>
        </dl>
      </UCard>

      <UCard>
        <div class="panel-head">
          <div><h2 class="font-semibold text-highlighted">POC credential boundary</h2><p class="mt-1 text-xs text-muted">Prototype rule</p></div>
          <ProductStatusBadge label="Configured" tone="success" />
        </div>
        <div class="soft-card mt-4 p-3">
          <div class="flex items-center justify-between gap-3"><strong class="text-sm text-highlighted">Browser viewer credential</strong><ProductStatusBadge :label="organization.permission" tone="info" /></div>
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

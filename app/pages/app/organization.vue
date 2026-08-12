<script setup lang="ts">
const organization = {
  name: 'POC Organization',
  id: 'org-demo-001',
  permission: 'Read & Write (POC)',
  buildings: 3,
  users: 8,
  devices: 13,
}

const organizationDetails = [
  { label: 'Name', value: organization.name },
  { label: 'Organization ID', value: organization.id },
  { label: 'API permission', value: organization.permission, kind: 'permission' },
  { label: 'Buildings', value: String(organization.buildings) },
  { label: 'Users', value: String(organization.users) },
  { label: 'Devices', value: String(organization.devices) },
] as const

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Organization' })
</script>

<template>
  <div class="operations-page space-y-6">
    <ProductPageHeader eyebrow="Organization" title="Organization" description="Account context, current permission boundary and available resources." />

    <div class="grid gap-[14px] lg:grid-cols-[1.4fr_.6fr]">
      <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
        <ProductPanelHeader title="Situm organization" meta="Current organization" />
        <div class="panel-body p-4"><ProductDetailList :items="organizationDetails"><template #value="{ item }"><ProductStatusBadge v-if="item.kind === 'permission'" :label="item.value ?? ''" tone="info" /><span v-else>{{ item.value }}</span></template></ProductDetailList></div>
      </UCard>

      <UCard :ui="{ body: 'p-0 sm:p-0' }">
        <ProductPanelHeader title="POC credential boundary" meta="Prototype rule" />
        <div class="panel-body p-4">
        <div class="soft-card p-3.5">
          <div class="flex items-center justify-between gap-3"><strong class="text-[11px] text-highlighted">Browser viewer key</strong><ProductStatusBadge label="Read &amp; Write (POC)" tone="info" /></div>
          <p class="mt-3 text-[10px] leading-relaxed text-muted">The current POC key permits Read &amp; Write access for viewer validation. No destructive cartography or account actions are represented as active operations.</p>
        </div>
        <div class="my-5 border-t border-default" />
        <p class="text-[10px] text-muted">This screen is product context only. No account, organization, cartography, or credential-management actions are available.</p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<style scoped>.operations-page { max-width: 1480px; }</style>

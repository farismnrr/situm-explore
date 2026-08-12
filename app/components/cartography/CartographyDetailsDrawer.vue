<script setup lang="ts">
export interface CartographyDetailRow {
  label: string
  value: string
}

const props = defineProps<{
  open: boolean
  title: string
  type: string
  name: string
  subtitle?: string
  details: readonly CartographyDetailRow[]
  mapTo: string
}>()

const emit = defineEmits<{ 'update:open': [value: boolean] }>()

function close() {
  emit('update:open', false)
}
</script>

<template>
  <USlideover :open="props.open" :title="props.title" :ui="{ content: 'cartography-drawer w-full sm:max-w-[380px]' }" @update:open="emit('update:open', $event)">
    <template #body>
      <div class="drawer-body space-y-5">
        <div>
          <UBadge color="neutral" variant="soft">{{ props.type }}</UBadge>
          <h2 class="mt-2 text-lg font-semibold text-highlighted">{{ props.name }}</h2>
          <p v-if="props.subtitle" class="mt-1 text-xs text-muted">{{ props.subtitle }}</p>
        </div>
        <dl class="divide-y divide-default border-y border-default text-sm">
          <div v-for="detail in props.details" :key="detail.label" class="flex justify-between gap-4 py-2.5">
            <dt class="text-muted">{{ detail.label }}</dt>
            <dd class="max-w-[65%] text-right font-medium text-highlighted">{{ detail.value }}</dd>
          </div>
        </dl>
        <slot />
        <UButton :to="props.mapTo" block label="View on map" @click="close" />
      </div>
    </template>
  </USlideover>
</template>

<style>
.cartography-drawer { top: 4rem; height: calc(100% - 4rem); }
@media (max-width: 639px) { .cartography-drawer { top: 3.625rem; height: calc(100% - 3.625rem); } }
</style>

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
        <UBadge color="neutral" variant="soft" class="w-fit">{{ props.type }}</UBadge>
        <ProductDetailList :items="props.details" />
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

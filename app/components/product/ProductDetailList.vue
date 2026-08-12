<script setup lang="ts">
export interface ProductDetailItem {
  label: string
  value?: string
  kind?: string
}

defineProps<{
  items: readonly ProductDetailItem[]
}>()
</script>

<template>
  <dl class="grid gap-3 text-[11px]">
    <div v-for="item in items" :key="item.label" class="grid grid-cols-[115px_1fr] gap-3">
      <dt class="text-muted">{{ item.label }}</dt>
      <dd class="font-semibold text-highlighted">
        <slot name="value" :item="item">{{ item.value }}</slot>
      </dd>
    </div>
  </dl>
</template>

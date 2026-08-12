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
  <dl class="divide-y divide-default border-y border-default text-sm">
    <div v-for="item in items" :key="item.label" class="grid grid-cols-[115px_minmax(0,1fr)] gap-3 py-2.5">
      <dt class="text-muted">{{ item.label }}</dt>
      <dd class="max-w-[65%] text-right font-medium text-highlighted">
        <slot name="value" :item="item">{{ item.value }}</slot>
      </dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  description?: string
}>()
</script>

<template>
  <header class="product-page-header mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <div>
      <p v-if="eyebrow" class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{{ eyebrow }}</p>
      <h1 class="mt-1 text-[30px] font-semibold leading-[1.08] tracking-[-0.045em] text-highlighted">{{ title }}</h1>
      <p v-if="description" class="mt-2 text-sm leading-relaxed text-muted">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap gap-2">
      <slot name="actions" />
    </div>
  </header>
</template>

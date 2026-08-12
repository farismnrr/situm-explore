<script setup lang="ts">
defineProps<{
  title: string
  meta?: string
  description?: string
}>()
</script>

<template>
  <div class="panel-head flex items-center justify-between gap-3 border-b border-default px-4 py-[15px]">
    <div class="min-w-0">
      <h2 class="text-[13px] font-semibold tracking-[-.015em] text-highlighted">{{ title }}</h2>
      <p v-if="description" class="mt-1 text-[10px] text-muted">{{ description }}</p>
    </div>
    <span v-if="meta" class="shrink-0 text-[10px] text-muted">{{ meta }}</span>
    <slot name="meta" />
  </div>
</template>

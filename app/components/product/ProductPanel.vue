<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <UCard :ui="{ body: 'p-0' }">
    <header v-if="title || description || $slots.actions" class="flex min-h-[52px] items-center justify-between gap-3 border-b border-default px-4 py-3">
      <div class="min-w-0">
        <h2 v-if="title" class="text-[13px] font-semibold tracking-[-0.015em] text-highlighted">{{ title }}</h2>
        <p v-if="description" class="mt-1 text-xs text-muted">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="shrink-0"><slot name="actions" /></div>
    </header>
    <div><slot /></div>
  </UCard>
</template>

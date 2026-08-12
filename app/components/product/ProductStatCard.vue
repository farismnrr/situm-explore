<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  note?: string
  positive?: boolean
}>()
</script>

<template>
  <UCard :ui="{ body: 'p-4' }">
    <span class="text-xs text-muted">{{ label }}</span>
    <strong class="mt-2 block text-2xl tracking-tight text-highlighted">{{ value }}</strong>
    <small v-if="note" class="mt-1 block text-xs" :class="positive ? 'text-success' : 'text-muted'">{{ note }}</small>
  </UCard>
</template>

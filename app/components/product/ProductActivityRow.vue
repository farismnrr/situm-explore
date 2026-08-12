<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  meta: string
  dotTone?: 'info' | 'success' | 'neutral'
}>(), { dotTone: 'info' })
</script>

<template>
  <div class="activity-row grid grid-cols-[auto_1fr_auto] items-start gap-2">
    <span class="mt-1 size-1.5 shrink-0 rounded-full" :class="dotTone === 'success' ? 'bg-success' : dotTone === 'neutral' ? 'bg-neutral' : 'bg-info'" />
    <div class="min-w-0">
      <strong class="block text-[11px] font-medium text-highlighted">{{ title }}</strong>
      <span class="mt-0.5 block text-[10px] text-muted">{{ meta }}</span>
    </div>
    <slot name="trailing" />
  </div>
</template>

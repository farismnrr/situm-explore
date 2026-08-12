<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="setting-row flex items-center justify-between gap-[18px] border-t border-default py-[13px] first:border-t-0">
    <div class="min-w-0">
      <strong class="block text-[11px] font-medium text-highlighted">{{ title }}</strong>
      <span class="mt-1 block text-[10px] leading-[1.4] text-muted">{{ description }}</span>
    </div>
    <div class="shrink-0">
      <slot />
    </div>
  </div>
</template>

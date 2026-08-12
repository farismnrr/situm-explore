<script setup lang="ts">
type StatusTone = 'neutral' | 'success' | 'warning' | 'error' | 'info'

const props = withDefaults(defineProps<{
  label: string
  tone?: StatusTone
  dot?: boolean
}>(), { tone: 'neutral', dot: false })
</script>

<template>
  <UBadge :color="props.tone" variant="soft" class="w-fit">
    <span v-if="props.dot" class="mr-1.5 size-1.5 rounded-full bg-current" aria-hidden="true" />
    {{ props.label }}
  </UBadge>
</template>

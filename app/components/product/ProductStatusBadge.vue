<script setup lang="ts">
type StatusTone = 'neutral' | 'success' | 'warning' | 'error' | 'info'

const props = withDefaults(defineProps<{
  label: string
  tone?: StatusTone
  dot?: boolean
}>(), { tone: 'neutral', dot: false })
</script>

<template>
  <UBadge :color="props.tone" variant="soft" class="status-badge w-fit">
    <span v-if="props.dot" class="mr-1.5 size-1.5 rounded-full bg-current" aria-hidden="true" />
    {{ props.label }}
  </UBadge>
</template>

<style scoped>
.status-badge {
  min-height: 1.75rem;
  border-radius: 999px !important;
  padding-inline: 0.625rem !important;
  font-size: 0.6875rem !important;
  font-weight: 600 !important;
}
</style>

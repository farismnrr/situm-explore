<script setup lang="ts">
export interface CartographyDetailRow {
  label: string
  value: string
}

const props = defineProps<{
  open: boolean
  title: string
  type: string
  name: string
  subtitle?: string
  details: readonly CartographyDetailRow[]
  mapTo: string
}>()

const emit = defineEmits<{ 'update:open': [value: boolean] }>()

function close() {
  emit('update:open', false)
}
</script>

<template>
  <USlideover :open="props.open" :title="props.title" description="Local cartography fixture details." :ui="{ content: 'w-full sm:max-w-md' }" @update:open="emit('update:open', $event)">
    <template #body>
      <div class="space-y-6">
        <div>
          <UBadge color="neutral" variant="soft">{{ props.type }}</UBadge>
          <h2 class="mt-3 text-xl font-semibold text-highlighted">{{ props.name }}</h2>
          <p v-if="props.subtitle" class="mt-1 text-sm text-muted">{{ props.subtitle }}</p>
        </div>
        <dl class="divide-y divide-default border-y border-default text-sm">
          <div v-for="detail in props.details" :key="detail.label" class="flex justify-between gap-4 py-3">
            <dt class="text-muted">{{ detail.label }}</dt>
            <dd class="max-w-[65%] text-right font-medium text-highlighted">{{ detail.value }}</dd>
          </div>
        </dl>
        <slot />
        <UButton :to="props.mapTo" block label="View on map" @click="close" />
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const model = defineModel<string>({ required: true })
const visible = ref(false)

const toggleLabel = computed(() => visible.value ? 'Hide password' : 'Show password')
</script>

<template>
  <UInput
    v-model="model"
    v-bind="$attrs"
    :type="visible ? 'text' : 'password'"
  >
    <template #trailing>
      <UButton
        type="button"
        color="neutral"
        variant="link"
        size="sm"
        :icon="visible ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        :aria-label="toggleLabel"
        :aria-pressed="visible"
        class="-me-1"
        @click="visible = !visible"
      />
    </template>
  </UInput>
</template>

<script setup lang="ts">
const viewer = ref<{ setLanguage: (language: string) => Promise<void>, showUserSettings: (visible: boolean) => Promise<void>, updateFontSize: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl') => Promise<void>, openLocationPicker: () => Promise<void> } | null>(null)
const language = ref('en')
const fontSize = ref<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'>('md')
const actionMessage = ref('')
async function applyLanguage() { await viewer.value?.setLanguage(language.value); actionMessage.value = `Viewer language set to ${language.value}.` }
async function applyFontSize() { await viewer.value?.updateFontSize(fontSize.value); actionMessage.value = `Viewer font size set to ${fontSize.value}.` }
async function openSettings() { await viewer.value?.showUserSettings(true); actionMessage.value = 'Viewer accessibility settings opened.' }
async function openPicker() { await viewer.value?.openLocationPicker(); actionMessage.value = 'Viewer location picker opened.' }

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Viewer settings' })
</script>

<template>
  <div class="operations-page space-y-6">
    <ProductPageHeader eyebrow="Viewer" title="Viewer settings" description="Verified web-safe Viewer configuration and accessibility controls.">
      <template #actions><ProductStatusBadge label="Verified Viewer commands" tone="success" /></template>
    </ProductPageHeader>
    <div class="grid gap-4 lg:grid-cols-[1fr_1fr]"><UCard><div class="space-y-4"><UFormField label="Language"><USelect v-model="language" :items="['en', 'es']" /></UFormField><UFormField label="Font size"><USelect v-model="fontSize" :items="['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl']" /></UFormField><div class="flex flex-wrap gap-2"><UButton label="Apply language" @click="applyLanguage" /><UButton label="Apply font size" color="neutral" variant="soft" @click="applyFontSize" /><UButton label="Accessibility settings" color="neutral" variant="soft" @click="openSettings" /><UButton label="Location picker" color="neutral" variant="soft" @click="openPicker" /></div><p v-if="actionMessage" class="text-xs text-muted" role="status">{{ actionMessage }}</p></div></UCard><SitumViewer ref="viewer" /></div>
  </div>
</template>

<style scoped>.operations-page { max-width: 1480px; }</style>

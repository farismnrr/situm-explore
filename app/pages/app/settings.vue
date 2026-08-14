<script setup lang="ts">
const isDesktopViewport = useDesktopViewport()
const viewer = ref<{ setLanguage: (language: string) => Promise<void>, showUserSettings: (visible: boolean) => Promise<void>, updateFontSize: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl') => Promise<void>, openLocationPicker: () => Promise<void> } | null>(null)
const viewerState = ref<'loading' | 'ready' | 'error'>('loading')
const panelOpen = ref(false)
const viewerErrorMessage = ref('')
const language = ref('en')
const fontSize = ref<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'>('md')
const actionMessage = ref('')

function handleViewerStatus(state: 'loading' | 'ready' | 'error', message?: string) {
  viewerState.value = state
  viewerErrorMessage.value = message ?? ''
}

async function runViewerAction(action: () => Promise<void>, successMessage: string) {
  if (viewerState.value !== 'ready') {
    actionMessage.value = 'The viewer is not ready yet, so this command has no effect.'
    return
  }
  try {
    await action()
    actionMessage.value = successMessage
  } catch (error) {
    actionMessage.value = error instanceof Error ? error.message : 'The command could not be applied to the viewer.'
  }
}

function applyLanguage() { return runViewerAction(() => viewer.value!.setLanguage(language.value), `Viewer language set to ${language.value}.`) }
function applyFontSize() { return runViewerAction(() => viewer.value!.updateFontSize(fontSize.value), `Viewer font size set to ${fontSize.value}.`) }
function openSettings() { return runViewerAction(() => viewer.value!.showUserSettings(true), 'Viewer accessibility settings opened.') }
function openPicker() { return runViewerAction(() => viewer.value!.openLocationPicker(), 'Viewer location picker opened.') }

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Viewer settings' })
</script>

<template>
  <div class="operations-page space-y-6">
    <ProductPageHeader eyebrow="Viewer" title="Viewer settings" description="Live controls for the embedded Situm Viewer on the right: change its display language and font size, or trigger its built-in accessibility panel and location picker.">
      <template #actions><ProductStatusBadge label="Verified Viewer commands" tone="success" /></template>
    </ProductPageHeader>
    <UAlert v-if="viewerState === 'error'" color="error" variant="subtle" title="Map viewer unavailable" :description="viewerErrorMessage || 'These commands need a working viewer connection and will have no effect until it loads.'" />

    <div v-if="!isDesktopViewport" class="desktop-required flex flex-col items-center justify-center gap-4 rounded-[var(--explore-radius-lg)] border border-default p-8 text-center">
      <UIcon name="i-lucide-monitor" class="size-9 text-muted" aria-hidden="true" />
      <div>
        <p class="text-sm font-semibold text-highlighted">Desktop required</p>
        <p class="mt-1.5 max-w-xs text-xs leading-5 text-muted">The Viewer settings panel needs more screen space than a mobile device can offer. Please open this page on a desktop or a tablet in landscape mode.</p>
      </div>
      <UButton to="/app" label="Back to home" color="neutral" variant="outline" size="sm" />
    </div>

    <div v-else class="settings-stage relative">
      <SitumViewer ref="viewer" :workspace-id="useWorkspaceContext().selectedWorkspaceId.value || undefined" class="settings-viewer" @status="handleViewerStatus" />

      <UCard v-if="panelOpen" class="settings-panel absolute bottom-28 left-6 z-10 w-72 shadow-lg" :ui="{ body: 'space-y-4' }">
        <div class="flex items-start justify-between gap-2">
          <p class="text-sm font-semibold text-highlighted">Viewer settings</p>
          <UButton icon="i-lucide-x" aria-label="Close panel" color="neutral" variant="ghost" size="xs" @click="panelOpen = false" />
        </div>
        <UFormField label="Language"><USelect v-model="language" :items="['en', 'es']" class="w-full" /></UFormField>
        <UFormField label="Font size"><USelect v-model="fontSize" :items="['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl']" class="w-full" /></UFormField>
        <div class="flex flex-col gap-2">
          <UButton label="Apply language" block :disabled="viewerState !== 'ready'" @click="applyLanguage" />
          <UButton label="Apply font size" color="neutral" variant="soft" block :disabled="viewerState !== 'ready'" @click="applyFontSize" />
          <UButton label="Accessibility settings" color="neutral" variant="soft" block :disabled="viewerState !== 'ready'" @click="openSettings" />
          <UButton label="Location picker" color="neutral" variant="soft" block :disabled="viewerState !== 'ready'" @click="openPicker" />
        </div>
        <p v-if="actionMessage" class="text-xs text-muted" role="status">{{ actionMessage }}</p>
      </UCard>

      <UButton :icon="panelOpen ? 'i-lucide-x' : 'i-lucide-sliders-horizontal'" aria-label="Toggle viewer settings" color="neutral" variant="solid" size="lg" class="settings-toggle absolute bottom-12 left-6 z-10 size-12 rounded-full p-0 shadow-lg" :ui="{ base: 'justify-center' }" @click="panelOpen = !panelOpen" />
    </div>
  </div>
</template>

<style scoped>
.operations-page { max-width: 1480px; }
.settings-stage { position: relative; height: calc(100vh - 13rem); min-height: 30rem; }
.settings-viewer { height: 100%; }
.settings-panel { max-height: calc(100% - 2rem); overflow-y: auto; }
</style>

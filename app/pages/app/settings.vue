<script setup lang="ts">
type SettingsTab = 'general' | 'navigation' | 'map' | 'styles' | 'images'

const activeTab = ref<SettingsTab>('general')
const showUserSettings = ref(true)
const followUser = ref(false)
const language = ref('English')
const preferShortestRoute = ref(true)
const accessibleRoutes = ref(false)
const excludedTags = ref('staff-only')
const configurationProfile = ref('default')
const defaultBuilding = ref('Main Building')
const defaultFloor = ref('Floor 1')
const resetMessage = ref('')
const { showFeedback } = useExploreFeedback()

const tabs: Array<{ id: SettingsTab, label: string }> = [
  { id: 'general', label: 'General' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'map', label: 'Map configuration' },
  { id: 'styles', label: 'Map styles' },
  { id: 'images', label: 'Images' }
]

function resetSettings() {
  showUserSettings.value = true
  followUser.value = false
  language.value = 'English'
  preferShortestRoute.value = true
  accessibleRoutes.value = false
  excludedTags.value = 'staff-only'
  configurationProfile.value = 'default'
  defaultBuilding.value = 'Main Building'
  defaultFloor.value = 'Floor 1'
  resetMessage.value = 'Local viewer preferences reset to their demo defaults.'
  showFeedback('Viewer preferences reset locally.')
}

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Viewer settings' })
</script>

<template>
  <div class="operations-page space-y-6">
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Viewer</p>
        <h1 class="mt-2 text-2xl font-semibold tracking-tight text-highlighted">Viewer settings</h1>
        <p class="mt-1 max-w-2xl text-sm text-muted">Preview map viewer configuration, accessibility and appearance preferences.</p>
      </div>
      <UButton label="Reset demo" icon="i-lucide-rotate-ccw" color="neutral" variant="outline" class="w-fit" @click="resetSettings" />
    </div>

    <p v-if="resetMessage" class="sr-only" role="status">{{ resetMessage }}</p>

    <div class="settings-layout grid gap-4 lg:grid-cols-[13.75rem_minmax(0,1fr)]">
      <UCard :ui="{ body: 'p-2 sm:p-2' }" class="h-fit overflow-hidden">
        <nav class="flex gap-1 overflow-x-auto lg:block" role="tablist" aria-label="Viewer settings sections">
          <button v-for="tab in tabs" :key="tab.id" type="button" role="tab" :aria-selected="activeTab === tab.id" :tabindex="activeTab === tab.id ? 0 : -1" class="shrink-0 rounded-md px-3 py-2 text-left text-sm transition lg:block lg:w-full" :class="activeTab === tab.id ? 'bg-elevated font-medium text-highlighted' : 'text-muted hover:bg-elevated/70 hover:text-highlighted'" @click="activeTab = tab.id">{{ tab.label }}</button>
        </nav>
      </UCard>

      <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
        <section v-if="activeTab === 'general'" class="p-[18px]">
          <h2 class="text-base font-semibold text-highlighted">General viewer behavior</h2>
          <p class="mt-1 text-xs text-muted">Local preferences representing viewer actions and configuration.</p>
          <div class="mt-5 divide-y divide-default">
            <div class="setting-row"><div><strong class="block text-sm text-highlighted">Light UI mode</strong><span class="mt-1 block text-xs leading-relaxed text-muted">Keep Situm Explore light-only for this product phase.</span></div><USwitch :model-value="true" disabled aria-label="Light UI mode locked on" /></div>
            <div class="setting-row"><div><strong class="block text-sm text-highlighted">Show user settings</strong><span class="mt-1 block text-xs leading-relaxed text-muted">Expose viewer accessibility controls.</span></div><USwitch v-model="showUserSettings" aria-label="Show user settings" /></div>
            <div class="setting-row"><div><strong class="block text-sm text-highlighted">Follow user by default</strong><span class="mt-1 block text-xs leading-relaxed text-muted">Center the map on the selected realtime position.</span></div><USwitch v-model="followUser" aria-label="Follow user by default" /></div>
            <div class="setting-row"><div><strong class="block text-sm text-highlighted">Language</strong><span class="mt-1 block text-xs leading-relaxed text-muted">Map Viewer interface language.</span></div><USelect v-model="language" :items="['English', 'Bahasa Indonesia']" aria-label="Map Viewer interface language" class="w-full sm:w-44" /></div>
          </div>
        </section>

        <section v-else-if="activeTab === 'navigation'" class="p-[18px]">
          <h2 class="text-base font-semibold text-highlighted">Navigation</h2><p class="mt-1 text-xs text-muted">Route behavior reflected from local directions preferences.</p>
          <div class="mt-5 divide-y divide-default">
            <div class="flex items-center justify-between gap-5 py-4 first:pt-0"><div><strong class="block text-sm text-highlighted">Prefer shortest route</strong><span class="mt-1 block text-xs leading-relaxed text-muted">Default directions strategy.</span></div><USwitch v-model="preferShortestRoute" aria-label="Prefer shortest route" /></div>
            <div class="flex items-center justify-between gap-5 py-4"><div><strong class="block text-sm text-highlighted">Accessible routes</strong><span class="mt-1 block text-xs leading-relaxed text-muted">Avoid stairs when accessibility is requested.</span></div><USwitch v-model="accessibleRoutes" aria-label="Accessible routes" /></div>
            <div class="flex items-center justify-between gap-5 py-4 last:pb-0"><div><strong class="block text-sm text-highlighted">Excluded tags</strong><span class="mt-1 block text-xs leading-relaxed text-muted">Local path tags excluded from directions.</span></div><UInput v-model="excludedTags" aria-label="Excluded path tags" class="w-56" /></div>
          </div>
        </section>

        <section v-else-if="activeTab === 'map'" class="p-[18px]">
          <h2 class="text-base font-semibold text-highlighted">Map configuration</h2><p class="mt-1 text-xs text-muted">Local configuration profile and viewer interaction defaults.</p>
          <div class="mt-5 divide-y divide-default">
            <div class="flex items-center justify-between gap-5 py-4 first:pt-0"><div><strong class="block text-sm text-highlighted">Configuration profile</strong><span class="mt-1 block text-xs leading-relaxed text-muted">Map behavior profile.</span></div><USelect v-model="configurationProfile" :items="['default', 'poc-workspace']" aria-label="Configuration profile" class="w-48" /></div>
            <div class="flex items-center justify-between gap-5 py-4"><div><strong class="block text-sm text-highlighted">Default building</strong><span class="mt-1 block text-xs leading-relaxed text-muted">Building selected when opening the viewer.</span></div><USelect v-model="defaultBuilding" :items="['Main Building', 'Warehouse Demo']" aria-label="Default building" class="w-48" /></div>
            <div class="flex items-center justify-between gap-5 py-4 last:pb-0"><div><strong class="block text-sm text-highlighted">Default floor</strong><span class="mt-1 block text-xs leading-relaxed text-muted">Initial floor when available.</span></div><USelect v-model="defaultFloor" :items="['Floor 1', 'Floor 2']" aria-label="Default floor" class="w-48" /></div>
          </div>
        </section>

        <section v-else-if="activeTab === 'styles'" class="p-[18px]">
          <h2 class="text-base font-semibold text-highlighted">Map styles</h2><p class="mt-1 text-xs text-muted">Local read-only previews; no style upload or remote mutation is available.</p>
          <div class="mt-5 grid gap-3 sm:grid-cols-3"><div v-for="style in [{ name: 'Default light', tone: 'bg-gradient-to-br from-slate-50 to-slate-200' }, { name: 'High contrast', tone: 'bg-gradient-to-br from-white to-slate-300' }, { name: 'Brand neutral', tone: 'bg-gradient-to-br from-zinc-50 to-zinc-200' }]" :key="style.name" class="rounded-lg border border-default p-3"><strong class="text-sm text-highlighted">{{ style.name }}</strong><div class="mt-3 h-20 rounded-md" :class="style.tone" /></div></div>
        </section>

        <section v-else class="p-[18px]">
          <h2 class="text-base font-semibold text-highlighted">Images</h2><p class="mt-1 text-xs text-muted">Local reference examples for POI, category and floor resources.</p>
          <div class="mt-5 divide-y divide-default rounded-lg border border-default"><div v-for="image in [{ name: 'poi-reception.svg', detail: 'POI icon · 6 KB', status: 'Referenced' }, { name: 'category-workspace.svg', detail: 'POI category icon · 5 KB', status: 'Referenced' }, { name: 'floor-1-map.png', detail: 'Floor resource · 842 KB', status: 'Active' }]" :key="image.name" class="flex items-center gap-3 p-4"><span class="size-2.5 shrink-0 rounded-full" :class="image.status === 'Active' ? 'bg-success' : 'bg-primary'" /><div class="min-w-0 flex-1"><strong class="block text-sm text-highlighted">{{ image.name }}</strong><span class="mt-1 block text-xs text-muted">{{ image.detail }}</span></div><UBadge :color="image.status === 'Active' ? 'success' : 'neutral'" variant="soft">{{ image.status }}</UBadge></div></div>
        </section>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
.operations-page { max-width: 1480px; }
.settings-layout :deep(button) { font-size: 0.6875rem; }
.settings-layout :deep(.setting-row) { min-height: 3.25rem; }
</style>

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
const { handleTabKey } = useTabKeyboard()

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
    <ProductPageHeader eyebrow="Viewer" title="Viewer settings" description="Prototype the map viewer configuration, accessibility and appearance controls.">
      <template #actions><UButton label="Reset demo" color="neutral" variant="outline" @click="resetSettings" /></template>
    </ProductPageHeader>

    <p v-if="resetMessage" class="sr-only" role="status">{{ resetMessage }}</p>

    <div class="settings-layout grid">
      <UCard :ui="{ body: 'p-2 sm:p-2' }" class="h-fit overflow-hidden">
        <nav class="settings-nav flex flex-col gap-1" role="tablist" aria-label="Viewer settings sections">
          <button v-for="(tab, index) in tabs" :key="tab.id" :data-settings-tab="tab.id" type="button" role="tab" :aria-selected="activeTab === tab.id" :tabindex="activeTab === tab.id ? 0 : -1" class="settings-nav-item shrink-0 text-left transition" :class="activeTab === tab.id ? 'active' : 'hover:bg-elevated/70 hover:text-highlighted'" @keydown="handleTabKey($event, index, tabs.length, nextIndex => activeTab = tabs[nextIndex]!.id, '[data-settings-tab]')" @click="activeTab = tab.id">{{ tab.label }}</button>
        </nav>
      </UCard>

      <UCard :ui="{ body: 'p-0 sm:p-0' }" class="overflow-hidden">
        <section v-if="activeTab === 'general'" class="p-[18px]">
          <h2 class="setting-heading">General viewer behavior</h2>
          <p class="setting-intro">Viewer behavior and accessibility preferences.</p>
          <div>
            <ProductSettingRow title="Light UI mode" description="Keep Situm Explore light-only for this product phase."><USwitch :model-value="true" disabled aria-label="Light UI mode locked on" /></ProductSettingRow>
            <ProductSettingRow title="Show user settings" description="Expose viewer accessibility controls."><USwitch v-model="showUserSettings" aria-label="Show user settings" /></ProductSettingRow>
            <ProductSettingRow title="Follow user by default" description="Center the map on the selected realtime position."><USwitch v-model="followUser" aria-label="Follow user by default" /></ProductSettingRow>
            <ProductSettingRow title="Language" description="Map Viewer interface language."><USelect v-model="language" :items="['English', 'Bahasa Indonesia']" aria-label="Map Viewer interface language" class="w-full sm:w-[160px]" /></ProductSettingRow>
          </div>
        </section>

        <section v-else-if="activeTab === 'navigation'" class="p-[18px]">
          <h2 class="setting-heading">Navigation</h2><p class="setting-intro">Route behavior reflected from local directions preferences.</p>
          <div>
            <ProductSettingRow title="Prefer shortest route" description="Default directions strategy."><USwitch v-model="preferShortestRoute" aria-label="Prefer shortest route" /></ProductSettingRow>
            <ProductSettingRow title="Accessible routes" description="Avoid stairs when accessibility is requested."><USwitch v-model="accessibleRoutes" aria-label="Accessible routes" /></ProductSettingRow>
            <ProductSettingRow title="Excluded tags" description="Local path tags excluded from directions."><UInput v-model="excludedTags" aria-label="Excluded path tags" class="w-[220px]" /></ProductSettingRow>
          </div>
        </section>

        <section v-else-if="activeTab === 'map'" class="p-[18px]">
          <h2 class="setting-heading">Map configuration</h2><p class="setting-intro">Configuration profile and viewer interaction defaults.</p>
          <div>
            <ProductSettingRow title="Configuration profile" description="Map behavior profile."><USelect v-model="configurationProfile" :items="['default', 'poc-workspace']" aria-label="Configuration profile" class="w-[170px]" /></ProductSettingRow>
            <ProductSettingRow title="Default building" description="Building selected when opening the viewer."><USelect v-model="defaultBuilding" :items="['Main Building', 'Warehouse Demo']" aria-label="Default building" class="w-[190px]" /></ProductSettingRow>
            <ProductSettingRow title="Default floor" description="Initial floor when available."><USelect v-model="defaultFloor" :items="['Floor 1', 'Floor 2']" aria-label="Default floor" class="w-[150px]" /></ProductSettingRow>
          </div>
        </section>

        <section v-else-if="activeTab === 'styles'" class="p-[18px]">
          <h2 class="setting-heading">Map styles</h2><p class="setting-intro">Read-only preview of style profiles; no upload action in this Only Read POC.</p>
          <div class="grid gap-3 sm:grid-cols-3"><div v-for="style in [{ name: 'Default light', tone: 'bg-gradient-to-br from-slate-50 to-slate-200' }, { name: 'High contrast', tone: 'bg-gradient-to-br from-white to-slate-300' }, { name: 'Brand neutral', tone: 'bg-gradient-to-br from-zinc-50 to-zinc-200' }]" :key="style.name" class="soft-card p-[13px] cursor-not-allowed"><strong class="text-[11px] text-highlighted">{{ style.name }}</strong><div class="mt-2.5 h-20 rounded-[9px]" :class="style.tone" /></div></div>
        </section>

        <section v-else class="p-[18px]">
          <h2 class="setting-heading">Images</h2><p class="setting-intro">Referenced POI, category and floor resources.</p>
          <div class="activity-list"><ProductActivityRow v-for="image in [{ name: 'poi-reception.svg', detail: 'POI icon · 6 KB', status: 'Referenced' }, { name: 'category-workspace.svg', detail: 'POI category icon · 5 KB', status: 'Referenced' }, { name: 'floor-1-map.png', detail: 'Floor resource · 842 KB', status: 'Active' }]" :key="image.name" :title="image.name" :meta="image.detail" :dot-tone="image.status === 'Active' ? 'success' : 'info'">
            <template #trailing><ProductStatusBadge :label="image.status" :tone="image.status === 'Active' ? 'success' : 'neutral'" /></template>
          </ProductActivityRow></div>
        </section>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
.operations-page { max-width: 1480px; }
.settings-layout { grid-template-columns: 220px minmax(0, 1fr); gap: 14px; }
.setting-heading { margin: 0 0 4px; font-size: 13px; font-weight: 600; color: var(--ui-text-highlighted); }
.setting-intro { margin: 0 0 18px; font-size: 10px; line-height: 1.4; color: var(--ui-text-muted); }
.settings-nav-item { width: 100%; min-height: 35px; padding: 0 9px; border-radius: 8px; font-size: 11px; color: var(--ui-text-muted); }
.settings-nav-item.active { background: #eef0f2; color: #111827; font-weight: 600; }

@media (max-width: 800px) {
  .settings-layout { grid-template-columns: 1fr; }
  .settings-nav { flex-direction: row; overflow-x: auto; }
  .settings-nav-item { width: auto; min-width: max-content; }
}
</style>

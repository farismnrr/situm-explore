<script setup lang="ts">
import { getSafeErrorMessage, useWorkspaceContext, type WorkspaceSitumConfig, type WorkspaceSummary } from '~/composables/useWorkspaceContext'

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Workspaces' })

const { workspaces, selectedWorkspaceId, selectedWorkspace, loadWorkspaces, selectWorkspace } = useWorkspaceContext()
const loading = ref(true)
const saving = ref(false)
const validating = ref(false)
const message = ref('')
const errorMessage = ref('')
const newName = ref('')
const renameName = ref('')
const apiKey = ref('')
const viewerApiKey = ref('')
const config = ref<WorkspaceSitumConfig | null>(null)

async function loadConfig() {
  config.value = null
  if (!selectedWorkspaceId.value) return
  try {
    config.value = await $fetch<WorkspaceSitumConfig>(`/api/workspaces/${selectedWorkspaceId.value}/situm-config`)
  } catch (error: unknown) {
    const status = (error as { statusCode?: number, data?: { statusCode?: number } })
    if (status.statusCode !== 404 && status.data?.statusCode !== 404) errorMessage.value = getSafeErrorMessage(error, 'Workspace configuration could not be loaded.')
  }
}

async function refresh() {
  loading.value = true
  errorMessage.value = ''
  try {
    await loadWorkspaces()
    await loadConfig()
    renameName.value = selectedWorkspace.value?.name ?? ''
  } catch (error: unknown) {
    errorMessage.value = getSafeErrorMessage(error, 'Workspaces could not be loaded.')
  } finally {
    loading.value = false
  }
}

async function createWorkspace() {
  if (!newName.value.trim()) return
  saving.value = true; errorMessage.value = ''; message.value = ''
  try {
    const workspace = await $fetch<WorkspaceSummary>('/api/workspaces', { method: 'POST', body: { name: newName.value } })
    newName.value = ''
    await loadWorkspaces()
    selectWorkspace(workspace.id)
    await loadConfig()
    message.value = 'Workspace created.'
  } catch (error: unknown) { errorMessage.value = getSafeErrorMessage(error, 'Workspace could not be created.') } finally { saving.value = false }
}

async function renameWorkspace() {
  if (!selectedWorkspaceId.value || !renameName.value.trim()) return
  saving.value = true; errorMessage.value = ''; message.value = ''
  try {
    await $fetch(`/api/workspaces/${selectedWorkspaceId.value}`, { method: 'PATCH', body: { name: renameName.value } })
    await loadWorkspaces(); message.value = 'Workspace renamed.'
  } catch (error: unknown) { errorMessage.value = getSafeErrorMessage(error, 'Workspace could not be renamed.') } finally { saving.value = false }
}

async function deleteWorkspace() {
  if (!selectedWorkspaceId.value || !selectedWorkspace.value || !window.confirm(`Delete ${selectedWorkspace.value.name}? This cannot be undone.`)) return
  saving.value = true; errorMessage.value = ''; message.value = ''
  try {
    await $fetch(`/api/workspaces/${selectedWorkspaceId.value}`, { method: 'DELETE' })
    await loadWorkspaces(); message.value = 'Workspace deleted.'
    await loadConfig()
    renameName.value = selectedWorkspace.value?.name ?? ''
  } catch (error: unknown) { errorMessage.value = getSafeErrorMessage(error, 'Workspace could not be deleted.') } finally { saving.value = false }
}

async function saveConfig() {
  if (!selectedWorkspaceId.value || !apiKey.value || !viewerApiKey.value) return
  saving.value = true; errorMessage.value = ''; message.value = ''
  try {
    config.value = await $fetch<WorkspaceSitumConfig & { configured: boolean }>(`/api/workspaces/${selectedWorkspaceId.value}/situm-config`, { method: 'PUT', body: { apiKey: apiKey.value, viewerApiKey: viewerApiKey.value } })
    apiKey.value = ''
    viewerApiKey.value = ''
    message.value = 'Situm configuration saved. The credential will not be shown again.'
  } catch (error: unknown) { errorMessage.value = getSafeErrorMessage(error, 'Situm configuration could not be saved.') } finally { saving.value = false }
}

async function deleteConfig() {
  if (!selectedWorkspaceId.value || !config.value || !window.confirm('Delete the stored Situm configuration for this workspace? This cannot be undone.')) return
  saving.value = true; errorMessage.value = ''; message.value = ''
  try {
    await $fetch(`/api/workspaces/${selectedWorkspaceId.value}/situm-config`, { method: 'DELETE' })
    config.value = null
    message.value = 'Situm configuration deleted.'
  } catch (error: unknown) { errorMessage.value = getSafeErrorMessage(error, 'Situm configuration could not be deleted.') } finally { saving.value = false }
}

async function validateConfig() {
  if (!selectedWorkspaceId.value || !config.value) return
  validating.value = true; errorMessage.value = ''; message.value = ''
  try {
    await $fetch(`/api/workspaces/${selectedWorkspaceId.value}/situm-config/validate`, { method: 'POST' })
    message.value = 'Situm configuration validated and account context matched.'
  } catch (error: unknown) { errorMessage.value = getSafeErrorMessage(error, 'Situm configuration could not be validated.') } finally { validating.value = false }
}

watch(selectedWorkspaceId, async () => { renameName.value = selectedWorkspace.value?.name ?? ''; await loadConfig() })
onMounted(refresh)
</script>

<template>
  <div class="operations-page space-y-6">
    <ProductPageHeader eyebrow="Workspace" title="Workspaces" description="Create private workspaces and manage their server-side Situm configuration.">
      <template #actions><UBadge color="neutral" variant="soft">{{ loading ? 'Loading' : `${workspaces.length} workspace${workspaces.length === 1 ? '' : 's'}` }}</UBadge></template>
    </ProductPageHeader>
    <UAlert v-if="errorMessage" color="error" variant="subtle" title="Action could not be completed" :description="errorMessage" />
    <UAlert v-if="message" color="success" variant="subtle" title="Done" :description="message" />
    <div class="grid gap-4 lg:grid-cols-[minmax(16rem,0.75fr)_minmax(0,1.5fr)]">
      <UCard :ui="{ body: 'space-y-4' }">
        <div><h2 class="font-semibold text-highlighted">Your workspaces</h2><p class="mt-1 text-xs text-muted">Only you can access these workspaces.</p></div>
        <div v-if="loading" class="text-sm text-muted">Loading workspaces…</div>
        <div v-else-if="workspaces.length" class="space-y-1">
          <button v-for="workspace in workspaces" :key="workspace.id" type="button" class="w-full rounded-lg border px-3 py-2.5 text-left text-sm transition" :class="selectedWorkspaceId === workspace.id ? 'border-primary bg-elevated text-highlighted' : 'border-default text-muted hover:bg-elevated'" @click="selectWorkspace(workspace.id)">{{ workspace.name }}</button>
        </div>
        <p v-else class="text-sm text-muted">Create a workspace to begin.</p>
        <div class="border-t border-default pt-4"><UFormField label="New workspace"><div class="flex gap-2"><UInput v-model="newName" placeholder="Operations" class="min-w-0 flex-1" @keyup.enter="createWorkspace" /><UButton label="Create" :loading="saving" :disabled="!newName.trim() || saving" @click="createWorkspace" /></div></UFormField></div>
      </UCard>
      <div v-if="selectedWorkspace" class="space-y-4">
        <UCard :ui="{ body: 'space-y-4' }">
          <div class="flex flex-wrap items-start justify-between gap-3"><div><p class="text-xs uppercase tracking-wider text-muted">Selected workspace</p><h2 class="mt-1 text-lg font-semibold text-highlighted">{{ selectedWorkspace.name }}</h2></div><UBadge color="success" variant="soft">Owner access</UBadge></div>
          <div class="flex flex-col gap-2 sm:flex-row"><UInput v-model="renameName" aria-label="Workspace name" class="min-w-0 flex-1" /><UButton label="Rename" color="neutral" variant="outline" :loading="saving" :disabled="!renameName.trim() || saving" @click="renameWorkspace" /><UButton label="Delete" color="error" variant="soft" :loading="saving" :disabled="saving" @click="deleteWorkspace" /></div>
        </UCard>
        <UCard :ui="{ body: 'space-y-4' }">
          <div><h2 class="font-semibold text-highlighted">Situm configuration</h2><p class="mt-1 text-xs leading-5 text-muted">Credentials are encrypted on the server. The stored API key is never returned or shown again.</p></div>
          <div v-if="config" class="grid gap-3 rounded-lg border border-default bg-elevated p-3 text-xs sm:grid-cols-3"><div><span class="block text-muted">Status</span><strong class="text-highlighted">Configured</strong></div><div><span class="block text-muted">Account</span><strong class="break-all text-highlighted">{{ config.situmAccountId }}</strong></div><div><span class="block text-muted">Viewer credential</span><strong class="text-highlighted">{{ config.viewerConfigured ? 'Configured' : 'Not configured' }}</strong></div></div>
          <UAlert v-else color="neutral" variant="subtle" title="Not configured" description="Add a primary Situm Read & Write API key and a separate read-only Viewer API key to connect this workspace." />
          <UFormField label="Primary Read & Write API key" hint="Required to add or replace the stored credentials"><UInput v-model="apiKey" type="password" autocomplete="new-password" placeholder="Enter a new key" class="w-full" /></UFormField>
          <UFormField label="Read-only Viewer API key" hint="Required for the browser Viewer; write-only and never returned"><UInput v-model="viewerApiKey" type="password" autocomplete="new-password" placeholder="Enter a read-only key" class="w-full" /></UFormField>
          <div class="flex flex-wrap gap-2">
            <UButton label="Save configuration" :loading="saving" :disabled="saving || !apiKey || !viewerApiKey" @click="saveConfig" />
            <UButton v-if="config" label="Validate configuration" color="neutral" variant="outline" :loading="validating" :disabled="saving || validating" @click="validateConfig" />
            <UButton v-if="config" label="Delete configuration" color="error" variant="soft" :loading="saving" :disabled="saving || validating" @click="deleteConfig" />
          </div>
        </UCard>
      </div>
      <UCard v-else-if="!loading"><div class="py-8 text-center"><h2 class="font-semibold text-highlighted">No workspace selected</h2><p class="mt-1 text-sm text-muted">Create your first private workspace to configure Situm.</p></div></UCard>
    </div>
  </div>
</template>

<style scoped>.operations-page { max-width: 1480px; }</style>

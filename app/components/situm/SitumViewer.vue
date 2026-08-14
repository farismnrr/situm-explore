<script setup lang="ts">
import type { RouteType } from '@situm/sdk-js'

const emit = defineEmits<{ status: [state: 'loading' | 'ready' | 'error', message?: string] }>()
const message = 'Workspace Viewer authentication is not configured. The Viewer is disabled until a scoped browser credential is proven safe.'
function disabled(): never { throw new Error(message) }
function selectBuilding(_id: number) { return disabled() }
function selectFloor(_id: number) { return disabled() }
function selectPoi(_id: number) { return disabled() }
function setLanguage(_language: string) { return disabled() }
function showUserSettings(_visible: boolean) { return disabled() }
function updateFontSize(_size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl') { return disabled() }
function openLocationPicker() { return disabled() }
function loadRealtimePositions(_buildingId?: number, _refreshRateMs?: number) { return disabled() }
function cleanRealtimePositions() { return disabled() }
function startDirections(_from: number, _to: number, _routeType?: RouteType) { return disabled() }
function cancelDirections() { return disabled() }
defineExpose({ selectBuilding, selectFloor, selectPoi, setLanguage, showUserSettings, updateFontSize, openLocationPicker, loadRealtimePositions, cleanRealtimePositions, startDirections, cancelDirections })
onMounted(() => emit('status', 'error', message))
</script>

<template>
  <UCard :ui="{ root: 'h-full flex flex-col', body: 'h-full flex-1 p-0 sm:p-0' }">
    <div class="relative min-h-[22rem] h-full w-full overflow-hidden rounded-lg bg-muted">
      <div class="absolute inset-0 flex items-center justify-center bg-default px-6"><UAlert color="warning" variant="subtle" title="Map Viewer unavailable" :description="message" class="max-w-md" /></div>
    </div>
  </UCard>
</template>

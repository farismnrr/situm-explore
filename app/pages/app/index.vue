<script setup lang="ts">
import { homeActivity, homeBuilding, homeExplore, homeMetrics } from '~/data/prototype/home'

definePageMeta({ middleware: 'auth', layout: 'app', title: 'Home' })

const { user } = useUserSession()
const firstName = computed(() => user.value?.email?.split('@')[0]?.split(/[._-]/)[0] || 'there')
</script>

<template>
  <div class="home-page mx-auto max-w-6xl">
    <UCard class="welcome-card mb-4" :ui="{ body: 'p-5 sm:p-6' }">
      <div class="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p class="eyebrow">Good afternoon</p>
          <h1 class="mt-1 text-2xl font-semibold tracking-tight text-highlighted">Welcome back, {{ firstName }}.</h1>
          <p class="mt-2 max-w-xl text-sm leading-6 text-muted">Your indoor workspace is healthy. Pick up from the map, check live positions, or explore cartography.</p>
        </div>
        <div class="flex shrink-0 flex-wrap gap-2">
          <UButton to="/app/realtime" color="neutral" variant="outline">View realtime</UButton>
          <UButton to="/app/map">Open map <span aria-hidden="true">→</span></UButton>
        </div>
      </div>
    </UCard>

    <div class="stat-grid mb-4">
      <UCard v-for="metric in homeMetrics" :key="metric.label" :ui="{ body: 'p-4' }">
        <span class="text-xs text-muted">{{ metric.label }}</span>
        <strong class="mt-2 block text-2xl tracking-tight text-highlighted">{{ metric.value }}</strong>
        <small class="mt-1 block text-xs" :class="metric.positive ? 'text-success' : 'text-muted'">{{ metric.note }}</small>
      </UCard>
    </div>

    <div class="content-grid mb-4">
      <UCard :ui="{ body: 'p-0' }" class="overflow-hidden">
        <div class="panel-head flex items-start justify-between gap-3 p-4 pb-3">
          <div><h2 class="font-semibold text-highlighted">{{ homeBuilding.name }}</h2><p class="mt-1 text-xs text-muted">{{ homeBuilding.organization }} · {{ homeBuilding.floor }}</p></div>
          <UButton to="/app/map" size="sm" color="neutral" variant="outline">Open viewer</UButton>
        </div>
        <div class="building-preview" aria-label="Local preview of the main building floor">
          <div class="building-floor" /><i class="preview-pin pin-a" /><i class="preview-pin pin-b" /><i class="preview-pin pin-c" />
        </div>
        <div class="flex items-center justify-between border-t border-default px-4 py-3 text-xs text-muted"><span>Viewer status</span><UBadge color="success" variant="soft"><span class="mr-1.5 size-1.5 rounded-full bg-success" />{{ homeBuilding.status }}</UBadge></div>
      </UCard>

      <UCard :ui="{ body: 'p-0' }">
        <div class="flex items-center justify-between border-b border-default p-4"><h2 class="font-semibold text-highlighted">Recent activity</h2><span class="text-xs text-muted">Today</span></div>
        <div class="divide-y divide-default">
          <div v-for="activity in homeActivity" :key="activity.title" class="flex items-start gap-3 px-4 py-3">
            <span class="activity-dot mt-1.5" :class="`tone-${activity.tone}`" /><div class="min-w-0 flex-1"><strong class="block text-sm font-medium text-highlighted">{{ activity.title }}</strong><span class="mt-0.5 block text-xs text-muted">{{ activity.detail }}</span></div><time class="text-xs text-muted">{{ activity.time }}</time>
          </div>
        </div>
      </UCard>
    </div>

    <UCard :ui="{ body: 'p-0' }">
      <div class="border-b border-default p-4"><h2 class="font-semibold text-highlighted">Quick explore</h2><p class="mt-1 text-xs text-muted">Common Situm web surfaces</p></div>
      <div class="quick-grid p-4">
        <NuxtLink v-for="item in homeExplore" :key="item.to" :to="item.to" class="quick-card rounded-lg border border-default p-4 transition hover:border-primary hover:bg-elevated">
          <span class="mb-4 grid size-9 place-items-center rounded-lg border border-default bg-elevated text-lg text-highlighted" aria-hidden="true">{{ item.icon }}</span><strong class="block text-sm text-highlighted">{{ item.title }}</strong><span class="mt-1 block text-xs leading-5 text-muted">{{ item.detail }}</span>
        </NuxtLink>
      </div>
    </UCard>
  </div>
</template>

<style scoped>
.eyebrow { color: var(--ui-text-muted); font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; }
.welcome-card { background: linear-gradient(135deg, var(--ui-bg) 0%, var(--ui-bg-elevated) 100%); }
.stat-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }
.content-grid { display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr); gap: 1rem; }
.building-preview { position: relative; min-height: 14rem; overflow: hidden; background: repeating-linear-gradient(0deg, #fafbfc 0 1.5rem, #f0f2f4 1.5625rem), repeating-linear-gradient(90deg, transparent 0 1.5rem, #f0f2f4 1.5625rem); }
.building-floor { position: absolute; inset: 15% 12%; border: 2px solid #d3d8de; border-radius: 1rem; background: white; transform: rotate(-3deg); }
.building-floor::before { content: ''; position: absolute; inset: 18% 12%; border: 1px solid #dde1e6; border-radius: 0.6rem; }
.preview-pin { position: absolute; width: 0.75rem; height: 0.75rem; border-radius: 999px; background: #2563eb; box-shadow: 0 0 0 0.25rem rgb(37 99 235 / 12%); }
.pin-a { left: 36%; top: 34%; }.pin-b { left: 62%; top: 58%; background: #168754; box-shadow: 0 0 0 0.25rem rgb(22 135 84 / 12%); }.pin-c { left: 70%; top: 30%; background: #7c3aed; box-shadow: 0 0 0 0.25rem rgb(124 58 237 / 12%); }
.quick-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.75rem; }
.activity-dot { flex: 0 0 auto; width: 0.4rem; height: 0.4rem; border-radius: 999px; background: var(--ui-text-muted); }.tone-success { background: #168754; }.tone-info { background: #2563eb; }.tone-warning { background: #d97706; }
@media (max-width: 900px) { .stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) { .content-grid, .quick-grid { grid-template-columns: 1fr; } .stat-grid { grid-template-columns: 1fr; } }
</style>

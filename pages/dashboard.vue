<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { data, error } = await useFetch('/api/me')

const connectivityLabel = computed(() => {
  if (error.value) return error.value.statusMessage || 'Unavailable'
  if (!data.value) return 'Checking…'
  if (data.value.status === 'not-migrated') return 'Setup required'
  return 'Connected'
})
</script>

<template>
  <AppShell>
    <div class="mx-auto max-w-6xl space-y-5 sm:space-y-6">
      <header class="space-y-1">
        <h1 class="text-2xl font-semibold tracking-tight text-highlighted sm:text-3xl">Building map</h1>
        <p class="text-sm text-muted">Explore your building in Situm.</p>
      </header>

      <SitumViewer />

      <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-default pt-3 text-sm">
        <span class="text-muted">Application status</span>
        <span class="text-highlighted">{{ connectivityLabel }}</span>
      </div>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { cartographyBuildings, cartographyPois } from '~/data/prototype/cartography'

const { user, clear } = useUserSession()
const mobileOpen = ref(false)
const isDesktop = ref(false)
const searchOpen = ref(false)
const searchQuery = ref('')
const displayName = computed(() => {
  const localPart = user.value?.email?.split('@')[0] || 'Workspace user'
  return localPart.split(/[._-]/).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
})
const initials = computed(() => displayName.value.split(' ').map(part => part.charAt(0)).slice(0, 2).join('').toUpperCase())
const syncStatus = ref('')

const searchDestinations = [
  { label: 'Home', detail: 'Workspace', to: '/app', icon: '⌂' },
  { label: 'Dashboard', detail: 'Workspace', to: '/app/dashboard', icon: '▦' },
  { label: 'Map Viewer', detail: 'Workspace', to: '/app/map', icon: '⌖' },
  { label: 'Buildings & floors', detail: 'Cartography', to: '/app/buildings', icon: '▤' },
  { label: 'Points of interest', detail: 'Cartography', to: '/app/pois', icon: '◇' },
  { label: 'Realtime', detail: 'Operations', to: '/app/realtime', icon: '●' },
  { label: 'Analytics & reports', detail: 'Operations', to: '/app/analytics', icon: '▥' },
  { label: 'Settings', detail: 'Organization', to: '/app/settings', icon: '⚙' }
]

const searchResults = computed(() => {
  const records = [
    ...searchDestinations,
    ...cartographyBuildings.map(building => ({ label: building.name, detail: `Building · ${building.floors.length} floors`, to: '/app/buildings', icon: '◇' })),
    ...cartographyPois.map(poi => ({ label: poi.name, detail: `POI · ${poi.category} · ${poi.floor}`, to: '/app/pois', icon: '●' }))
  ]
  const query = searchQuery.value.trim().toLowerCase()
  return query ? records.filter((record) => `${record.label} ${record.detail}`.toLowerCase().includes(query)) : records
})

function openSearch() {
  searchOpen.value = true
}

function closeSearch() {
  searchOpen.value = false
  searchQuery.value = ''
}

function handleGlobalShortcut(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    openSearch()
  }
  if (event.key === 'Escape' && searchOpen.value) closeSearch()
}

onMounted(() => window.addEventListener('keydown', handleGlobalShortcut))
onBeforeUnmount(() => window.removeEventListener('keydown', handleGlobalShortcut))

let desktopMedia: MediaQueryList | undefined
function updateDesktopState() {
  isDesktop.value = desktopMedia?.matches ?? false
}

onMounted(() => {
  desktopMedia = window.matchMedia('(min-width: 1024px)')
  updateDesktopState()
  desktopMedia.addEventListener('change', updateDesktopState)
})
onBeforeUnmount(() => desktopMedia?.removeEventListener('change', updateDesktopState))

const navigationHidden = computed(() => !isDesktop.value && !mobileOpen.value)

const navigation = [
  { group: 'Workspace', items: [{ label: 'Home', to: '/app', icon: '⌂' }, { label: 'Dashboard', to: '/app/dashboard', icon: '▦' }, { label: 'Map', to: '/app/map', icon: '⌖' }] },
  { group: 'Cartography', items: [{ label: 'Buildings & floors', to: '/app/buildings', icon: '▤' }, { label: 'Points of interest', to: '/app/pois', icon: '◇' }, { label: 'Geofences', to: '/app/geofences', icon: '◎' }, { label: 'Paths & routing', to: '/app/paths', icon: '↗' }] },
  { group: 'Operations', items: [{ label: 'Realtime', to: '/app/realtime', icon: '●' }, { label: 'Analytics & reports', to: '/app/analytics', icon: '▥' }, { label: 'Alarms', to: '/app/alarms', icon: '!' }] },
  { group: 'Organization', items: [{ label: 'Users & groups', to: '/app/users', icon: '♙' }, { label: 'Organization', to: '/app/organization', icon: '◫' }, { label: 'Settings', to: '/app/settings', icon: '⚙' }] }
]

async function logout() {
  await clear()
  await navigateTo('/')
}

function syncWorkspace() {
  syncStatus.value = 'Workspace data refreshed locally.'
  window.setTimeout(() => { syncStatus.value = '' }, 2200)
}
</script>

<template>
  <div>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <div class="app-shell flex min-h-screen bg-default text-default">
    <button v-if="mobileOpen" class="fixed inset-0 z-30 bg-gray-950/25 lg:hidden" aria-label="Close navigation" @click="mobileOpen = false" />
    <aside id="workspace-navigation" class="app-sidebar fixed inset-y-0 left-0 z-40 flex w-[228px] -translate-x-full flex-col border-r border-default bg-default transition-transform lg:translate-x-0" :class="{ 'translate-x-0': mobileOpen }" :aria-hidden="navigationHidden ? 'true' : undefined" :inert="navigationHidden">
      <div class="flex h-16 items-center border-b border-default px-4">
        <NuxtLink to="/" class="flex items-center gap-2 text-sm font-semibold tracking-tight text-highlighted" @click="mobileOpen = false">
          <BrandMark size="sm" /><span>Situm Explore</span>
        </NuxtLink>
      </div>
      <nav class="flex-1 overflow-y-auto px-2.5 py-3" aria-label="Workspace navigation">
        <div v-for="section in navigation" :key="section.group" class="mb-5">
          <p class="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">{{ section.group }}</p>
          <NuxtLink v-for="item in section.items" :key="item.to" :to="item.to" class="group mb-0.5 flex min-h-9 items-center gap-2 rounded-lg px-2.5 text-xs text-muted transition hover:bg-elevated hover:text-highlighted" active-class="bg-elevated font-medium text-highlighted" @click="mobileOpen = false">
            <span class="grid size-[18px] place-items-center text-sm text-muted group-[.text-highlighted]:text-highlighted" aria-hidden="true">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </NuxtLink>
        </div>
      </nav>
      <div class="border-t border-default p-2.5">
        <div class="flex items-center gap-2 rounded-lg px-2 py-2">
          <span class="grid size-7 shrink-0 place-items-center rounded-full bg-elevated text-[11px] font-semibold text-highlighted">{{ initials }}</span>
          <span class="user-meta min-w-0 flex-1"><strong class="block truncate text-[11px] text-highlighted">{{ displayName }}</strong><span class="block truncate text-[10px] text-muted">{{ user?.email }}</span></span>
          <span class="text-muted" aria-hidden="true">⋯</span>
        </div>
        <UButton block label="Sign out" color="neutral" variant="ghost" size="sm" class="mt-0.5 justify-start px-2.5 text-xs" @click="logout" />
      </div>
    </aside>

    <div class="app-shell-main min-w-0 flex-1 lg:pl-[228px]">
      <header class="sticky top-0 z-20 flex h-16 min-w-0 items-center justify-between gap-2 border-b border-default bg-default/90 px-3 backdrop-blur sm:gap-3 sm:px-[22px]">
        <div class="flex min-w-0 items-center gap-3">
          <UButton icon="i-lucide-menu" aria-label="Open navigation" aria-controls="workspace-navigation" :aria-expanded="mobileOpen" color="neutral" variant="ghost" class="lg:hidden" @click="mobileOpen = true" />
          <p class="truncate text-xs text-muted">Workspace <span class="px-1">/</span> <span class="text-highlighted">{{ $route.meta.title || 'Home' }}</span></p>
        </div>
        <div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button class="search-trigger hidden sm:flex" type="button" aria-haspopup="dialog" @click="openSearch"><span class="flex items-center gap-2"><UIcon name="i-lucide-search" />Search anything…</span><kbd>⌘ K</kbd></button>
          <UButton label="Sync" color="neutral" variant="ghost" size="sm" class="hidden sm:inline-flex" @click="syncWorkspace" />
          <UBadge color="success" variant="soft" class="hidden sm:inline-flex"><span class="mr-1.5 size-1.5 rounded-full bg-success" />POC configured</UBadge>
        </div>
      </header>
      <p v-if="syncStatus" class="sr-only" role="status">{{ syncStatus }}</p>
      <main id="main-content" tabindex="-1" class="app-content mx-auto min-h-[calc(100vh-4rem)] w-full max-w-[1480px] px-4 py-6 outline-none sm:px-6 lg:px-7 lg:py-[30px]"><slot /></main>
    </div>
    </div>

    <UModal v-model:open="searchOpen" title="Search Situm Explore" description="Search local workspace destinations and prototype records." :ui="{ content: 'sm:max-w-xl' }" @after:leave="searchQuery = ''">
    <template #body>
      <UInput v-model="searchQuery" autofocus icon="i-lucide-search" placeholder="Search buildings, POIs, users, reports…" aria-label="Search workspace" class="w-full" />
      <div class="mt-3 max-h-80 overflow-y-auto">
        <NuxtLink v-for="result in searchResults" :key="`${result.to}-${result.label}`" :to="result.to" class="flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-elevated" @click="closeSearch">
          <span class="grid size-8 shrink-0 place-items-center rounded-md bg-elevated text-sm text-highlighted" aria-hidden="true">{{ result.icon }}</span>
          <span class="min-w-0"><strong class="block truncate text-sm text-highlighted">{{ result.label }}</strong><span class="block truncate text-xs text-muted">{{ result.detail }}</span></span>
        </NuxtLink>
        <p v-if="searchResults.length === 0" class="px-3 py-6 text-center text-sm text-muted">No local results found.</p>
      </div>
    </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const { user, clear } = useUserSession()

async function logout() {
  await clear()
  await navigateTo('/')
}
</script>

<template>
  <div class="min-h-screen bg-default">
    <header class="border-b border-default bg-default">
      <div class="mx-auto flex min-h-14 w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <p class="text-sm font-semibold tracking-tight text-highlighted">Situm Explore</p>

        <div class="flex min-w-0 items-center gap-2">
          <span class="max-w-[min(52vw,13rem)] truncate text-sm text-muted">{{ user?.email }}</span>
          <UButton variant="ghost" color="neutral" size="sm" @click="logout">Log out</UButton>
        </div>
      </div>
    </header>

    <main class="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <slot />
    </main>
  </div>
</template>

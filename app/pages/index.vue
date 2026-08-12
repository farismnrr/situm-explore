<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
const { loggedIn, user } = useUserSession()
const email = ref('')
const password = ref('')
const error = ref('')
const isSubmitting = ref(false)

async function login() {
  error.value = ''
  isSubmitting.value = true

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    await navigateTo('/dashboard')
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Unable to sign in.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-default px-4 py-10 sm:px-6">
    <UCard class="w-full max-w-md" :ui="{ body: 'p-6 sm:p-8' }">
      <div class="space-y-8">
        <header class="space-y-2">
          <p class="text-sm font-medium text-primary">Situm Explore</p>
          <h1 class="text-2xl font-semibold tracking-tight text-highlighted">Sign in to your workspace</h1>
          <p class="text-sm leading-6 text-muted">Use your account credentials to continue.</p>
        </header>

        <div v-if="loggedIn" class="space-y-5">
          <p class="text-sm text-muted">You are signed in as <span class="font-medium text-default">{{ user?.email }}</span>.</p>
          <UButton to="/dashboard" block>Continue to dashboard</UButton>
        </div>

        <form v-else class="space-y-5" autocomplete="on" @submit.prevent="login">
          <UFormField label="Email" name="email">
            <UInput id="email" v-model="email" class="w-full" type="email" autocomplete="username" required />
          </UFormField>
          <UFormField label="Password" name="password">
            <UInput id="password" v-model="password" class="w-full" type="password" autocomplete="current-password" required />
          </UFormField>
          <UAlert v-if="error" id="login-error" role="alert" color="error" variant="soft" title="Sign-in failed" :description="error" />
          <UButton type="submit" block :loading="isSubmitting" :disabled="isSubmitting">Sign in</UButton>
        </form>
      </div>
    </UCard>
  </main>
</template>

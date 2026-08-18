<script setup lang="ts">
const { loggedIn, fetch: refreshSession } = useUserSession()
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

if (loggedIn.value) await navigateTo('/app', { replace: true })

async function submit() {
  errorMessage.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/register', { method: 'POST', body: { email: email.value, password: password.value } })
    await refreshSession()
    await navigateTo('/app')
  } catch (error: unknown) {
    const fetchError = error as { data?: { statusMessage?: string }; statusMessage?: string }
    errorMessage.value = fetchError.data?.statusMessage || fetchError.statusMessage || 'Unable to create your account. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthShell active="register" title="Create your account" intro="Set up your Situm Explore account to continue.">
    <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
    <form class="auth-form" @submit.prevent="submit">
      <UFormField label="Email" name="email" required>
        <UInput v-model="email" type="email" autocomplete="email" placeholder="you@example.com" required class="w-full" />
      </UFormField>
      <UFormField label="Password" name="password" required hint="At least 8 characters">
        <PasswordInput v-model="password" autocomplete="new-password" placeholder="Create a password" minlength="8" required class="w-full" />
      </UFormField>
      <UButton type="submit" block size="lg" :loading="loading" :disabled="loading">Create account <span aria-hidden="true">→</span></UButton>
    </form>
    <p class="auth-helper">Already have an account? <NuxtLink to="/login" class="font-medium text-primary">Sign in</NuxtLink></p>
  </AuthShell>
</template>

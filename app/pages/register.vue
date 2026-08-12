<script setup lang="ts">
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const workspace = ref('')
const submitted = ref(false)
const errorMessage = ref('')

function submit() {
  errorMessage.value = ''
  if (!firstName.value.trim() || !lastName.value.trim() || !email.value.trim() || !password.value || !workspace.value.trim()) {
    errorMessage.value = 'Complete the required fields first.'
    submitted.value = false
    return
  }
  submitted.value = true
}
</script>

<template>
  <AuthShell active="register" title="Create your workspace" intro="Set up a local demo workspace to preview the product flow." art-description="This local demo lets you explore the product flow without creating an account." art-context="Explore the product flow with local demo data.">
        <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
        <UAlert v-if="submitted" color="success" variant="soft" title="Local demo ready" description="No account was created. Continue to real sign in when you have an existing account." class="mb-5" role="status">
          <template #actions><UButton to="/login" color="success" variant="solid" size="sm">Go to sign in</UButton></template>
        </UAlert>
        <form class="auth-form" @submit.prevent="submit">
          <div class="auth-form-split">
            <UFormField label="First name" name="firstName" required><UInput v-model="firstName" autocomplete="given-name" required class="w-full" /></UFormField>
            <UFormField label="Last name" name="lastName" required><UInput v-model="lastName" autocomplete="family-name" required class="w-full" /></UFormField>
          </div>
          <UFormField label="Work email" name="email" required><UInput v-model="email" type="email" autocomplete="email" placeholder="you@example.com" required class="w-full" /></UFormField>
          <UFormField label="Password" name="password" required><UInput v-model="password" type="password" autocomplete="new-password" placeholder="Choose a password" required class="w-full" /></UFormField>
          <UFormField label="Workspace name" name="workspace" required><UInput v-model="workspace" autocomplete="organization" placeholder="Situm Explore POC" required class="w-full" /></UFormField>
          <UButton type="submit" block size="lg">Create demo workspace <span aria-hidden="true">→</span></UButton>
        </form>
        <p class="auth-helper">By continuing, you enter a local dummy workspace. No account or session is created.</p>
  </AuthShell>
</template>

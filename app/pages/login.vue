<script setup lang="ts">
const { loggedIn, fetch: refreshSession } = useUserSession()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const redirectPath = computed(() => typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/') ? route.query.redirect : '/app')

if (loggedIn.value) {
  await navigateTo('/app', { replace: true })
}

async function submit() {
  errorMessage.value = ''
  loading.value = true

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    await refreshSession()
    await navigateTo(redirectPath.value)
  } catch (error: unknown) {
    const fetchError = error as { data?: { statusMessage?: string }; statusMessage?: string }
    errorMessage.value = fetchError.data?.statusMessage || fetchError.statusMessage || 'Unable to sign in. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <aside class="auth-art">
      <NuxtLink to="/" class="auth-brand"><BrandMark size="sm" /><span>Situm Explore</span></NuxtLink>
      <div class="auth-art-copy">
        <UBadge color="neutral" variant="soft">Indoor operations, simplified</UBadge>
        <h1>One workspace for maps, movement and spatial context.</h1>
        <p>Bring indoor maps, positioning, routes and operational context into one calm workspace.</p>
        <div class="auth-art-cards">
          <div class="auth-art-card"><strong>Map-first</strong><span>Viewer, POIs, directions, floors and realtime overlays.</span></div>
          <div class="auth-art-card"><strong>POC workspace</strong><span>Explore the product flow with your configured account.</span></div>
        </div>
      </div>
      <span class="auth-art-foot">Situm Explore · 2026</span>
    </aside>

    <section class="auth-panel" aria-labelledby="login-title">
      <div class="auth-box">
        <div class="auth-tabs" role="tablist" aria-label="Account access">
          <span class="auth-tab active" role="tab" aria-selected="true" aria-current="page">Sign in</span>
          <NuxtLink class="auth-tab" role="tab" to="/register">Create account</NuxtLink>
        </div>
        <h2 id="login-title">Welcome back</h2>
        <p class="auth-intro">Sign in to continue to your workspace.</p>

        <UAlert v-if="errorMessage" color="error" variant="soft" title="Sign in failed" :description="errorMessage" class="mb-5" role="alert" />

        <form class="auth-form" @submit.prevent="submit">
          <UFormField label="Email" name="email" required>
            <UInput v-model="email" type="email" autocomplete="email" placeholder="you@example.com" required class="w-full" />
          </UFormField>
          <UFormField label="Password" name="password" required>
            <UInput v-model="password" type="password" autocomplete="current-password" placeholder="Enter your password" required class="w-full" />
          </UFormField>
          <UButton type="submit" block size="lg" :loading="loading" :disabled="loading">Sign in <span aria-hidden="true">→</span></UButton>
        </form>
        <p class="auth-helper">Use the account configured for this Situm Explore environment.</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.auth-page{min-height:100svh;display:grid;grid-template-columns:minmax(300px,.88fr) minmax(420px,1.12fr);background:#fff}.auth-art{display:flex;flex-direction:column;padding:32px clamp(28px,5vw,72px);background:#111827;color:#fff}.auth-brand{display:flex;align-items:center;gap:9px;color:#fff;font-size:14px;font-weight:700}.auth-art-copy{max-width:440px;margin:auto 0}.auth-art-copy h1{font-size:clamp(32px,4vw,52px);line-height:1.05;letter-spacing:-.055em;margin:20px 0 16px}.auth-art-copy p{color:#b7bec8;line-height:1.65;margin:0}.auth-art-cards{display:grid;gap:10px;margin-top:32px}.auth-art-card{border:1px solid #ffffff1f;border-radius:12px;padding:15px;background:#ffffff08}.auth-art-card strong,.auth-art-card span{display:block}.auth-art-card strong{font-size:13px;margin-bottom:5px}.auth-art-card span{color:#9ca6b3;font-size:12px;line-height:1.5}.auth-art-foot{color:#6f7987;font-size:11px}.auth-panel{display:grid;place-items:center;padding:40px 24px}.auth-box{width:min(100%,430px)}.auth-tabs{display:flex;gap:22px;border-bottom:1px solid var(--explore-border);margin-bottom:38px}.auth-tab{padding:0 0 13px;color:var(--explore-foreground-subtle);font-size:13px;text-decoration:none}.auth-tab.active{color:var(--explore-foreground);border-bottom:2px solid var(--explore-accent);font-weight:600}.auth-box h2{font-size:32px;letter-spacing:-.045em;margin:0 0 8px}.auth-intro{color:var(--explore-foreground-muted);font-size:14px;margin:0 0 28px}.auth-form{display:grid;gap:18px}.auth-helper{color:var(--explore-foreground-subtle);font-size:11px;line-height:1.5;margin:22px 0 0}@media(max-width:700px){.auth-page{display:block}.auth-art{min-height:300px;padding:24px}.auth-art-copy{margin:58px 0 0}.auth-art-copy h1{font-size:34px}.auth-art-cards,.auth-art-foot{display:none}.auth-panel{padding:40px 20px 56px}.auth-tabs{margin-bottom:30px}}
@media (max-width: 760px) {
  .auth-page { display: block; }
}
</style>

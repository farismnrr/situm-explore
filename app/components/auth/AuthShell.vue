<script setup lang="ts">
const props = withDefaults(defineProps<{
  active: 'login' | 'register'
  title: string
  intro: string
  artDescription?: string
  artContext?: string
}>(), {
  artDescription: 'Bring indoor maps, positioning, routes and operational context into one calm workspace.',
  artContext: 'Explore the product flow with your configured account.'
})
</script>

<template>
  <main class="auth-page">
    <aside class="auth-art">
      <NuxtLink to="/" class="auth-brand"><BrandMark size="sm" /><span>Situm Explore</span></NuxtLink>
      <div class="auth-art-copy">
        <p class="auth-eyebrow">Indoor operations, simplified</p>
        <h1>One workspace for maps, movement and spatial context.</h1>
        <p class="auth-art-description">{{ props.artDescription }}</p>
        <div class="auth-art-cards">
          <div class="auth-art-card"><strong>Map-first</strong><span>Viewer, POIs, directions, floors and realtime overlays.</span></div>
          <div class="auth-art-card"><strong>POC workspace</strong><span>{{ props.artContext }}</span></div>
        </div>
      </div>
      <span class="auth-art-foot">Situm Explore · 2026</span>
    </aside>
    <section class="auth-panel" :aria-labelledby="`${props.active}-title`">
      <div class="auth-box">
        <div class="auth-tabs" role="tablist" aria-label="Account access">
          <NuxtLink class="auth-tab" :class="{ active: props.active === 'login' }" role="tab" :aria-selected="props.active === 'login'" to="/login">Sign in</NuxtLink>
          <NuxtLink class="auth-tab" :class="{ active: props.active === 'register' }" role="tab" :aria-selected="props.active === 'register'" to="/register">Create account</NuxtLink>
        </div>
        <h2 :id="`${props.active}-title`">{{ props.title }}</h2>
        <p class="auth-intro">{{ props.intro }}</p>
        <slot />
      </div>
    </section>
  </main>
</template>

<style>
.auth-page{min-height:100svh;display:grid;grid-template-columns:1fr 1fr;background:#fff}.auth-art{display:flex;flex-direction:column;padding:32px clamp(28px,5vw,72px);background:#111827;color:#fff}.auth-brand{display:flex;align-items:center;gap:9px;color:#fff;font-size:14px;font-weight:700}.auth-art-copy{max-width:440px;margin:auto 0}.auth-eyebrow{color:#7f8997;font-size:11px;font-weight:700;letter-spacing:.11em;text-transform:uppercase}.auth-art-copy h1{font-size:clamp(32px,4vw,52px);line-height:1.05;letter-spacing:-.055em;margin:20px 0 16px}.auth-art-description{color:#b7bec8;line-height:1.65;margin:0}.auth-art-cards{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:32px}.auth-art-card{border:1px solid #ffffff1f;border-radius:12px;padding:15px;background:#ffffff08}.auth-art-card strong,.auth-art-card span{display:block}.auth-art-card strong{font-size:13px;margin-bottom:5px}.auth-art-card span{color:#9ca6b3;font-size:12px;line-height:1.5}.auth-art-foot{color:#6f7987;font-size:11px}.auth-panel{display:grid;place-items:center;padding:40px 24px}.auth-box{width:min(100%,410px)}.auth-tabs{display:flex;gap:22px;border-bottom:1px solid var(--explore-border);margin-bottom:38px}.auth-tab{padding:0 0 13px;color:var(--explore-foreground-subtle);font-size:13px;text-decoration:none}.auth-tab.active{color:var(--explore-foreground);border-bottom:2px solid var(--explore-accent);font-weight:600}.auth-box h2{font-size:30px;letter-spacing:-.045em;margin:0 0 8px}.auth-intro{color:var(--explore-foreground-muted);font-size:14px;margin:0 0 28px}.auth-form{display:grid;gap:18px}.auth-form-split{display:grid;grid-template-columns:1fr 1fr;gap:12px}.auth-helper{color:var(--explore-foreground-subtle);font-size:11px;line-height:1.5;margin:22px 0 0}.form-error{margin:-4px 0 -2px;color:#b42318;font-size:12px}@media(max-width:700px){.auth-page{display:block}.auth-art{display:none}.auth-panel{min-height:100svh;padding:40px 20px 56px}.auth-tabs{margin-bottom:30px}}@media(max-width:480px){.auth-form-split{grid-template-columns:1fr}}
</style>

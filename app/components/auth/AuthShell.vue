<script setup lang="ts">
const props = withDefaults(defineProps<{
  active: 'login'
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
        <h2 :id="`${props.active}-title`">{{ props.title }}</h2>
        <p class="auth-intro">{{ props.intro }}</p>
        <slot />
      </div>
    </section>
  </main>
</template>

<style>
.auth-page{min-height:100svh;display:grid;grid-template-columns:1fr 1fr;background:#fff}.auth-art{display:flex;flex-direction:column;padding:32px clamp(28px,5vw,72px);background:#f6f7f9;color:var(--explore-foreground);border-right:1px solid var(--explore-border)}.auth-brand{display:flex;align-items:center;gap:9px;color:var(--explore-foreground);font-size:14px;font-weight:700}.auth-art-copy{max-width:440px;margin:auto 0}.auth-eyebrow{color:var(--explore-foreground-subtle);font-size:11px;font-weight:700;letter-spacing:.11em;text-transform:uppercase}.auth-art-copy h1{font-size:clamp(32px,4vw,52px);line-height:1.05;letter-spacing:-.055em;margin:20px 0 16px}.auth-art-description{color:var(--explore-foreground-muted);line-height:1.65;margin:0}.auth-art-cards{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:32px}.auth-art-card{border:1px solid var(--explore-border);border-radius:12px;padding:15px;background:#fff}.auth-art-card strong,.auth-art-card span{display:block}.auth-art-card strong{font-size:13px;margin-bottom:5px}.auth-art-card span{color:var(--explore-foreground-muted);font-size:12px;line-height:1.5}.auth-art-foot{color:var(--explore-foreground-subtle);font-size:11px}.auth-panel{display:grid;place-items:center;padding:40px 24px}.auth-box{width:min(100%,410px)}.auth-box h2{font-size:30px;letter-spacing:-.045em;margin:0 0 8px}.auth-intro{color:var(--explore-foreground-muted);font-size:14px;margin:0 0 24px}.auth-form{display:grid;gap:16px}.auth-helper{color:var(--explore-foreground-subtle);font-size:11px;line-height:1.5;margin:18px 0 0}.form-error{margin:-2px 0 -2px;color:#b42318;font-size:12px}.auth-success{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:-4px 0 4px;padding:10px 12px;border:1px solid #b7e2c8;border-radius:9px;background:#f0fbf4;color:#166534;font-size:12px}.auth-success p{margin:2px 0 0;color:#3f6d4c;font-size:11px}@media(max-width:800px){.auth-page{display:block}.auth-art{display:none}.auth-panel{min-height:100svh;padding:40px 20px 56px}}
</style>

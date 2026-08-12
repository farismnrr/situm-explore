<script setup lang="ts">
const { message } = useExploreFeedback()
</script>

<template>
  <Transition name="explore-toast">
    <div v-if="message" class="explore-toast" role="status" aria-live="polite">{{ message }}</div>
  </Transition>
</template>

<style scoped>
.explore-toast { position: fixed; right: 1.125rem; bottom: 1.125rem; z-index: 100; min-width: 16.25rem; max-width: 22.5rem; border-radius: .75rem; background: #15171a; color: #fff; padding: .8125rem .875rem; box-shadow: var(--explore-shadow-md); font-size: .6875rem; line-height: 1.4; }
.explore-toast-enter-active,.explore-toast-leave-active { transition: opacity .2s ease, transform .2s ease; }.explore-toast-enter-from,.explore-toast-leave-to { opacity: 0; transform: translateY(1.25rem); }
</style>

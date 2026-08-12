<template>
  <span
    class="brand-mark"
    :class="sizeClass"
    role="img"
    aria-label="Situm Explore"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h11" />
      <path d="m12 6 6 6-6 6" />
    </svg>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ size?: 'sm' | 'md' }>(), {
  size: 'md'
})

const sizeClass = computed(() => props.size === 'sm' ? 'brand-mark--sm' : 'brand-mark--md')
</script>

<style scoped>
.brand-mark {
  display: inline-grid;
  flex: 0 0 auto;
  place-items: center;
  border-radius: var(--explore-radius-sm);
  background: #111827;
  color: #fff;
  box-shadow: var(--explore-shadow-xs);
}

.brand-mark--md {
  width: 2rem;
  height: 2rem;
}

.brand-mark--sm {
  width: 1.75rem;
  height: 1.75rem;
}

svg {
  width: 1.125rem;
  height: 1.125rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2.25;
}

.brand-mark--sm svg {
  width: 1rem;
  height: 1rem;
}
</style>

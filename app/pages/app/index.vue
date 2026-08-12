<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'app', title: 'Home' })
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold tracking-tight text-highlighted">Home</h1>
    <p class="mt-2 text-sm text-muted">Your authenticated workspace is ready.</p>
  </div>
</template>

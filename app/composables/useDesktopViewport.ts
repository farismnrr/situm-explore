export function useDesktopViewport(minWidthPx = 1024) {
  const isDesktop = ref(false)
  let media: MediaQueryList | undefined

  function update() {
    isDesktop.value = media?.matches ?? false
  }

  onMounted(() => {
    media = window.matchMedia(`(min-width: ${minWidthPx}px)`)
    update()
    media.addEventListener('change', update)
  })
  onBeforeUnmount(() => media?.removeEventListener('change', update))

  return isDesktop
}

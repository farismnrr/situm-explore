export const mapViewerBreakpoint = {
  minWidth: 768,
  minHeight: 600
} as const

export function useMapViewerCapability() {
  const isCapable = ref(false)
  let media: MediaQueryList | undefined

  function update() {
    isCapable.value = media?.matches ?? false
  }

  onMounted(() => {
    media = window.matchMedia(`(min-width: ${mapViewerBreakpoint.minWidth}px) and (min-height: ${mapViewerBreakpoint.minHeight}px)`)
    update()
    media.addEventListener('change', update)
  })
  onBeforeUnmount(() => media?.removeEventListener('change', update))

  return isCapable
}

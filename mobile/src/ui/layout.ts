export type LayoutMode = 'phone' | 'tablet' | 'wide' | 'veryWide'

export const navigationDestinations = ['Explore', 'Realtime', 'Recent', 'Settings'] as const

export function shouldRenderTopbarBrand(isRail: boolean): boolean {
  return !isRail
}

export function layoutModeForWidth(width: number): LayoutMode {
  if (width >= 1800) return 'veryWide'
  if (width >= 1050) return 'wide'
  if (width >= 700) return 'tablet'
  return 'phone'
}

export function layoutForWidth(width: number) {
  const mode = layoutModeForWidth(width)
  return {
    mode,
    isPhone: mode === 'phone',
    isRail: mode !== 'phone',
    isWide: mode === 'wide' || mode === 'veryWide',
    isVeryWide: mode === 'veryWide',
    railWidth: mode === 'tablet' ? 72 : mode === 'wide' ? 208 : mode === 'veryWide' ? 228 : 0,
    contentPadding: mode === 'phone' ? 14 : mode === 'tablet' ? 22 : mode === 'wide' ? 28 : 34,
  } as const
}

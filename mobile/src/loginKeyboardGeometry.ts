export type LoginKeyboardGeometry = {
  focusedBottom: number
  actionBottom: number
  keyboardTop: number
  safetyMargin: number
}

export function requiredLoginScrollShift({ focusedBottom, actionBottom, keyboardTop, safetyMargin }: LoginKeyboardGeometry): number {
  const bottoms = [focusedBottom, actionBottom].filter(Number.isFinite)
  if (!Number.isFinite(keyboardTop) || bottoms.length === 0) return 0
  return Math.max(0, Math.max(...bottoms) + Math.max(0, safetyMargin) - keyboardTop)
}

export function clampLoginScrollOffset(offset: number, maxOffset: number): number {
  if (!Number.isFinite(offset) || !Number.isFinite(maxOffset)) return 0
  return Math.min(Math.max(0, offset), Math.max(0, maxOffset))
}

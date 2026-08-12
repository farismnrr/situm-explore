export function useTabKeyboard() {
  function handleTabKey(event: KeyboardEvent, index: number, count: number, select: (nextIndex: number) => void, selector: string) {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? count - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + count) % count
    select(nextIndex)
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`${selector}[aria-selected="true"]`)?.focus())
  }

  return { handleTabKey }
}

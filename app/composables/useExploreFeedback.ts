export function useExploreFeedback() {
  const message = useState('explore-feedback-message', () => '')
  let timer: ReturnType<typeof setTimeout> | undefined

  function showFeedback(nextMessage: string) {
    message.value = nextMessage
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => { message.value = '' }, 2600)
  }

  return { message, showFeedback }
}

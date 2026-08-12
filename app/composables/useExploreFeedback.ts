let feedbackTimer: ReturnType<typeof setTimeout> | undefined

export function useExploreFeedback() {
  const message = useState('explore-feedback-message', () => '')
  function showFeedback(nextMessage: string) {
    message.value = nextMessage
    if (feedbackTimer) clearTimeout(feedbackTimer)
    feedbackTimer = setTimeout(() => { message.value = '' }, 2600)
  }

  return { message, showFeedback }
}

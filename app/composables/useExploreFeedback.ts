let feedbackTimer: ReturnType<typeof setTimeout> | undefined

interface FeedbackState {
  message: string
  revision: number
}

export function useExploreFeedback() {
  const state = useState<FeedbackState>('explore-feedback-state', () => ({ message: '', revision: 0 }))
  function showFeedback(nextMessage: string) {
    const revision = state.value.revision + 1
    state.value = { message: nextMessage, revision }
    if (feedbackTimer) clearTimeout(feedbackTimer)
    feedbackTimer = setTimeout(() => {
      if (state.value.revision === revision) state.value = { message: '', revision }
    }, 2600)
  }

  return { message: computed(() => state.value.message), showFeedback }
}

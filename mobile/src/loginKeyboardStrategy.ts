export type LoginKeyboardAvoidingBehavior = 'padding' | undefined

export function loginKeyboardAvoidingBehavior(platform: string): LoginKeyboardAvoidingBehavior {
  // Android already uses windowSoftInputMode=adjustResize via Expo's softwareKeyboardLayoutMode.
  // Adding KeyboardAvoidingView behavior="height" double-resizes the window and can collapse actions.
  return platform === 'ios' ? 'padding' : undefined
}

export function shouldUseCompactLoginLayout(keyboardVisible: boolean): boolean {
  return keyboardVisible
}

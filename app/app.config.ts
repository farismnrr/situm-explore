export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'slate',
      success: 'green',
      info: 'blue',
      warning: 'amber',
      error: 'red'
    },
    button: {
      defaultVariants: {
        color: 'neutral',
        variant: 'solid',
        size: 'md'
      }
    },
    input: {
      defaultVariants: {
        color: 'neutral',
        variant: 'outline',
        size: 'md'
      }
    },
    card: {
      defaultVariants: {
        variant: 'outline'
      }
    }
  }
})

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
        color: 'primary',
        variant: 'solid',
        size: 'sm'
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

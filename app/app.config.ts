export default defineAppConfig({
  ui: {
    colors: {
      // Product-primary actions use the dark ink role. Blue remains explicit via info/accent usage.
      primary: 'slate',
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
      },
      slots: {
        base: 'rounded-[10px] font-semibold min-h-10 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2',
        label: 'truncate',
        leadingIcon: 'shrink-0',
        trailingIcon: 'shrink-0'
      },
      variants: {
        size: {
          xs: { base: 'min-h-8 rounded-[9px] px-2.5 text-xs' },
          sm: { base: 'min-h-[34px] rounded-[9px] px-2.5 text-xs' },
          md: { base: 'min-h-10 rounded-[10px] px-3.5 text-[13px]' },
          lg: { base: 'min-h-10 rounded-[10px] px-4 text-[13px]' },
          xl: { base: 'min-h-11 rounded-[10px] px-4 text-sm' }
        },
        square: {
          true: { base: 'size-9 min-h-9 rounded-[9px] p-0' }
        }
      }
    },
    input: {
      defaultVariants: {
        color: 'neutral',
        variant: 'outline',
        size: 'md'
      },
      slots: {
        base: 'h-[42px] rounded-[10px] text-[13px] ring-1 ring-inset ring-accented focus-visible:ring-2 focus-visible:ring-inverted/40',
        leading: 'start-0',
        trailing: 'end-0'
      },
      variants: {
        size: {
          xs: { base: 'h-8 rounded-[9px] text-xs' },
          sm: { base: 'h-9 rounded-[9px] text-xs' },
          md: { base: 'h-[42px] rounded-[10px] text-[13px]' },
          lg: { base: 'h-11 rounded-[10px] text-sm' },
          xl: { base: 'h-12 rounded-[10px] text-base' }
        }
      }
    },
    textarea: {
      slots: {
        base: 'min-h-[90px] rounded-[10px] text-[13px] ring-1 ring-inset ring-accented focus-visible:ring-2 focus-visible:ring-inverted/40'
      }
    },
    badge: {
      slots: {
        base: 'min-h-7 rounded-full px-2.5 text-[11px] font-semibold ring-1 ring-inset ring-transparent'
      }
    },
    card: {
      defaultVariants: {
        variant: 'outline'
      },
      slots: {
        root: 'rounded-2xl overflow-hidden shadow-[0_1px_2px_rgb(16_24_40_/_4%)]',
        header: 'p-4 sm:px-5',
        body: 'p-4 sm:p-5',
        footer: 'p-4 sm:px-5'
      },
      variants: {
        variant: {
          soft: { root: 'rounded-xl bg-muted/50 ring ring-default shadow-none' },
          subtle: { root: 'rounded-xl bg-muted/50 ring ring-default shadow-none' }
        }
      }
    },
    modal: {
      slots: {
        content: 'rounded-2xl shadow-[0_18px_55px_rgb(16_24_40_/_10%)]',
        header: 'p-4 sm:px-5',
        body: 'p-4 sm:p-5',
        footer: 'p-4 sm:px-5'
      }
    },
    slideover: {
      slots: {
        content: 'shadow-[-18px_0_45px_rgb(16_24_40_/_8%)]',
        header: 'p-4 sm:px-5',
        body: 'p-4 sm:p-5',
        footer: 'p-4 sm:px-5'
      }
    }
  }
})

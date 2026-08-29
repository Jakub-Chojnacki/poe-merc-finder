import type * as Dialog from 'radix-ui/dialog'
import type { ComponentPropsWithoutRef } from 'react'

export interface DialogContentProps extends ComponentPropsWithoutRef<
  typeof Dialog.Content
> {
  overlayClassName?: string
}

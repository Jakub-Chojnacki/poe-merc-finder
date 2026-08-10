import type { ComponentPropsWithRef } from 'react'
import type { DialogContentProps } from './types'
import * as RadixDialog from 'radix-ui/dialog'
import { usePortalContainer } from '@/components/ui/provider/context'
import { mergeClassNames } from '@/components/ui/utils'

export const DialogRoot: React.FC<
  ComponentPropsWithRef<typeof RadixDialog.Root>
> = props => <RadixDialog.Root {...props} />

export const DialogTrigger: React.FC<
  ComponentPropsWithRef<typeof RadixDialog.Trigger>
> = props => <RadixDialog.Trigger {...props} />

export const DialogClose: React.FC<
  ComponentPropsWithRef<typeof RadixDialog.Close>
> = props => <RadixDialog.Close {...props} />

export const DialogTitle: React.FC<
  ComponentPropsWithRef<typeof RadixDialog.Title>
> = props => <RadixDialog.Title {...props} />

export const DialogDescription: React.FC<
  ComponentPropsWithRef<typeof RadixDialog.Description>
> = props => <RadixDialog.Description {...props} />

export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className,
  overlayClassName,
  ...props
}) => {
  const portalContainer = usePortalContainer()

  return (
    <RadixDialog.Portal container={portalContainer}>
      <RadixDialog.Overlay
        className={mergeClassNames('ui-dialog__overlay', overlayClassName)}
      />
      <RadixDialog.Content
        {...props}
        className={mergeClassNames('ui-dialog__content', className)}
      >
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  )
}

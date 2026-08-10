import type { ComponentPropsWithRef } from 'react'
import type { PopoverContentProps } from './types'
import * as RadixPopover from 'radix-ui/popover'
import { usePortalContainer } from '@/components/ui/provider/context'
import { mergeClassNames } from '@/components/ui/utils'
import {
  POPOVER_COLLISION_PADDING_PX,
  POPOVER_SIDE_OFFSET_PX,
} from './const'

export const PopoverRoot: React.FC<
  ComponentPropsWithRef<typeof RadixPopover.Root>
> = props => <RadixPopover.Root {...props} />

export const PopoverTrigger: React.FC<
  ComponentPropsWithRef<typeof RadixPopover.Trigger>
> = props => <RadixPopover.Trigger {...props} />

export const PopoverAnchor: React.FC<
  ComponentPropsWithRef<typeof RadixPopover.Anchor>
> = props => <RadixPopover.Anchor {...props} />

export const PopoverClose: React.FC<
  ComponentPropsWithRef<typeof RadixPopover.Close>
> = props => <RadixPopover.Close {...props} />

export const PopoverContent: React.FC<PopoverContentProps> = ({
  align = 'start',
  children,
  className,
  collisionPadding = POPOVER_COLLISION_PADDING_PX,
  sideOffset = POPOVER_SIDE_OFFSET_PX,
  ...props
}) => {
  const portalContainer = usePortalContainer()
  const contentClassName = mergeClassNames('ui-popover__content', className)

  return (
    <RadixPopover.Portal container={portalContainer}>
      <RadixPopover.Content
        {...props}
        align={align}
        className={contentClassName}
        collisionPadding={collisionPadding}
        sideOffset={sideOffset}
      >
        {children}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  )
}

import type { ComponentPropsWithRef } from 'react'
import type { UiTooltipProps } from '@/components/ui/tooltip/types'

export interface IconButtonProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'aria-label'
> {
  label: string
  tooltipSide?: UiTooltipProps['side']
  variant?: 'default' | 'danger'
}

import type * as Tooltip from 'radix-ui/tooltip'
import type { ReactElement, ReactNode } from 'react'

export interface UiTooltipProps {
  children: ReactElement
  content: ReactNode
  side?: React.ComponentPropsWithoutRef<typeof Tooltip.Content>['side']
}

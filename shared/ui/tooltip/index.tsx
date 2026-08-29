import type { UiTooltipProps } from './types'
import * as Tooltip from 'radix-ui/tooltip'
import { usePortalContainer } from '@/shared/ui/provider/context'
import { TOOLTIP_SIDE_OFFSET_PX } from './const'

const UiTooltip: React.FC<UiTooltipProps> = ({
  children,
  content,
  side = 'left',
}) => {
  const portalContainer = usePortalContainer()

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal container={portalContainer}>
        <Tooltip.Content
          className="ui-tooltip__content"
          side={side}
          sideOffset={TOOLTIP_SIDE_OFFSET_PX}
        >
          {content}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}

export default UiTooltip

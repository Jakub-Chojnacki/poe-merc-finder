import type { UiProviderProps } from './types'
import * as Tooltip from 'radix-ui/tooltip'
import { TOOLTIP_DELAY_MS } from './const'
import { PortalContainerContext } from './context'

const UiProvider: React.FC<UiProviderProps> = ({
  children,
  portalContainer,
}) => (
  <PortalContainerContext value={portalContainer}>
    <Tooltip.Provider delayDuration={TOOLTIP_DELAY_MS}>
      {children}
    </Tooltip.Provider>
  </PortalContainerContext>
)

export default UiProvider

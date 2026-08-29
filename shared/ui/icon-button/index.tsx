import type { IconButtonProps } from './types'
import UiTooltip from '@/shared/ui/tooltip'
import { mergeClassNames } from '@/shared/ui/utils'

const IconButton: React.FC<IconButtonProps> = ({
  children,
  className,
  label,
  tooltipSide = 'top',
  type = 'button',
  variant = 'default',
  ...props
}) => (
  <UiTooltip content={label} side={tooltipSide}>
    <button
      {...props}
      type={type}
      className={mergeClassNames('ui-icon-button', className)}
      data-variant={variant}
      aria-label={label}
    >
      {children}
    </button>
  </UiTooltip>
)

export default IconButton

import type { SvgIconProps } from '../types'

const CloseIcon: React.FC<SvgIconProps> = props => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M6 6 18 18M18 6 6 18" />
  </svg>
)

export default CloseIcon

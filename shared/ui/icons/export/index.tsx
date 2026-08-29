import type { SvgIconProps } from '../types'

const ExportIcon: React.FC<SvgIconProps> = props => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 16V4M7 9l5-5 5 5M5 20h14" />
  </svg>
)

export default ExportIcon

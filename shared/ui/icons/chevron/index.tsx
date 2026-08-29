import type { SvgIconProps } from '../types'

const ChevronIcon: React.FC<SvgIconProps> = props => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path d="m9 6 6 6-6 6" />
  </svg>
)

export default ChevronIcon

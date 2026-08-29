import type { SvgIconProps } from '../types'

const TrashIcon: React.FC<SvgIconProps> = props => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
  </svg>
)

export default TrashIcon

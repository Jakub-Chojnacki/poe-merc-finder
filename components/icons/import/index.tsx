import type { SvgIconProps } from '../types'

const ImportIcon: React.FC<SvgIconProps> = props => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 3v12M7 10l5 5 5-5M5 20h14" />
  </svg>
)

export default ImportIcon

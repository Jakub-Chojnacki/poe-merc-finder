import type { AppIconProps } from './types'
import { APP_ICON_PATH } from './const'

const AppIcon: React.FC<AppIconProps> = props => (
  <img
    {...props}
    src={browser.runtime.getURL(APP_ICON_PATH)}
    alt=""
    aria-hidden="true"
  />
)

export default AppIcon

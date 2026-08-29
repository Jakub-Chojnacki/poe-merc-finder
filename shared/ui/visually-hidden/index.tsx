import type { UiVisuallyHiddenProps } from './types'
import * as VisuallyHidden from 'radix-ui/visually-hidden'

const UiVisuallyHidden: React.FC<UiVisuallyHiddenProps> = props => (
  <VisuallyHidden.Root {...props} />
)

export default UiVisuallyHidden

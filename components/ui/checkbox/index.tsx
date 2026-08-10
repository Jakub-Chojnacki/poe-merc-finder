import type { UiCheckboxProps } from './types'
import * as Checkbox from 'radix-ui/checkbox'
import CheckIcon from '@/components/icons/check'
import { mergeClassNames } from '@/components/ui/utils'

const UiCheckbox: React.FC<UiCheckboxProps> = ({ className, ...props }) => {
  const checkboxClassName = mergeClassNames('ui-checkbox', className)

  return (
    <Checkbox.Root {...props} className={checkboxClassName}>
      <Checkbox.Indicator className="ui-checkbox__indicator">
        <CheckIcon className="ui-checkbox__icon" />
      </Checkbox.Indicator>
    </Checkbox.Root>
  )
}

export default UiCheckbox

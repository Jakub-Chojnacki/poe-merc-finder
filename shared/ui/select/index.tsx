import type { UiSelectProps } from './types'
import * as Select from 'radix-ui/select'
import CheckIcon from '@/shared/ui/icons/check'
import ChevronIcon from '@/shared/ui/icons/chevron'
import { usePortalContainer } from '@/shared/ui/provider/context'
import { mergeClassNames } from '@/shared/ui/utils'
import {
  SELECT_COLLISION_PADDING_PX,
  SELECT_SIDE_OFFSET_PX,
} from './const'

const UiSelect: React.FC<UiSelectProps> = ({
  className,
  disabled,
  id,
  labelledBy,
  onChange,
  options,
  placeholder,
  value,
}) => {
  const portalContainer = usePortalContainer()
  const triggerClassName = mergeClassNames('ui-select__trigger', className)

  return (
    <Select.Root
      disabled={disabled}
      value={value}
      onValueChange={onChange}
    >
      <Select.Trigger
        id={id}
        className={triggerClassName}
        aria-labelledby={labelledBy}
      >
        <Select.Value className="ui-truncate" placeholder={placeholder} />
        <Select.Icon asChild>
          <ChevronIcon className="ui-select__chevron" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal container={portalContainer}>
        <Select.Content
          className="ui-select__content"
          collisionPadding={SELECT_COLLISION_PADDING_PX}
          position="popper"
          sideOffset={SELECT_SIDE_OFFSET_PX}
        >
          <Select.Viewport className="ui-select__viewport">
            {options.map(option => (
              <Select.Item
                className="ui-select__option"
                disabled={option.disabled}
                key={option.value}
                value={option.value}
              >
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator className="ui-select__indicator">
                  <CheckIcon className="ui-select__check-icon" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

export default UiSelect

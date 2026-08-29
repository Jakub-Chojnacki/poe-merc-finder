import type { SelectFieldProps } from './types'
import { useId, useMemo, useState } from 'react'
import ChevronIcon from '@/shared/ui/icons/chevron'
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from '@/shared/ui/popover'
import {
  ToggleGroupItem,
  ToggleGroupRoot,
} from '@/shared/ui/toggle-group'
import UiVisuallyHidden from '@/shared/ui/visually-hidden'
import { getAvailableSelectOptions } from './utils'

const SelectField: React.FC<SelectFieldProps> = ({
  emptyLabel,
  hideLabel = false,
  hint,
  label,
  onChange,
  options,
  value,
}) => {
  const labelId = useId()
  const searchId = useId()
  const valueId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const availableOptions = useMemo(
    () => getAvailableSelectOptions(options, value, searchQuery),
    [options, searchQuery, value],
  )
  const selectedOption = options.find(option => option.value === value)

  const selectOption = (optionValue: string): void => {
    onChange(optionValue)
    setIsOpen(false)
  }

  const updateOpen = (open: boolean): void => {
    setIsOpen(open)

    if (!open) {
      setSearchQuery('')
    }
  }

  return (
    <div className="field">
      {hideLabel
        ? (
            <UiVisuallyHidden asChild>
              <span id={labelId}>{label}</span>
            </UiVisuallyHidden>
          )
        : <span id={labelId}>{label}</span>}

      <PopoverRoot open={isOpen} onOpenChange={updateOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="select-field__trigger"
            aria-labelledby={`${labelId} ${valueId}`}
          >
            <span id={valueId} className="select-field__value">
              {selectedOption?.iconPath && (
                <img
                  className="select-field__icon"
                  src={browser.runtime.getURL(selectedOption.iconPath)}
                  alt={selectedOption.iconAlt}
                />
              )}
              <span className="ui-truncate">{value || emptyLabel}</span>
            </span>
            <ChevronIcon className="select-field__chevron" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="select-field__panel">
          <UiVisuallyHidden asChild>
            <label htmlFor={searchId}>
              Search
              {' '}
              {label}
            </label>
          </UiVisuallyHidden>
          <input
            id={searchId}
            type="search"
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            placeholder={`Search ${label.toLocaleLowerCase()}`}
          />

          <ToggleGroupRoot
            className="select-field__options"
            type="single"
            value={value}
            onValueChange={selectOption}
          >
            {!searchQuery && (
              <button
                type="button"
                className="select-field__option"
                data-state={value ? 'off' : 'on'}
                onClick={() => selectOption('')}
              >
                {emptyLabel}
              </button>
            )}

            {availableOptions.map(option => (
              <ToggleGroupItem
                className="select-field__option"
                key={option.value}
                value={option.value}
              >
                <span className="select-field__option-value">
                  {option.iconPath && (
                    <img
                      className="select-field__icon"
                      src={browser.runtime.getURL(option.iconPath)}
                      alt={option.iconAlt}
                      aria-hidden="true"
                    />
                  )}
                  <span>{option.value}</span>
                </span>
                {option.label && <small>{option.label}</small>}
              </ToggleGroupItem>
            ))}

            {availableOptions.length === 0 && (
              <p className="select-field__empty">No matching options</p>
            )}
          </ToggleGroupRoot>
        </PopoverContent>
      </PopoverRoot>

      {hint && <small>{hint}</small>}
    </div>
  )
}

export default SelectField

import type { MultiSelectFieldProps } from './types'
import { useId, useMemo, useState } from 'react'
import ChevronIcon from '@/components/icons/chevron'
import CloseIcon from '@/components/icons/close'
import UiCheckbox from '@/components/ui/checkbox'
import {
  PopoverAnchor,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from '@/components/ui/popover'
import UiVisuallyHidden from '@/components/ui/visually-hidden'
import {
  getAvailableMultiSelectOptions,
  updateSelectedOptions,
} from './utils'

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  hint,
  label,
  onChange,
  options,
  placeholder,
  value,
}) => {
  const labelId = useId()
  const searchId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const availableOptions = useMemo(
    () => getAvailableMultiSelectOptions(options, value, searchQuery),
    [options, searchQuery, value],
  )

  const toggleOption = (option: string, selected: boolean): void => {
    onChange(updateSelectedOptions(value, option, selected))
  }

  const updateOpen = (open: boolean): void => {
    setIsOpen(open)

    if (!open) {
      setSearchQuery('')
    }
  }

  return (
    <div className="field multi-select-field">
      <span id={labelId}>{label}</span>

      <PopoverRoot open={isOpen} onOpenChange={updateOpen}>
        <PopoverAnchor asChild>
          <div className="multi-select__control">
            <div className="multi-select__selection">
              {value.map(option => (
                <span className="selection-chip" key={option}>
                  <span>{option}</span>
                  <button
                    type="button"
                    className="selection-chip__remove"
                    aria-label={`Remove ${option}`}
                    onClick={() => toggleOption(option, false)}
                  >
                    <CloseIcon className="selection-chip__icon" />
                  </button>
                </span>
              ))}

              {value.length === 0 && (
                <span className="multi-select__placeholder">{placeholder}</span>
              )}
            </div>

            <PopoverTrigger asChild>
              <button
                type="button"
                className="multi-select__trigger"
                aria-labelledby={labelId}
              >
                Add
                <ChevronIcon className="multi-select__chevron" />
              </button>
            </PopoverTrigger>
          </div>
        </PopoverAnchor>

        <PopoverContent className="multi-select__panel">
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
            placeholder="Search supports"
          />

          <div
            className="multi-select__options"
            role="group"
            aria-labelledby={labelId}
          >
            {availableOptions.map((option, index) => {
              const checkboxId = `${labelId}-${index}`

              return (
                <div className="multi-select__option" key={option}>
                  <UiCheckbox
                    id={checkboxId}
                    checked={value.includes(option)}
                    onCheckedChange={checked => (
                      toggleOption(option, checked === true)
                    )}
                  />
                  <label htmlFor={checkboxId}>{option}</label>
                </div>
              )
            })}

            {availableOptions.length === 0 && (
              <p className="multi-select__empty">No matching supports</p>
            )}
          </div>

          {value.length > 0 && (
            <button
              type="button"
              className="multi-select__clear"
              onClick={() => onChange([])}
            >
              Clear all
            </button>
          )}
        </PopoverContent>
      </PopoverRoot>

      {hint && <small>{hint}</small>}
    </div>
  )
}

export default MultiSelectField

import type { MultiSelectFieldProps } from './types'
import { useId, useMemo, useState } from 'react'
import ChevronIcon from '@/components/icons/chevron'
import CloseIcon from '@/components/icons/close'

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
  const [searchQuery, setSearchQuery] = useState('')
  const availableOptions = useMemo(() => {
    const selectedOptions = new Set(value)

    return [...new Set([...value, ...options])]
      .filter(option => (
        option.toLocaleLowerCase().includes(searchQuery.trim().toLocaleLowerCase())
      ))
      .sort((left, right) => (
        Number(selectedOptions.has(right)) - Number(selectedOptions.has(left))
      ))
  }, [options, searchQuery, value])

  const toggleOption = (option: string, selected: boolean): void => {
    onChange(selected
      ? [...value, option]
      : value.filter(selectedOption => selectedOption !== option))
  }

  return (
    <div className="field multi-select-field">
      <span id={labelId}>{label}</span>

      <div className="multi-select__control">
        <div className="multi-select__selection">
          {value.map(option => (
            <span className="selection-chip" key={option}>
              <span>{option}</span>
              <button
                type="button"
                className="selection-chip__remove"
                aria-label={`Remove ${option}`}
                title={`Remove ${option}`}
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

        <details
          className="multi-select"
          onToggle={(event) => {
            if (!event.currentTarget.open) {
              setSearchQuery('')
            }
          }}
        >
          <summary aria-labelledby={labelId}>
            Add
            <ChevronIcon className="multi-select__chevron" />
          </summary>

          <div className="multi-select__panel">
            <label className="visually-hidden" htmlFor={searchId}>
              Search
              {' '}
              {label}
            </label>
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
              {availableOptions.map(option => (
                <label className="multi-select__option" key={option}>
                  <input
                    type="checkbox"
                    checked={value.includes(option)}
                    onChange={event => toggleOption(option, event.target.checked)}
                  />
                  <span>{option}</span>
                </label>
              ))}

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
          </div>
        </details>
      </div>

      {hint && <small>{hint}</small>}
    </div>
  )
}

export default MultiSelectField

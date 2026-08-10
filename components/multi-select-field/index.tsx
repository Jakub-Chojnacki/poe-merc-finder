import type { MultiSelectFieldProps } from './types'
import { useId, useMemo, useState } from 'react'
import ChevronIcon from '@/components/icons/chevron'

function getSelectionLabel(value: string[], placeholder: string): string {
  if (value.length === 0) {
    return placeholder
  }

  if (value.length <= 2) {
    return value.join(', ')
  }

  return `${value.length} selected`
}

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
  const availableOptions = useMemo(() => (
    [...new Set([...value, ...options])]
      .filter(option => (
        option.toLocaleLowerCase().includes(searchQuery.trim().toLocaleLowerCase())
      ))
  ), [options, searchQuery, value])

  const toggleOption = (option: string, selected: boolean): void => {
    onChange(selected
      ? [...value, option]
      : value.filter(selectedOption => selectedOption !== option))
  }

  return (
    <div className="field multi-select-field">
      <span id={labelId}>{label}</span>

      <details
        className="multi-select"
        onToggle={(event) => {
          if (!event.currentTarget.open) {
            setSearchQuery('')
          }
        }}
      >
        <summary aria-labelledby={labelId}>
          <span>{getSelectionLabel(value, placeholder)}</span>
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
              className="button multi-select__clear"
              onClick={() => onChange([])}
            >
              Clear selection
            </button>
          )}
        </div>
      </details>

      {hint && <small>{hint}</small>}
    </div>
  )
}

export default MultiSelectField

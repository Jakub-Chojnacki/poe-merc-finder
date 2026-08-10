import type { SelectFieldProps, SelectOption } from './types'
import { useId, useMemo, useRef, useState } from 'react'
import ChevronIcon from '@/components/icons/chevron'

function includeCurrentOption(
  options: SelectOption[],
  value: string,
): SelectOption[] {
  return value && !options.some(option => option.value === value)
    ? [{ value }, ...options]
    : options
}

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
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const allOptions = includeCurrentOption(options, value)
  const availableOptions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase()

    return allOptions.filter(option => (
      option.value.toLocaleLowerCase().includes(normalizedQuery)
      || option.label?.toLocaleLowerCase().includes(normalizedQuery)
    ))
  }, [allOptions, searchQuery])

  const selectOption = (optionValue: string): void => {
    onChange(optionValue)
    detailsRef.current?.removeAttribute('open')
  }

  return (
    <div className="field">
      <span className={hideLabel ? 'visually-hidden' : undefined} id={labelId}>
        {label}
      </span>

      <details
        ref={detailsRef}
        className="select-field"
        onToggle={(event) => {
          if (!event.currentTarget.open) {
            setSearchQuery('')
          }
        }}
      >
        <summary aria-labelledby={labelId}>
          <span>{value || emptyLabel}</span>
          <ChevronIcon className="select-field__chevron" />
        </summary>

        <div className="select-field__panel">
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
            placeholder={`Search ${label.toLocaleLowerCase()}`}
          />

          <div
            className="select-field__options"
            role="listbox"
            aria-labelledby={labelId}
          >
            {!searchQuery && (
              <button
                type="button"
                className="select-field__option"
                role="option"
                aria-selected={!value}
                onClick={() => selectOption('')}
              >
                {emptyLabel}
              </button>
            )}

            {availableOptions.map(option => (
              <button
                type="button"
                className="select-field__option"
                key={option.value}
                role="option"
                aria-selected={value === option.value}
                onClick={() => selectOption(option.value)}
              >
                <span>{option.value}</span>
                {option.label && <small>{option.label}</small>}
              </button>
            ))}

            {availableOptions.length === 0 && (
              <p className="select-field__empty">No matching options</p>
            )}
          </div>
        </div>
      </details>

      {hint && <small>{hint}</small>}
    </div>
  )
}

export default SelectField

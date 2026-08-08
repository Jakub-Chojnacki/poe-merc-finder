import type { ClearableDatalistFieldProps } from './types'
import { useId } from 'react'

const ClearableDatalistField: React.FC<ClearableDatalistFieldProps> = ({
  clearLabel,
  hint,
  label,
  onChange,
  optionsId,
  placeholder,
  value,
}) => {
  const fieldId = useId()

  return (
    <div className="field">
      <label htmlFor={fieldId}>{label}</label>

      <div className="clearable-datalist-field">
        <input
          id={fieldId}
          type="text"
          list={optionsId}
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
        />

        <button
          type="button"
          className="button"
          disabled={!value}
          onClick={() => onChange('')}
        >
          {clearLabel}
        </button>
      </div>

      {hint && <small>{hint}</small>}
    </div>
  )
}

export default ClearableDatalistField

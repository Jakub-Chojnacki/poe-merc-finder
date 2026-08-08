import type { GemListFieldProps } from './types'
import { useId, useState } from 'react'

function appendGem(value: string, gem: string): string {
  const gems = value
    .split(/[\n,]/)
    .map(item => item.trim())
    .filter(Boolean)

  if (!gems.some(existing => existing.toLocaleLowerCase() === gem.toLocaleLowerCase())) {
    gems.push(gem)
  }

  return gems.join('\n')
}

const GemListField: React.FC<GemListFieldProps> = ({
  hint,
  label,
  onChange,
  optionsId,
  placeholder,
  value,
}) => {
  const fieldId = useId()
  const [gem, setGem] = useState('')

  const addGem = (): void => {
    const nextGem = gem.trim()

    if (!nextGem) {
      return
    }

    onChange(appendGem(value, nextGem))
    setGem('')
  }

  const handleGemKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    addGem()
  }

  return (
    <div className="field">
      <label htmlFor={fieldId}>{label}</label>

      <div className="gem-picker">
        <input
          type="text"
          list={optionsId}
          value={gem}
          onChange={event => setGem(event.target.value)}
          onKeyDown={handleGemKeyDown}
          placeholder="Choose or type a support"
        />
        <button
          type="button"
          className="button"
          disabled={!gem.trim()}
          onClick={addGem}
        >
          Add
        </button>
      </div>

      <textarea
        id={fieldId}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
      />
      <small>{hint}</small>
    </div>
  )
}

export default GemListField

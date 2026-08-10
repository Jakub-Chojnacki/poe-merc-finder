import type { SkillRequirementEditorProps } from './types'
import CloseIcon from '@/components/icons/close'
import MultiSelectField from '@/components/multi-select-field'
import SelectField from '@/components/select-field'
import { SUPPORT_GEM_NAMES } from '@/utils/mercenary-data'

const SkillRequirementEditor: React.FC<SkillRequirementEditorProps> = ({
  index,
  onChange,
  onRemove,
  skillOptions,
  value,
}) => {
  const skillNumber = index + 1
  const skillLabel = `Skill ${skillNumber}`

  return (
    <section className="skill-group" aria-label={skillLabel}>
      <header className="skill-group__header">
        <span className="skill-group__index" aria-hidden="true">
          {String(skillNumber).padStart(2, '0')}
        </span>

        <div className="skill-group__skill-select">
          <SelectField
            hideLabel
            label={skillLabel}
            emptyLabel="Choose a skill"
            options={skillOptions}
            value={value.skill}
            onChange={skill => onChange({ skill })}
          />
        </div>

        <button
          type="button"
          className="remove-button"
          onClick={onRemove}
          aria-label={`Remove skill ${skillNumber}`}
          title={`Remove skill ${skillNumber}`}
        >
          <CloseIcon
            className="remove-button__icon"
          />
        </button>
      </header>

      <div className="skill-group__content">
        <MultiSelectField
          label="Required supports"
          value={value.requiredSupports}
          onChange={requiredSupports => onChange({ requiredSupports })}
          options={SUPPORT_GEM_NAMES}
          placeholder="Choose required supports"
          hint="All must be linked."
        />

        <MultiSelectField
          label="Optional supports"
          value={value.optionalSupports}
          onChange={optionalSupports => onChange({ optionalSupports })}
          options={SUPPORT_GEM_NAMES}
          placeholder="Choose optional supports"
        />
      </div>
    </section>
  )
}

export default SkillRequirementEditor

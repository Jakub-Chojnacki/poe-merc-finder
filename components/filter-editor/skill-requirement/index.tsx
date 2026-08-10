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
  const titleId = `skill-requirement-${value.id}-title`
  const skillNumber = index + 1

  return (
    <section className="skill-group" aria-labelledby={titleId}>
      <header className="skill-group__header">
        <h3 id={titleId} className="skill-group__title">
          Skill
          {' '}
          {skillNumber}
        </h3>

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
        <SelectField
          label="Skill name"
          emptyLabel="Choose a skill"
          options={skillOptions}
          value={value.skill}
          onChange={skill => onChange({ skill })}
        />

        <MultiSelectField
          label="Required supports"
          value={value.requiredSupports}
          onChange={requiredSupports => onChange({ requiredSupports })}
          options={SUPPORT_GEM_NAMES}
          placeholder="Choose required supports"
          hint="Every selected support must be linked to this skill."
        />

        <MultiSelectField
          label="Optional supports"
          value={value.optionalSupports}
          onChange={optionalSupports => onChange({ optionalSupports })}
          options={SUPPORT_GEM_NAMES}
          placeholder="Choose optional supports"
          hint="These improve the match but are not required."
        />
      </div>
    </section>
  )
}

export default SkillRequirementEditor

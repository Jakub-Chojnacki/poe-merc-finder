import type { SkillRequirementEditorProps } from './types'
import ClearableDatalistField from '@/components/clearable-datalist-field'
import GemListField from '@/components/gem-list-field'
import CloseIcon from '@/components/icons/close'
import {
  MERCENARY_SKILL_OPTIONS_ID,
  MERCENARY_SUPPORT_OPTIONS_ID,
} from '../const'

const SkillRequirementEditor: React.FC<SkillRequirementEditorProps> = ({
  index,
  onChange,
  onRemove,
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
        <ClearableDatalistField
          label="Skill name"
          clearLabel="Clear"
          optionsId={MERCENARY_SKILL_OPTIONS_ID}
          value={value.skill}
          onChange={skill => onChange({ skill })}
          placeholder="Kinetic Blast of Clustering"
        />

        <GemListField
          label="Required supports"
          value={value.requiredSupports}
          onChange={requiredSupports => onChange({ requiredSupports })}
          optionsId={MERCENARY_SUPPORT_OPTIONS_ID}
          placeholder={'Return\nGreater Multiple Projectiles'}
          hint="Every support must be linked to this skill. The list remains manually editable."
        />

        <GemListField
          label="Optional supports"
          value={value.optionalSupports}
          onChange={optionalSupports => onChange({ optionalSupports })}
          optionsId={MERCENARY_SUPPORT_OPTIONS_ID}
          placeholder={'Greater Pierce\nChain'}
          hint="These improve the match but are not required. The list remains manually editable."
        />
      </div>
    </section>
  )
}

export default SkillRequirementEditor

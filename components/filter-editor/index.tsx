import type { SkillRequirementUpdates } from './skill-requirement/types'
import type { FilterEditorProps } from './types'
import SelectField from '@/components/select-field'
import { createEmptySkillRequirement } from '@/utils/filter-draft'
import { getMercenarySkillOptions } from '@/utils/mercenary-data'
import {
  APPLY_BUTTON_LABELS,
  MERCENARY_CLASS_OPTIONS,
} from './const'
import GeneratedSearch from './generated-search'
import SkillRequirementEditor from './skill-requirement'

const FilterEditor: React.FC<FilterEditorProps> = ({
  applyStatus,
  onApply,
  onChange,
  value,
}) => {
  const skillOptions = getMercenarySkillOptions(value.mercenaryClass).map(
    skill => ({
      label: skill.label,
      value: skill.name,
    }),
  )

  const updateRequirement = (
    id: string,
    updates: SkillRequirementUpdates,
  ): void => {
    onChange({
      ...value,
      requirements: value.requirements.map(requirement =>
        requirement.id === id ? { ...requirement, ...updates } : requirement,
      ),
    })
  }

  const addRequirement = (): void => {
    onChange({
      ...value,
      requirements: [...value.requirements, createEmptySkillRequirement()],
    })
  }

  const removeRequirement = (id: string): void => {
    const requirements = value.requirements.filter(
      requirement => requirement.id !== id,
    )

    onChange({
      ...value,
      requirements: requirements.length
        ? requirements
        : [createEmptySkillRequirement()],
    })
  }

  return (
    <section className="filter-editor" aria-labelledby="filter-editor-title">
      <header className="section-header">
        <div>
          <p className="section-kicker">Mercenary configuration</p>
          <h2 id="filter-editor-title">Skill requirements</h2>
        </div>

        <button type="button" className="button" onClick={addRequirement}>
          Add skill
        </button>
      </header>

      <SelectField
        label="Mercenary class"
        emptyLabel="All mercenary classes"
        options={MERCENARY_CLASS_OPTIONS}
        value={value.mercenaryClass}
        onChange={mercenaryClass => onChange({
          ...value,
          mercenaryClass,
        })}
        hint="Choose a class to narrow the available skills."
      />

      <div className="skill-groups">
        {value.requirements.map((requirement, index) => (
          <SkillRequirementEditor
            key={requirement.id}
            index={index}
            skillOptions={skillOptions}
            value={requirement}
            onChange={updates => updateRequirement(requirement.id, updates)}
            onRemove={() => removeRequirement(requirement.id)}
          />
        ))}
      </div>

      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={value.hideFailures}
          onChange={event =>
            onChange({ ...value, hideFailures: event.target.checked })}
        />
        <span>Hide listings missing required skills or supports</span>
      </label>

      <button
        type="button"
        className="button apply-button"
        aria-live="polite"
        disabled={applyStatus === 'applying'}
        onClick={() => onApply()}
      >
        {APPLY_BUTTON_LABELS[applyStatus]}
      </button>

      <GeneratedSearch filterDraft={value} />
    </section>
  )
}

export default FilterEditor

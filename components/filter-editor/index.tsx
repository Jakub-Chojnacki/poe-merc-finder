import type { SkillRequirementUpdates } from './skill-requirement/types'
import type { FilterEditorProps } from './types'
import SelectField from '@/components/select-field'
import { createEmptySkillRequirement } from '@/utils/filter-draft'
import { getMercenarySkillOptions } from '@/utils/mercenary-data'
import {
  MERCENARY_CLASS_OPTIONS,
} from './const'
import FilterActions from './filter-actions'
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
        <h2 id="filter-editor-title">Skill requirements</h2>

        <button type="button" className="add-skill-button" onClick={addRequirement}>
          + Add skill
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

      <FilterActions
        key={JSON.stringify(value)}
        applyStatus={applyStatus}
        filterDraft={value}
        onApply={onApply}
      />
    </section>
  )
}

export default FilterEditor

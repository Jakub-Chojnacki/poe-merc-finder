import type { SkillRequirementUpdates } from './skill-requirement/types'
import type { FilterEditorProps } from './types'
import ClearableDatalistField from '@/components/clearable-datalist-field'
import { createEmptySkillRequirement } from '@/utils/filter-draft'
import {
  getMercenarySkillOptions,
  MERCENARY_OPTIONS,
  SUPPORT_GEM_NAMES,
} from '@/utils/mercenary-data'
import {
  APPLY_BUTTON_LABELS,
  MERCENARY_CLASS_OPTIONS_ID,
  MERCENARY_SKILL_OPTIONS_ID,
  MERCENARY_SUPPORT_OPTIONS_ID,
} from './const'
import GeneratedSearch from './generated-search'
import SkillRequirementEditor from './skill-requirement'

const FilterEditor: React.FC<FilterEditorProps> = ({
  applyStatus,
  onApply,
  onChange,
  value,
}) => {
  const skillOptions = getMercenarySkillOptions(value.mercenaryClass)

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
          <p className="section-kicker">Manual configuration</p>
          <h2 id="filter-editor-title">Skill requirements</h2>
        </div>

        <button type="button" className="button" onClick={addRequirement}>
          Add skill
        </button>
      </header>

      <ClearableDatalistField
        label="Mercenary class"
        clearLabel="Clear"
        optionsId={MERCENARY_CLASS_OPTIONS_ID}
        value={value.mercenaryClass}
        onChange={mercenaryClass => onChange({
          ...value,
          mercenaryClass,
        })}
        placeholder="Stormhand"
        hint="Choose a class to narrow the skill suggestions, or type manually."
      />

      <datalist id={MERCENARY_CLASS_OPTIONS_ID}>
        {MERCENARY_OPTIONS.map(mercenary => (
          <option key={mercenary.name} value={mercenary.name}>
            {mercenary.attribute}
          </option>
        ))}
      </datalist>

      <datalist id={MERCENARY_SKILL_OPTIONS_ID}>
        {skillOptions.map(skill => (
          <option key={skill.name} value={skill.name} label={skill.label} />
        ))}
      </datalist>

      <datalist id={MERCENARY_SUPPORT_OPTIONS_ID}>
        {SUPPORT_GEM_NAMES.map(supportName => (
          <option key={supportName} value={supportName} />
        ))}
      </datalist>

      <div className="skill-groups">
        {value.requirements.map((requirement, index) => (
          <SkillRequirementEditor
            key={requirement.id}
            index={index}
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

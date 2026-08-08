import type { FilterEditorProps, UpdatesToRequirement } from './types'
import { createEmptySkillRequirement } from '@/utils/filter-draft'

const APPLY_BUTTON_LABELS = {
  applied: 'Applied',
  applying: 'Applying…',
  error: 'Try again',
  idle: 'Apply filters',
} as const

const FilterEditor: React.FC<FilterEditorProps> = ({
  applyStatus,
  onApply,
  onChange,
  value,
}) => {
  const updateRequirement = (id: string, updates: UpdatesToRequirement): void => {
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

      <div className="skill-groups">
        {value.requirements.map((requirement, index) => (
          <fieldset className="skill-group" key={requirement.id}>
            <legend>
              Skill
              {index + 1}
            </legend>

            {value.requirements.length > 1 && (
              <button
                type="button"
                className="remove-button"
                onClick={() => removeRequirement(requirement.id)}
                aria-label={`Remove skill ${index + 1}`}
              >
                Remove
              </button>
            )}

            <label className="field">
              <span>Skill name</span>
              <input
                type="text"
                value={requirement.skill}
                onChange={event =>
                  updateRequirement(requirement.id, {
                    skill: event.target.value,
                  })}
                placeholder="Kinetic Blast of Clustering"
              />
            </label>

            <label className="field">
              <span>Required supports</span>
              <textarea
                value={requirement.requiredSupports}
                onChange={event =>
                  updateRequirement(requirement.id, {
                    requiredSupports: event.target.value,
                  })}
                placeholder={'Return\nGreater Multiple Projectiles'}
                rows={3}
              />
              <small>Every support must be linked to this skill.</small>
            </label>

            <label className="field">
              <span>Optional supports</span>
              <textarea
                value={requirement.optionalSupports}
                onChange={event =>
                  updateRequirement(requirement.id, {
                    optionalSupports: event.target.value,
                  })}
                placeholder={'Greater Pierce\nChain'}
                rows={3}
              />
              <small>These improve the match but are not required.</small>
            </label>
          </fieldset>
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
        onClick={() => void onApply()}
      >
        {APPLY_BUTTON_LABELS[applyStatus]}
      </button>
    </section>
  )
}

export default FilterEditor

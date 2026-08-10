import type { FilterEditorProps, UpdatesToRequirement } from './types'
import ClearableDatalistField from '@/components/clearable-datalist-field'
import GemListField from '@/components/gem-list-field'
import { useTradeSearchLink } from '@/hooks/use-trade-search-link'
import {
  COPY_LINK_BUTTON_LABELS,
  GENERATE_LINK_BUTTON_LABELS,
} from '@/hooks/use-trade-search-link/const'
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

const FilterEditor: React.FC<FilterEditorProps> = ({
  applyStatus,
  onApply,
  onChange,
  value,
}) => {
  const skillOptions = getMercenarySkillOptions(value.mercenaryClass)
  const {
    copyLink,
    errorMessage: linkErrorMessage,
    generateLink,
    generatedLink,
    resetLink,
    status: linkStatus,
    warningMessage: linkWarningMessage,
  } = useTradeSearchLink(value)

  const updateValue = (nextValue: FilterEditorProps['value']): void => {
    resetLink()
    onChange(nextValue)
  }

  const updateRequirement = (id: string, updates: UpdatesToRequirement): void => {
    updateValue({
      ...value,
      requirements: value.requirements.map(requirement =>
        requirement.id === id ? { ...requirement, ...updates } : requirement,
      ),
    })
  }

  const addRequirement = (): void => {
    updateValue({
      ...value,
      requirements: [...value.requirements, createEmptySkillRequirement()],
    })
  }

  const removeRequirement = (id: string): void => {
    const requirements = value.requirements.filter(
      requirement => requirement.id !== id,
    )

    updateValue({
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
        onChange={mercenaryClass => updateValue({
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
        {value.requirements.map((requirement, index) => {
          const titleId = `skill-requirement-${requirement.id}-title`

          return (
            <section
              className="skill-group"
              key={requirement.id}
              aria-labelledby={titleId}
            >
              <header className="skill-group__header">
                <h3 id={titleId} className="skill-group__title">
                  Skill
                  {' '}
                  {index + 1}
                </h3>

                {!!value.requirements.length && (
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeRequirement(requirement.id)}
                    aria-label={`Remove skill ${index + 1}`}
                    title={`Remove skill ${index + 1}`}
                  >
                    <svg
                      className="remove-button__icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M6 6 18 18M18 6 6 18" />
                    </svg>
                  </button>
                )}
              </header>

              <div className="skill-group__content">
                <ClearableDatalistField
                  label="Skill name"
                  clearLabel="Clear"
                  optionsId={MERCENARY_SKILL_OPTIONS_ID}
                  value={requirement.skill}
                  onChange={skill => updateRequirement(requirement.id, { skill })}
                  placeholder="Kinetic Blast of Clustering"
                />

                <GemListField
                  label="Required supports"
                  value={requirement.requiredSupports}
                  onChange={requiredSupports =>
                    updateRequirement(requirement.id, { requiredSupports })}
                  optionsId={MERCENARY_SUPPORT_OPTIONS_ID}
                  placeholder={'Return\nGreater Multiple Projectiles'}
                  hint="Every support must be linked to this skill. The list remains manually editable."
                />

                <GemListField
                  label="Optional supports"
                  value={requirement.optionalSupports}
                  onChange={optionalSupports =>
                    updateRequirement(requirement.id, { optionalSupports })}
                  optionsId={MERCENARY_SUPPORT_OPTIONS_ID}
                  placeholder={'Greater Pierce\nChain'}
                  hint="These improve the match but are not required. The list remains manually editable."
                />
              </div>
            </section>
          )
        })}
      </div>

      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={value.hideFailures}
          onChange={event =>
            updateValue({ ...value, hideFailures: event.target.checked })}
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

      <section
        className="generated-search"
        aria-labelledby="generated-search-title"
      >
        <div>
          <p className="section-kicker">Path of Exile query</p>
          <h3 id="generated-search-title">Linked search</h3>
        </div>

        <p className="generated-search__description">
          Generate an Instant Buyout search requiring each skill and its required linked supports. Optional supports stay in the local matcher.
        </p>

        <button
          type="button"
          className="button generate-link-button"
          disabled={linkStatus === 'generating'}
          onClick={() => generateLink()}
        >
          {GENERATE_LINK_BUTTON_LABELS[linkStatus]}
        </button>

        {generatedLink && (
          <div className="generated-search__result">
            <p className="generated-search__url" title={generatedLink}>
              {generatedLink}
            </p>

            <div className="generated-search__actions">
              <a
                className="button generated-search__open"
                href={generatedLink}
                target="_blank"
                rel="noreferrer"
              >
                Open search
              </a>
              <button
                type="button"
                className="button"
                onClick={() => copyLink()}
              >
                {COPY_LINK_BUTTON_LABELS[linkStatus]}
              </button>
            </div>
          </div>
        )}

        {linkWarningMessage && (
          <p className="generated-search__warning" role="status">
            {linkWarningMessage}
          </p>
        )}

        {linkErrorMessage && (
          <p className="generated-search__error" role="alert">
            {linkErrorMessage}
          </p>
        )}
      </section>
    </section>
  )
}

export default FilterEditor

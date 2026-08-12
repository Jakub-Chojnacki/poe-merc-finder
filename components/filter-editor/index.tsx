import type { SkillRequirementUpdates } from './skill-requirement/types'
import type { FilterEditorProps } from './types'
import { useId, useState } from 'react'
import SelectField from '@/components/select-field'
import UiCheckbox from '@/components/ui/checkbox'
import {
  createEmptyFilterDraft,
  createEmptySkillRequirement,
  hasConfiguredSkillRequirements,
} from '@/utils/filter-draft'
import { getMercenarySkillOptions } from '@/utils/mercenary-data'
import {
  MERCENARY_CLASS_OPTIONS,
} from './const'
import FilterActions from './filter-actions'
import MercenaryChangeDialog from './mercenary-change-dialog'
import ResetConfirmationDialog from './reset-confirmation-dialog'
import SkillRequirementEditor from './skill-requirement'

const FilterEditor: React.FC<FilterEditorProps> = ({
  applyStatus,
  onApply,
  onChange,
  value,
}) => {
  const hideFailuresId = useId()
  const [pendingMercenaryClass, setPendingMercenaryClass] = useState<string>()
  const [isResetting, setIsResetting] = useState(false)
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

  const updateMercenaryClass = (mercenaryClass: string): void => {
    if (
      mercenaryClass
      && mercenaryClass !== value.mercenaryClass
      && hasConfiguredSkillRequirements(value.requirements)
    ) {
      setPendingMercenaryClass(mercenaryClass)
      return
    }

    onChange({
      ...value,
      mercenaryClass,
    })
  }

  const confirmMercenaryClass = (): void => {
    if (!pendingMercenaryClass) {
      return
    }

    onChange({
      ...value,
      mercenaryClass: pendingMercenaryClass,
      requirements: [createEmptySkillRequirement()],
    })
    setPendingMercenaryClass(undefined)
  }

  const canClear = Boolean(
    value.mercenaryClass
    || value.hideFailures
    || value.requirements.length !== 1
    || hasConfiguredSkillRequirements(value.requirements),
  )

  const clearFilter = (): void => {
    onChange(createEmptyFilterDraft())
    setIsResetting(false)
  }

  return (
    <section className="filter-editor" aria-labelledby="filter-editor-title">
      <header className="section-header">
        <h2 id="filter-editor-title">Skill requirements</h2>

        <div className="section-header__actions">
          <button
            type="button"
            className="clear-filter-button"
            disabled={!canClear}
            onClick={() => setIsResetting(true)}
          >
            Clear
          </button>
          <button type="button" className="add-skill-button" onClick={addRequirement}>
            + Add skill
          </button>
        </div>
      </header>

      {isResetting && (
        <ResetConfirmationDialog
          title="Clear filter?"
          confirmLabel="Clear filter"
          description="This will reset the mercenary class, every skill and support, and the listing visibility option. This cannot be undone."
          onCancel={() => setIsResetting(false)}
          onConfirm={clearFilter}
        />
      )}

      <SelectField
        label="Mercenary class"
        emptyLabel="All mercenary classes"
        options={MERCENARY_CLASS_OPTIONS}
        value={value.mercenaryClass}
        onChange={updateMercenaryClass}
      />

      {pendingMercenaryClass && (
        <MercenaryChangeDialog
          mercenaryClass={pendingMercenaryClass}
          onCancel={() => setPendingMercenaryClass(undefined)}
          onConfirm={confirmMercenaryClass}
        />
      )}

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

      <div className="checkbox-field">
        <UiCheckbox
          id={hideFailuresId}
          checked={value.hideFailures}
          onCheckedChange={checked => onChange({
            ...value,
            hideFailures: checked === true,
          })}
        />
        <label htmlFor={hideFailuresId}>
          Hide listings missing required skills or supports
        </label>
      </div>

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

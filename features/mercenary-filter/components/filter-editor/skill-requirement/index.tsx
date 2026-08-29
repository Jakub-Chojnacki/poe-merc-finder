import type { SkillRequirementEditorProps } from './types'
import { useState } from 'react'
import { getMercenarySupportOptions } from '@/shared/mercenary-data'
import CloseIcon from '@/shared/ui/icons/close'
import MultiSelectField from '@/shared/ui/multi-select-field'
import SelectField from '@/shared/ui/select-field'
import UiTooltip from '@/shared/ui/tooltip'
import SkillChangeDialog from '../skill-change-dialog'

const SkillRequirementEditor: React.FC<SkillRequirementEditorProps> = ({
  index,
  onChange,
  onRemove,
  skillOptions,
  value,
}) => {
  const [pendingSkill, setPendingSkill] = useState<string | null>(null)
  const skillNumber = index + 1
  const skillLabel = `Skill ${skillNumber}`
  const supportOptions = getMercenarySupportOptions(value.skill)
  const hasConfiguredSupports = (
    !!value.requiredSupports.length || !!value.optionalSupports.length
  )

  const applySkill = (skill: string): void => {
    onChange({
      skill,
      requiredSupports: [],
      optionalSupports: [],
    })
  }

  const updateSkill = (skill: string): void => {
    if (skill === value.skill) {
      return
    }

    if (hasConfiguredSupports) {
      setPendingSkill(skill)
      return
    }

    applySkill(skill)
  }

  const confirmSkill = (): void => {
    if (pendingSkill === null) {
      return
    }

    applySkill(pendingSkill)
    setPendingSkill(null)
  }

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
            onChange={updateSkill}
          />
        </div>

        <UiTooltip content={`Remove skill ${skillNumber}`}>
          <button
            type="button"
            className="remove-button"
            onClick={onRemove}
            aria-label={`Remove skill ${skillNumber}`}
          >
            <CloseIcon className="ui-icon-sm" />
          </button>
        </UiTooltip>
      </header>

      {pendingSkill !== null && (
        <SkillChangeDialog
          skill={pendingSkill}
          onCancel={() => setPendingSkill(null)}
          onConfirm={confirmSkill}
        />
      )}

      <div className="skill-group__content">
        <MultiSelectField
          disabled={!value.skill}
          label="Required supports"
          value={value.requiredSupports}
          onChange={requiredSupports => onChange({ requiredSupports })}
          options={supportOptions}
          placeholder={value.skill
            ? 'Choose required supports'
            : 'Choose a skill first'}
          hint="All must be linked."
        />

        <MultiSelectField
          disabled={!value.skill}
          label="Optional supports"
          value={value.optionalSupports}
          onChange={optionalSupports => onChange({ optionalSupports })}
          options={supportOptions}
          placeholder={value.skill
            ? 'Choose optional supports'
            : 'Choose a skill first'}
        />
      </div>
    </section>
  )
}

export default SkillRequirementEditor

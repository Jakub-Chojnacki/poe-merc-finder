import type { SkillChangeDialogProps } from './types'
import ResetConfirmationDialog from '../reset-confirmation-dialog'

const SkillChangeDialog: React.FC<SkillChangeDialogProps> = ({
  onCancel,
  onConfirm,
  skill,
}) => (
  <ResetConfirmationDialog
    title="Change skill?"
    confirmLabel="Reset supports and select"
    description={(
      <>
        {skill
          ? (
              <>
                Selecting
                {' '}
                <strong>{skill}</strong>
                {' '}
              </>
            )
          : 'Clearing this skill '}
        will reset its required and optional supports. This cannot be undone.
      </>
    )}
    onCancel={onCancel}
    onConfirm={onConfirm}
  />
)

export default SkillChangeDialog

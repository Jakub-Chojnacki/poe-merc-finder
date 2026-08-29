import type { MercenaryChangeDialogProps } from './types'
import ResetConfirmationDialog from '../reset-confirmation-dialog'

const MercenaryChangeDialog: React.FC<MercenaryChangeDialogProps> = ({
  mercenaryClass,
  onCancel,
  onConfirm,
}) => (
  <ResetConfirmationDialog
    title="Change mercenary class?"
    confirmLabel="Reset and select"
    description={(
      <>
        Selecting
        {' '}
        <strong>{mercenaryClass}</strong>
        {' '}
        will reset every configured skill and its required and optional
        supports. This cannot be undone.
      </>
    )}
    onCancel={onCancel}
    onConfirm={onConfirm}
  />
)

export default MercenaryChangeDialog

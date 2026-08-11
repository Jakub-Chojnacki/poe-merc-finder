import type { MercenaryChangeDialogProps } from './types'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'

const MercenaryChangeDialog: React.FC<MercenaryChangeDialogProps> = ({
  mercenaryClass,
  onCancel,
  onConfirm,
}) => (
  <DialogRoot
    open
    onOpenChange={open => !open && onCancel()}
  >
    <DialogContent className="mercenary-change-dialog">
      <DialogTitle className="mercenary-change-dialog__title">
        Change mercenary class?
      </DialogTitle>
      <DialogDescription className="mercenary-change-dialog__description">
        Selecting
        {' '}
        <strong>{mercenaryClass}</strong>
        {' '}
        will reset every configured skill and its required and optional
        supports. This cannot be undone.
      </DialogDescription>

      <div className="mercenary-change-dialog__actions">
        <DialogClose asChild>
          <button type="button" className="button">Cancel</button>
        </DialogClose>
        <button
          type="button"
          className="button mercenary-change-dialog__confirm"
          onClick={onConfirm}
        >
          Reset and select
        </button>
      </div>
    </DialogContent>
  </DialogRoot>
)

export default MercenaryChangeDialog

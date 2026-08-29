import type { ResetConfirmationDialogProps } from './types'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from '@/shared/ui/dialog'

const ResetConfirmationDialog: React.FC<ResetConfirmationDialogProps> = ({
  confirmLabel,
  description,
  onCancel,
  onConfirm,
  title,
}) => (
  <DialogRoot
    open
    onOpenChange={open => !open && onCancel()}
  >
    <DialogContent className="form-dialog">
      <DialogTitle className="form-dialog__title">
        {title}
      </DialogTitle>
      <DialogDescription className="form-dialog__description">
        {description}
      </DialogDescription>

      <div className="form-dialog__actions">
        <DialogClose asChild>
          <button type="button" className="button">Cancel</button>
        </DialogClose>
        <button
          type="button"
          className="button form-dialog__primary"
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </DialogContent>
  </DialogRoot>
)

export default ResetConfirmationDialog

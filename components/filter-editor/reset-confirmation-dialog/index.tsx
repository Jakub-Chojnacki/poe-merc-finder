import type { ResetConfirmationDialogProps } from './types'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'

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
    <DialogContent className="reset-confirmation-dialog">
      <DialogTitle className="reset-confirmation-dialog__title">
        {title}
      </DialogTitle>
      <DialogDescription className="reset-confirmation-dialog__description">
        {description}
      </DialogDescription>

      <div className="reset-confirmation-dialog__actions">
        <DialogClose asChild>
          <button type="button" className="button">Cancel</button>
        </DialogClose>
        <button
          type="button"
          className="button reset-confirmation-dialog__confirm"
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </DialogContent>
  </DialogRoot>
)

export default ResetConfirmationDialog

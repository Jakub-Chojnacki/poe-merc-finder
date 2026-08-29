import type { ReactNode } from 'react'

export interface ResetConfirmationDialogProps {
  confirmLabel: string
  description: ReactNode
  onCancel: () => void
  onConfirm: () => void
  title: string
}

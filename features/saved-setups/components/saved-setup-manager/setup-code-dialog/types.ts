import type { SavedSetup } from '@/features/saved-setups/model/saved-setup'
import type { ImportedSavedSetup } from '@/features/saved-setups/model/setup-code/types'

interface SetupCodeDialogBaseProps {
  disabled?: boolean
}

export interface ExportSetupCodeDialogProps
  extends SetupCodeDialogBaseProps {
  mode: 'export'
  setup: SavedSetup | undefined
}

export interface ImportSetupCodeDialogProps
  extends SetupCodeDialogBaseProps {
  mode: 'import'
  onImport: (setup: ImportedSavedSetup) => Promise<void>
}

export type SetupCodeDialogProps
  = | ExportSetupCodeDialogProps
    | ImportSetupCodeDialogProps

import type { SavedSetup } from '@/hooks/use-saved-setups/types'
import type { ImportedSavedSetup } from '@/utils/saved-setup-code/types'

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

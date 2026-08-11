import type { ImportedWarrantFilter } from '@/utils/warrant-import/types'

export interface WarrantImportDialogProps {
  confirmReplacement: boolean
  onImport: (filter: ImportedWarrantFilter) => void
}

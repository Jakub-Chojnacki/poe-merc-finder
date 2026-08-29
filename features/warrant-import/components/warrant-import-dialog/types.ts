import type { ImportedWarrantFilter } from '@/features/warrant-import/model/warrant-parser/types'

export interface WarrantImportDialogProps {
  confirmReplacement: boolean
  onImport: (filter: ImportedWarrantFilter) => void
}

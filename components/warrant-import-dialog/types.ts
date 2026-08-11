import type { ImportedWarrantFilter } from '@/utils/warrant-import/types'

export interface WarrantImportDialogProps {
  onImport: (filter: ImportedWarrantFilter) => void
}

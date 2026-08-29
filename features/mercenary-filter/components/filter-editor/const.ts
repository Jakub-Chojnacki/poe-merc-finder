import type { SelectOption } from '@/shared/ui/select-field/types'
import { MERCENARY_OPTIONS } from '@/shared/mercenary-data/const'

export const MERCENARY_CLASS_OPTIONS: SelectOption[] = MERCENARY_OPTIONS.map(
  mercenary => ({
    iconAlt: `House ${mercenary.house}`,
    iconPath: mercenary.iconPath,
    label: `${mercenary.attribute} • House ${mercenary.house}`,
    value: mercenary.name,
  }),
)

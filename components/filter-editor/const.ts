import type { SelectOption } from '@/components/select-field/types'
import type { FilterApplyStatus } from '@/hooks/use-trade-page-filter/types'
import { MERCENARY_OPTIONS } from '@/utils/mercenary-data'

export const MERCENARY_CLASS_OPTIONS: SelectOption[] = MERCENARY_OPTIONS.map(
  mercenary => ({
    iconPath: mercenary.iconPath,
    label: `${mercenary.attribute} • House ${mercenary.house}`,
    value: mercenary.name,
  }),
)

export const APPLY_BUTTON_LABELS = {
  applied: 'Applied',
  applying: 'Applying…',
  error: 'Try again',
  idle: 'Apply filters',
} as const satisfies Record<FilterApplyStatus, string>

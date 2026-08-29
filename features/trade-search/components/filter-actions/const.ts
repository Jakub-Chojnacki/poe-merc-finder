import type { FilterApplyStatus } from '@/features/mercenary-filter/hooks/use-trade-page-filter/types'

export const APPLY_BUTTON_LABELS = {
  applied: 'Applied',
  applying: 'Applying…',
  error: 'Try again',
  idle: 'Apply filters',
} as const satisfies Record<FilterApplyStatus, string>

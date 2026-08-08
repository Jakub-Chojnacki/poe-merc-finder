import type { FilterApplyStatus } from '@/hooks/use-trade-page-filter/types'

export const MERCENARY_CLASS_OPTIONS_ID = 'mercenary-class-options'
export const MERCENARY_SKILL_OPTIONS_ID = 'mercenary-skill-options'
export const MERCENARY_SUPPORT_OPTIONS_ID = 'mercenary-support-options'

export const APPLY_BUTTON_LABELS = {
  applied: 'Applied',
  applying: 'Applying…',
  error: 'Try again',
  idle: 'Apply filters',
} as const satisfies Record<FilterApplyStatus, string>

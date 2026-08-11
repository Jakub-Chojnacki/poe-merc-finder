import type { PublicPath } from 'wxt/browser'

interface SelectOptionBase {
  label?: string
  value: string
}

interface SelectOptionWithoutIcon extends SelectOptionBase {
  iconAlt?: never
  iconPath?: never
}

interface SelectOptionWithIcon extends SelectOptionBase {
  iconAlt: string
  iconPath: PublicPath
}

export type SelectOption = SelectOptionWithIcon | SelectOptionWithoutIcon

export interface SelectFieldProps {
  emptyLabel: string
  hideLabel?: boolean
  hint?: string
  label: string
  onChange: (value: string) => void
  options: SelectOption[]
  value: string
}

import type { PublicPath } from 'wxt/browser'

export interface SelectOption {
  iconPath?: PublicPath
  label?: string
  value: string
}

export interface SelectFieldProps {
  emptyLabel: string
  hideLabel?: boolean
  hint?: string
  label: string
  onChange: (value: string) => void
  options: SelectOption[]
  value: string
}

export interface UiSelectOption {
  disabled?: boolean
  label: string
  value: string
}

export interface UiSelectProps {
  className?: string
  disabled?: boolean
  id?: string
  labelledBy?: string
  onChange: (value: string) => void
  options: UiSelectOption[]
  placeholder: string
  value: string
}

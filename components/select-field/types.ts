export interface SelectOption {
  label?: string
  value: string
}

export interface SelectFieldProps {
  emptyLabel: string
  hint?: string
  label: string
  onChange: (value: string) => void
  options: SelectOption[]
  value: string
}

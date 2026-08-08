export interface ClearableDatalistFieldProps {
  clearLabel: string
  hint?: string
  label: string
  optionsId: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}

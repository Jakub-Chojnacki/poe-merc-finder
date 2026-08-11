export interface MultiSelectFieldProps {
  disabled?: boolean
  hint?: string
  label: string
  onChange: (value: string[]) => void
  options: string[]
  placeholder: string
  value: string[]
}

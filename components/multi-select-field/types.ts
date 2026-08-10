export interface MultiSelectFieldProps {
  hint?: string
  label: string
  onChange: (value: string[]) => void
  options: string[]
  placeholder: string
  value: string[]
}

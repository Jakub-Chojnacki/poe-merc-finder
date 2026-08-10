import type { SelectOption } from './types'

function includeCurrentOption(
  options: SelectOption[],
  value: string,
): SelectOption[] {
  return value && !options.some(option => option.value === value)
    ? [{ value }, ...options]
    : options
}

export function getAvailableSelectOptions(
  options: SelectOption[],
  value: string,
  searchQuery: string,
): SelectOption[] {
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase()

  return includeCurrentOption(options, value).filter(option => (
    option.value.toLocaleLowerCase().includes(normalizedQuery)
    || option.label?.toLocaleLowerCase().includes(normalizedQuery)
  ))
}

export function getAvailableMultiSelectOptions(
  options: string[],
  value: string[],
  searchQuery: string,
): string[] {
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase()
  const selectedOptions = new Set(value)

  return [...new Set([...value, ...options])]
    .filter(option => option.toLocaleLowerCase().includes(normalizedQuery))
    .sort((left, right) => (
      Number(selectedOptions.has(right)) - Number(selectedOptions.has(left))
    ))
}

export function updateSelectedOptions(
  value: string[],
  option: string,
  selected: boolean,
): string[] {
  return selected
    ? [...new Set([...value, option])]
    : value.filter(selectedOption => selectedOption !== option)
}

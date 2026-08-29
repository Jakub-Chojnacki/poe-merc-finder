// Takes the count and label like: 2, support
// Depending on count returns either singular - "support" or plural - "supports"
function formatCount(count: number, label: string): string {
  return `${count} ${label}${count === 1 ? '' : 's'}`
}

export default formatCount

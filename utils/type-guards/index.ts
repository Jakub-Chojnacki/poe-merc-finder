export function isObject(value: unknown): value is object | null {
  return typeof value === 'object';
}

export function isNonNullObject(value: unknown): value is object {
  return isObject(value) && value !== null;
}

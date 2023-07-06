export function uniqueItems<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function compact<T>(array: T[]): T[] {
  return array.filter((item) => !!item);
}

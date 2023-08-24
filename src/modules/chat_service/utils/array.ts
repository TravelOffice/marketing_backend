/**
 * Shuffles array in place.
 * @param array Input array
 * @returns Shuffled array
 */
export function shuffle<T>(array: T[]) {
  // Randomize array element order in-place
  // Refer from https://stackoverflow.com/a/12646864
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

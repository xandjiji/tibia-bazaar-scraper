const DEFAULT_MAX_VALUE = 28

export const pushAndShift = <T>(
  item: T,
  array: T[],
  maxSize = DEFAULT_MAX_VALUE,
) => {
  const newArray = [...array, item]
  return newArray.slice(newArray.length - maxSize)
}

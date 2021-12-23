const DEFAULT_MAX_VALUE = 28

export const pushAndShift = <T>(
  item: T,
  array: T[],
  maxSize = DEFAULT_MAX_VALUE,
) => {
  const newArray = [...array, item]
  return newArray.slice(newArray.length - maxSize)
}

export const forceFillValues = <T>(
  array: T[],
  maxSize = DEFAULT_MAX_VALUE,
): T[] => {
  const [clonedValue] = array
  const fillValues = Array.from(
    { length: maxSize - array.length },
    () => clonedValue,
  )

  return [...fillValues, ...array]
}

export const arrayPartitions = <T>(array: T[], size: number): Array<T[]> => {
  var partitions = []

  for (var offset = 0; offset < array.length; offset += size) {
    partitions.push(array.slice(offset, offset + size))
  }

  return partitions
}

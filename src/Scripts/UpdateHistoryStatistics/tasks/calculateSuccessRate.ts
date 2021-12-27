export const calculateSuccessRate = (
  history: PartialCharacterObject[],
): number => {
  const totalCount = history.length
  const successCount = history.filter(
    ({ hasBeenBidded }) => hasBeenBidded,
  ).length

  return +((successCount / totalCount) * 100).toFixed(2)
}

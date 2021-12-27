export const calculateTotalNegotiated = (
  history: PartialCharacterObject[],
): number => {
  const successAuctions = history.filter(({ hasBeenBidded }) => hasBeenBidded)

  return successAuctions.reduce(
    (total, { currentBid }) => total + currentBid,
    0,
  )
}

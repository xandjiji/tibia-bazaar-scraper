const BASE_AUCTION_FEE = 50
const AUCTION_TAX = 0.12

export const calculateTotalRevenue = (
  history: PartialCharacterObject[],
): number => {
  const totalCount = history.length

  const totalInitialFeeCoins = totalCount * BASE_AUCTION_FEE

  const successAuctions = history.filter(({ hasBeenBidded }) => hasBeenBidded)
  const totalTaxedCoins = successAuctions.reduce(
    (total, { currentBid }) =>
      total + Math.floor((currentBid - BASE_AUCTION_FEE) * AUCTION_TAX),
    0,
  )

  return totalInitialFeeCoins + totalTaxedCoins
}

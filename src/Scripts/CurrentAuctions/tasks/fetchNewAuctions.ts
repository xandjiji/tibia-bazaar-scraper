import { AuctionPage } from 'Helpers'
import { logging, fetchHtml, retryWrapper, batchPromises } from 'utils'

const { broadcast, coloredText, colorProgress } = logging

const AUCTION_PAGE_URL =
  'https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&page=details'

const fetchAuctionPage = retryWrapper(
  async (auctionId: number) =>
    await fetchHtml(`${AUCTION_PAGE_URL}&auctionid=${auctionId}`),
)

export const fetchNewAuctions = async (
  newAuctionIds: number[],
): Promise<PartialCharacterObject[]> => {
  const batchSize = newAuctionIds.length

  const helper = new AuctionPage()
  await helper.loadServerData()

  const auctionPageRequests = newAuctionIds.map(
    (auctionId, currentIndex) => async () => {
      broadcast(
        `Scraping auction id: ${coloredText(
          auctionId.toString(),
          'highlight',
        )} ${colorProgress([currentIndex + 1, batchSize])}`,
        'neutral',
      )

      const newAuctionHtml = await fetchAuctionPage(auctionId)
      return helper.partialCharacterObject(newAuctionHtml)
    },
  )

  return await batchPromises(auctionPageRequests)
}

import { AuctionPage } from 'Helpers'
import { broadcast, coloredText, colorProgress, BroadcastETA } from 'logging'
import { fetchHtml, retryWrapper, batchPromises } from 'utils'

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
  const timer = new BroadcastETA(0, batchSize)

  const helper = new AuctionPage()
  await helper.loadServerData()

  const auctionPageRequests = newAuctionIds.map(
    (auctionId, currentIndex) => async () => {
      broadcast(
        `Scraping auction id: ${coloredText(
          auctionId,
          'highlight',
        )} ${colorProgress([currentIndex + 1, batchSize])}`,
        'neutral',
      )

      const newAuctionHtml = await fetchAuctionPage(auctionId)
      timer.setCurrentTask(currentIndex)
      return helper.partialCharacterObject(newAuctionHtml)
    },
  )

  const auctions = await batchPromises(auctionPageRequests)
  timer.finish()
  return auctions
}

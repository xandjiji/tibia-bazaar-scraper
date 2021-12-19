import { AuctionPage } from 'Helpers'
import { broadcast, coloredText, coloredProgress, TrackETA } from 'logging'
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
  const taskTracking = new TrackETA(
    batchSize,
    coloredText('Scraping single auctions', 'highlight'),
  )

  const helper = new AuctionPage()
  await helper.loadServerData()

  const auctionPageRequests = newAuctionIds.map(
    (auctionId, currentIndex) => async () => {
      broadcast(
        `Scraping auction id: ${coloredText(
          auctionId,
          'highlight',
        )} ${coloredProgress([currentIndex + 1, batchSize])}`,
        'neutral',
      )

      const newAuctionHtml = await fetchAuctionPage(auctionId)
      const auction = await helper.partialCharacterObject(newAuctionHtml)
      taskTracking.setCurrentTask(currentIndex)
      return auction
    },
  )

  const auctions = await batchPromises(auctionPageRequests)
  taskTracking.finish()
  return auctions
}

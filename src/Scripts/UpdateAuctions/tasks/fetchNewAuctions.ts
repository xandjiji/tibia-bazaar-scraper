import { AuctionPage } from 'Helpers'
import { broadcast, coloredText, TrackETA } from 'logging'
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
    coloredText('Scraping new auctions', 'highlight'),
  )

  const helper = new AuctionPage()
  await helper.loadServerData()

  const auctionPageRequests = newAuctionIds.map(
    (auctionId) => async () => {
      taskTracking.incTask()
      broadcast(
        `Scraping auction id: ${coloredText(
          auctionId,
          'highlight',
        )} ${taskTracking.getProgress()}`,
        'neutral',
      )

      const newAuctionHtml = await fetchAuctionPage(auctionId)
      const auction = await helper.partialCharacterObject(newAuctionHtml)
      return auction
    },
  )

  const auctions = await batchPromises(auctionPageRequests)
  taskTracking.finish()
  return auctions
}

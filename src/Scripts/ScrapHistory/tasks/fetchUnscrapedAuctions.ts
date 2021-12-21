import { History } from 'Data'
import { AuctionPage } from 'Helpers'
import { broadcast, coloredText, coloredProgress, TrackETA } from 'logging'
import { fetchHtml, retryWrapper, batchPromises, arrayPartitions } from 'utils'

const BUFFER_SIZE = 100

const AUCTION_PAGE_URL =
  'https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&page=details'

const fetchAuctionPage = retryWrapper(
  async (auctionId: number) =>
    await fetchHtml(`${AUCTION_PAGE_URL}&auctionid=${auctionId}`),
)

export const fetchUnscrapedAuctions = async (
  unscrapedIds: number[],
  historyData: History,
) => {
  const batchSize = unscrapedIds.length
  const taskTracking = new TrackETA(
    batchSize,
    coloredText('Scraping new history auctions', 'highlight'),
  )

  const helper = new AuctionPage()
  await helper.loadServerData()

  const auctionPageRequests = unscrapedIds.map(
    (auctionId, currentIndex) => async () => {
      broadcast(
        `Scraping auction id: ${coloredText(
          auctionId,
          'highlight',
        )} ${coloredProgress([currentIndex + 1, batchSize])}`,
        'neutral',
      )

      const html = await fetchAuctionPage(auctionId)

      if (helper.errorCheck(html)) {
        taskTracking.incTask()
        return
      }

      if (!helper.isFinished(html)) {
        historyData.appendUnfinishedBuffer({
          id: helper.id(html),
          auctionEnd: helper.auctionEnd(html),
        })
        taskTracking.incTask()
        return
      }

      historyData.appendFinishedBuffer(
        await helper.partialCharacterObject(html),
      )
      taskTracking.incTask()
    },
  )

  const requestQueues = arrayPartitions(auctionPageRequests, BUFFER_SIZE)
  for (const queue of requestQueues) {
    await batchPromises(queue)
    await historyData.saveBuffers()
  }

  taskTracking.finish()
}

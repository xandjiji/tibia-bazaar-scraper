import { History } from 'Data'
import { AuctionPage } from 'Helpers'
import { broadcast, coloredText, coloredProgress, TrackETA } from 'logging'
import { batchPromises, arrayPartitions } from 'utils'
import { BUFFER_SIZE, fetchAuctionPage } from '../utils'

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
      const readableId = coloredText(auctionId, 'highlight')
      const readableProgress = coloredProgress([currentIndex + 1, batchSize])

      const html = await fetchAuctionPage(auctionId)

      if (helper.errorCheck(html)) {
        taskTracking.incTask()
        broadcast(
          `Not found  auction id: ${readableId} ${readableProgress}`,
          'control',
        )
        return
      }

      if (!helper.isFinished(html)) {
        broadcast(
          `Unfinished auction id: ${readableId} ${readableProgress}`,
          'neutral',
        )
        historyData.appendUnfinishedBuffer({
          id: helper.id(html),
          auctionEnd: helper.auctionEnd(html),
        })
        taskTracking.incTask()
        return
      }

      broadcast(
        `Scraping   auction id: ${readableId} ${readableProgress}`,
        'neutral',
      )
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

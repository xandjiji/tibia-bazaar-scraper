import { History } from 'Data'
import { AuctionPage } from 'Helpers'
import { broadcast, coloredText, TrackETA } from 'logging'
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

  const auctionPageRequests = unscrapedIds.map((auctionId) => async () => {
    const readableId = coloredText(auctionId, 'highlight')

    const html = await fetchAuctionPage(auctionId)
    taskTracking.incTask()
    const readableProgress = taskTracking.getProgress()

    const checkResult = await helper.checkhistoryAuction(html)

    if (checkResult.result === 'NOT_FOUND') {
      broadcast(
        `Not found  auction id: ${readableId} ${readableProgress}`,
        'control',
      )
      return
    }

    if (checkResult.result === 'NOT_FINISHED') {
      broadcast(
        `Unfinished auction id: ${readableId} ${readableProgress}`,
        'neutral',
      )
      historyData.appendUnfinishedBuffer(checkResult.data)
      return
    }

    broadcast(
      `Scraping   auction id: ${readableId} ${readableProgress}`,
      'neutral',
    )
    historyData.appendFinishedBuffer(checkResult.data)
  })

  const requestQueues = arrayPartitions(auctionPageRequests, BUFFER_SIZE)
  for (const queue of requestQueues) {
    await batchPromises(queue)
    await historyData.saveBuffers()
  }

  taskTracking.finish()
}

import { History } from 'Data'
import { AuctionPage } from 'Helpers'
import { broadcast, coloredText, TrackETA } from 'logging'
import { batchPromises, arrayPartitions } from 'utils'
import { BUFFER_SIZE, fetchAuctionPage } from '../utils'

export const fetchMaturedAuctions = async (
  maturedIds: number[],
  historyData: History,
) => {
  const batchSize = maturedIds.length
  const taskTracking = new TrackETA(
    batchSize,
    coloredText('Scraping matured history auctions', 'highlight'),
  )

  const helper = new AuctionPage()
  await helper.loadServerData()

  const auctionPageRequests = maturedIds.map((auctionId) => async () => {
    const readableId = coloredText(auctionId, 'highlight')

    const html = await fetchAuctionPage(auctionId)
    taskTracking.incTask()
    const readableProgress = taskTracking.getProgress()

    if (helper.errorCheck(html)) {
      broadcast(
        `Not found  auction id: ${readableId} ${readableProgress}`,
        'control',
      )
      return
    }

    broadcast(
      `Scraping   auction id: ${readableId} ${readableProgress}`,
      'neutral',
    )
    historyData.appendFinishedBuffer(await helper.partialCharacterObject(html))
    historyData.appendMaturedId(auctionId)
  })

  const requestQueues = arrayPartitions(auctionPageRequests, BUFFER_SIZE)
  for (const queue of requestQueues) {
    await batchPromises(queue)
    await historyData.saveBuffers()
  }

  taskTracking.finish()
}

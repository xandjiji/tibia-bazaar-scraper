import { AuctionList } from 'Helpers'
import { broadcast, coloredProgress, TrackETA, coloredText } from 'logging'
import { fetchHtml, retryWrapper, batchPromises } from 'utils'

const AUCTION_LIST_URL = 'https://www.tibia.com/charactertrade'

const fetchAuctionsFromPage = retryWrapper(async (pageIndex) => {
  const helper = new AuctionList()
  const html = await fetchHtml(`${AUCTION_LIST_URL}/?currentpage=${pageIndex}`)
  return helper.auctionBlocks(html)
})

export const fetchAllAuctionBlocks = async (
  pageIndexes: number[],
): Promise<AuctionBlock[]> => {
  const lastIndex = pageIndexes[pageIndexes.length - 1]
  const taskTracking = new TrackETA(
    lastIndex,
    coloredText('Scraping auction blocks', 'highlight'),
  )

  const auctionBlocksRequests = pageIndexes.map((currentIndex) => async () => {
    broadcast(
      `Scraping auction page ${coloredProgress([currentIndex, lastIndex])}`,
      'neutral',
    )

    const auctionBlock = await fetchAuctionsFromPage(currentIndex)
    taskTracking.incTask()
    return auctionBlock
  })

  const auctionBlocks = await batchPromises(auctionBlocksRequests)
  taskTracking.finish()
  return auctionBlocks.flat()
}

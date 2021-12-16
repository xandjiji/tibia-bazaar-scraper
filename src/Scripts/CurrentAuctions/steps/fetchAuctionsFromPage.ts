import { AuctionList } from 'Helpers'
import { logging, fetchHtml, retryWrapper, batchPromises } from 'utils'

const { broadcast, colorProgress } = logging

const AUCTION_LIST_URL = 'https://www.tibia.com/charactertrade'

const fetchAuctionsFromPage = retryWrapper(async (pageIndex) => {
  const helper = new AuctionList()
  const html = await fetchHtml(`${AUCTION_LIST_URL}/?currentpage=${pageIndex}`)
  helper.setContent(html)
  return helper.auctionBlocks()
})

export const fetchAllAuctionBlocks = async (
  pageIndexes: number[],
): Promise<AuctionBlock[]> => {
  const lastIndex = pageIndexes[pageIndexes.length - 1]

  const auctionBlocksRequests = pageIndexes.map((currentIndex) => async () => {
    broadcast(
      `Scraping auction page ${colorProgress([currentIndex, lastIndex])}`,
      'neutral',
    )
    return await fetchAuctionsFromPage(currentIndex)
  })

  const auctionBlocks = await batchPromises(auctionBlocksRequests)
  return auctionBlocks.flat()
}

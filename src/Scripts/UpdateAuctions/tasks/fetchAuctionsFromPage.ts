import { AuctionList } from 'Helpers'
import { broadcast, colorProgress } from 'logging'
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

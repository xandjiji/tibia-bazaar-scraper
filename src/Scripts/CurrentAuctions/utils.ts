import { AuctionList } from 'Helpers'
import { logging, fetchHtml, retryWrapper, batchPromises } from 'utils'

const { broadcast, coloredText } = logging

const FIRST_PAGE_AUCTION_LIST =
  'https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades'

export const fetchAuctionPageIndexes = retryWrapper(
  async (): Promise<number[]> => {
    broadcast('Fetching for all auction pages indexes...', 'neutral')

    const helper = new AuctionList()
    const html = await fetchHtml(FIRST_PAGE_AUCTION_LIST)
    helper.setContent(html)

    const lastPageIndex = helper.lastPageIndex()
    return Array.from({ length: lastPageIndex }, (_, index) => index + 1)
  },
)

const AUCTION_LIST_URL = 'https://www.tibia.com/charactertrade'

const fetchAuctionsFromPage = retryWrapper(async (pageIndex) => {
  const helper = new AuctionList()
  const html = await fetchHtml(`${AUCTION_LIST_URL}/?currentpage=${pageIndex}`)
  helper.setContent(html)
  return helper.auctionBlocks()
})

const colorProgress = ([current, last]: number[]): string =>
  `[${coloredText(`${current}`, 'system')}/${coloredText(`${last}`, 'system')}]`

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

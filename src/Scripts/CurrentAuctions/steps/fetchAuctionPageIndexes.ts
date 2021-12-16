import { AuctionList } from 'Helpers'
import { logging, fetchHtml, retryWrapper } from 'utils'

const FIRST_PAGE_AUCTION_LIST =
  'https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades'

export const fetchAuctionPageIndexes = retryWrapper(
  async (): Promise<number[]> => {
    logging.broadcast('Fetching for all auction pages indexes...', 'neutral')

    const helper = new AuctionList()
    const html = await fetchHtml(FIRST_PAGE_AUCTION_LIST)
    helper.setContent(html)

    const lastPageIndex = helper.lastPageIndex()
    return Array.from({ length: lastPageIndex }, (_, index) => index + 1)
  },
)

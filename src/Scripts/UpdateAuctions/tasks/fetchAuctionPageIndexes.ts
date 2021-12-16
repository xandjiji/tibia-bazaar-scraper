import { AuctionList } from 'Helpers'
import { broadcast } from 'logging'
import { fetchHtml, retryWrapper } from 'utils'

const FIRST_PAGE_AUCTION_LIST =
  'https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades'

export const fetchAuctionPageIndexes = retryWrapper(
  async (): Promise<number[]> => {
    broadcast('Fetching for all auction pages indexes...', 'neutral')

    const helper = new AuctionList()
    const html = await fetchHtml(FIRST_PAGE_AUCTION_LIST)

    const lastPageIndex = helper.lastPageIndex(html)
    return Array.from({ length: lastPageIndex }, (_, index) => index + 1)
  },
)

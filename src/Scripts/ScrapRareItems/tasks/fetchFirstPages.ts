import { AuctionList } from 'Helpers'
import { broadcast } from 'logging'
import { fetchHtml, retryWrapper } from 'utils'
import { RareItemBlock, RareItemBlockCollection } from '../types'

const BASE_URL =
  'https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades'

const buildItemPageUrl = (itemName: string, index: number) =>
  encodeURI(
    `${BASE_URL}&searchstring=${itemName}&searchtype=2&currentpage=${index}`,
  )

export const fetchItemFirstPage = retryWrapper(
  async (itemName: string): Promise<RareItemBlock> => {
    const url = buildItemPageUrl(itemName, 1)

    const helper = new AuctionList()
    const html = await fetchHtml(url)

    const lastPageIndex = helper.lastPageIndex(html)
    const ids = helper.auctionBlocks(html).map(({ id }) => id)

    return { name: itemName, lastPageIndex, ids }
  },
)

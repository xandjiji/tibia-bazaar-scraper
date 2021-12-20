import { AuctionList } from 'Helpers'
import { broadcast, coloredProgress, TrackETA, coloredText } from 'logging'
import { batchPromises, fetchHtml, retryWrapper } from 'utils'
import { buildItemPageUrl, buildRareItemCollection } from '../utils'
import { itemList } from '../items'
import { RareItemBlock, RareItemBlockCollection } from '../types'

const fetchItemPage = retryWrapper(
  async (itemName: string, index: number): Promise<RareItemBlock> => {
    const url = buildItemPageUrl(itemName, index)

    const helper = new AuctionList()
    const html = await fetchHtml(url)

    const lastPageIndex = helper.lastPageIndex(html)
    const ids = helper.auctionBlocks(html).map(({ id }) => id)

    return { name: itemName, lastPageIndex, ids }
  },
)

export const fetchAllFirstPages =
  async (): Promise<RareItemBlockCollection> => {
    const lastIndex = itemList.length
    const taskTracking = new TrackETA(
      lastIndex,
      coloredText('Scraping rare item auction blocks', 'highlight'),
    )

    const rareItemBlockRequests = itemList.map(
      (name, currentIndex) => async () => {
        broadcast(
          `Scraping ${name}'s frist page ${coloredProgress([
            currentIndex + 1,
            lastIndex,
          ])}`,
          'neutral',
        )

        const rareItemBlock = await fetchItemPage(name, 1)
        taskTracking.incTask()
        return rareItemBlock
      },
    )

    const rareItemBlocks = await batchPromises(rareItemBlockRequests)
    taskTracking.finish()

    return buildRareItemCollection(rareItemBlocks)
  }

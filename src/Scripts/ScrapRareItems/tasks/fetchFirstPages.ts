import { broadcast, coloredProgress, TrackETA, coloredText } from 'logging'
import { batchPromises } from 'utils'
import { fetchItemPage, buildRareItemCollection } from '../utils'
import { itemList } from '../items'
import { RareItemBlockCollection } from '../types'

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

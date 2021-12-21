import { broadcast, coloredProgress, TrackETA, coloredText } from 'logging'
import { batchPromises } from 'utils'
import { fetchItemPage } from '../utils'

const countRequests = (blocks: RareItemBlock[]): number => {
  let count = 0
  blocks.forEach(({ lastPageIndex }) => {
    if (lastPageIndex > 1) count += lastPageIndex - 1
  })
  return count
}

export const fetchOtherPages = async (
  incompleteCollection: RareItemBlockCollection,
): Promise<RareItemBlockCollection> => {
  const fullCollection = { ...incompleteCollection }

  const incompleteBlocks = Object.values(incompleteCollection).filter(
    ({ lastPageIndex }) => lastPageIndex > 1,
  )

  const totalRequests = countRequests(incompleteBlocks)
  if (totalRequests) {
    let requestedCount = 0
    const taskTracking = new TrackETA(
      totalRequests,
      coloredText('Scraping rest of the rare items', 'highlight'),
    )

    const incompleteItemRequests = incompleteBlocks.map(
      ({ name, lastPageIndex }) =>
        async () => {
          for (let index = 2; index <= lastPageIndex; index++) {
            requestedCount++

            broadcast(
              `Scraping ${name}'s other pages ${coloredProgress([
                requestedCount,
                totalRequests,
              ])}`,
              'neutral',
            )

            const rareItemBlock = await fetchItemPage(name, index)
            fullCollection[name].ids = [
              ...fullCollection[name].ids,
              ...rareItemBlock.ids,
            ]
            taskTracking.incTask()
          }
        },
    )

    await batchPromises(incompleteItemRequests)
    taskTracking.finish()
  }

  return fullCollection
}

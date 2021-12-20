import { RareItemBlock, RareItemBlockCollection } from './types'

const BASE_URL =
  'https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades'

export const buildItemPageUrl = (itemName: string, index: number) =>
  encodeURI(
    `${BASE_URL}&searchstring=${itemName}&searchtype=2&currentpage=${index}`,
  )

export const buildRareItemCollection = (
  itemBlocks: RareItemBlock[],
): RareItemBlockCollection => {
  const collection: RareItemBlockCollection = {}

  itemBlocks.forEach((block) => {
    if (block.ids.length) {
      collection[block.name] = block
    }
  })

  return collection
}

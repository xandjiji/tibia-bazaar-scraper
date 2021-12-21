type FileConstant = {
  name: string
  path: string
}

const OUTPUT_PATH = './Output'

const names = {
  SERVER_DATA: 'ServerData.json',
  CURRENT_AUCTIONS: 'CurrentAuctions.json',
  RARE_ITEM_DATA: 'ItemsData.json',
}

const SERVER_DATA = {
  name: names.SERVER_DATA,
  path: `${OUTPUT_PATH}/${names.SERVER_DATA}`,
}

const CURRENT_AUCTIONS = {
  name: names.CURRENT_AUCTIONS,
  path: `${OUTPUT_PATH}/${names.CURRENT_AUCTIONS}`,
}

const RARE_ITEM_DATA = {
  name: names.RARE_ITEM_DATA,
  path: `${OUTPUT_PATH}/${names.RARE_ITEM_DATA}`,
}

export const file: Record<string, FileConstant> = {
  SERVER_DATA,
  CURRENT_AUCTIONS,
  RARE_ITEM_DATA,
}

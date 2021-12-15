type FileConstant = {
  name: string
  path: string
}

const OUTPUT_PATH = './Output'

const names = {
  SERVER_DATA: 'ServerData.json',
  CURRENT_AUCTIONS: 'CurrentAuctions.json',
}

const SERVER_DATA = {
  name: names.SERVER_DATA,
  path: `${OUTPUT_PATH}/${names.SERVER_DATA}`,
}

const CURRENT_AUCTIONS = {
  name: names.CURRENT_AUCTIONS,
  path: `${OUTPUT_PATH}/${names.CURRENT_AUCTIONS}`,
}

export const file: Record<string, FileConstant> = {
  SERVER_DATA,
  CURRENT_AUCTIONS,
}

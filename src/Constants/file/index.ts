import { CURRENT_AUCTIONS } from './currentAuctions'
import { HISTORY_AUCTIONS, SCRAP_HISTORY_DATA } from './historyAuctions'
import { RARE_ITEM_DATA } from './rareItemData'
import { SERVER_DATA } from './serverData'
import { FileConstant } from './types'

export const file: Record<string, FileConstant> = {
  SERVER_DATA,
  CURRENT_AUCTIONS,
  RARE_ITEM_DATA,
  HISTORY_AUCTIONS,
  SCRAP_HISTORY_DATA,
}

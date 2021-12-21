import { CURRENT_AUCTIONS } from './currentAuctions'
import { HISTORY_AUCTIONS, SCRAP_HISTORY_DATA } from './historyAuctions'
import { RARE_ITEM_DATA } from './rareItemData'
import { SERVER_DATA } from './serverData'

export const file = {
  SERVER_DATA,
  CURRENT_AUCTIONS,
  RARE_ITEM_DATA,
  HISTORY_AUCTIONS,
  SCRAP_HISTORY_DATA,
} as const

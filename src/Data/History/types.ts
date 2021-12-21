export type UnfinishedAuction = {
  id: number
  auctionEnd: number
}

export type ScrapHistoryData = {
  lastScrapedId: number
  unfinishedAuctions: UnfinishedAuction[]
}

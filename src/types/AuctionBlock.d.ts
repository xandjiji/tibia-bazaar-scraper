declare interface AuctionBlock {
  id: number
  currentBid: number
  hasBeenBidded: boolean
}

declare type UnfinishedAuction = {
  id: number
  auctionEnd: number
}

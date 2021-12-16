import { Auctions } from 'Data'
import ScrapServers from 'Scripts/ScrapServers'
import {
  fetchAuctionPageIndexes,
  fetchAllAuctionBlocks,
  fetchNewAuctions,
} from './tasks'

const main = async () => {
  await ScrapServers()

  const auctionData = new Auctions()

  const pageIndexes = await fetchAuctionPageIndexes()
  const auctionBlocks = await fetchAllAuctionBlocks(pageIndexes)

  await auctionData.load()
  await auctionData.updatePreviousAuctions(auctionBlocks)

  const newAuctionIds = auctionData.newAuctionIds(auctionBlocks)

  const newAuctions = await fetchNewAuctions(newAuctionIds)
  await auctionData.appendAuctions(newAuctions)
}

export default main

import { Auctions } from 'Data'
import { broadcast, coloredText, Timer } from 'logging'
import ScrapServers from 'Scripts/ScrapServers'
import {
  fetchAuctionPageIndexes,
  fetchAllAuctionBlocks,
  fetchNewAuctions,
} from './tasks'

const SCRIPT_NAME = coloredText('UpdateAuctions', 'highlight')

const main = async () => {
  const timer = new Timer()
  broadcast(`Starting ${SCRIPT_NAME} script routine`, 'success')

  await ScrapServers()

  const auctionData = new Auctions()

  const pageIndexes = await fetchAuctionPageIndexes()
  const auctionBlocks = await fetchAllAuctionBlocks(pageIndexes)

  await auctionData.load()
  await auctionData.updatePreviousAuctions(auctionBlocks)

  const newAuctionIds = auctionData.newAuctionIds(auctionBlocks)

  const newAuctions = await fetchNewAuctions(newAuctionIds)
  await auctionData.appendAuctions(newAuctions)

  broadcast(
    `${SCRIPT_NAME} script routine finished in ${timer.elapsedTime()}`,
    'success',
  )
}

export default main

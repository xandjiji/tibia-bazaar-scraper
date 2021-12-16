import { Auctions } from 'Data'
import ScrapServers from 'Scripts/ScrapServers'
import { logging } from 'utils'
import {
  fetchAuctionPageIndexes,
  fetchAllAuctionBlocks,
  fetchNewAuctions,
} from './tasks'

const { broadcast, coloredText, humanReadableTimestamp } = logging

const SCRIPT_NAME = coloredText('UpdateAuctions', 'highlight')

const main = async () => {
  const startTimestamp = +new Date()
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

  const runTimestamp = +new Date() - startTimestamp
  logging.broadcast(
    `${SCRIPT_NAME} script routine finished in ${humanReadableTimestamp(
      runTimestamp,
    )}`,
    'success',
  )
}

export default main

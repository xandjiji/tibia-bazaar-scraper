import { Auctions, ServerData } from 'Data'
import { broadcast } from 'logging'

export const buildHighlightedAuctions = async (
  highlightedAuctionData: HighlightedAuctionData[],
): Promise<CharacterObject[]> => {
  broadcast(`Building character objects...`, 'neutral')

  const highlightedIds = new Set<number>(
    highlightedAuctionData.map(({ id }) => id),
  )

  const auctionData = new Auctions()
  await auctionData.load()
  const serverData = new ServerData()
  await serverData.load()

  const currentTimestamp = +new Date() / 1000

  const allAuctions = auctionData.getAllAuctions()
  const buildedAuctions: CharacterObject[] = allAuctions
    .filter(({ id }) => highlightedIds.has(id))
    .filter(({ auctionEnd }) => auctionEnd > currentTimestamp)
    .map((auction) => ({
      ...auction,
      serverData: serverData.getServerById(auction.serverId),
    }))

  return buildedAuctions
}

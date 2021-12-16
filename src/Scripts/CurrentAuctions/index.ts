import { AuctionList } from 'Helpers'
import { Auctions } from 'Data'
import { fetchAuctionPageIndexes, fetchAllAuctionBlocks } from './steps'

/* @ ToDo:
    - scrapar individualmente leiloes paginados que nao estao nos salvos
    - mergear a lista, ordenar e salvar
*/

const main = async () => {
  const helper = new AuctionList()
  const auctionData = new Auctions()

  const pageIndexes = await fetchAuctionPageIndexes()
  const auctionBlocks = await fetchAllAuctionBlocks(pageIndexes)

  await auctionData.load()
  await auctionData.updatePreviousAuctions(auctionBlocks)
}

export default main

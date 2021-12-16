import { AuctionList } from 'Helpers'
import { Auctions } from 'Data'
import { logging, batchPromises } from 'utils'
import { fetchAuctionPageIndexes, fetchAllAuctionBlocks } from './steps'

const helper = new AuctionList()
const auctionData = new Auctions()

/* @ ToDo:
    - load nos leiloes salvos
    - remover leiloes salvos que não estao nos AuctionBlocks
    - atualizar os leiloes salvos com os novos preços
    - scrapar individualmente leiloes paginados que nao estao nos salvos
    - mergear a lista, ordenar e salvar
*/

const main = async () => {
  await auctionData.load()
  const pageIndexes = await fetchAuctionPageIndexes()

  const auctionBlocks = await fetchAllAuctionBlocks(pageIndexes)
}

export default main

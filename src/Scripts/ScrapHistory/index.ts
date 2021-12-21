import { History } from 'Data'
import { broadcast, coloredText, Timer } from 'logging'
import ScrapServers from 'Scripts/ScrapServers'
import { fetchHighestAuctionId } from './tasks'

const SCRIPT_NAME = coloredText('ScrapHistory', 'highlight')

const main = async () => {
  const timer = new Timer()
  broadcast(`Starting ${SCRIPT_NAME} script routine`, 'success')

  await ScrapServers()

  const historyData = new History()
  await historyData.load()

  const id = await fetchHighestAuctionId()
  broadcast(id, 'neutral')

  broadcast(
    `${SCRIPT_NAME} script routine finished in ${timer.elapsedTime()}`,
    'success',
  )
}

export default main

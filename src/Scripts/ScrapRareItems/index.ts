import { broadcast, coloredText, Timer } from 'logging'
import { itemList } from './items'

const SCRIPT_NAME = coloredText('ScrapRareItems', 'highlight')

const main = async () => {
  const timer = new Timer()
  broadcast(`Starting ${SCRIPT_NAME} script routine`, 'success')

  broadcast(
    `${SCRIPT_NAME} script routine finished in ${timer.elapsedTime()}`,
    'success',
  )
}

export default main

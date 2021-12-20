import { broadcast, coloredText, Timer } from 'logging'
import { fetchAllFirstPages } from './tasks/fetchFirstPages'

const SCRIPT_NAME = coloredText('ScrapRareItems', 'highlight')

const main = async () => {
  const timer = new Timer()
  broadcast(`Starting ${SCRIPT_NAME} script routine`, 'success')

  const incompleteCollection = await fetchAllFirstPages()

  broadcast(
    `${SCRIPT_NAME} script routine finished in ${timer.elapsedTime()}`,
    'success',
  )
}

export default main
